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

let audioPlaying = false
const audioLoader = new THREE.AudioLoader();
const initAudio = () => {
  if (!audioPlaying) {
  audioLoader.load('sounds/Savior.mp3' , function(buffer) {
  positionalSound.setBuffer(buffer);
  positionalSound.setLoop(true);
  positionalSound.setVolume(0.4);
  positionalSound.play();
  audioPlaying = true;
}); 
} else {
  positionalSound.pause();
  audioPlaying = false;
}
  };

    
  




// audioLoader.load('./sounds/Story.mp3' , function(buffer) {
//   positionalSound.setBuffer(buffer);
//   positionalSound.setLoop(true);
//   positionalSound.setVolume(0.4);
//   positionalSound.play();
// })

// const backgroundSound = new THREE.Audio(listener);
const positionalSound = new THREE.PositionalAudio(listener);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


// Torus mesh //
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
  const texture = new THREE.TextureLoader().load('images/yeast.png');
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
const spaceTexture = new THREE.TextureLoader().load('images/space.jpg');
scene.background= spaceTexture;

// box in middle //
const testTexture = new THREE.TextureLoader().load('images/testTexture.jpg');

const test = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({ map: testTexture})
)

scene.add(test);
// Adds the moon //
const moonTexture = new THREE.TextureLoader().load('images/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('images/normal.jpg');

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
const dogTexture = new THREE.TextureLoader().load('images/yeast.png');
const shibaTexture = new THREE.TextureLoader().load('images/shibaInu.png');

const dogMaterial = new THREE.MeshStandardMaterial({ map: dogTexture });
const shibaMaterial = new THREE.MeshStandardMaterial({ map: shibaTexture });

const hugeDog = new THREE.Mesh(
  new THREE.BoxGeometry(5,5,1),
  new THREE.MeshStandardMaterial({ map:shibaTexture,})
);

scene.add(hugeDog)
 // test
hugeDog.position.z = 10;
hugeDog.position.setX(+20);

// adds JingLiu //
let girl;
const glftloader = new GLTFLoader();
glftloader.load('./assets/Jingliu/scene.gltf', (gltfScene) => {
 girl = gltfScene;
scene.add(gltfScene.scene);
gltfScene.scene.position.setZ(+21);
gltfScene.scene.position.setX(+1);
gltfScene.scene.position.setY(-0.8);

});

// Astronaut man
let astronaut;
glftloader.load('./assets/astronaut/scene.gltf', (gltfScene) => {
 astronaut = gltfScene;
scene.add(gltfScene.scene);
gltfScene.scene.position.setZ(+37.5);
gltfScene.scene.position.setX(-1);
gltfScene.scene.position.setY(-0.5);

});

// moves the camera 
function moveCamera() {
   const t = document.body.getBoundingClientRect().top;

   // Rotates the moon when mouse moves
   moon.rotation.x += 0.05;
   moon.rotation.y += 0.075;
   moon.rotation.z += 0.05;

    // Loop through all dog instances and rotate them
    dogs.forEach(dog => {
      dog.rotation.x += 0.01;
      dog.rotation.y += 0.0075;
      dog.rotation.z += 0.005;
    });
   // Rotates the huge dog cube when mouse moves
   hugeDog.rotation.x += 0.05;
   hugeDog.rotation.y += 0.075;
   hugeDog.rotation.z += 0.05;
   
   // Rotates cube in middle of Torus when mouse moves
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
  // Torus rotates all the time
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  
  // Astronaut moves all the time 
  if (astronaut) {
    astronaut.scene.rotation.x += 0.001;
    astronaut.scene.rotation.z += 0.001;
  }

  renderer.render( scene, camera );

  controls.update();

}
// overlay JingLiu
const overlayGeometry = new THREE.BoxGeometry(1, 1.8, 1); // Adjust size as needed
const overlayMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
const overlayMesh = new THREE.Mesh(overlayGeometry, overlayMaterial);
overlayMesh.position.set(1,-0.1, 21); // Adjust position relative to your GLTF model
scene.add(overlayMesh);
overlayMesh.add(positionalSound)

// overlay Astronaut
// const overlayGeometry2 = new THREE.BoxGeometry(1, 1.8, 1); // Adjust size as needed
// const overlayMaterial2 = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
// const overlayMesh2 = new THREE.Mesh(overlayGeometry2, overlayMaterial2);
// overlayMesh2.position.set(-1,-0.5, 37.5); // Adjust position relative to your GLTF model
// scene.add(overlayMesh2);
// overlayMesh2.add(positionalSound)



function onMouseMove(event) {
  // Update the mouse coordinates when the mouse moves
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function onClick() {
  // Check for intersections with the overlay mesh
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(overlayMesh);
 
  if (intersects.length > 0) {
  
    
    }
  }


// Function to switch to another song
function switchSong() {
  if (isAudioPlaying) {
      // Pause the current audio
      audioLoader.audio.pause();

      // Load and play the new audio file
      audioLoader.load('./sounds/Story.mp3', (buffer) => {
          audio.setBuffer(buffer);
          audio.play();
          isAudioPlaying = true;
      });

      console.log('Switched to the new song');
  } else {
      console.log('No audio playing to switch');
  }
}



// Add event listeners
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', initAudio, false);

window.addEventListener('mousemove', (event) => {
  girl.scene.rotation.y = (event.clientX / window.innerWidth) - 0.7;
  girl.scene.rotation.x = (event.clientY / window.innerHeight) - 0.7;

});

animate();
