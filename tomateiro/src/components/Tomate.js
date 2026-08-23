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
    this.corPodre = new THREE.Color('#3d1e16');

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

    this.tempoCiclo = 0;
    this.primeiroCiclo = true; // Controla a transição do primeiro crescimento da planta
    this.offsetQuedaY = 0;
    this.estaCaindo = false;
    this.noChao = false;
  }

  atualizar(progressoGalho, delta = 0) {
    // 1. Crescimento inicial da planta
    if (progressoGalho < 1) {
      if (progressoGalho > 0.4) {
        const p = Math.min(1, (progressoGalho - 0.4) * 1.6);
        this.scale.setScalar(p);
        this.mat.color.lerpColors(this.corVerde, this.corVermelha, p);
      }
      return;
    }

    const TEMPO_CRESCER_VERDE = 0.20; // 1 ciclo brotando verde
    const TEMPO_AMADURECER = 0.40;    // 2 ciclos amadurecendo
    const TEMPO_APODRECER = 0.60;     // 3 ciclos apodrecendo

    // Transição da primeira crescida: pula a fase de re-brota verde e amadurecimento
    if (this.primeiroCiclo) {
      this.primeiroCiclo = false;
      this.tempoCiclo = TEMPO_CRESCER_VERDE + TEMPO_AMADURECER; 
    }

    // 2. Ciclo contínuo do fruto
    this.tempoCiclo += delta;

    if (this.estaCaindo) {
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

    // Fase 1: Broto verde novo nascendo (nas gerações seguintes)
    if (this.tempoCiclo < TEMPO_CRESCER_VERDE) {
      const p = this.tempoCiclo / TEMPO_CRESCER_VERDE;
      this.scale.setScalar(p);
      this.mat.color.copy(this.corVerde);
    }
    // Fase 2: Amadurecendo até ficar vermelho
    else if (this.tempoCiclo < TEMPO_CRESCER_VERDE + TEMPO_AMADURECER) {
      this.scale.setScalar(1);
      const pVermelho = (this.tempoCiclo - TEMPO_CRESCER_VERDE) / TEMPO_AMADURECER;
      this.mat.color.lerpColors(this.corVerde, this.corVermelha, pVermelho);
    }
    // Fase 3: Apodrecendo (Vermelho -> Castanho Escuro)
    else if (this.tempoCiclo < TEMPO_CRESCER_VERDE + TEMPO_AMADURECER + TEMPO_APODRECER) {
      this.scale.setScalar(1);
      const pPodre = (this.tempoCiclo - (TEMPO_CRESCER_VERDE + TEMPO_AMADURECER)) / TEMPO_APODRECER;
      this.mat.color.lerpColors(this.corVermelha, this.corPodre, pPodre);
    }
    // Fase 4: Cai do galho
    else {
      this.estaCaindo = true;
    }
  }

  resetarTomate() {
    this.tempoCiclo = 0;
    this.primeiroCiclo = false;
    this.offsetQuedaY = 0;
    this.estaCaindo = false;
    this.noChao = false;
    this.position.copy(this.posicaoOrigem);
    this.mat.opacity = 1;
    this.mat.color.copy(this.corVerde);
    this.scale.set(0, 0, 0);
  }
}