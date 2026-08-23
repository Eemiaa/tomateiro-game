import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//1. Scene — o "mundo" onde tudo existe
const scene = new THREE.Scene();

//2. Camera — o "olho" que olha pra essa cena
const camera = new THREE.PerspectiveCamera(
  60,                                    // campo de visão (graus) — tipo o "zoom" da lente
  window.innerWidth / window.innerHeight, // proporção da tela (largura/altura)
  0.1,                                   // distância mínima que a câmera enxerga
  1000                                   // distância máxima que a câmera enxerga
);
camera.position.set(3, 3, 3); // se não afastar a câmera, ela nasce em (0,0,0) — dentro de tudo, vendo nada

//3. Renderer — quem de fato "desenha" a cena, através da câmera, num <canvas>
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // cria o <canvas> e coloca na página

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // dá uma "inércia" suave ao soltar o mouse, opcional mas fica bem melhor

// SEM LUZ, os materiais do seu modelo (PBR, do Blender) aparecem PRETOS.
// Uma luz simples já resolve pra essa etapa de teste:
scene.add(new THREE.AmbientLight('#9ce8ff', 1));
scene.add(new THREE.DirectionalLight('#ffffff', 1));

let mixer = null;
let clipDuration = 0;
let testProgress = 0; // 0 a 1 — vamos fazer isso subir sozinho só pra testar


const loader = new GLTFLoader();

async function loadModel() {
    const gltf = await loader.loadAsync('/src/assets/planta10.glb');
    scene.add(gltf.scene);

    const clip = gltf.animations[0];
    clipDuration = clip.duration;
    console.log('Clipe encontrado:', clip.name, '— duração:', clipDuration, 's —', clip.tracks.length, 'tracks');

    mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(clip);
    action.play();


    // DIAGNÓSTICO — vamos ver se as folhas/tomates existem e o que acontece com a escala delas
    const leafOrFruitMeshes = [];
    gltf.scene.traverse(obj => {
      if (obj.isMesh && (obj.name.toLowerCase().includes('folha') || obj.name.toLowerCase().includes('tomate'))) {
        leafOrFruitMeshes.push(obj);
      }
    });
    console.log('Folhas/tomates encontrados:', leafOrFruitMeshes.length);

    mixer.setTime(clipDuration);
    const gruposComProblema = new Set();
    leafOrFruitMeshes.forEach(m => {
      if (m.scale.x < 0.01) gruposComProblema.add(m.parent.name);
    });
    console.log('Grupos com escala 0 na fase madura:', [...gruposComProblema]);
    console.log('Total de grupos afetados:', gruposComProblema.size);
    mixer.setTime(0);
}
loadModel();

/*4. O loop de renderização
Uma imagem só (um "frame") não é um jogo. Precisamos desenhar de novo, repetidamente,
pra sempre — isso é o que requestAnimationFrame faz: pede pro navegador "me chama de
novo assim que puder desenhar o próximo frame" (geralmente 60 vezes por segundo).
*/
function animate() {
  requestAnimationFrame(animate); // agenda a PRÓXIMA chamada antes de desenhar essa
  controls.update(); // necessário por causa do enableDamping
  // TESTE: sobe o progresso bem devagar, só pra ver a planta crescer sozinha
  if (mixer) {
    testProgress = Math.min(1, testProgress + 0.001);
    mixer.setTime(testProgress * clipDuration);
  }

  renderer.render(scene, camera);
}
animate();

