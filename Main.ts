/**
 * Created by mvie on 06/11/14.
 */
/// <reference path="Particle-System/Emitter.ts" />
/// <reference path="UI/EmitterCustomizer.ts" />


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

    // Pointer Lock
    canvas.requestPointerLock = canvas.requestPointerLock ||
        canvas.mozRequestPointerLock ||
        canvas.webkitRequestPointerLock;
    canvas.addEventListener("click", () => {
        canvas.requestPointerLock();
    });
    var mousemove = function(e) {
        console.log(e.movementX + " - " + e.movementY);
    };
    var pointerLockChangeEvent = () => {
        console.log("pointer change");
        if(document.pointerLockElement === canvas ||
            document.mozPointerLockElement === canvas ||
            document.webkitPointerLockElement === canvas) {
            console.log("captured");
            canvas.addEventListener("mousemove", mousemove);
            return;
        }
        console.log("exit");
        canvas.removeEventListener("mousemove", mousemove);
    };
    document.addEventListener("pointerlockchange", pointerLockChangeEvent);
    document.addEventListener("mozpointerlockchange", pointerLockChangeEvent);
    document.addEventListener("webkitpointerlockchange", pointerLockChangeEvent);
    // End Pointer Lock

    document.body.appendChild(canvas);
    window.addEventListener("resize", () => {
        canvas.height = document.body.clientHeight;
        canvas.width = document.body.clientWidth;
    });

    renderSystem = new RenderSystem(canvas);
    var debugOptions = {};
    emitters = [];
    for(var i = -1; i < 0; i++) {
        emitters.push(
            new Emitter(new Vector(i, 0, -5), 3000, debugOptions)
        )
    }

    var ui = new EmitterCustomizer(emitters);


    requestAnimationFrame(loop);
})();