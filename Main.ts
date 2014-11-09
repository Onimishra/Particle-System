/**
 * Created by mvie on 06/11/14.
 */
/// <reference path="Particle-System/Emitter.ts" />

(function() {
    var canvas: HTMLCanvasElement, lastFrameTime: number, emitters : Emitter[];
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
    var deltaSampleLimit = 200;
    function update(deltaTime: number) {
        //Update emitters
        emitters.forEach(e => e.update(deltaTime));

        //Calculate moving average for fps counter
        deltas[deltaI++] = deltaTime;
        if(deltaI > deltaSampleLimit) deltaI = 0;
        var sum = deltas.reduce(function(a, b) { return a + b });
        var avg = sum / deltas.length;
        fpsCounter.innerText = (1/avg).toFixed(0);

        //Update total particle count
        pCounter.innerText = emitters.reduce((acc : number, e) => acc + e.particleCount(), 0).toString();
    }

    canvas = <HTMLCanvasElement> document.createElement("canvas");
    canvas.height = window.innerHeight-6;
    canvas.width = window.innerWidth;
    //canvas.style.border = "1px solid black";
    document.body.appendChild(canvas);

    renderSystem = new RenderSystem(canvas);

    emitters = [];
    for(var i = -1; i <= 3; i++) {
        emitters.push(
            new Emitter(new Vector(i*0.75, 1.5, -5), 37500, 7500, 0)
        )
    }

    requestAnimationFrame(loop);
})();