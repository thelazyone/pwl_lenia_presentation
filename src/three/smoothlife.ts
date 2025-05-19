import * as THREE from 'three';
import {Scene, Camera, WebGLRenderer} from 'three';
import {useScene} from '@motion-canvas/core/lib/utils';
import {createComputed, createSignal} from '@motion-canvas/core/lib/signals';
import {createSmoothLife} from './createSmoothLife';

import smoothlifeFragment from '../shaders/smoothlife.fragment.glsl?raw';
import smoothlifeVertex from '../shaders/smoothlife.vertex.glsl?raw';

// Create the shader material
export const smoothLifeMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color('#ff0000') },
        intensity: { value: 1 }
    },
    vertexShader: smoothlifeVertex,
    fragmentShader: smoothlifeFragment,
    transparent: false,
    side: THREE.DoubleSide,
    glslVersion: THREE.GLSL3
});

// Create scene and camera
const threeScene = new THREE.Scene();
const camera = new THREE.OrthographicCamera();
const smoothLife = createSmoothLife();

// Add camera and mesh to scene
threeScene.add(camera);
threeScene.add(smoothLife.mesh);

// Create a group for positioning (like lightOrbit in the example)
const smoothLifeGroup = new THREE.Group();
smoothLifeGroup.add(smoothLife.mesh);
threeScene.add(smoothLifeGroup);

// Signal for animation
const time = createSignal(0);

// Update function for animation
const apply = createComputed(() => {
    time(time() + 1);
    smoothLifeMaterial.uniforms.time.value = time();
});

function setup() {
    useScene().lifecycleEvents.onBeginRender.subscribe(apply);
    time.reset();

    // Position and scale the mesh
    smoothLife.mesh.scale.setScalar(1920);
    smoothLife.mesh.position.set(0, 0, 0);

    // Setup the material
    smoothLife.setup();

    // Position camera
    camera.position.set(0, 0, 10);
}

function render(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
    renderer.render(scene, camera);
}

// Export signals for external control
export const color = smoothLife.color;
export const intensity = smoothLife.intensity;

export {threeScene, camera, setup, render, time}; 