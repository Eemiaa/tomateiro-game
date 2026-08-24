export class UI {
  constructor() {
    this.tomatesColhidos = 0;
    this.dinheiro = 0;
    this.precoPorTomate = 5;
    this.multiplicadorVelocidade = 1;

    this.tempoRegaAuto = 0;
    this.tempoPragasAuto = 0;
    this.tempoColheitaAuto = 0;

    this._criarUI();
  }

  _criarUI() {
    // 1. Canto Superior Esquerdo
    const containerEsq = document.createElement('div');
    containerEsq.style.position = 'absolute';
    containerEsq.style.top = '20px';
    containerEsq.style.left = '20px';
    containerEsq.style.fontFamily = 'Arial, sans-serif';
    containerEsq.style.color = '#ffffff';
    containerEsq.style.userSelect = 'none';
    containerEsq.style.zIndex = '100';

    containerEsq.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 4px; text-shadow: 1px 1px 2px #000; font-size: 14px;">
        💧 Água: <span id="texto-agua">100</span>%
      </div>
      <div style="width: 160px; height: 14px; background: rgba(0,0,0,0.5); border: 2px solid #fff; border-radius: 8px; overflow: hidden; margin-bottom: 12px;">
        <div id="barra-agua-preenchimento" style="width: 100%; height: 100%; background: linear-gradient(90deg, #3a86ff, #00b4d8); transition: width 0.1s linear;"></div>
      </div>

      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
        <div style="font-weight: bold; font-size: 18px; text-shadow: 1px 1px 3px #000; display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.3); padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.3); width: fit-content;">
          <span>🍅</span>
          <span id="texto-tomates">0</span>
        </div>
        
        <button id="btn-vender" style="
          background: linear-gradient(135deg, #2ec4b6, #2a9d8f);
          border: 1px solid #fff;
          color: white;
          font-weight: bold;
          font-size: 13px;
          padding: 6px 12px;
          border-radius: 15px;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        ">
          💰 Vender (R$ 5)
        </button>
      </div>

      <div style="font-weight: bold; font-size: 18px; text-shadow: 1px 1px 3px #000; display: flex; align-items: center; gap: 8px; background: rgba(155, 93, 229, 0.3); padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(155, 93, 229, 0.6); width: fit-content;">
        <span>🐛</span>
        <span id="texto-pragas">0</span>
      </div>
    `;

    // 2. Topo Central (Velocidade)
    const containerVelocidade = document.createElement('div');
    containerVelocidade.style.position = 'absolute';
    containerVelocidade.style.top = '20px';
    containerVelocidade.style.left = '50%';
    containerVelocidade.style.transform = 'translateX(-50%)';
    containerVelocidade.style.fontFamily = 'Arial, sans-serif';
    containerVelocidade.style.zIndex = '100';
    containerVelocidade.style.background = 'rgba(0, 0, 0, 0.4)';
    containerVelocidade.style.backdropFilter = 'blur(4px)';
    containerVelocidade.style.padding = '6px 12px';
    containerVelocidade.style.borderRadius = '20px';
    containerVelocidade.style.border = '1px solid rgba(255, 255, 255, 0.3)';
    containerVelocidade.style.display = 'flex';
    containerVelocidade.style.alignItems = 'center';
    containerVelocidade.style.gap = '6px';

    containerVelocidade.innerHTML = `
      <span style="color: #fff; font-size: 12px; font-weight: bold; margin-right: 4px; text-shadow: 1px 1px 2px #000;">⚡ VELOCIDADE</span>
      <button class="btn-speed" data-speed="1" style="padding: 4px 10px; border-radius: 12px; border: 1px solid #fff; background: #3a86ff; color: #fff; font-weight: bold; cursor: pointer; font-size: 12px;">1x</button>
      <button class="btn-speed" data-speed="2" style="padding: 4px 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.4); background: rgba(0,0,0,0.3); color: #ccc; font-weight: bold; cursor: pointer; font-size: 12px;">2x</button>
      <button class="btn-speed" data-speed="4" style="padding: 4px 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.4); background: rgba(0,0,0,0.3); color: #ccc; font-weight: bold; cursor: pointer; font-size: 12px;">4x</button>
      <button class="btn-speed" data-speed="5" style="padding: 4px 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.4); background: rgba(0,0,0,0.3); color: #ccc; font-weight: bold; cursor: pointer; font-size: 12px;">5x</button>
    `;

    // 3. Canto Superior Direito
    const containerDir = document.createElement('div');
    containerDir.style.position = 'absolute';
    containerDir.style.top = '20px';
    containerDir.style.right = '20px';
    containerDir.style.fontFamily = 'Arial, sans-serif';
    containerDir.style.color = '#ffffff';
    containerDir.style.userSelect = 'none';
    containerDir.style.zIndex = '100';
    containerDir.style.textAlign = 'right';

    containerDir.innerHTML = `
      <div style="font-weight: bold; font-size: 20px; text-shadow: 1px 1px 3px #000; display: inline-flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.4); padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(255, 215, 0, 0.6); color: #ffd700; margin-bottom: 10px;">
        <span>💰</span>
        <span>R$ <span id="texto-dinheiro">0</span></span>
      </div>

      <div style="font-weight: bold; margin-bottom: 4px; text-shadow: 1px 1px 2px #000; font-size: 14px;">
        ❤️ Saúde: <span id="texto-saude">100</span>%
      </div>
      <div style="width: 160px; height: 14px; background: rgba(0,0,0,0.5); border: 2px solid #fff; border-radius: 8px; overflow: hidden; display: inline-block;">
        <div id="barra-saude-preenchimento" style="width: 100%; height: 100%; background: linear-gradient(90deg, #2ec4b6, #2a9d8f); transition: width 0.1s linear;"></div>
      </div>
    `;

    // 4. Canto Inferior Direito (Habilidades)
    const containerHabilidades = document.createElement('div');
    containerHabilidades.style.position = 'absolute';
    containerHabilidades.style.bottom = '20px';
    containerHabilidades.style.right = '20px';
    containerHabilidades.style.fontFamily = 'Arial, sans-serif';
    containerHabilidades.style.zIndex = '100';
    containerHabilidades.style.display = 'flex';
    containerHabilidades.style.flexDirection = 'column';
    containerHabilidades.style.gap = '8px';
    containerHabilidades.style.alignItems = 'flex-end';

    containerHabilidades.innerHTML = `
      <div style="font-size: 12px; font-weight: bold; color: #fff; text-shadow: 1px 1px 2px #000; margin-bottom: 2px;">
        ✨ HABILIDADES
      </div>

      <button id="btn-hab-rega" style="background: rgba(0, 0, 0, 0.6); border: 1px solid #3a86ff; color: #fff; padding: 8px 12px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: bold; font-size: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
        <span>🚿 Rega Auto (R$ 20)</span>
        <span id="timer-rega" style="color: #3a86ff; font-size: 11px;">00:00</span>
      </button>

      <button id="btn-hab-pragas" style="background: rgba(0, 0, 0, 0.6); border: 1px solid #9b5de5; color: #fff; padding: 8px 12px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: bold; font-size: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
        <span>🧪 Anti-Pragas (R$ 50)</span>
        <span id="timer-pragas" style="color: #9b5de5; font-size: 11px;">00:00</span>
      </button>

      <button id="btn-hab-colheita" style="background: rgba(0, 0, 0, 0.6); border: 1px solid #ffd700; color: #fff; padding: 8px 12px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: bold; font-size: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
        <span>🧺 Colheita Auto (R$ 100)</span>
        <span id="timer-colheita" style="color: #ffd700; font-size: 11px;">00:00</span>
      </button>
    `;

    // 5. Tela de GAME OVER (Modal Centralizado)
    this.containerGameOver = document.createElement('div');
    this.containerGameOver.style.position = 'fixed';
    this.containerGameOver.style.top = '0';
    this.containerGameOver.style.left = '0';
    this.containerGameOver.style.width = '100vw';
    this.containerGameOver.style.height = '100vh';
    this.containerGameOver.style.background = 'rgba(0, 0, 0, 0.75)';
    this.containerGameOver.style.backdropFilter = 'blur(6px)';
    this.containerGameOver.style.display = 'none';
    this.containerGameOver.style.justifyContent = 'center';
    this.containerGameOver.style.alignItems = 'center';
    this.containerGameOver.style.zIndex = '1000';
    this.containerGameOver.style.fontFamily = 'Arial, sans-serif';

    this.containerGameOver.innerHTML = `
      <div style="
        background: linear-gradient(180deg, #1f2937, #111827);
        border: 2px solid #ef4444;
        border-radius: 20px;
        padding: 32px 40px;
        text-align: center;
        max-width: 380px;
        box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
      ">
        <div style="font-size: 50px; margin-bottom: 10px;">💀</div>
        <h1 style="color: #ef4444; margin: 0 0 10px 0; font-size: 28px; text-shadow: 0 2px 4px #000;">GAME OVER</h1>
        <p style="color: #d1d5db; font-size: 15px; line-height: 1.5; margin: 0 0 24px 0;">
          Sua planta de tomate não resistiu às condições e acabou secando.
        </p>

        <!-- Botão no meio inferior da mensagem -->
        <button id="btn-recomecar" style="
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #ffffff;
          border: 1px solid #fca5a5;
          font-weight: bold;
          font-size: 15px;
          padding: 12px 24px;
          border-radius: 25px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
          transition: transform 0.15s, background 0.15s;
        ">
          🔄 Começar de Novo
        </button>
      </div>
    `;

    document.body.appendChild(containerEsq);
    document.body.appendChild(containerVelocidade);
    document.body.appendChild(containerDir);
    document.body.appendChild(containerHabilidades);
    document.body.appendChild(this.containerGameOver);

    // Mapeamento de Elementos
    this.elTextoAgua = document.getElementById('texto-agua');
    this.elBarraAgua = document.getElementById('barra-agua-preenchimento');
    this.elTextoTomates = document.getElementById('texto-tomates');
    this.elTextoPragas = document.getElementById('texto-pragas');
    this.elTextoDinheiro = document.getElementById('texto-dinheiro');
    this.btnVender = document.getElementById('btn-vender');

    this.elTextoSaude = document.getElementById('texto-saude');
    this.elBarraSaude = document.getElementById('barra-saude-preenchimento');

    this.timerRegaEl = document.getElementById('timer-rega');
    this.timerPragasEl = document.getElementById('timer-pragas');
    this.timerColheitaEl = document.getElementById('timer-colheita');
    this.btnRecomecar = document.getElementById('btn-recomecar');

    // Eventos
    const btnsVelocidade = containerVelocidade.querySelectorAll('.btn-speed');
    btnsVelocidade.forEach(btn => {
      btn.addEventListener('click', () => {
        this.multiplicadorVelocidade = parseFloat(btn.dataset.speed);
        btnsVelocidade.forEach(b => {
          b.style.background = 'rgba(0,0,0,0.3)';
          b.style.color = '#ccc';
          b.style.borderColor = 'rgba(255,255,255,0.4)';
        });
        btn.style.background = '#3a86ff';
        btn.style.color = '#fff';
        btn.style.borderColor = '#fff';
      });
    });

    this.btnVender.addEventListener('click', (e) => this._venderTomates(e));

    document.getElementById('btn-hab-rega').addEventListener('click', (e) => {
      if (this.dinheiro >= 20) {
        this.dinheiro -= 20;
        this.tempoRegaAuto += 60;
        this.elTextoDinheiro.innerText = this.dinheiro;
        this.mostrarEfeito('+1 min 🚿', e.clientX, e.clientY, '#3a86ff');
      }
    });

    document.getElementById('btn-hab-pragas').addEventListener('click', (e) => {
      if (this.dinheiro >= 50) {
        this.dinheiro -= 50;
        this.tempoPragasAuto += 60;
        this.elTextoDinheiro.innerText = this.dinheiro;
        this.mostrarEfeito('+1 min 🧪', e.clientX, e.clientY, '#9b5de5');
      }
    });

    document.getElementById('btn-hab-colheita').addEventListener('click', (e) => {
      if (this.dinheiro >= 100) {
        this.dinheiro -= 100;
        this.tempoColheitaAuto += 60;
        this.elTextoDinheiro.innerText = this.dinheiro;
        this.mostrarEfeito('+1 min 🧺', e.clientX, e.clientY, '#ffd700');
      }
    });
  }

  exibirGameOver() {
    this.containerGameOver.style.display = 'flex';
  }

  ocultarGameOver() {
    this.containerGameOver.style.display = 'none';
  }

  resetarStats() {
    this.tomatesColhidos = 0;
    this.dinheiro = 0;
    this.tempoRegaAuto = 0;
    this.tempoPragasAuto = 0;
    this.tempoColheitaAuto = 0;

    this.elTextoTomates.innerText = 0;
    this.elTextoDinheiro.innerText = 0;
    this.atualizarAgua(100);
    this.atualizarSaude(100);
    this.atualizarPragas(0);
    this.atualizarTimers(0);
  }

  _formatarTempo(segundos) {
    const mins = Math.floor(segundos / 60);
    const segs = Math.floor(segundos % 60);
    return `${String(mins).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
  }

  atualizarTimers(deltaSegundos) {
    if (this.tempoRegaAuto > 0) {
      this.tempoRegaAuto = Math.max(0, this.tempoRegaAuto - deltaSegundos);
    }
    if (this.tempoPragasAuto > 0) {
      this.tempoPragasAuto = Math.max(0, this.tempoPragasAuto - deltaSegundos);
    }
    if (this.tempoColheitaAuto > 0) {
      this.tempoColheitaAuto = Math.max(0, this.tempoColheitaAuto - deltaSegundos);
    }

    this.timerRegaEl.innerText = this._formatarTempo(this.tempoRegaAuto);
    this.timerPragasEl.innerText = this._formatarTempo(this.tempoPragasAuto);
    this.timerColheitaEl.innerText = this._formatarTempo(this.tempoColheitaAuto);
  }

  _venderTomates(event) {
    if (this.tomatesColhidos <= 0) return;

    const valorGanho = this.tomatesColhidos * this.precoPorTomate;
    this.dinheiro += valorGanho;
    
    const rect = this.btnVender.getBoundingClientRect();
    this.mostrarEfeito(`+R$ ${valorGanho} 💰`, rect.left + 10, rect.top - 20, '#ffd700');

    this.tomatesColhidos = 0;
    this.elTextoTomates.innerText = 0;
    this.elTextoDinheiro.innerText = this.dinheiro;
  }

  atualizarAgua(nivel) {
    const porcentagem = Math.max(0, Math.min(100, Math.round(nivel)));
    this.elTextoAgua.innerText = porcentagem;
    this.elBarraAgua.style.width = `${porcentagem}%`;

    if (porcentagem < 25) {
      this.elBarraAgua.style.background = '#e63946';
    } else {
      this.elBarraAgua.style.background = 'linear-gradient(90deg, #3a86ff, #00b4d8)';
    }
  }

  atualizarSaude(nivel) {
    const porcentagem = Math.max(0, Math.min(100, Math.round(nivel)));
    this.elTextoSaude.innerText = porcentagem;
    this.elBarraSaude.style.width = `${porcentagem}%`;

    if (porcentagem <= 0) {
      this.elBarraSaude.style.background = '#555555';
    } else if (porcentagem < 30) {
      this.elBarraSaude.style.background = '#e63946';
    } else if (porcentagem < 60) {
      this.elBarraSaude.style.background = '#e9c46a';
    } else {
      this.elBarraSaude.style.background = 'linear-gradient(90deg, #2ec4b6, #2a9d8f)';
    }
  }

  atualizarPragas(qtd) {
    this.elTextoPragas.innerText = qtd;
  }

  adicionarTomate() {
    this.tomatesColhidos++;
    this.elTextoTomates.innerText = this.tomatesColhidos;
  }

  mostrarEfeito(texto, x, y, cor = '#ff4d4d') {
    const pop = document.createElement('div');
    pop.innerText = texto;
    pop.style.position = 'absolute';
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
    pop.style.fontFamily = 'Arial, sans-serif';
    pop.style.fontSize = '22px';
    pop.style.fontWeight = 'bold';
    pop.style.color = cor;
    pop.style.textShadow = '0 0 5px #000';
    pop.style.pointerEvents = 'none';
    pop.style.zIndex = '1000';
    pop.style.transition = 'all 0.8s ease-out';

    document.body.appendChild(pop);

    requestAnimationFrame(() => {
      pop.style.transform = 'translateY(-40px)';
      pop.style.opacity = '0';
    });

    setTimeout(() => pop.remove(), 800);
  }
}