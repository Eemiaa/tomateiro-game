import * as THREE from 'three';
import { COLORS } from '../utils/constants.js';
import { Folha } from './Folha.js';
import { Tomate } from './Tomate.js';

export class Galho extends THREE.Group {
  constructor(comprimento, indice, alturaNoCaule, alturaTronco = 1.2) {
    super();

    this.position.y = alturaNoCaule; 
    this.proporcaoAltura = alturaNoCaule / alturaTronco; 

    // 1. Geometria do Galho
    const geo = new THREE.CylinderGeometry(0.01, 0.02, comprimento, 8);
    geo.translate(0, comprimento / 2, 0);
    const mat = new THREE.MeshStandardMaterial({ color: COLORS.STEM, roughness: 0.8 });
    
    this.mesh = new THREE.Mesh(geo, mat);
    this.add(this.mesh);

    // 2. Folha na ponta
    this.folha = new Folha();
    this.folha.position.set(0, comprimento, 0);
    this.add(this.folha);

    // 3. Cacho com 3 Tomates no meio do galho
    this.tomates = [];
    this._criarTomatesNoMeio(comprimento);

    // Rotação Y (120° entre cada um) e inclinação Z
    this.rotation.order = 'YXZ';
    this.rotation.y = indice * (Math.PI * 2 / 3); 
    this.rotation.z = Math.PI / 3.5; 

    this.scale.set(0, 0, 0);
  }

  _criarTomatesNoMeio(comprimento) {
    const totalTomates = 3;
    const centroY = comprimento * 0.5; // Meio da extensão do galho

    for (let i = 0; i < totalTomates; i++) {
      const angulo = (i * Math.PI * 2) / totalTomates;
      const raioDistancia = 0.035; // Distância ao redor do cilindro do galho

      const x = Math.cos(angulo) * raioDistancia;
      const z = Math.sin(angulo) * raioDistancia;
      const y = centroY + (i - 1) * 0.025; // Pequeno desnível vertical no cacho

      const tomate = new Tomate(x, y, z);
      this.add(tomate);
      this.tomates.push(tomate);
    }
  }

  atualizar(progresso, delta) {
    if (progresso >= this.proporcaoAltura) {
      const progressoGalho = Math.min(1, (progresso - this.proporcaoAltura) * 8);
      
      this.scale.setScalar(progressoGalho);

      // Repassa os deltas de tempo para os componentes
      this.folha.atualizar(progressoGalho, delta, 0.35); // 0.35 é o comprimento do galho
      this.tomates.forEach(tomate => tomate.atualizar(progressoGalho, delta));
    } else {
      this.scale.set(0, 0, 0);
    }
  }
}