import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gltfUrl from "./mobius-with-universal-covering-space.glb";

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 10, 10, 10);

const scene = new THREE.Scene();

const light= new THREE.AmbientLight(0xffffff);
const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(-10, 3, 3);
camera.add(directionalLight)
scene.add(camera);

const controls = new OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', () => renderer.render(scene, camera) ); // use if there is no animation loop
controls.minDistance = 2;
controls.maxDistance = 10;
controls.target.set( 0, 0, - 0.2 );
controls.update();

const loader = new GLTFLoader();
loader.load(gltfUrl, function ( gltf ) {

    const model = gltf.scene;
    model.translateY(-1.5);
    renderer.compile( model, camera, scene );
    scene.add( model );

    animate();
} );

window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

animate();

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}