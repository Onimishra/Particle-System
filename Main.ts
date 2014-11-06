/**
 * Created by mvie on 06/11/14.
 */
/// <reference path="Particle-System/Emitter.ts" />

(function() {
    var gl, canvas: HTMLCanvasElement, emitter: Emitter, lastFrameTime: number;
    var emitterVertexBuffer;

    function loop(timestamp: number) {
        if(lastFrameTime === undefined) lastFrameTime = timestamp;
        requestAnimationFrame(loop);
        render(timestamp - lastFrameTime);
        lastFrameTime = timestamp;
    }

    function render(deltaTime: number) {
        emitter.update(deltaTime);

        var vertices = emitter.collectDrawData(deltaTime);
        console.log(vertices);
        gl.bindBuffer(gl.ARRAY_BUFFER, emitterVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "aVertexPosition"), 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.POINTS, 0, vertices.length/3);
    }

    var shaderProgram;
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

    canvas = <HTMLCanvasElement> document.createElement("canvas");
    canvas.height = 300;
    canvas.width = 512;
    canvas.style.border = "1px solid black";
    document.body.appendChild(canvas);

    gl = canvas.getContext("webgl", {});
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var pMatrix = mat4.create(), mvMatrix = mat4.create();

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);

    initShaders();

    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    emitterVertexBuffer = gl.createBuffer();

    emitter = new Emitter(Vector.Zero, 1000, 2, 1);

    requestAnimationFrame(loop);
})();