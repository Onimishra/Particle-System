/**
 * Created by mvie on 06/11/14.
 */
/// <reference path="Particle-System/Emitter.ts" />

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
    var deltas = [];
    var deltaI = 0;
    var deltaSampleLimit = 10;
    function update(deltaTime: number) {
        emitter.update(deltaTime);
        emitter2.update(deltaTime);

        deltas[deltaI++] = deltaTime;
        if(deltaI > deltaSampleLimit) deltaI = 0;
        var sum = deltas.reduce(function(a, b) { return a + b });
        var avg = sum / deltas.length;
        fpsCounter.innerText = (1/avg).toFixed(2);

        pCounter.innerText = (emitter.particleCount() + emitter2.particleCount()).toString();
    }

    canvas = <HTMLCanvasElement> document.createElement("canvas");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.style.border = "1px solid black";
    document.body.appendChild(canvas);

    renderSystem = new RenderSystem(canvas);

    emitter = new Emitter(new Vector(-2, 0, -4), 60000, 100000, 0);
    emitter2 = new Emitter(new Vector(0, 1, -4), 60000, 100000, 0);

    requestAnimationFrame(loop);
})();