import './style.css';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Create the scene //
const scene = new THREE.Scene();
// Adds the camera perspective //
const camera = new THREE.PerspectiveCamera (75 , window.innerWidth / window.innerHeight, 0.1, 1000);
// Renders the canvas //
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio (window.devicePixelRatio);
renderer.setSize (window.innerWidth, window.innerHeight)
camera.position.setZ(30);

renderer.render( scene, camera) ;

const geometry = new THREE.TorusGeometry(10 , 3 , 16 ,100)
const material = new THREE.MeshStandardMaterial({color: 0xFF6347}) ;
const torus = new THREE.Mesh( geometry, material);

scene.add(torus)
// Lights up specific parts of the object //
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)

// Lights the whole object up //
const ambientLight = new THREE.AmbientLight(0xffffff);
// adds the lighting to the scene //
scene.add(pointLight, ambientLight)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200 , 50)
scene.add(lightHelper, gridHelper)

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh (geometry , material) ;

  const [x, y , z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100) );

  star.position.set(x, y ,z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background= spaceTexture;

const controls = new OrbitControls(camera, renderer.domElement);
// animates the object rotating.
function animate() {
  requestAnimationFrame( animate );
  renderer.render (scene, camera);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

}

animate();
