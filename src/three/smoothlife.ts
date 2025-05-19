import * as THREE from 'three';
import {Scene, Camera, WebGLRenderer} from 'three';
import {createSmoothLife} from './createSmoothLife';

// Create scene and camera
const threeScene = new THREE.Scene();
const camera = new THREE.OrthographicCamera();
const smoothLife = createSmoothLife();

// Add camera and mesh to scene
threeScene.add(camera);
threeScene.add(smoothLife.mesh);

// Create a group for positioning
const smoothLifeGroup = new THREE.Group();
smoothLifeGroup.add(smoothLife.mesh);
threeScene.add(smoothLifeGroup);

function setup() {
    smoothLife.setup();

    // Position and scale the mesh
    smoothLife.mesh.scale.setScalar(1920);
    smoothLife.mesh.position.set(0, 0, 0);

    // Position camera
    camera.position.set(0, 0, 10);
}

function render(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
    // Update time before rendering
    smoothLife.time(smoothLife.time() + 1);
    smoothLife.material.uniforms.time.value = smoothLife.time();

    // Only use render targets if they're initialized
    if (smoothLife.currentTarget && smoothLife.previousTarget) {
        // Render to the current target
        renderer.setRenderTarget(smoothLife.currentTarget);
        renderer.render(scene, camera);
        
        // Reset render target and render to screen
        renderer.setRenderTarget(null);
    }
    renderer.render(scene, camera);
}

export {threeScene, camera, setup, render}; 