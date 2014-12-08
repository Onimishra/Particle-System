/// <reference path="../Rendering/Camera.ts" />
class FPSController extends Camera {
    private sensivity : number = 0.001;
    private speed : number = 2;
    private v : Vector = Vector.Zero();
    private u : Vector = Vector.Zero();
    private keys : number[] = [];

    public constructor(canvas) {
        super();
        // Pointer Lock
        canvas.requestPointerLock = canvas.requestPointerLock ||
        canvas.mozRequestPointerLock ||
        canvas.webkitRequestPointerLock;
        canvas.addEventListener("click", () => {
            canvas.requestPointerLock();
        });
        var mousemove = (e) => {
            this.mouseEvent(e.movementX, e.movementY);
        };
        var _keyDown = (e) => {
            this.keyDown(e);
        };
        var _keyUp = (e) => {
            this.keyUp(e);
        };
        var pointerLockChangeEvent = () => {
            if(document.pointerLockElement === canvas ||
                document.mozPointerLockElement === canvas ||
                document.webkitPointerLockElement === canvas) {
                window.addEventListener("keydown", _keyDown);
                window.addEventListener("keyup", _keyUp);
                canvas.addEventListener("mousemove", mousemove);
                return;
            }
            window.removeEventListener("keydown", _keyDown);
            window.removeEventListener("keyup", _keyUp);
            canvas.removeEventListener("mousemove", mousemove);
        };
        document.addEventListener("pointerlockchange", pointerLockChangeEvent);
        document.addEventListener("mozpointerlockchange", pointerLockChangeEvent);
        document.addEventListener("webkitpointerlockchange", pointerLockChangeEvent);
        // End Pointer Lock
    }

    public update(deltaTime) {
        this.v.set(this.u);
        this.v.rotate(this.pitch, this.yaw);
        this.eye.addmul(this.v, deltaTime);
    }

    private mouseEvent = function(mX, mY) {
        this.yaw    += mX * this.sensivity;
        this.pitch  += mY * this.sensivity;
    };

    private keyDown(event) {
        if(this.keys.indexOf(event.which) != -1)
            return;
        switch (event.which) {
            case 87: //w
                this.u.z += this.speed;
                break;
            case 65: //a
                this.u.x += this.speed;
                break;
            case 83: //s
                this.u.z += -this.speed;
                break;
            case 68: //d
                this.u.x += -this.speed;
                break;
            case 81: //q
                this.u.y += this.speed;
                break;
            case 69: //e
                this.u.y += -this.speed;
                break;
        }
        this.keys.push(event.which);
    }
    private keyUp = function(event) {
        switch(event.which) {
            case 87: //w
                this.u.z -= this.speed;
                break;
            case 65: //a
                this.u.x -= this.speed;
                break;
            case 83: //s
                this.u.z -= -this.speed;
                break;
            case 68: //d
                this.u.x -= -this.speed;
                break;
            case 81: //q
                this.u.y -= this.speed;
                break;
            case 69: //e
                this.u.y -= -this.speed;
                break;
        }
        this.keys.splice(this.keys.indexOf(event.which), 1);
    }
}
