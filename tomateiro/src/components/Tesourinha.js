import * as THREE from 'three';

export class Tesourinha extends THREE.Group {
  constructor() {
    super();

    this.estaSendoArrastada = false;
    this.posicaoInventario = new THREE.Vector3();
    this.animCorte = 0;

    this._criarModelo();
  }

  _criarModelo() {
    const matMetal = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const matCabo = new THREE.MeshStandardMaterial({ color: 0xd90429, roughness: 0.5 });

    // Grupo da lâmina 1 + cabo
    this.lamina1 = new THREE.Group();
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.12, 0.005), matMetal);
    b1.position.set(0, 0.05, 0);
    const c1 = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.006, 8, 12), matCabo);
    c1.position.set(0, -0.02, 0);
    this.lamina1.add(b1, c1);

    // Grupo da lâmina 2 + cabo
    this.lamina2 = new THREE.Group();
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.12, 0.005), matMetal);
    b2.position.set(0, 0.05, 0);
    const c2 = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.006, 8, 12), matCabo);
    c2.position.set(0, -0.02, 0);
    this.lamina2.add(b2, c2);

    // Parafuso central (pivô)
    const pino = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.012, 8), matMetal);
    pino.rotateX(Math.PI / 2);

    this.add(this.lamina1, this.lamina2, pino);
  }

  _atualizarPosicaoInventario(camera) {
    const distancia = 1.0;
    const vFOV = THREE.MathUtils.degToRad(camera.fov);
    const alturaVisivel = 2 * Math.tan(vFOV / 2) * distancia;
    const larguraVisivel = alturaVisivel * camera.aspect;

    // Posiciona ao lado do regador (+0.38 na largura)
    this.posicaoInventario.set(
      -larguraVisivel / 2 + 0.38,
      -alturaVisivel / 2 + 0.18,
      -distancia
    );
  }

  animarCorte() {
    this.animCorte = 1.0; // Inicia a animação rápida de "tesourada"
  }

  atualizar(camera) {
    this._atualizarPosicaoInventario(camera);

    // Animação das lâminas abrindo e fechando ao cortar
    if (this.animCorte > 0) {
      this.animCorte -= 0.1;
      const angulo = Math.sin(this.animCorte * Math.PI) * 0.4;
      this.lamina1.rotation.z = angulo;
      this.lamina2.rotation.z = -angulo;
    } else {
      this.lamina1.rotation.z = 0.15;
      this.lamina2.rotation.z = -0.15;
    }

    if (!this.estaSendoArrastada) {
      // Retorna ao inventário
      this.position.lerp(this.posicaoInventario, 0.15);
      this.rotation.x = THREE.MathUtils.lerp(this.rotation.x, 0.2, 0.15);
      this.rotation.y = THREE.MathUtils.lerp(this.rotation.y, 0, 0.15);
      this.rotation.z = THREE.MathUtils.lerp(this.rotation.z, -0.2, 0.15);
    } else {
      this.rotation.x = THREE.MathUtils.lerp(this.rotation.x, 0, 0.15);
      this.rotation.y = THREE.MathUtils.lerp(this.rotation.y, 0, 0.15);
    }
  }
}