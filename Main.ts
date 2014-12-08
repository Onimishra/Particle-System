/**
 * Created by mvie on 06/11/14.
 */
/// <reference path="Particle-System/Emitter.ts" />
/// <reference path="UI/EmitterCustomizer.ts" />
/// <reference path="UI/FPSController.ts" />


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
        fpsCounter.textContent = (1/avg).toFixed(0);

        //Update total particle count
        pCounter.textContent = emitters.reduce((acc : number, e) => acc + e.particleCount(), 0).toString();
    }


    //Initialization
    canvas = <HTMLCanvasElement> document.createElement("canvas");
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;
    document.body.appendChild(canvas);
    window.addEventListener("resize", () => {
        canvas.height = document.body.clientHeight;
        canvas.width = document.body.clientWidth;
    });

    var camera = new FPSController(canvas);

    renderSystem = new RenderSystem(canvas, camera);
    var debugOptions = { life: 3, pitchVar: 3.14, yawVar: 3.14 };
    emitters = [];
    for(var i = -1; i < 0; i++) {
        emitters.push(
            new Emitter(new Vector(i, 0, -5), 10000, debugOptions)
        )
    }

    var ui = new EmitterCustomizer(emitters);


    requestAnimationFrame(loop);
})();