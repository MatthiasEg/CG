//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1, //wird unten wieder überschrieben
    aVertexPositionId: -1,
    uColorId: -1,
    vColorId: -1,
    colorId: -1,
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1,
    colorBuffer: -1,
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(
        gl,
        "VertexShader.glsl",
        "FragmentShader.glsl"
    );
    setUpAttributesAndUniforms();
    setUpBuffers();

    // set the clear color here - Hintergrundfarbe des Canvas
    gl.clearColor(0.5, 0.5, 0.5, 1);

    // add more necessary commands here
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms() {
    "use strict";
    // finds the index of the variable in the program || überschreibt ctx.aVertexPositionId
    ctx.aVertexPositionId = gl.getAttribLocation(
        ctx.shaderProgram,
        "aVertexPosition"
    );
    ctx.colorId = gl.getAttribLocation(
        ctx.shaderProgram,
        "color"
    );
    // ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor")
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers() {
    "use strict";

    rectangleObject.buffer = gl.createBuffer();
    rectangleObject.colorBuffer = gl.createBuffer();

    // const vertices = [0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5];
    const vertices = [
        0.5, 0.5,
        0.5, -0.5,
        -0.5, 0.5,
        -0.5, -0.5,
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const color = [
        1, 0, 0, 0.5,
        1, 0, 0, 0.5,
        1, 0, 0, 0.5,
        1, 1, 1, 0.5,
    ]

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT); // Zeichnet die Farbe

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.colorBuffer);
    // gl.vertexAttribPointer(ctx.vColor, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(ctx.colorId, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(ctx.colorId);

    // gl.uniform4f(ctx.uColorId, 1.0, 0.0, 0.5, 1.0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    console.log("done");
}
