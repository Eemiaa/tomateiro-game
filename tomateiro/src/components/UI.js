export class UI {
  constructor() {
    this.tomatesColhidos = 0;
    this._criarUI();
  }

  _criarUI() {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '20px';
    container.style.left = '20px';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.color = '#ffffff';
    container.style.userSelect = 'none';
    container.style.zIndex = '100';

    container.innerHTML = `
      <!-- Medidor de Água -->
      <div style="font-weight: bold; margin-bottom: 4px; text-shadow: 1px 1px 2px #000; font-size: 14px;">
        💧 Água: <span id="texto-agua">100</span>%
      </div>
      <div style="width: 160px; height: 14px; background: rgba(0,0,0,0.5); border: 2px solid #fff; border-radius: 8px; overflow: hidden; margin-bottom: 12px;">
        <div id="barra-agua-preenchimento" style="width: 100%; height: 100%; background: linear-gradient(90deg, #3a86ff, #00b4d8); transition: width 0.1s linear;"></div>
      </div>

      <!-- Contador de Tomates -->
      <div style="font-weight: bold; font-size: 20px; text-shadow: 1px 1px 3px #000; display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.3); padding: 6px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.3); width: fit-content;">
        <span>🍅</span>
        <span id="texto-tomates">0</span>
      </div>
    `;

    document.body.appendChild(container);

    this.elTextoAgua = document.getElementById('texto-agua');
    this.elBarraAgua = document.getElementById('barra-agua-preenchimento');
    this.elTextoTomates = document.getElementById('texto-tomates');
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

  adicionarTomate() {
    this.tomatesColhidos++;
    this.elTextoTomates.innerText = this.tomatesColhidos;
  }
}