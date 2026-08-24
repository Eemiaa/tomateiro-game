import * as THREE from 'three';
import { COLORS } from '../utils/constants.js';

export class Caule extends THREE.Group {
  constructor(altura = 2, raioTopo = 0.02, raioBase = 0.05) {
    super(); // OBRIGATÓRIO: chama o construtor do THREE.Group

    this.altura = altura;

    // 1. Geometria do cilindro
    const geo = new THREE.CylinderGeometry(raioTopo, raioBase, this.altura, 16);

    // 2. Mover o pivô para a base
    // Como o Three.js cria o cilindro centralizado em (0,0,0), subimos a geometria metade da altura.
    geo.translate(0, this.altura / 2, 0);

    // 3. Material e Mesh
    const mat = new THREE.MeshStandardMaterial({ 
      color: COLORS.STEM, 
      roughness: 0.8 
    });

    this.mesh = new THREE.Mesh(geo, mat);
    this.add(this.mesh);

    // 4. Estado inicial: recolhido na terra (escala Y zerada)
    this.scale.set(1, 0, 1);
  }

  // Atualiza a altura do caule conforme o progresso (0 a 1)
  atualizar(progresso) {
    this.scale.y = progresso;
  }
}