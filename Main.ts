/**
 * Created by mvie on 06/11/14.
 */
/// <reference path="Particle-System/Emitter.ts" />

(function() {
    var gl, canvas: HTMLCanvasElement, emitter: Emitter, lastFrameTime: number;
    var emitterVertexBuffer;
    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    var shaderProgram;

    var fpsCounter = document.getElementById("fps-counter");
    var pCounter = document.getElementById("particle-counter");

    function loop(timestamp: number) {
        if(lastFrameTime === undefined) lastFrameTime = timestamp;
        requestAnimationFrame(loop);
        update(timestamp - lastFrameTime);
        render(timestamp - lastFrameTime);
        lastFrameTime = timestamp;
    }
    var deltas = [];
    var deltaI = 0;
    var deltaSampleLimit = 10;
    function update(deltaTime: number) {
        emitter.update(deltaTime);

        deltas[deltaI++] = deltaTime;
        if(deltaI > deltaSampleLimit) deltaI = 0;
        var sum = deltas.reduce(function(a, b) { return a + b });
        var avg = sum / deltas.length;
        fpsCounter.innerText = (1000/avg).toFixed(2);

        pCounter.innerText = emitter.particleCount().toString();
    }

    function render(deltaTime: number) {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(pMatrix, 45* (Math.PI/180), gl.viewportWidth/gl.viewportHeight, 0.1, 100);
        mat4.identity(mvMatrix);

        mat4.translate(mvMatrix, mvMatrix, [0.0, -1.0, -4.0]);

        var rO = emitter.collectDrawData(deltaTime);
        gl.bindBuffer(gl.ARRAY_BUFFER, emitterVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rO.vertices), gl.STATIC_DRAW);

        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        setMatrixUniforms();

        gl.drawArrays(gl.LINES, 0, rO.count/3);
    }

    function initShaders() {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    }

    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3)
                str += k.textContent;
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    }

    function initBuffers() {
        emitterVertexBuffer = gl.createBuffer();
    }

    canvas = <HTMLCanvasElement> document.createElement("canvas");
    canvas.height = 300;
    canvas.width = 512;
    canvas.style.border = "1px solid black";
    document.body.appendChild(canvas);

    initGL(canvas);
    initShaders();
    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    emitter = new Emitter(Vector.Zero(), 60000, 300000, 0);

    requestAnimationFrame(loop);
})();