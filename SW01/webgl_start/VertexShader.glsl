attribute vec2 aVertexPosition; //specifies an attribute of a vertex

void main () {
    //called for each vertex
    gl_Position = vec4(aVertexPosition, 0, 1);
}