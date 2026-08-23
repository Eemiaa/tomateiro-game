import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Planta } from './components/Planta.js';
import { Sol } from './components/Sol.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2.5, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const planta = new Planta();
scene.add(planta);

const sol = new Sol(2.5);
scene.add(sol);

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Repasse a 'scene' aqui para atualizar a cor do background
  sol.atualizar(
    0.1, //velocidade do tempo
    planta, 
    scene)
    ;

  renderer.render(scene, camera);
}

animate();

//ok, acho que agora da pra gente ir para funcionalidades do jogo, vamos começar com ok, acho que agora da pra gente ir para funcionalidades do jogo, vamos começar com 