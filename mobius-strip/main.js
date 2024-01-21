import * as THREE from 'three';
import {
    DirectionalLight,
    LineDashedMaterial,
    Mesh,
    MeshBasicMaterial, MeshLambertMaterial,
    MeshPhongMaterial,
    MeshPhysicalMaterial
} from "three";
import {OrbitControls, ParametricGeometries, ParametricGeometry} from "three/addons";
import WebGL from 'three/addons/capabilities/WebGL.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
//
const controls = new OrbitControls(camera, renderer.domElement);
//
{
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    camera.add(light);
}
scene.add(camera);

const geometry = new ParametricGeometry(ParametricGeometries.mobius, 25, 25);
const material = new MeshBasicMaterial({color: 0x44aa88, side: THREE.DoubleSide, wireframe: false });
const mesh = new THREE.Mesh(geometry, material);
mesh.receiveShadow = true;
mesh.castShadow = true;
scene.add(mesh);

const edgesGeometry = new THREE.EdgesGeometry( geometry );
const wireframe = new THREE.LineSegments( edgesGeometry, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
mesh.add( wireframe );

camera.position.z = 5;

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render(scene, camera);
}


if ( WebGL.isWebGLAvailable() ) {

    // Initiate function or other initializations here
    animate();

} else {

    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById( 'container' ).appendChild( warning );

}