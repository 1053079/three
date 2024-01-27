import './style.css';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

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

const listener = new THREE.AudioListener();
camera.add(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load('./sounds/Savior.mp3' , function(buffer) {
  backgroundSound.setBuffer(buffer);
  backgroundSound.setLoop(true);
  backgroundSound.setVolume(0.4);
  backgroundSound.play();
})

const backgroundSound = new THREE.Audio(listener);


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
// make an array of dogs and then we can push the dogs in addYeastKen function to it//
const dogs = [];

function addYeastKen () {
  const texture = new THREE.TextureLoader().load('yeast.png');
  const material = new THREE.MeshBasicMaterial({ map:texture, transparent: true})

  const geometry = new THREE.PlaneGeometry(1,1);

  const dog = new THREE.Mesh(geometry , material) ;

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  dog.position.set (x, y , z)
  scene.add(dog);

  // pushes the dogs to global scope //
  dogs.push(dog);
}


// Adds dogs //
Array(200).fill().forEach(addYeastKen);

// Background //
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background= spaceTexture;

// box in middle //
const testTexture = new THREE.TextureLoader().load('testTexture.jpg');

const test = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({ map: testTexture})
)

scene.add(test);

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32 , 32),
  new THREE.MeshStandardMaterial({ map:moonTexture,
    normalMap: normalTexture
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

// add huge dog
const dogTexture = new THREE.TextureLoader().load('yeast.png');
const grassTexture = new THREE.TextureLoader().load('grass.jpg');
const hugeDog = new THREE.Mesh(
  new THREE.BoxGeometry(5,5,5),
  new THREE.MeshStandardMaterial({ map:dogTexture})
);

scene.add(hugeDog)

hugeDog.position.z = 10;
hugeDog.position.setX(+20);

let girl;
const glftloader = new GLTFLoader();
glftloader.load('./assets/Jingliu/scene.gltf', (gltfScene) => {
 girl = gltfScene;
scene.add(gltfScene.scene);
gltfScene.scene.position.setZ(+21);
gltfScene.scene.position.setX(+1);
gltfScene.scene.position.setY(-0.8);


});



// moves the camera 
function moveCamera() {
   const t = document.body.getBoundingClientRect().top;
   moon.rotation.x += 0.05;
   moon.rotation.y += 0.075;
   moon.rotation.z += 0.05;

    // Loop through all dog instances and rotate them
    dogs.forEach(dog => {
      dog.rotation.x += 0.01;
      dog.rotation.y += 0.0075;
      dog.rotation.z += 0.005;
    });

   hugeDog.rotation.x += 0.05;
   hugeDog.rotation.y += 0.075;
   hugeDog.rotation.z += 0.05;

   test.rotation.x += 0.01;
   test.rotation.y += 0.01;

   camera.position.x = t * -0.0002;
   camera.position.y = t * -0.0002;
   camera.position.z = t * -0.01;
}
document.body.onscroll = moveCamera

const controls = new OrbitControls(camera, renderer.domElement);
// animates the object rotating.
function animate() {
  requestAnimationFrame( animate );
  renderer.render (scene, camera);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  

  renderer.render( scene, camera );

 


  controls.update();

}



window.addEventListener('mousemove', (event) => {
  girl.scene.rotation.y = (event.clientX / window.innerWidth) - 0.7;
  girl.scene.rotation.x = (event.clientY / window.innerHeight) - 0.7;


  // girl.scene.position.x = ((event.clientX / window.innerWidth) - 0.5) * 15;
  // girl.scene.position.y = ((event.clientY / window.innerHeight) - 0.5) * -15;
});



animate();
