import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Planta } from './components/Planta.js';
import { Sol } from './components/Sol.js';
import { Regador } from './components/Regador.js';
import { UI } from './components/UI.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2.5, 3);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ui = new UI();
const planta = new Planta();
scene.add(planta);

const sol = new Sol(2.5);
scene.add(sol);

const regador = new Regador();
camera.add(regador);

// --- Controles de Interação ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const planoArrasto = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.2);
const planoPontoIntersect = new THREE.Vector3();

window.addEventListener('pointerdown', (e) => {
  if (planta.estaMorta) return; // Desativa interações se estiver em Game Over

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  if (raycaster.intersectObject(regador, true).length > 0) {
    regador.estaSendoArrastado = true;
    controls.enabled = false;
    return;
  }

  const interseccoes = raycaster.intersectObjects(scene.children, true);
  for (const hit of interseccoes) {
    let curr = hit.object;
    while (curr) {
      if (curr.userData && curr.userData.praga) {
        planta.removerPraga(curr.userData.praga);
        ui.mostrarEfeito('💥 LIMPO!', e.clientX, e.clientY, '#9b5de5');
        return;
      }
      if (curr.userData && curr.userData.tomate) {
        const tomate = curr.userData.tomate;
        if (tomate.podeSerColhido()) {
          tomate.colher();
          ui.adicionarTomate();
          ui.mostrarEfeito('+1 🍅', e.clientX, e.clientY, '#ff4d4d');
          return;
        }
      }
      curr = curr.parent;
    }
  }
});

window.addEventListener('pointermove', (e) => {
  if (!regador.estaSendoArrastado) return;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  if (raycaster.ray.intersectPlane(planoArrasto, planoPontoIntersect)) {
    const pontoLocal = camera.worldToLocal(planoPontoIntersect.clone());
    regador.position.copy(pontoLocal);
  }
});

window.addEventListener('pointerup', () => {
  if (regador.estaSendoArrastado) {
    regador.estaSendoArrastado = false;
    controls.enabled = true;
  }
});

// --- Lógica de Recomeçar (Restart) ---
ui.btnRecomecar.addEventListener('click', () => {
  planta.resetar();
  ui.resetarStats();
  ui.ocultarGameOver();
});

let ultimoTempo = performance.now();
let gameOverExibido = false;

function animate(tempoAtual) {
  requestAnimationFrame(animate);
  controls.update();

  const deltaBase = Math.min((tempoAtual - ultimoTempo) / 1000, 0.1) || 0;
  ultimoTempo = tempoAtual;

  const deltaJogo = deltaBase * ui.multiplicadorVelocidade;

  if (!planta.estaMorta) {
    gameOverExibido = false;

    // 1. Atualiza habilidades automáticas
    ui.atualizarTimers(deltaJogo);

    if (ui.tempoRegaAuto > 0) {
      planta.regar(1.5);
    }

    if (ui.tempoPragasAuto > 0 && planta.pragas.length > 0) {
      planta.removerPraga(planta.pragas[0]);
    }

    if (ui.tempoColheitaAuto > 0) {
      planta.galhos.forEach(galho => {
        galho.tomates.forEach(tomate => {
          if (tomate.podeSerColhido()) {
            tomate.colher();
            ui.adicionarTomate();
          }
        });
      });
    }

    sol.atualizar(0.005 * ui.multiplicadorVelocidade, planta, scene);
  } else {
    // Se a planta acabou de morrer
    if (!gameOverExibido) {
      gameOverExibido = true;
      ui.exibirGameOver();
    }
  }

  regador.atualizar(planta, camera, scene);

  ui.atualizarAgua(planta.nivelAgua);
  ui.atualizarSaude(planta.nivelSaude);
  ui.atualizarPragas(planta.pragas.length);

  renderer.render(scene, camera);
}

animate(performance.now());