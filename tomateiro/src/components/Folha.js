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

    this.tempoPosMaturidade = 0;
    this.offsetQuedaY = 0;
    this.estaCaindo = false;
    this.noChao = false;
  }

  atualizar(progressoGalho, delta = 0, comprimentoGalho = 0.35) {
    // 1. Enquanto o galho estiver crescendo pela primeira vez
    if (progressoGalho < 1) {
      this.mesh.scale.set(progressoGalho * 0.4, progressoGalho * 1.0, progressoGalho * 0.12);
      this.mat.color.copy(this.corVerde);
      return;
    }

    // 2. Galho 100% adulto: inicia os ciclos solares de envelhecimento
    this.tempoPosMaturidade += delta;

    const ESPERA_3_CICLOS = 0.60; // 3 voltas do Sol
    const DURACAO_AMARELO = 0.20; // 1 volta do Sol amarelando

    if (this.tempoPosMaturidade < ESPERA_3_CICLOS) {
      // Permanece madura e verde
      this.mat.color.copy(this.corVerde);
    } else if (this.tempoPosMaturidade < ESPERA_3_CICLOS + DURACAO_AMARELO) {
      // Amarela progressivamente
      const pAmarelo = (this.tempoPosMaturidade - ESPERA_3_CICLOS) / DURACAO_AMARELO;
      this.mat.color.lerpColors(this.corVerde, this.corAmarela, pAmarelo);
    } else {
      // 3. Queda da folha amarela e renascimento
      this.mat.color.copy(this.corAmarela);

      if (!this.noChao) {
        this.estaCaindo = true;
        this.offsetQuedaY += 0.01;
        this.position.y = comprimentoGalho - this.offsetQuedaY;
        this.rotation.z += 0.04; // Vai balançando enquanto cai

        // Tocou o solo perto do vaso
        if (this.position.y <= -comprimentoGalho * 0.8) {
          this.noChao = true;
        }
      } else {
        // Desintegra no chão e renasce
        this.mat.opacity -= 0.015;

        if (this.mat.opacity <= 0) {
          this.resetarFolha(comprimentoGalho);
        }
      }
    }
  }

  resetarFolha(comprimentoGalho) {
    this.tempoPosMaturidade = 0;
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