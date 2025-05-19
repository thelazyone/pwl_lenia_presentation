import * as THREE from 'three';
import {createComputed, createSignal} from '@motion-canvas/core/lib/signals';
import {useScene} from '@motion-canvas/core/lib/utils';
import {Color as MCColor} from '@motion-canvas/core/lib/types';

import smoothlifeFragment from '../shaders/smoothlife.fragment.glsl?raw';
import smoothlifeVertex from '../shaders/smoothlife.vertex.glsl?raw';

// Create render targets for ping-pong rendering
let renderTarget1: THREE.WebGLRenderTarget;
let renderTarget2: THREE.WebGLRenderTarget;
let currentTarget: THREE.WebGLRenderTarget;
let previousTarget: THREE.WebGLRenderTarget;

export function createSmoothLifeMaterial() {
    const time = createSignal(0);
    const color = MCColor.createSignal('#ff0000');
    const intensity = createSignal(1);
    const resolution = createSignal(new THREE.Vector2(1920, 1080));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color('#ff0000') },
            intensity: { value: 1 },
            resolution: { value: new THREE.Vector2(1920, 1080) },
            previousState: { value: null }
        },
        vertexShader: smoothlifeVertex,
        fragmentShader: smoothlifeFragment,
        transparent: false,
        side: THREE.DoubleSide,
        glslVersion: THREE.GLSL3
    });

    const update = createComputed(() => {
        time(time() + 1);
        material.uniforms.time.value = time();
        material.uniforms.color.value.set(color().toString());
        material.uniforms.intensity.value = intensity();
        material.uniforms.resolution.value = resolution();
        
        if (currentTarget && previousTarget) {
            
            // Swap render targets
            [currentTarget, previousTarget] = [previousTarget, currentTarget];
            material.uniforms.previousState.value = previousTarget.texture;
        }
    });

    function setup() {
        // Initialize render targets
        renderTarget1 = new THREE.WebGLRenderTarget(1920, 1080, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            type: THREE.FloatType
        });

        renderTarget2 = new THREE.WebGLRenderTarget(1920, 1080, {
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

        // Set up the ping-pong targets
        currentTarget = renderTarget1;
        previousTarget = renderTarget2;
        material.uniforms.previousState.value = previousTarget.texture;

        // Reset all signals
        time.reset();
        color.reset();
        intensity.reset();
        resolution.reset();

        // Subscribe to render events
        useScene().lifecycleEvents.onBeginRender.subscribe(update);
    }

    return {
        material,
        setup,
        time,
        color,
        intensity,
        resolution,
        currentTarget,
        previousTarget
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