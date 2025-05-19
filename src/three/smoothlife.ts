import * as THREE from 'three';
import {Scene, Camera, WebGLRenderer} from 'three';
import {createSmoothLife} from './createSmoothLife';

// Create scene and camera
const threeScene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
camera.position.z = 10;
const smoothLife = createSmoothLife();

// Flag to track if first render has happened
let hasInitialRender = false;

// Add camera and mesh to scene
threeScene.add(camera);
threeScene.add(smoothLife.mesh);

// Create a group for positioning
const smoothLifeGroup = new THREE.Group();
smoothLifeGroup.add(smoothLife.mesh);
threeScene.add(smoothLifeGroup);

// Function to clean up ALL resources (call when leaving slide)
function cleanup() {
    console.log("CLEANUP: Disposing all SmoothLife resources");
    
    // Mark context as invalid to prevent using stale textures
    smoothLife.invalidateContext();
    
    // Return true to indicate cleanup completed
    return true;
}

function setup() {
    console.log('SmoothLife setup starting');
    
    // Reset initial render flag
    hasInitialRender = false;
    
    // Setup smooth life (completely recreates all textures)
    smoothLife.setup();

    // Position and scale the mesh to fill the viewport
    smoothLife.mesh.scale.setScalar(1);
    smoothLife.mesh.position.set(0, 0, 0);
    
    // Force an initial advance to get things started
    smoothLife.shouldAdvance(true);
    
    console.log('SmoothLife setup complete');
}

// Public reset function that can be called when returning to a slide
function reset() {
    console.log('Resetting SmoothLife');
    
    // Run setup directly - no need for setTimeout
    setup();
}

function render(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
    // Skip if context is invalidated
    if (!smoothLife.isContextValid) {
        return;
    }

    try {
        // Get render targets
        const renderTargets = (smoothLife.material as any).renderTargets;
        if (!renderTargets?.current || !renderTargets?.previous) {
            console.log('No render targets, resetting');
            setTimeout(reset, 50);
            return;
        }

        // Get initial textures for first render
        const initialTextures = (smoothLife.material as any).initialTextures;
        
        // Special case for very first render - we need to set up the initial state
        if (!hasInitialRender) {
            if (!initialTextures?.texture1) {
                console.log('No initial textures, skipping initial render');
                return;
            }
            
            console.log('First render - initializing with data textures');
            
            // Use the data texture as source
            smoothLife.material.uniforms.previousState.value = initialTextures.texture1;
            
            // Render to screen
            renderer.setRenderTarget(null);
            renderer.render(scene, camera);
            
            // Render to both targets to ensure they're initialized
            renderer.setRenderTarget(renderTargets.current);
            renderer.render(scene, camera);
            
            renderer.setRenderTarget(renderTargets.previous);
            renderer.render(scene, camera);
            
            hasInitialRender = true;
            return;
        }
        
        // Always update material uniforms
        smoothLife.updateUniforms();
        
        // Step 1: Render to screen
        renderer.setRenderTarget(null);
        smoothLife.material.uniforms.previousState.value = renderTargets.previous.texture;
        renderer.render(scene, camera);
        
        // Step 2: Only render next state if advance flag is set
        if (smoothLife.shouldAdvance()) {
            smoothLife.shouldAdvance(false);
            
            // Render to current target using previous as input
            renderer.setRenderTarget(renderTargets.current);
            smoothLife.material.uniforms.previousState.value = renderTargets.previous.texture;
            renderer.render(scene, camera);
            
            // Swap buffers for next frame
            const temp = renderTargets.current;
            renderTargets.current = renderTargets.previous;
            renderTargets.previous = temp;
        }
    } catch (error) {
        console.error('Error in SmoothLife render:', error);
        hasInitialRender = false;
        smoothLife.invalidateContext();
    }
}

export {threeScene, camera, setup, render, reset, cleanup, smoothLife}; 