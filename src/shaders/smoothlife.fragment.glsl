uniform float time;
uniform vec2 resolution;
uniform sampler2D previousState;

in vec2 vUv;
out vec4 fragColor;

// Function to get the state of a neighboring pixel
float getNeighbor(vec2 offset) {
    // Calculate pixel size in UV space
    vec2 pixelSize = 1.0 / resolution;
    
    // Calculate neighbor position in UV space
    vec2 neighborUv = vUv + offset * pixelSize;
    
    // Wrap around edges
    neighborUv = fract(neighborUv);
    
    return texture(previousState, neighborUv).r;
}

void main() {

    // Sample the current pixel
    float currentState = texture(previousState, vUv).r;
    
    
    // Count live neighbors (using a threshold of 0.5 to determine if a cell is alive)
    float neighbors = 0.0;
    neighbors += getNeighbor(vec2(-1.0, -1.0)) > 0.5 ? 1.0 : 0.0; // top-left
    neighbors += getNeighbor(vec2( 0.0, -1.0)) > 0.5 ? 1.0 : 0.0; // top
    neighbors += getNeighbor(vec2( 1.0, -1.0)) > 0.5 ? 1.0 : 0.0; // top-right
    neighbors += getNeighbor(vec2(-1.0,  0.0)) > 0.5 ? 1.0 : 0.0; // left
    neighbors += getNeighbor(vec2( 1.0,  0.0)) > 0.5 ? 1.0 : 0.0; // right
    neighbors += getNeighbor(vec2(-1.0,  1.0)) > 0.5 ? 1.0 : 0.0; // bottom-left
    neighbors += getNeighbor(vec2( 0.0,  1.0)) > 0.5 ? 1.0 : 0.0; // bottom
    neighbors += getNeighbor(vec2( 1.0,  1.0)) > 0.5 ? 1.0 : 0.0; // bottom-right

    // Apply Game of Life rules
    float nextState = 0.0;
    if (currentState > 0.5) { // Cell is alive
        if (neighbors > 1.5 && neighbors < 3.5) {
            nextState = 1.0; // Survives
        }
    } else { // Cell is dead
        if (neighbors > 2.5 && neighbors < 3.5) {
            nextState = 1.0; // Becomes alive
        }
    }
    
    // Output the next state
    fragColor = vec4(vec3(nextState) , 1.0);
} 