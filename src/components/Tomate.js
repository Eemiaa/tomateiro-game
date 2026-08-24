import * as THREE from 'three';
import { COLORS } from '../utils/constants.js';

export class Tomate extends THREE.Group {
  constructor(x, y, z) {
    super();

    this.posicaoOrigem = new THREE.Vector3(x, y, z);
    this.userData.tomate = this; // Identificador para a colheita

    // 1. Cabinho
    const cabinhoGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.04, 6);
    cabinhoGeo.translate(0, -0.02, 0);
    const cabinhoMat = new THREE.MeshStandardMaterial({ color: COLORS.STEM, roughness: 0.8 });
    this.cabinho = new THREE.Mesh(cabinhoGeo, cabinhoMat);
    this.cabinho.userData.tomate = this;
    this.add(this.cabinho);

    // 2. Fruto (Tomate)
    const raio = 0.065;
    const geo = new THREE.SphereGeometry(raio, 12, 10);
    geo.translate(0, -0.04 - raio * 0.7, 0);

    this.corVerde = new THREE.Color(COLORS.TOMATO_GREEN || '#55a630');
    this.corVermelha = new THREE.Color('#d90429');
    this.corPodre = new THREE.Color('#3d1e16');

    this.mat = new THREE.MeshStandardMaterial({ 
      color: this.corVerde.clone(), 
      roughness: 0.45,
      transparent: true,
      opacity: 1
    });

    this.mesh = new THREE.Mesh(geo, this.mat);
    this.mesh.userData.tomate = this; 
    this.add(this.mesh);

    this.position.copy(this.posicaoOrigem);
    this.scale.set(0, 0, 0);

    this.tempoCiclo = 0;
    this.primeiroCiclo = true;
    this.offsetQuedaY = 0;
    this.estaCaindo = false;
    this.noChao = false;
    this.estaMaduro = false;
  }

  podeSerColhido() {
    return this.estaMaduro && !this.estaCaindo && !this.noChao;
  }

  colher() {
    this.resetarTomate();
  }

  atualizar(progressoGalho, delta = 0) {
    // Crescimento inicial da planta
    if (progressoGalho < 1) {
      if (progressoGalho > 0.4) {
        const p = Math.min(1, (progressoGalho - 0.4) * 1.6);
        this.scale.setScalar(p);
        this.mat.color.lerpColors(this.corVerde, this.corVermelha, p);
        if (p >= 0.9) this.estaMaduro = true;
      }
      return;
    }

    // Estágios do ciclo de vida
    const TEMPO_BROTAR = 0.20;     // Brota verde
    const TEMPO_AMADURECER = 0.30; // Fica vermelho
    const TEMPO_MADURO = 0.80;     // FICA MADURO E VERMELHO (Tempo de sobra para colher!)
    const TEMPO_APODRECER = 0.40;  // Começa a apodrecer

    if (this.primeiroCiclo) {
      this.primeiroCiclo = false;
      this.tempoCiclo = TEMPO_BROTAR + TEMPO_AMADURECER;
    }

    this.tempoCiclo += delta;

    if (this.estaCaindo) {
      this.estaMaduro = false;
      if (!this.noChao) {
        this.offsetQuedaY += 0.015;
        this.position.y = this.posicaoOrigem.y - this.offsetQuedaY;

        if (this.position.y <= -this.posicaoOrigem.y * 1.5) {
          this.noChao = true;
        }
      } else {
        this.mat.opacity -= 0.02;
        if (this.mat.opacity <= 0) {
          this.resetarTomate();
        }
      }
      return;
    }

    const t1 = TEMPO_BROTAR;
    const t2 = t1 + TEMPO_AMADURECER;
    const t3 = t2 + TEMPO_MADURO;
    const t4 = t3 + TEMPO_APODRECER;

    // FASE 1: Broto verde
    if (this.tempoCiclo < t1) {
      const p = this.tempoCiclo / t1;
      this.scale.setScalar(p);
      this.mat.color.copy(this.corVerde);
      this.estaMaduro = false;
    }
    // FASE 2: Amadurecendo
    else if (this.tempoCiclo < t2) {
      this.scale.setScalar(1);
      const p = (this.tempoCiclo - t1) / TEMPO_AMADURECER;
      this.mat.color.lerpColors(this.corVerde, this.corVermelha, p);
      this.estaMaduro = p > 0.6;
    }
    // FASE 3: Totalmente Maduro e Vermelho (Disponível para colheita)
    else if (this.tempoCiclo < t3) {
      this.scale.setScalar(1);
      this.mat.color.copy(this.corVermelha);
      this.estaMaduro = true;
    }
    // FASE 4: Apodrecendo
    else if (this.tempoCiclo < t4) {
      this.scale.setScalar(1);
      const p = (this.tempoCiclo - t3) / TEMPO_APODRECER;
      this.mat.color.lerpColors(this.corVermelha, this.corPodre, p);
      this.estaMaduro = false;
    }
    // FASE 5: Cai no chão
    else {
      this.estaMaduro = false;
      this.estaCaindo = true;
    }
  }

  resetarTomate() {
    this.tempoCiclo = 0;
    this.primeiroCiclo = false;
    this.offsetQuedaY = 0;
    this.estaCaindo = false;
    this.noChao = false;
    this.estaMaduro = false;
    this.position.copy(this.posicaoOrigem);
    this.mat.opacity = 1;
    this.mat.color.copy(this.corVerde);
    this.scale.set(0, 0, 0);
  }
}