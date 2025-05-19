import * as THREE from 'three';
import { createComputed, createSignal } from '@motion-canvas/core/lib/signals';
import { useScene } from '@motion-canvas/core/lib/utils';

import smoothlifeFragment from '../shaders/smoothlife.fragment.glsl?raw';
import smoothlifeVertex from '../shaders/smoothlife.vertex.glsl?raw';

const life_width = 1920;
const life_height = 1080;

export function createSmoothLifeMaterial() {
    const time = createSignal(0);
    const resolution = createSignal(new THREE.Vector2(life_width, life_height));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            resolution: { value: new THREE.Vector2(life_width, life_height) },
            previousState: { value: null }
        },
        vertexShader: smoothlifeVertex,
        fragmentShader: smoothlifeFragment,
        transparent: true
    });

    // Create render targets for ping-pong rendering
    const renderTarget1 = new THREE.WebGLRenderTarget(life_width, life_height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType
    });
    const renderTarget2 = new THREE.WebGLRenderTarget(life_width, life_height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType
    });

    // Initialize with random state
    const initialTexture = new THREE.DataTexture(
        new Float32Array(life_width * life_height * 4).map(() => Math.random()),
        life_width,
        life_height,
        THREE.RGBAFormat,
        THREE.FloatType
    );
    initialTexture.needsUpdate = true;
    renderTarget1.texture = initialTexture;

    let currentTarget = renderTarget1;
    let previousTarget = renderTarget2;

    const update = createComputed(() => {
        material.uniforms.time.value = time();
        material.uniforms.resolution.value = resolution();      
        
        // Swap render targets
        [currentTarget, previousTarget] = [previousTarget, currentTarget];
        material.uniforms.previousState.value = previousTarget.texture;
    });

    function setup() {
        time.reset();
        resolution.reset();
        useScene().lifecycleEvents.onBeginRender.subscribe(update);
    }

    return {
        material,
        setup,
        time,
        resolution,
        renderTarget1,
        renderTarget2,
        get currentTarget() { return currentTarget; }
    };
}

export function createSmoothLife() {
    const material = createSmoothLifeMaterial();
    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(),
        material.material
    );

    return {
        mesh,
        ...material
    };
} 