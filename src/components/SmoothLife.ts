import * as THREE from 'three';
import { createComputed, createSignal } from '@motion-canvas/core/lib/signals';
import { useScene } from '@motion-canvas/core/lib/utils';

import smoothlifeFragment from '../shaders/smoothlife.fragment.glsl?raw';
import smoothlifeVertex from '../shaders/smoothlife.vertex.glsl?raw';

export function createSmoothLifeMaterial() {
    const time = createSignal(0);
    const resolution = createSignal(new THREE.Vector2(1920, 1080));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            resolution: { value: new THREE.Vector2(1920, 1080) },
            previousState: { value: null }
        },
        vertexShader: smoothlifeVertex,
        fragmentShader: smoothlifeFragment,
        transparent: true
    });

    // Create render targets for ping-pong rendering
    const renderTarget1 = new THREE.WebGLRenderTarget(1920, 1080, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType
    });
    const renderTarget2 = new THREE.WebGLRenderTarget(1920, 1080, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType
    });

    // Initialize with random state
    const initialTexture = new THREE.DataTexture(
        new Float32Array(1920 * 1080 * 4).map(() => Math.random()),
        1920,
        1080,
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
        new THREE.PlaneGeometry(2, 2),
        material.material
    );

    return {
        mesh,
        ...material
    };
} 