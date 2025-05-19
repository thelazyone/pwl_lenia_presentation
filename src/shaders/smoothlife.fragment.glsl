uniform float time;
uniform vec2 resolution;
uniform sampler2D previousState;

in vec2 vUv;
out vec4 fragColor;

// Debug uniform to help diagnose problems
//uniform bool debugMode;

// Get cell state using direct texture coordinate sampling to ensure proper alignment
float getCell(ivec2 pixelCoord) {
    // Wrap coordinates to handle edge cases
    ivec2 localPixelCoord = pixelCoord / 2;
    localPixelCoord.x = (pixelCoord.x + int(resolution.x) / 2) % int(resolution.x);
    localPixelCoord.y = (pixelCoord.y + int(resolution.y) / 2) % int(resolution.y);
    
    // Convert to normalized UV coordinates - note we're correcting for WebGL texture coordinates
    // WebGL textures are indexed (0,0) at bottom-left, but we want (0,0) at top-left for consistency
    // We also add 0.5 to each coordinate to sample the center of the pixel
    vec2 uv = vec2(
        (float(localPixelCoord.x) + 0.5) / resolution.x,
        (float(localPixelCoord.y) + 0.5) / resolution.y
    );
    
    // Sample the texture at the calculated position
    return texture(previousState, uv).r;
}

void main() {
    // Calculate pixel coordinates directly from UV
    ivec2 pixelCoord = ivec2(vUv * resolution * 2.0);
    
    // Get current cell state using direct sampling
    float currentState = texture(previousState, vUv).r;
    
    // Count live neighbors using pixel coordinates
    float neighbors = 0.0;
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            // Skip the center cell
            if (x == 0 && y == 0) continue;
            
            // Check if the neighbor is alive (>0.5)
            if (getCell(pixelCoord + ivec2(x, y)) > 0.5) {
                neighbors += 1.0;
            }
        }
    }
    
    // Apply Game of Life rules
    float nextState = 0.0;
    if (currentState > 0.5) {
        // If cell is alive, survives if it has 2-3 neighbors
        if (neighbors > 1.5 && neighbors < 3.5) {
            nextState = 1.0; // Survives
        }
    } else { 
        // Cell is dead, becomes alive if it has 3 neighbors
        if (neighbors > 2.5 && neighbors < 3.5) {
            nextState = 1.0; // Becomes alive
        }
    }
    
    // Testing getCell
    // nextState = getCell(pixelCoord);
    // float nextState = texture(previousState, vUv).r;

    // Output the next state
    fragColor = vec4(vec3(nextState), 1.0);
} 