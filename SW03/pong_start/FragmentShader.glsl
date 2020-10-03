precision mediump float;
uniform vec4 uColor;

//A Fragment Shader's job is to provide a color for the current pixel being rasterized.
void main() {
    gl_FragColor = uColor;
}
