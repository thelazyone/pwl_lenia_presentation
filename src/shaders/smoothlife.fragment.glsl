uniform float time;
uniform vec3 color;
uniform float intensity;

in vec2 vUv;
out vec4 fragColor;

void main() {
    fragColor = vec4(color * intensity, 1.0);
} 