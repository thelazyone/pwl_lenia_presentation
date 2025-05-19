uniform float time;
uniform vec2 resolution;
uniform sampler2D previousState;

in vec2 vUv;
out vec4 fragColor;

// 1 out, 3 in... <https://www.shadertoy.com/view/4djSRW>
#define MOD3 vec3(.1031,.11369,.13787)
float hash13(vec3 p3) {
	p3 = fract(p3 * MOD3);
    p3 += dot(p3, p3.yzx+19.19);
    return fract((p3.x + p3.y)*p3.z);
}

void main() {
    // Sample the previous state
    vec4 prevState = texture(previousState, vUv);
    
    // Get the current state
    vec3 currentState = prevState.rgb;
    
    // Add some variation based on time and position
    currentState = mix(currentState, vec3(hash13(vec3(vUv * 255.0, time * 0.1))), 0.5);
    
    // Output the color with full opacity
    fragColor = vec4(currentState, 1.0);
} 