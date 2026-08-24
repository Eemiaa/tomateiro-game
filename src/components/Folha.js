import * as THREE from 'three';
import { COLORS } from '../utils/constants.js';

export class Folha extends THREE.Group {
  constructor() {
    super();

    const raio = 0.2;
    const geo = new THREE.SphereGeometry(raio, 8, 6);
    geo.translate(0, raio, 0);

    this.corVerde = new THREE.Color(COLORS.LEAF || '#2d6a4f');
    this.corAmarela = new THREE.Color('#d4b483');

    this.mat = new THREE.MeshStandardMaterial({ 
      color: this.corVerde.clone(), 
      roughness: 0.7, 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1
    });

    this.mesh = new THREE.Mesh(geo, this.mat);
    this.mesh.rotation.y = Math.PI / 2; 
    this.mesh.rotation.x = -Math.PI / 6; 
    this.add(this.mesh);

    this.tempoCiclo = 0;
    this.primeiroCiclo = true; // Controla a transição do primeiro crescimento da planta
    this.offsetQuedaY = 0;
    this.estaCaindo = false;
    this.noChao = false;
  }

  atualizar(progressoGalho, delta = 0, comprimentoGalho = 0.35) {
    // 1. Crescimento inicial da estrutura da planta
    if (progressoGalho < 1) {
      this.mesh.scale.set(progressoGalho * 0.4, progressoGalho * 1.0, progressoGalho * 0.12);
      this.mat.color.copy(this.corVerde);
      return;
    }

    const TEMPO_CRESCER = 0.20;       // 1 ciclo brotando
    const ESPERA_3_CICLOS = 0.60;     // 3 ciclos verde madura
    const DURACAO_AMARELO = 0.20;     // 1 ciclo amarelando

    // Transição da primeira crescida: pula a fase de re-brota
    if (this.primeiroCiclo) {
      this.primeiroCiclo = false;
      this.tempoCiclo = TEMPO_CRESCER; 
    }

    // 2. Ciclo de vida contínuo
    this.tempoCiclo += delta;

    if (this.estaCaindo) {
      if (!this.noChao) {
        this.offsetQuedaY += 0.01;
        this.position.y = comprimentoGalho - this.offsetQuedaY;
        this.rotation.z += 0.04;

        if (this.position.y <= -comprimentoGalho * 0.8) {
          this.noChao = true;
        }
      } else {
        this.mat.opacity -= 0.02;
        if (this.mat.opacity <= 0) {
          this.resetarFolha(comprimentoGalho);
        }
      }
      return;
    }

    // Fase 1: Broto novo nascendo do zero (nas gerações seguintes)
    if (this.tempoCiclo < TEMPO_CRESCER) {
      const p = this.tempoCiclo / TEMPO_CRESCER;
      this.mesh.scale.set(p * 0.4, p * 1.0, p * 0.12);
      this.mat.color.copy(this.corVerde);
    } 
    // Fase 2: Folha verde madura (3 ciclos solares)
    else if (this.tempoCiclo < TEMPO_CRESCER + ESPERA_3_CICLOS) {
      this.mesh.scale.set(0.4, 1.0, 0.12);
      this.mat.color.copy(this.corVerde);
    } 
    // Fase 3: Amarelando (1 ciclo solar)
    else if (this.tempoCiclo < TEMPO_CRESCER + ESPERA_3_CICLOS + DURACAO_AMARELO) {
      this.mesh.scale.set(0.4, 1.0, 0.12);
      const pAmarelo = (this.tempoCiclo - (TEMPO_CRESCER + ESPERA_3_CICLOS)) / DURACAO_AMARELO;
      this.mat.color.lerpColors(this.corVerde, this.corAmarela, pAmarelo);
    } 
    // Fase 4: Cai do galho
    else {
      this.estaCaindo = true;
    }
  }

  resetarFolha(comprimentoGalho) {
    this.tempoCiclo = 0;
    this.primeiroCiclo = false;
    this.offsetQuedaY = 0;
    this.estaCaindo = false;
    this.noChao = false;
    this.position.set(0, comprimentoGalho, 0);
    this.rotation.set(0, 0, 0);
    this.mat.opacity = 1;
    this.mat.color.copy(this.corVerde);
    this.mesh.scale.set(0, 0, 0);
  }
}