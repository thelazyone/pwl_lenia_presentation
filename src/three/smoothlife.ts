import * as THREE from 'three';
import {Scene, Camera, WebGLRenderer} from 'three';
import {createSmoothLife} from './createSmoothLife';

// Create scene and camera
const threeScene = new THREE.Scene();
const camera = new THREE.OrthographicCamera();
const smoothLife = createSmoothLife();

// Temporary render target
let tempTarget: THREE.WebGLRenderTarget;

// Add camera and mesh to scene
threeScene.add(camera);
threeScene.add(smoothLife.mesh);

// Create a group for positioning
const smoothLifeGroup = new THREE.Group();
smoothLifeGroup.add(smoothLife.mesh);
threeScene.add(smoothLifeGroup);

function setup() {
    smoothLife.setup();

    // Position and scale the mesh to fill the viewport
    smoothLife.mesh.scale.setScalar(1);
    smoothLife.mesh.position.set(0, 0, 0);

    // Position camera
    camera.position.set(0, 0, 10);

    // Temporary render target
    console.log(`setting up temp target`);
    tempTarget = new THREE.WebGLRenderTarget(1920, 1080, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType
    });
}

function render(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
    // Update time before rendering
    smoothLife.time(smoothLife.time() + 1);
    smoothLife.material.uniforms.time.value = smoothLife.time();

    const renderTargets = (smoothLife.material as any).renderTargets;
    if (!renderTargets.current || !renderTargets.previous) {
        console.error('Render targets not initialized');
        return;
    }

    // First render to screen using previous state
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    // Then render to current target for next frame
    renderer.setRenderTarget(renderTargets.current);
    renderer.render(scene, camera);

    // Update previous state uniform to use the target we just rendered to
    smoothLife.material.uniforms.previousState.value = renderTargets.current.texture;

    // Swap targets for next frame
    [renderTargets.current, renderTargets.previous] = [renderTargets.previous, renderTargets.current];
}

export {threeScene, camera, setup, render}; 