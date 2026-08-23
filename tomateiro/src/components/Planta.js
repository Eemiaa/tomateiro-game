import * as THREE from 'three';
import { Galho } from './Galho.js';
import { Vaso } from './Vaso.js';
import { Caule } from './Caule.js';

export class Planta extends THREE.Group {
  constructor() {
    super();

    this.progresso = 0;
    this.galhos = [];

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
    const alturaMin = 0.25;
    const alturaMax = alturaTronco - 0.15;

    const totalGalhos = Math.floor((alturaTronco - alturaMin) / alturaMin)-1;
  
    for (let i = 0; i < totalGalhos; i++) {
      const t = i / (totalGalhos - 1);
      const altura = alturaMin + t * (alturaMax - alturaMin);

      const galho = new Galho(0.35, i, altura, alturaTronco);
      this.stem.add(galho);
      this.galhos.push(galho);
    }
  }

  crescer(delta) {
    // 1. O progresso físico da estrutura (tamanho de caule e galhos) é limitado em 1.0
    this.progresso = Math.min(1.0, this.progresso + delta);

    // 2. Atualiza os componentes estruturais
    this.stem.atualizar(this.progresso);
    
    // 3. Os galhos continuam recebendo o 'delta' do Sol para alimentar o ciclo de vida
    this.galhos.forEach(galho => galho.atualizar(this.progresso, delta));
  }
}