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

        console.log(`initializing map pixels`);
        // Initialize with random state
        const initialTexture = new THREE.DataTexture(
            new Float32Array(1920 * 1080 * 4).map((_, i) => {
                // For RGBA format, each pixel takes 4 values
                const pixelIndex = Math.floor(i / 4);
                const channel = i % 4;
                
                // Only set the red channel (r) for our binary state
                if (channel === 0) {
                    const x = pixelIndex % 1920;
                    const y = Math.floor(pixelIndex / 1920);
                    
                    // Create some random "blobs" of life
                    // Use x,y to create more interesting patterns
                    const distance = Math.sqrt(
                        Math.pow((x - 960) / 960, 2) + 
                        Math.pow((y - 540) / 540, 2)
                    );
                    
                    // Create a more interesting pattern with some randomness
                    return 1.0; // Set all pixels to white for testing
                }
                // Set other channels to 0
                return 0.0;
            }),
            1920,
            1080,
            THREE.RGBAFormat,
            THREE.FloatType
        );
        initialTexture.needsUpdate = true;
        console.log(`Initial texture created with size:`, initialTexture.image.width, initialTexture.image.height);
        
        // Set the initial texture to renderTarget1
        renderTarget1.texture = initialTexture;
        
        // Set up the ping-pong targets
        currentTarget = renderTarget1;
        previousTarget = renderTarget2;
        material.uniforms.previousState.value = previousTarget.texture;
        console.log(`Render targets set up, current target:`, currentTarget, `previous target:`, previousTarget);

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
    
    // Create a plane that fills the screen with proper UV coordinates
    const geometry = new THREE.PlaneGeometry(1./1920, 1./1080);
    // Ensure UVs are properly set
    const uvs = geometry.attributes.uv as THREE.BufferAttribute;
    // Set UVs to cover the full texture
    const uvArray = new Float32Array([
        0, 0,  // bottom-left
        1, 0,  // bottom-right
        0, 1,  // top-left
        1, 1   // top-right
    ]);
    uvs.array = uvArray;
    uvs.needsUpdate = true;
    
    const mesh = new THREE.Mesh(geometry, material.material);

    return {
        mesh,
        ...material
    };
} 