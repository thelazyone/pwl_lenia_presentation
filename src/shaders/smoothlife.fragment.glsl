uniform float time;
uniform vec2 resolution;
uniform sampler2D previousState;

in vec2 vUv;
out vec4 fragColor;

// SmoothLife parameters
const float PI = 3.14159265;
const float dt = 0.30; 
const vec2 r = vec2(12.0, 4.0);  // x = outer radius, y = inner radius

// SmoothLifeL rules
// const float b1 = 0.257;
const float b1 = 0.257;
// const float b2 = 0.336;
const float b2 = 0.338;
// const float d1 = 0.365;
const float d1 = 0.365;
// const float d2 = 0.549;
const float d2 = 0.549;

// const float alpha_n = 0.028;
const float alpha_n = 0.028;
// const float alpha_m = 0.147;
const float alpha_m = 0.147;

// Sigmoid functions for SmoothLife
float sigmoid_a(float x, float a, float b) {
    return 1.0 / (1.0 + exp(-(x - a) * 4.0 / b));
}

float sigmoid_b(float x, float b, float eb) {
    return 1.0 - sigmoid_a(x, b, eb);
}

float sigmoid_ab(float x, float a, float b, float ea, float eb) {
    return sigmoid_a(x, a, ea) * sigmoid_b(x, b, eb);
}

float sigmoid_mix(float x, float y, float m, float em) {
    return x * (1.0 - sigmoid_a(m, 0.5, em)) + y * sigmoid_a(m, 0.5, em);
}

// SmoothLife transition function
float transition_function(vec2 disk_ring) {
    return sigmoid_mix(
        sigmoid_ab(disk_ring.x, b1, b2, alpha_n, alpha_n),
        sigmoid_ab(disk_ring.x, d1, d2, alpha_n, alpha_n), 
        disk_ring.y, alpha_m
    );
}

// Get cell state using direct texture coordinate sampling
float getCell(vec2 pixelCoord) {
    // Wrap coordinates to handle edge cases
    vec2 localPixelCoord = pixelCoord;
    localPixelCoord.x = mod(localPixelCoord.x + (resolution.x / 2.0), resolution.x);
    localPixelCoord.y = mod(localPixelCoord.y + (resolution.y / 2.0), resolution.y);
    
    // Convert to normalized UV coordinates
    float pixelShift = 0.5;
    vec2 uv = vec2(
        (localPixelCoord.x + pixelShift) / resolution.x,
        (localPixelCoord.y + pixelShift) / resolution.y
    );
    
    // Sample the texture at the calculated position
    return texture(previousState, uv).r;
}

// Compute the inner disk and outer ring integrals
vec2 convolve(vec2 pixelCoord) {
    vec2 result = vec2(0.0);
    float areaInner = 0.0;
    float areaOuter = 0.0;
    
    for (float dx = -r.x; dx <= r.x; dx++) {
        for (float dy = -r.x; dy <= r.x; dy++) {
            vec2 offset = vec2(dx, dy);
            float dist = length(offset);
            
            // Skip if outside outer radius
            if (dist > r.x) continue;
            
            // Get cell value at this position
            float cellValue = getCell(pixelCoord + offset);
            
            // Add to inner disk and outer ring with smooth boundary
            if (dist < r.y - 0.5) {
                // Fully in inner disk
                result.y += cellValue;
                areaInner += 1.0;
            } 
            else if (dist > r.y + 0.5) {
                // Fully in outer ring
                result.x += cellValue;
                areaOuter += 1.0;
            }
            else {
                // Smooth transition at the boundary
                float t = (dist - (r.y - 0.5)) / 1.0; // t goes from 0 to 1 in the transition region
                float innerWeight = 1.0 - t;
                float outerWeight = t;
                
                result.y += cellValue * innerWeight;
                areaInner += innerWeight;
                
                result.x += cellValue * outerWeight;
                areaOuter += outerWeight;
            }
        }
    }
    
    // Normalize by area
    if (areaInner > 0.0) result.y /= areaInner;
    if (areaOuter > 0.0) result.x /= areaOuter;
    
    return result;
}

void main() {
    // Calculate pixel coordinates directly from UV
    vec2 pixelCoord = vec2(vUv * resolution * 2.0);
    
    // Get current cell state
    float currentState = getCell(pixelCoord);
    
    // Calculate normalized convolution
    vec2 normalized_convolution = convolve(pixelCoord);
    
    // Apply SmoothLife transition function
    float nextState = currentState + dt * (2.0 * transition_function(normalized_convolution) - 1.0);
    nextState = clamp(nextState, 0.0, 1.0);
    
    // Output the next state
    fragColor = vec4(vec4(nextState));
} 