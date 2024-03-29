attribute vec2 aVertexPosition; //specifies an attribute of a vertex
attribute vec2 aVertexTextureCoord;

varying vec2 vTextureCoord;

void main () {
    //called for each vertex
    gl_Position = vec4(aVertexPosition, 0, 1);
    vTextureCoord = aVertexTextureCoord;
}