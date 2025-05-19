import * as THREE from 'three';
import {createComputed, createSignal} from '@motion-canvas/core/lib/signals';
import {useScene} from '@motion-canvas/core/lib/utils';
import {Color as MCColor} from '@motion-canvas/core/lib/types';

import smoothlifeFragment from '../shaders/smoothlife.fragment.glsl?raw';
import smoothlifeVertex from '../shaders/smoothlife.vertex.glsl?raw';

const life_width = 1920;
const life_height = life_width;

// Track if we're using a stale context
let isContextValid = true;

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
        
        // Keep context valid when actively rendering
        isContextValid = true;
    }

    function setup() {
        console.log(`DEBUG: Starting setup`);
        
        // Mark the context as valid
        isContextValid = true;
        
        // Use fixed dimensions
        const width = life_width;
        const height = life_height;

        // CLEAN APPROACH: Fully remove old targets first
        if ((material as any).renderTargets?.current) {
            // First, clear any references to the texture in the shader
            material.uniforms.previousState.value = null;
            
            // Get old targets
            const oldTargets = (material as any).renderTargets;
            
            // Clear references in the material
            (material as any).renderTargets = {
                current: null,
                previous: null
            };
            
            // Now dispose the old targets
            try {
                if (oldTargets.current) oldTargets.current.dispose();
                if (oldTargets.previous) oldTargets.previous.dispose();
            } catch (e) {
                console.warn("Error disposing old targets:", e);
            }
        }
        
        // Update the resolution uniform
        resolution(new THREE.Vector2(width, height));
        material.uniforms.resolution.value.set(width, height);
        
        // Create initial data
        console.log(`Initializing data (${width}x${height})`);
        const initialData = new Float32Array(width * height * 4);
        
        // Fill with random pattern
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                initialData[index] = Math.random() > 0.5 ? 1.0 : 0.0; // Red channel = state
                initialData[index + 1] = 0.0; // Green unused
                initialData[index + 2] = 0.0; // Blue unused
                initialData[index + 3] = 1.0; // Alpha always 1
            }
        }

        // Settings for render targets - create fresh each time
        const rtSettings = {
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
            minFilter: THREE.NearestFilter, 
            magFilter: THREE.NearestFilter,
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            generateMipmaps: false,
            depthBuffer: false,
            stencilBuffer: false
        };
        
        // Create new render targets - don't reuse old ones
        const renderTarget1 = new THREE.WebGLRenderTarget(width, height, rtSettings);
        const renderTarget2 = new THREE.WebGLRenderTarget(width, height, rtSettings);
        
        console.log(`Created render targets`);
        
        // Create the DataTextures
        const texture1 = new THREE.DataTexture(
            initialData.slice(), 
            width, 
            height, 
            THREE.RGBAFormat,
            THREE.FloatType
        );
        
        const texture2 = new THREE.DataTexture(
            initialData.slice(), 
            width, 
            height, 
            THREE.RGBAFormat,
            THREE.FloatType
        );
        
        // Apply settings to textures
        texture1.minFilter = texture2.minFilter = rtSettings.minFilter;
        texture1.magFilter = texture2.magFilter = rtSettings.magFilter;
        texture1.wrapS = texture2.wrapS = rtSettings.wrapS;
        texture1.wrapT = texture2.wrapT = rtSettings.wrapT;
        texture1.generateMipmaps = texture2.generateMipmaps = rtSettings.generateMipmaps;
        
        // Force textures to upload to GPU immediately
        texture1.needsUpdate = texture2.needsUpdate = true;
        
        // Key difference: store the DataTextures separately and don't directly assign
        // to render targets to avoid immutability issues
        (material as any).initialTextures = {
            texture1: texture1,
            texture2: texture2
        };
        
        // Store the render targets
        (material as any).renderTargets = {
            current: renderTarget1,
            previous: renderTarget2
        };
        
        // Start with the initial texture as our previous state
        material.uniforms.previousState.value = texture1;
        
        console.log(`Set up render targets and uniforms`);
        
        // Reset other signals
        time(0);
        color.reset();
        intensity(1);
        shouldAdvance(true); // Start with an advance
        needsUpdate(true);
        
        // Update all uniforms
        updateUniforms();
    }

    // Function to mark context as invalid (called on slide transitions)
    function invalidateContext() {
        console.log("Marking SmoothLife context as invalid");
        isContextValid = false;
        
        // Clear references to avoid texture errors
        material.uniforms.previousState.value = null;
        
        // Also clear renderTargets if they exist
        if ((material as any).renderTargets) {
            (material as any).renderTargets.current = null;
            (material as any).renderTargets.previous = null;
        }
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
        needsUpdate,
        invalidateContext,
        get isContextValid() { return isContextValid; }
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