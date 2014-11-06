/**
 * Created by mvie on 06/11/14.
 */
/// <reference path="Emitter.ts" />

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
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }

    canvas = <HTMLCanvasElement> document.createElement("canvas");
    canvas.height = 300;
    canvas.width = 512;
    canvas.style.border = "1px solid black";
    document.body.appendChild(canvas);

    gl = canvas.getContext("webgl", {});

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.bindBuffer(gl.ARRAY_BUFFER, emitterVertexBuffer);

    emitter = new Emitter(Vector.Zero, 1000, 5, 5);

    requestAnimationFrame(loop);
})();