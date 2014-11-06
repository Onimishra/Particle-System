/**
 * Created by mvie on 06/11/14.
 */
/// <reference path="Emitter.ts" />

(function() {
    var context: Object, canvas: HTMLCanvasElement, emitter: Emitter, lastFrameTime: number;

    function loop(timestamp: number) {
        requestAnimationFrame(loop);
        render(timestamp - lastFrameTime);
    }

    function render(deltaTime: number) {
        emitter.update(deltaTime);
    }

    canvas = <HTMLCanvasElement> document.createElement("canvas");
    canvas.height = 512;
    canvas.width = 512;
    document.body.appendChild(canvas);

    context = canvas.getContext("webgl", {});
    emitter = new Emitter();
    lastFrameTime = new Date().getTime();
    requestAnimationFrame(loop);
})();