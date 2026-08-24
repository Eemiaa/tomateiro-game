import * as THREE from 'three';
import { Galho } from './Galho.js';
import { Vaso } from './Vaso.js';
import { Caule } from './Caule.js';
import { Praga } from './Praga.js';

export class Planta extends THREE.Group {
  constructor() {
    super();

    this.progresso = 0;
    this.nivelAgua = 50;
    this.nivelSaude = 100;
    this.estaMorta = false;
    this.galhos = [];
    this.pragas = [];

    this._criarVasoETerra();
    this._criarCaule();
    this._criarGalhos();
  }

  _criarVasoETerra() {
    this.vaso = new Vaso();
    this.add(this.vaso);
  }

  _criarCaule() {
    this.stem = new Caule();
    this.add(this.stem);
  }

  _criarGalhos() {
    const alturaTronco = this.stem.altura || 1.2;
    const totalGalhos = 6;
    const alturaMin = 0.25;
    const alturaMax = alturaTronco - 0.15;

    for (let i = 0; i < totalGalhos; i++) {
      const t = i / (totalGalhos - 1);
      const altura = alturaMin + t * (alturaMax - alturaMin);

      const galho = new Galho(0.35, i, altura, alturaTronco);
      this.stem.add(galho);
      this.galhos.push(galho);
    }
  }

  gerarPraga() {
    if (this.pragas.length >= 10 || this.progresso < 0.2) return;

    // Decide se nasce no Caule ou num Galho
    const noCaule = Math.random() < 0.4;
    let x = 0, y = 0, z = 0;
    let pai = this.stem;

    if (noCaule) {
      const angulo = Math.random() * Math.PI * 2;
      const raio = 0.035;
      x = Math.cos(angulo) * raio;
      z = Math.sin(angulo) * raio;
      y = 0.2 + Math.random() * 0.8;
    } else {
      const galhoSorteado = this.galhos[Math.floor(Math.random() * this.galhos.length)];
      pai = galhoSorteado;
      const angulo = Math.random() * Math.PI * 2;
      const distAlong = 0.1 + Math.random() * 0.2;
      x = Math.cos(angulo) * 0.025;
      z = Math.sin(angulo) * 0.025;
      y = distAlong;
    }

    const praga = new Praga(x, y, z);
    pai.add(praga);
    this.pragas.push(praga);
  }

  removerPraga(praga) {
    const idx = this.pragas.indexOf(praga);
    if (idx !== -1) {
      if (praga.parent) praga.parent.remove(praga);
      this.pragas.splice(idx, 1);
    }
  }

  regar(quantidade) {
    this.nivelAgua = Math.min(100, this.nivelAgua + quantidade);
  }

  evaporarAgua(delta) {
    this.nivelAgua = Math.max(0, this.nivelAgua - delta * 50);
  }

  atualizarSaude(delta) {
    // DANO MULTIPLICATIVO / ACUMULATIVO DAS PRAGAS
    const danoPragas = this.pragas.length * delta * 50;

    if (this.nivelAgua <= 0) {
      this.nivelSaude = Math.max(0, this.nivelSaude - delta * 15 - danoPragas);
    } else if (this.nivelAgua < 20) {
      this.nivelSaude = Math.max(0, this.nivelSaude - delta * 5 - danoPragas);
    } else if (this.pragas.length > 0) {
      // Se houver insetos, a saúde cai continuamente mesmo tendo água
      this.nivelSaude = Math.max(0, this.nivelSaude - danoPragas);
    } else if (this.nivelAgua > 40 && this.nivelSaude < 100) {
      // Planta limpa e regada se recupera aos poucos
      this.nivelSaude = Math.min(100, this.nivelSaude + delta * 50);
    }

    this.estaMorta = this.nivelSaude <= 0;
  }
  
  resetar() {
    this.progresso = 0;
    this.nivelAgua = 100;
    this.nivelSaude = 100;
    this.estaMorta = false;
    this.rotation.set(0, 0, 0);

    // Remove todas as pragas ativas
    [...this.pragas].forEach(p => this.removerPraga(p));

    // Reseta o caule e os galhos
    this.stem.atualizar(0);
    this.galhos.forEach(galho => {
      galho.scale.set(0, 0, 0);
      galho.folha.resetarFolha(0.35);
      galho.tomates.forEach(tomate => tomate.resetarTomate());
    });
  }

  crescer(delta) {
    this.evaporarAgua(delta);
    this.atualizarSaude(delta);

    // Animação de pulsação dos insetos
    this.pragas.forEach(p => p.atualizar());

    // Chance de surgimento de novas pragas
    if (Math.random() < 0.004) {
      this.gerarPraga();
    }

    if (this.estaMorta) {
      this.rotation.x = THREE.MathUtils.lerp(this.rotation.x, 0.4, 0.05);
      this.rotation.z = THREE.MathUtils.lerp(this.rotation.z, 0.2, 0.05);
      return; 
    } else if (this.nivelAgua <= 0) {
      this.rotation.x = THREE.MathUtils.lerp(this.rotation.x, 0.15, 0.05);
      this.rotation.z = THREE.MathUtils.lerp(this.rotation.z, 0, 0.05);
      return;
    } else {
      this.rotation.x = THREE.MathUtils.lerp(this.rotation.x, 0, 0.05);
      this.rotation.z = THREE.MathUtils.lerp(this.rotation.z, 0, 0.05);
    }

    this.progresso = Math.min(1.0, this.progresso + delta);
    this.stem.atualizar(this.progresso);
    this.galhos.forEach(galho => galho.atualizar(this.progresso, delta));
  }
}