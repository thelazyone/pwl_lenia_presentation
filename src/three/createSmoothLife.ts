import * as THREE from 'three';
import {createComputed, createSignal} from '@motion-canvas/core/lib/signals';
import {useScene} from '@motion-canvas/core/lib/utils';
import {Color as MCColor} from '@motion-canvas/core/lib/types';

import smoothlifeFragment from '../shaders/smoothlife.fragment.glsl?raw';
import smoothlifeVertex from '../shaders/smoothlife.vertex.glsl?raw';

const life_width = 1080;
const life_height = 1080;

export function createSmoothLifeMaterial() {
    const time = createSignal(0);
    const color = MCColor.createSignal('#ff0000');
    const intensity = createSignal(1);
    const resolution = createSignal(new THREE.Vector2(life_width, life_height));
    const shouldAdvance = createSignal(false);
    // To track if we need to update uniforms
    const needsUpdate = createSignal(false);

    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color('#ff0000') },
            intensity: { value: 1 },
            resolution: { value: new THREE.Vector2(life_width, life_height) },
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
        
        // Use fixed dimensions
        const width = life_width;
        const height = life_height;
        
        // Clean up existing resources before creating new ones
        if ((material as any).renderTargets?.current) {
            console.log("Cleaning up previous render targets");
            const oldTargets = (material as any).renderTargets;
            
            // Dispose textures and render targets
            oldTargets.current.dispose();
            oldTargets.previous.dispose();
            
            if (oldTargets.current.texture) oldTargets.current.texture.dispose();
            if (oldTargets.previous.texture) oldTargets.previous.texture.dispose();
            
            // Clear reference to previous texture
            material.uniforms.previousState.value = null;
        }
        
        // Skip re-initialization if already set up
        const currentResolutionValue = material.uniforms.resolution.value;
        if (currentResolutionValue && 
            currentResolutionValue.x === width && 
            currentResolutionValue.y === height &&
            (material as any).renderTargets?.current) {
            console.log("Skipping re-initialization - already at correct resolution");
            return;
        }
        
        // Update the resolution uniform
        resolution(new THREE.Vector2(width, height));
        material.uniforms.resolution.value.set(width, height);
        
        // Create initial data with consistent dimensions
        console.log(`Initializing data (${width}x${height})`);
        const initialData = new Float32Array(width * height * 4);
        
        // Fill with random state data (only in red channel)
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                initialData[index] = Math.random() > 0.7 ? 1.0 : 0.0; // Red channel = state
                initialData[index + 1] = 0.0; // Green unused
                initialData[index + 2] = 0.0; // Blue unused
                initialData[index + 3] = 1.0; // Alpha always 1
            }
        }

        // Fixed settings for all textures and render targets
        const textureSettings = {
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            generateMipmaps: false
        };
        
        // Create initial texture
        const initialTexture = new THREE.DataTexture(
            initialData, 
            width, 
            height,
            textureSettings.format,
            textureSettings.type
        );
        
        // Apply all settings to the texture
        initialTexture.minFilter = textureSettings.minFilter;
        initialTexture.magFilter = textureSettings.magFilter;
        initialTexture.wrapS = textureSettings.wrapS;
        initialTexture.wrapT = textureSettings.wrapT;
        initialTexture.generateMipmaps = textureSettings.generateMipmaps;
        initialTexture.needsUpdate = true;
        
        console.log(`Created initial texture`);
        
        // Create a clone of the initial texture for the second buffer
        // We do this by creating a new texture with the same data
        const initialTexture2 = new THREE.DataTexture(
            initialData.slice(), 
            width, 
            height,
            textureSettings.format,
            textureSettings.type
        );
        
        // Apply all settings to the second texture
        initialTexture2.minFilter = textureSettings.minFilter;
        initialTexture2.magFilter = textureSettings.magFilter;
        initialTexture2.wrapS = textureSettings.wrapS;
        initialTexture2.wrapT = textureSettings.wrapT;
        initialTexture2.generateMipmaps = textureSettings.generateMipmaps;
        initialTexture2.needsUpdate = true;
        
        // Settings for render targets
        const rtSettings = {
            format: textureSettings.format,
            type: textureSettings.type,
            minFilter: textureSettings.minFilter,
            magFilter: textureSettings.magFilter,
            wrapS: textureSettings.wrapS,
            wrapT: textureSettings.wrapT,
            generateMipmaps: textureSettings.generateMipmaps,
            depthBuffer: false,
            stencilBuffer: false
        };
        
        // Create render targets with these settings
        const renderTarget1 = new THREE.WebGLRenderTarget(width, height, rtSettings);
        const renderTarget2 = new THREE.WebGLRenderTarget(width, height, rtSettings);
        
        // Assign initial textures to render targets (IMPORTANT)
        renderTarget1.texture = initialTexture;
        renderTarget2.texture = initialTexture2;
        
        console.log(`Created render targets with textures`);
        
        // Set up the ping-pong targets in the material
        // Start with renderTarget2 as "previous" (source of truth)
        (material as any).renderTargets = {
            current: renderTarget1,  // We'll render INTO this one next
            previous: renderTarget2  // We'll read FROM this one next
        };
        
        // Set the initial uniform to point to renderTarget2's texture
        material.uniforms.previousState.value = renderTarget2.texture;
        
        console.log(`Set up render targets and uniforms`);
        
        // Reset other signals
        time(0);
        color.reset();
        intensity(1);
        shouldAdvance(false);
        needsUpdate(true);
        
        // Update all uniforms
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
    
    // Use a simple fullscreen quad with exact coordinates
    const geometry = new THREE.BufferGeometry();
    
    // Define vertices for a fullscreen quad
    const vertices = new Float32Array([
        -1.0, -1.0, 0.0,  // bottom-left
         1.0, -1.0, 0.0,  // bottom-right
        -1.0,  1.0, 0.0,  // top-left
         1.0,  1.0, 0.0   // top-right
    ]);
    
    // Define UV coordinates exactly matching vertices
    const uvs = new Float32Array([
        0.0, 0.0,  // bottom-left
        1.0, 0.0,  // bottom-right
        0.0, 1.0,  // top-left
        1.0, 1.0   // top-right
    ]);
    
    // Define indices for two triangles
    const indices = new Uint16Array([
        0, 1, 2,  // first triangle
        2, 1, 3   // second triangle
    ]);
    
    // Set the attributes
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    
    // Create the mesh with the custom geometry
    const mesh = new THREE.Mesh(geometry, material.material);
    
    // Ensure no transformations are applied
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();

    return {
        mesh,
        ...material
    };
} 