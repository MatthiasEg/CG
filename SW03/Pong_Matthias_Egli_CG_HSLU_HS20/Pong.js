//
// DI Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    uProjectionMatId: -1,
    uModelMatId: -1,
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);
    drawAnimated();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');

    setUpAttributesAndUniforms();
    setUpBuffers();
    setupWorld();

    gl.clearColor(0.1, 0.1, 0.1, 1);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms() {
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers() {
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    const vertices = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5];
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

//Setup world coordinates
function setupWorld() {
    const projectionMat = mat3.create();
    //Creates a matrix from a vector scaling
    mat3.fromScaling(projectionMat, [2.0 / gl.drawingBufferWidth, 2.0 / gl.drawingBufferWidth]);
    gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectionMat)
}

function drawShape(position, size) {
    // draw rectangle using model matrix
    const modelMat = mat3.create();
    mat3.fromTranslation(modelMat, position);
    mat3.scale(modelMat, modelMat, size);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);
}

let ball = {
    xPosition: 0,
    yPosition: 0,
    lastXPosition: 1,
    lastYPosition: 2,
    sizeX: 10,
    sizeY: 10,
    xDirection: 'right', //left or right
    yDirection: 'upside', //upside or downside
    xSpeed: 3,
    ySpeed: 3,
    changeXDirection: () => ball.xDirection === 'left' ? ball.xDirection = 'right' : ball.xDirection = 'left',
    changeYDirection: () => ball.yDirection === 'upside' ? ball.yDirection = 'downside' : ball.yDirection = 'upside',


};
let player = {
    xPosition: 350,
    yPosition: 0,
    sizeX: 10,
    sizeY: 100,
};
let bot = {
    xPosition: -350,
    yPosition: 0,
    sizeX: 10,
    sizeY: 100,
};

const adjustComputerPlayerPosition = () => {
    bot.yPosition = ball.yPosition
};


function moveBall() {
    if (ball.xDirection === 'left') {
        ball.yDirection === 'upside' ? ball.yPosition += ball.ySpeed : ball.yPosition -= ball.ySpeed;
        ball.xPosition -= ball.xSpeed;
    } else {
        ball.yDirection === 'upside' ? ball.yPosition += ball.ySpeed : ball.yPosition -= ball.ySpeed;
        ball.xPosition += ball.xSpeed;
    }
}

const isBallBetweenTopAndBottom = () => ball.yPosition <= 400 && ball.yPosition >= -400;


function ballTouchesPaddles() {
    if (ball.xPosition <= bot.xPosition + bot.sizeX / 2 && ball.xPosition >= bot.xPosition - bot.sizeX / 2) {
        if (ball.yPosition < bot.yPosition + bot.sizeY / 2 && ball.yPosition > bot.yPosition - bot.sizeY / 2) {
            ball.xSpeed += 1;
            ball.ySpeed += 1;
            return true
        }
    } else if (ball.xPosition >= player.xPosition - player.sizeX / 2 && ball.xPosition <= player.xPosition + player.sizeX / 2) {
        if (ball.yPosition < player.yPosition + player.sizeY / 2 && ball.yPosition > player.yPosition - player.sizeY / 2) {
            ball.xSpeed += 1;
            ball.ySpeed += 1;
            return true
        }
    }
    return false
}


function resetGame() {
    ball.xPosition = 0;
    ball.yPosition = 0;
    ball.xSpeed = 1;
    ball.ySpeed = 1;

}

function isBallOut() {
    return !(ball.xPosition < 400 && ball.xPosition > -400)
}

function drawAnimated(timestampInMillis) {
    if (timestampInMillis) {
        //calculate time since last call
        // move or change objects
        // const timeSinceLastCall = window.performance.now() - timestampInMillis;
        if (isBallBetweenTopAndBottom()) {
            console.log('between');
        } else {
            ball.changeYDirection()
        }
        if (ballTouchesPaddles()) {
            ball.changeXDirection();
        }
        if (isBallOut()) {
            resetGame();
        }

        moveBall();
        adjustComputerPlayerPosition();

        if (isDown(key.UP)) {
            player.yPosition += 15;
        } else if (isDown((key.DOWN))) {
            player.yPosition -= 15;
        }
    }

    draw();
    //request the next frame
    window.requestAnimationFrame(drawAnimated)
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    // color of shapes
    gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);

    //bot paddle
    drawShape([bot.xPosition, bot.yPosition], [bot.sizeX, bot.sizeY]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    // middle line
    drawShape([0, 0], [3, 1000]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    // ball
    drawShape([ball.xPosition, ball.yPosition], [ball.sizeX, ball.sizeY]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    // right player paddle

    drawShape([player.xPosition, player.yPosition], [player.sizeX, player.sizeY]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

// Key Handling
var key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

function isDown(keyCode) {
    return key._pressed[keyCode];
}

function onKeydown(event) {
    key._pressed[event.keyCode] = true;
}

function onKeyup(event) {
    delete key._pressed[event.keyCode];
}
