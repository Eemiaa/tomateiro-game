import * as THREE from 'three';

export class Praga extends THREE.Group {
  constructor(x, y, z) {
    super();

    // Material Roxo para o corpo
    const matRoxo = new THREE.MeshStandardMaterial({ 
      color: 0x9b5de5, 
      roughness: 0.3,
      metalness: 0.1
    });

    const matOlhos = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // 1. Corpo
    const corpoGeo = new THREE.SphereGeometry(0.025, 8, 8);
    this.corpoMesh = new THREE.Mesh(corpoGeo, matRoxo);
    this.corpoMesh.scale.set(1, 0.7, 1.3);
    this.add(this.corpoMesh);

    // 2. Cabeça
    const cabecaGeo = new THREE.SphereGeometry(0.015, 6, 6);
    this.cabecaMesh = new THREE.Mesh(cabecaGeo, matRoxo);
    this.cabecaMesh.position.set(0, 0.005, 0.022);
    this.add(this.cabecaMesh);

    // 3. Olhos
    const olhoGeo = new THREE.SphereGeometry(0.004, 4, 4);
    const olhoEsq = new THREE.Mesh(olhoGeo, matOlhos);
    olhoEsq.position.set(0.007, 0.01, 0.032);
    const olhoDir = new THREE.Mesh(olhoGeo, matOlhos);
    olhoDir.position.set(-0.007, 0.01, 0.032);
    this.add(olhoEsq, olhoDir);

    // Identificação para detecção de clique
    this.userData.praga = this;
    this.corpoMesh.userData.praga = this;
    this.cabecaMesh.userData.praga = this;

    this.position.set(x, y, z);
    this.tempoAnim = Math.random() * 10;
  }

  atualizar() {
    // Efeito de pulsação respiratória para parecer vivo
    this.tempoAnim += 0.08;
    const s = 1 + Math.sin(this.tempoAnim) * 0.08;
    this.scale.set(s, s, s);
  }
}