import * as THREE from 'three';
import {createComputed, createSignal} from '@motion-canvas/core/lib/signals';
import {useScene} from '@motion-canvas/core/lib/utils';
import {Color as MCColor} from '@motion-canvas/core/lib/types';

import smoothlifeFragment from '../shaders/smoothlife.fragment.glsl?raw';
import smoothlifeVertex from '../shaders/smoothlife.vertex.glsl?raw';

export function createSmoothLifeMaterial() {
    const time = createSignal(0);
    const color = MCColor.createSignal('#ff0000');
    const intensity = createSignal(1);
    const resolution = createSignal(new THREE.Vector2(1920, 1080));
    const shouldAdvance = createSignal(false);
    // To track if we need to update uniforms
    const needsUpdate = createSignal(false);

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
        glslVersion: THREE.GLSL3,
        depthTest: false,
        depthWrite: false
    });

    // Store render targets directly in the material
    (material as any).renderTargets = {
        current: null as THREE.WebGLRenderTarget | null,
        previous: null as THREE.WebGLRenderTarget | null
    };

    // Update the material uniforms - but only call this explicitly when needed
    function updateUniforms() {
        material.uniforms.time.value = time();
        material.uniforms.color.value.set(color().toString());
        material.uniforms.intensity.value = intensity();
        material.uniforms.resolution.value = resolution();
        needsUpdate(false);
    }

    // Function to advance the simulation by one frame
    function advanceFrame() {
        time(time() + 1);
        shouldAdvance(true);
        needsUpdate(true);
    }

    function setup() {
        console.log(`DEBUG: Starting setup`);
        
        // Create initial texture
        console.log(`initializing map pixels`);
        const initialData = new Float32Array(1920 * 1080 * 4).map((_, i) => {
            const pixelIndex = Math.floor(i / 4);
            const channel = i % 4;
            
            if (channel === 0) {
                const x = pixelIndex % 1920;
                const y = Math.floor(pixelIndex / 1920);
                
                const distance = Math.sqrt(
                    Math.pow((x - 960) / 960, 2) + 
                    Math.pow((y - 540) / 540, 2)
                );
                
                return Math.random() > 0.5 ? 1.0 : 0.0;
            }
            return 0.0;
        });

        // Create render targets with their own textures
        const renderTarget1 = new THREE.WebGLRenderTarget(1920, 1080, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            type: THREE.FloatType
        });
        console.log(`DEBUG: renderTarget1 created:`, renderTarget1);

        const renderTarget2 = new THREE.WebGLRenderTarget(1920, 1080, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            type: THREE.FloatType
        });
        console.log(`DEBUG: renderTarget2 created:`, renderTarget2);

        const initialTexture = new THREE.DataTexture(
            initialData,
            1920,
            1080,
            THREE.RGBAFormat,
            THREE.FloatType
        );
        initialTexture.needsUpdate = true;
        renderTarget2.texture = initialTexture;

        console.log(`DEBUG: Initial data written to render targets`);
        
        // Set up the ping-pong targets in the material
        (material as any).renderTargets.current = renderTarget1;
        (material as any).renderTargets.previous = renderTarget2;
        material.uniforms.previousState.value = renderTarget2.texture;
        console.log(`Render targets set up in material:`, (material as any).renderTargets);

        // Reset all signals
        time.reset();
        color.reset();
        intensity.reset();
        resolution.reset();
        shouldAdvance.reset();
        needsUpdate.reset();

        // Initial update
        updateUniforms();
    }

    return {
        material,
        setup,
        time,
        color,
        intensity,
        resolution,
        shouldAdvance,
        advanceFrame,
        updateUniforms,
        needsUpdate
    };
}

export function createSmoothLife() {
    const material = createSmoothLifeMaterial();
    
    // Create a plane that fills the screen with proper UV coordinates
    const geometry = new THREE.PlaneGeometry(2, 2);
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