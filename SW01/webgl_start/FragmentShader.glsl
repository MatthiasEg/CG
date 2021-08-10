precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {
    //called for each pixel
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}
