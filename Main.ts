/**
 * Created by mvie on 06/11/14.
 */
/// <reference path="Emitter.ts" />

(function() {
    var context: Object, canvas: HTMLCanvasElement, emitter: Emitter, lastFrameTime: number;

    function loop(timestamp: number) {
        if(lastFrameTime === undefined) lastFrameTime = timestamp;
        requestAnimationFrame(loop);
        render(timestamp - lastFrameTime);
        lastFrameTime = timestamp;
    }

    function render(deltaTime: number) {
        emitter.update(deltaTime);

        emitter.draw(deltaTime);
    }

    canvas = <HTMLCanvasElement> document.createElement("canvas");
    canvas.height = 300;
    canvas.width = 512;
    canvas.style.border = "1px solid black";
    document.body.appendChild(canvas);

    context = canvas.getContext("webgl", {});

    emitter = new Emitter(Vector.Zero, 1000, 5, 5);

    requestAnimationFrame(loop);
})();