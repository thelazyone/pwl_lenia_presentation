uniform float time;
uniform vec2 resolution;
uniform sampler2D previousState;

in vec2 vUv;
out vec4 fragColor;

// Debug uniform to help diagnose problems
//uniform bool debugMode;

// Get cell state using direct texture coordinate sampling to ensure proper alignment
float getCellWithShift(vec2 pixelCoord, vec2 shift) {
    // Wrap coordinates to handle edge cases
    vec2 localPixelCoord = pixelCoord + shift;
    localPixelCoord.x = mod(localPixelCoord.x + (resolution.x / 2.0), resolution.x);
    localPixelCoord.y = mod(localPixelCoord.y + (resolution.y / 2.0), resolution.y);
    
    // Convert to normalized UV coordinates - note we're correcting for WebGL texture coordinates
    // WebGL textures are indexed (0,0) at bottom-left, but we want (0,0) at top-left for consistency
    // We also add 0.5 to each coordinate to sample the center of the pixel
    float pixelShift = 0.5;
    vec2 uv = vec2(
        (localPixelCoord.x + pixelShift) / resolution.x,
        (localPixelCoord.y + pixelShift) / resolution.y
    );
    
    // Sample the texture at the calculated position
    float out_value = texture(previousState, uv).r;
    if (out_value > 0.5) {
        return 1.0;
    } else {
        return 0.0;
    }
}

void main() {
    // Calculate pixel coordinates directly from UV
    vec2 pixelCoord = vec2(vUv * float(resolution) * 2.0);
    
    // // Get current cell state using direct sampling
    // float currentState = texture(previousState, vUv).r;

    // Get current cell state - also use the getCellWithShift function for consistency
    float currentState = getCellWithShift(pixelCoord, vec2(0.0, 0.0));
    
    // Count live neighbors using pixel coordinates
    float neighbors = 0.0;
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            // Skip the center cell
            if (x == 0 && y == 0) continue;
            
            // Check if the neighbor is alive
            if (getCellWithShift(pixelCoord, vec2(x, y)) > 0.9) {
                neighbors += 1.0;
            }
        }
    }
    
    // Apply Game of Life rules
    float nextState = 0.0;
    if (currentState > 0.9) {
        // If cell is alive, survives if it has 2-3 neighbors
        if (neighbors > 1.9 && neighbors < 3.1) {
            nextState = 1.0; // Survives
        }
    } else { 
        // Cell is dead, becomes alive if it has 3 neighbors
        if (neighbors > 2.9 && neighbors < 3.1) {
            nextState = 1.0; // Becomes alive
        }
    }
    
    // Testing getCell
    // nextState = getCell(pixelCoord);
    // float nextState = texture(previousState, vUv).r;

    // Output the next state
    fragColor = vec4(vec3(nextState), 1.0);
} 