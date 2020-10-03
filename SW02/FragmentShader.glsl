precision mediump float;

varying vec4 vColor;
varying vec2 vTextureCoord;

uniform sampler2D uSampler; //gibt an welche Texture verwendet werden soll

//eigentliches Texture Mapping wird im Fragment Shader ausgeführt

void main( void ) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}
