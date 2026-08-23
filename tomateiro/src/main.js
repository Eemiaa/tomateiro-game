import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Planta } from './components/Planta.js';
import { Sol } from './components/Sol.js';
import { Regador } from './components/Regador.js';
import { UI } from './components/UI.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2.5, 3);
scene.add(camera); // Adiciona a câmera na cena para suportar filhos 3D

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

// O regador agora é filho da câmera para acompanhar a tela como inventário
const regador = new Regador();
camera.add(regador);

// --- Lógica de Arrasto do Inventário ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const planoArrasto = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.2); // Plano virtual na altura do topo da planta
const planoPontoIntersect = new THREE.Vector3();

window.addEventListener('pointerdown', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(regador, true);

  if (intersects.length > 0) {
    regador.estaSendoArrastado = true;
    controls.enabled = false; // Desativa órbita da câmera enquanto segura o item
  }
});

window.addEventListener('pointermove', (e) => {
  if (!regador.estaSendoArrastado) return;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  
  // Projeta o arrasto no espaço local da câmera
  if (raycaster.ray.intersectPlane(planoArrasto, planoPontoIntersect)) {
    const pontoLocal = camera.worldToLocal(planoPontoIntersect.clone());
    regador.position.copy(pontoLocal);
  }
});

window.addEventListener('pointerup', () => {
  if (regador.estaSendoArrastado) {
    regador.estaSendoArrastado = false;
    controls.enabled = true; // Libera o controle de câmera
  }
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  sol.atualizar(0.015, planta, scene);
  regador.atualizar(planta, camera, scene);
  ui.atualizarAgua(planta.nivelAgua);

  renderer.render(scene, camera);
}

animate();