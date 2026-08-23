import * as THREE from 'three';
import { COLORS } from '../utils/constants.js';

export class Tomate extends THREE.Group {
  constructor(x, y, z) {
    super();

    this.posicaoOrigem = new THREE.Vector3(x, y, z);

    // Cabinho
    const cabinhoGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.04, 6);
    cabinhoGeo.translate(0, -0.02, 0);
    const cabinhoMat = new THREE.MeshStandardMaterial({ color: COLORS.STEM, roughness: 0.8 });
    this.add(new THREE.Mesh(cabinhoGeo, cabinhoMat));

    // Fruto
    const raio = 0.065;
    const geo = new THREE.SphereGeometry(raio, 12, 10);
    geo.translate(0, -0.04 - raio * 0.7, 0);

    this.corVerde = new THREE.Color(COLORS.TOMATO_GREEN || '#55a630');
    this.corVermelha = new THREE.Color('#d90429');
    this.corPodre = new THREE.Color('#3d1e16'); // Castanho escuro / podre

    this.mat = new THREE.MeshStandardMaterial({ 
      color: this.corVerde.clone(), 
      roughness: 0.45,
      transparent: true,
      opacity: 1
    });

    this.mesh = new THREE.Mesh(geo, this.mat);
    this.add(this.mesh);

    this.position.copy(this.posicaoOrigem);
    this.scale.set(0, 0, 0);

    this.tempoPosMaturidade = 0;
    this.offsetQuedaY = 0;
    this.noChao = false;
  }

  atualizar(progressoGalho, delta = 0) {
    if (progressoGalho < 1) {
      if (progressoGalho > 0.4) {
        const p = Math.min(1, (progressoGalho - 0.4) * 1.6);
        this.scale.setScalar(p);
        this.mat.color.lerpColors(this.corVerde, this.corVermelha, p);
      }
      return;
    }

    // Galho 100% desenvolvido
    this.tempoPosMaturidade += delta;

    const ESPERA_AMADURECER = 0.40; // 2 ciclos solares maduro
    const ESPERA_APODRECER = 0.80;  // 2 ciclos apodrecendo

    if (this.tempoPosMaturidade < ESPERA_AMADURECER) {
      this.mat.color.copy(this.corVermelha);
    } else if (this.tempoPosMaturidade < ESPERA_APODRECER) {
      // Apodrece mudando para castanho escuro
      const pPodre = (this.tempoPosMaturidade - ESPERA_AMADURECER) / (ESPERA_APODRECER - ESPERA_AMADURECER);
      this.mat.color.lerpColors(this.corVermelha, this.corPodre, pPodre);
    } else {
      // Tomate podre cai
      this.mat.color.copy(this.corPodre);

      if (!this.noChao) {
        this.offsetQuedaY += 0.015;
        this.position.y = this.posicaoOrigem.y - this.offsetQuedaY;

        if (this.position.y <= -this.posicaoOrigem.y * 1.5) {
          this.noChao = true;
        }
      } else {
        // Sumir no chão e renascer novo fruto verde
        this.mat.opacity -= 0.02;

        if (this.mat.opacity <= 0) {
          this.resetarTomate();
        }
      }
    }
  }

  resetarTomate() {
    this.tempoPosMaturidade = 0;
    this.offsetQuedaY = 0;
    this.noChao = false;
    this.position.copy(this.posicaoOrigem);
    this.mat.opacity = 1;
    this.mat.color.copy(this.corVerde);
    this.scale.set(0, 0, 0);
  }
}