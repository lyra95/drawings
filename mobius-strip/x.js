import * as THREE from 'three';
import {DirectionalLight, Mesh, MeshBasicMaterial, MeshPhongMaterial, MeshPhysicalMaterial} from "three";
import {OrbitControls, ParametricGeometries, ParametricGeometry} from "three/addons";
import WebGL from 'three/addons/capabilities/WebGL.js';

// Create a scene
const scene = new THREE.Scene();

// Create a Möbius strip geometry
const mobiusGeometry = new ParametricGeometry(
    function (u, v, target) {
        const phi = 2 * u * Math.PI;
        const v2 = 2 * v - 1;
        target.set(
            Math.cos(phi) * (1 + 0.5 * v2 * Math.cos(phi / 2)),
            Math.sin(phi) * (1 + 0.5 * v2 * Math.cos(phi / 2)),
            0.5 * v2 * Math.sin(phi / 2)
        );
    }, 25, 25);

// Create a material
const mobiusMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, wireframe: true });

// Create a Möbius strip mesh
const mobiusMesh = new THREE.Mesh(mobiusGeometry, mobiusMaterial);

// Add the Möbius strip to the scene
scene.add(mobiusMesh);

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add mouse controls
const controls = new OrbitControls(camera, renderer.domElement);


// Add lights
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
camera.add(light);
scene.add(camera);

// Render loop
const animate = function () {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
};

// Start the animation loop
animate();
