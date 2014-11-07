/**
 * Created by mvie on 06/11/14.
 */
/// <reference path="Particle-System/Emitter.ts" />
/// <reference path="Rendering/RenderSystem.ts" />

(function() {
    var canvas: HTMLCanvasElement, lastFrameTime: number, emitter, emitter2;
    var renderSystem : RenderSystem;

    var fpsCounter = document.getElementById("fps-counter");
    var pCounter = document.getElementById("particle-counter");

    function loop(timestamp: number) {
        if(lastFrameTime === undefined) lastFrameTime = timestamp;
        requestAnimationFrame(loop);

        update((timestamp - lastFrameTime)/1000);
        renderSystem.render((timestamp - lastFrameTime)/1000);

        lastFrameTime = timestamp;
    }
    var prevDelta = 0;
    function update(deltaTime: number) {
        emitter.update(deltaTime);
        emitter2.update(deltaTime);

        fpsCounter.innerText = (1/(deltaTime * 0.8 + prevDelta * 0.2)).toFixed(2);
        prevDelta = deltaTime;

        pCounter.innerText = (emitter.particleCount() + emitter2.particleCount()).toString();
    }

    canvas = <HTMLCanvasElement> document.createElement("canvas");
    canvas.height = 300;
    canvas.width = 512;
    canvas.style.border = "1px solid black";
    document.body.appendChild(canvas);

    renderSystem = new RenderSystem(canvas);

    emitter = new Emitter(new Vector(-2, 0, -4), 60000, 10000, 0);
    emitter2 = new Emitter(new Vector(2, 0, -4), 60000, 10000, 0);

    requestAnimationFrame(loop);
})();