import * as THREE from 'three';

export class Regador extends THREE.Group {
  constructor() {
    super();

    this.estaSendoArrastado = false;
    this.gotas = [];
    this.posicaoInventario = new THREE.Vector3();

    this._criarModelo();
  }

  _criarModelo() {
    const matAco = new THREE.MeshStandardMaterial({ color: 0x8d99ae, roughness: 0.3, metalness: 0.8 });

    // 1. Corpo principal
    const corpoGeo = new THREE.CylinderGeometry(0.07, 0.09, 0.15, 12);
    this.corpoMesh = new THREE.Mesh(corpoGeo, matAco);
    this.add(this.corpoMesh);

    // 2. Bico do regador
    const bicoGeo = new THREE.CylinderGeometry(0.012, 0.025, 0.15, 8);
    bicoGeo.rotateZ(-Math.PI / 3);
    bicoGeo.translate(-0.08, 0.04, 0);
    const bicoMesh = new THREE.Mesh(bicoGeo, matAco);
    this.add(bicoMesh);

    // 3. Ponta (Chuveirinho)
    const pontaGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.02, 10);
    pontaGeo.translate(-0.15, 0.08, 0);
    this.pontaMeshRef = new THREE.Mesh(pontaGeo, matAco);
    this.add(this.pontaMeshRef);

    // 4. Alça do regador
    const alcaGeo = new THREE.TorusGeometry(0.06, 0.01, 8, 12, Math.PI);
    alcaGeo.rotateZ(Math.PI / 2);
    alcaGeo.translate(0.07, 0, 0);
    this.add(new THREE.Mesh(alcaGeo, matAco));

    this.bicoWorldPos = new THREE.Vector3();
    this.matGota = new THREE.MeshBasicMaterial({ color: 0x4cc9f0, transparent: true, opacity: 0.8 });
    this.geoGota = new THREE.SphereGeometry(0.012, 6, 6);
  }

  _atualizarPosicaoInventario(camera) {
    // Calcula o limite visual exato do canto inferior esquerdo da câmera
    const distancia = 1.0;
    const vFOV = THREE.MathUtils.degToRad(camera.fov);
    const alturaVisivel = 2 * Math.tan(vFOV / 2) * distancia;
    const larguraVisivel = alturaVisivel * camera.aspect;

    // Posição no canto inferior esquerdo no espaço local da câmera
    this.posicaoInventario.set(
      -larguraVisivel / 2 + 0.18, // Margem da esquerda
      -alturaVisivel / 2 + 0.18,  // Margem inferior
      -distancia                  // Distância à frente da lente
    );
  }

  _gerarGota(scene) {
    const gota = new THREE.Mesh(this.geoGota, this.matGota);
    
    // Obtém a posição absoluta no mundo de onde sai a água
    this.pontaMeshRef.getWorldPosition(this.bicoWorldPos);
    
    gota.position.copy(this.bicoWorldPos);
    gota.position.x += (Math.random() - 0.5) * 0.04;
    gota.position.z += (Math.random() - 0.5) * 0.04;

    scene.add(gota);
    this.gotas.push({ mesh: gota, velocidadeY: 0.03 + Math.random() * 0.02 });
  }

  atualizar(planta, camera, scene) {
    this._atualizarPosicaoInventario(camera);

    if (this.estaSendoArrastado) {
      // Ângulo de inclinação ao regar sobre a planta
      this.rotation.z = THREE.MathUtils.lerp(this.rotation.z, 0.6, 0.15);
      this.rotation.x = THREE.MathUtils.lerp(this.rotation.x, 0.2, 0.15);
      this.rotation.y = THREE.MathUtils.lerp(this.rotation.y, 0, 0.15);

      if (Math.random() < 0.6) {
        this._gerarGota(scene);
      }
    } else {
      // Retorna suavemente (lerp) para a posição e rotação de inventário no canto da tela
      this.position.lerp(this.posicaoInventario, 0.15);
      this.rotation.x = THREE.MathUtils.lerp(this.rotation.x, 0.2, 0.15);
      this.rotation.y = THREE.MathUtils.lerp(this.rotation.y, 0.8, 0.15);
      this.rotation.z = THREE.MathUtils.lerp(this.rotation.z, -0.1, 0.15);
    }

    // Atualiza gotinhas caindo no mundo 3D
    for (let i = this.gotas.length - 1; i >= 0; i--) {
      const g = this.gotas[i];
      g.mesh.position.y -= g.velocidadeY;

      const distPlantaXZ = Math.hypot(g.mesh.position.x, g.mesh.position.z);

      if (g.mesh.position.y <= 0.8 && distPlantaXZ < 0.45) {
        planta.regar(0.8);
        scene.remove(g.mesh);
        this.gotas.splice(i, 1);
      } else if (g.mesh.position.y <= 0) {
        scene.remove(g.mesh);
        this.gotas.splice(i, 1);
      }
    }
  }
}