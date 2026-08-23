import * as THREE from 'three';
import { Galho } from './Galho.js';
import { Vaso } from './Vaso.js';
import { Caule } from './Caule.js';

export class Planta extends THREE.Group {
  constructor() {
    super();

    this.progresso = 0;
    this.nivelAgua = 50; // Começa com 100% de água
    this.galhos = [];

    this._criarVasoETerra();
    this._criarCaule();
    this._criarGalhos();
  }

  regar(quantidade) {
    this.nivelAgua = Math.min(100, this.nivelAgua + quantidade);
  }

  evaporarAgua(delta) {
    // Perde água conforme os ciclos do sol passam
    this.nivelAgua = Math.max(0, this.nivelAgua - delta * 50);
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
    const alturaMax = alturaTronco;

    const totalGalhos = Math.floor((alturaTronco - alturaMin) / alturaMin) ;
    console.log(totalGalhos)
  
    for (let i = 0; i < totalGalhos; i++) {
      const t = i / (totalGalhos - 1);
      const altura = alturaMin + t * (alturaMax - alturaMin);

      const galho = new Galho(0.35, i, altura, alturaTronco);
      this.stem.add(galho);
      this.galhos.push(galho);
    }
  }

  crescer(delta) {
    // 1. Evapora a água gradualmente
    this.evaporarAgua(delta);

    // 2. Se não tiver água (> 0), A PLANTA NÃO CRESCE e murcha
    if (this.nivelAgua <= 0) {
      this.rotation.x = THREE.MathUtils.lerp(this.rotation.x, 0.15, 0.05); // Caule murcha caído
      return; 
    } else {
      this.rotation.x = THREE.MathUtils.lerp(this.rotation.x, 0, 0.05); // Ergue normal
    }

    // 3. O progresso físico da estrutura (tamanho de caule e galhos) é limitado em 1.0
    this.progresso = Math.min(1.0, this.progresso + delta);

    // 4. Atualiza os componentes estruturais
    this.stem.atualizar(this.progresso);
    
    // 5. Os galhos continuam recebendo o 'delta' do Sol para alimentar o ciclo de vida
    this.galhos.forEach(galho => galho.atualizar(this.progresso, delta));
  }
}