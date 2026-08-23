import * as THREE from 'three';

export class Sol extends THREE.Group {
  constructor(raioOrbita = 3) {
    super();

    this.raioOrbita = raioOrbita;
    this.anguloAtual = -Math.PI / 2; // Inicia na meia-noite

    this.corDia = new THREE.Color('#87ceeb');   // Azul clarinho
    this.corNoite = new THREE.Color('#030712'); // Azul noite profundo

    // 1. Luz direcional (Sol)
    this.luz = new THREE.DirectionalLight(0xfff5ea, 1.5);
    this.luz.castShadow = true;
    this.add(this.luz);

    // 2. Esfera do Sol
    const geo = new THREE.SphereGeometry(0.12, 16, 16);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffcc33 });
    this.meshSol = new THREE.Mesh(geo, mat);
    this.add(this.meshSol);

    // 3. Luz ambiente
    this.luzAmbiente = new THREE.AmbientLight(0xffffff, 0.4);
    this.add(this.luzAmbiente);

    // 4. Campo de Estrelas no fundo
    this._criarEstrelas();

    this._atualizarPosicao();
  }

  _criarEstrelas() {
    const totalEstrelas = 400;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(totalEstrelas * 3);

    // Distribui os pontinhos brancos em uma esfera distante ao redor do cenário
    for (let i = 0; i < totalEstrelas * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const raio = 7 + Math.random() * 3;

      pos[i] = raio * Math.sin(phi) * Math.cos(theta);
      pos[i + 1] = raio * Math.sin(phi) * Math.sin(theta);
      pos[i + 2] = raio * Math.cos(phi);
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    this.matEstrelas = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.03,
      transparent: true,
      opacity: 0 // Começam invisíveis de dia
    });

    this.estrelas = new THREE.Points(geo, this.matEstrelas);
    this.add(this.estrelas);
  }

  _atualizarPosicao() {
    const x = Math.cos(this.anguloAtual) * this.raioOrbita;
    const y = Math.sin(this.anguloAtual) * this.raioOrbita;
    const z = Math.cos(this.anguloAtual) * 1.2;

    this.luz.position.set(x, y, z);
    this.meshSol.position.set(x, y, z);
  }

  atualizar(velocidadeRotacao, planta, scene) {
    // Avança o ângulo do ciclo de forma constante (50% dia na parte superior, 50% noite na inferior)
    const deltaAngulo = velocidadeRotacao;
    this.anguloAtual += deltaAngulo;
    this._atualizarPosicao();

    // Mapeia a altura do sol: 1 no meio-dia, 0 na meia-noite
    const fatorDia = THREE.MathUtils.clamp((Math.sin(this.anguloAtual) + 1) / 2, 0, 1);
    const fatorNoite = 1 - fatorDia;

    // Transição de cor do fundo
    if (scene) {
      if (!scene.background) scene.background = new THREE.Color();
      scene.background.lerpColors(this.corNoite, this.corDia, fatorDia);
    }

    // Controle de opacidade das estrelas (surgem suavemente à noite)
    this.matEstrelas.opacity = THREE.MathUtils.clamp((fatorNoite - 0.3) * 1.8, 0, 1);

    // Ajuste proporcional da intensidade de luz
    this.luz.intensity = THREE.MathUtils.lerp(0.05, 1.5, fatorDia);

    // Crescimento da planta (20% a cada volta completa do Sol)
    // O Sol continua contando ciclos para permitir o envelhecimento das folhas
    const incrementoProgresso = (deltaAngulo / (Math.PI * 2)) * 0.20;
    planta.crescer(incrementoProgresso);
  }
}