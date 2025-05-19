import * as THREE from 'three';
import {Scene, Camera, WebGLRenderer} from 'three';
import {createSmoothLife} from './createSmoothLife';

// Create scene and camera
const threeScene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
camera.position.z = 10;
const smoothLife = createSmoothLife();

// Temporary render target
let tempTarget: THREE.WebGLRenderTarget;

// Frame counter for controlling simulation speed
let frameCounter = 0;

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

    // Get current resolution
    const currentResolution = smoothLife.resolution();
    const width = currentResolution.x;
    const height = currentResolution.y;

    // Temporary render target
    console.log(`setting up temp target`);
    tempTarget = new THREE.WebGLRenderTarget(width, height, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType
    });
}

function render(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
    const renderTargets = (smoothLife.material as any).renderTargets;
    if (!renderTargets.current || !renderTargets.previous) {
        console.error('Render targets not initialized');
        return;
    }

    // Only update if needed
    if (smoothLife.needsUpdate()) {
        smoothLife.updateUniforms();
    }

    // STEP 1: Always render to screen first using the previous state
    // This ensures we see the current state before processing the next one
    renderer.setRenderTarget(null);
    smoothLife.material.uniforms.previousState.value = renderTargets.previous.texture;
    renderer.render(scene, camera);

    // STEP 2: Only compute next state if we should advance
    if (!smoothLife.shouldAdvance()) {
        return; // Exit early if we're not advancing
    }

    // We're computing a new frame - reset flag
    smoothLife.shouldAdvance(false);
    
    // CRITICAL: Make sure input texture is locked before rendering
    const previousTexture = renderTargets.previous.texture;
    
    // STEP 3: Compute the next state by rendering to the current target
    renderer.setRenderTarget(renderTargets.current);
    smoothLife.material.uniforms.previousState.value = previousTexture;
    renderer.render(scene, camera);
    
    // STEP 4: Ensure rendering is complete before proceeding
    renderer.setRenderTarget(null);
    
    // STEP 5: Swap the buffers
    // Use a clean approach that prevents reference issues
    const temp = renderTargets.current;
    renderTargets.current = renderTargets.previous;
    renderTargets.previous = temp;
}

export {threeScene, camera, setup, render, smoothLife}; 