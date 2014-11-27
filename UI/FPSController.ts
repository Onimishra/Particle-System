/// <reference path="../Rendering/Camera.ts" />
class FPSController extends Camera {
    private sensivity : number = 0.1;
    private v : Vector = Vector.Zero();
    private u : Vector = Vector.Zero();
    private speed : number;
    private mouseEvent = function(mX, mY) {
        this.yaw    += mX * this.sensivity;
        this.pitch  += mY * this.sensivity;
    };

    public update(deltaTime) {
        this.v.set(this.u.x, this.u.y, this.u.z);
        this.v.rotate(this.pitch, this.yaw);
        this.eye.addmul(this.v, deltaTime);
    }

    private keyDown = function(event) {
        switch (event.key) {
            case 'w':
                this.u.z += this.speed;
                break;
            case 'a':
                this.u.x += -this.speed;
                break;
            case 's':
                this.u.z += -this.speed;
                break;
            case 'd':
                this.u.x += this.speed;
                break;
            case 'q':
                this.u.y += this.speed;
                break;
            case 'e':
                this.u.y += -this.speed;
                break;
        }
    };
    private keyUp = function(event) {
        switch(event.key) {
            case 'w':
                this.u.z -= this.speed;
                break;
            case 'a':
                this.u.x -= -this.speed;
                break;
            case 's':
                this.u.z -= -this.speed;
                break;
            case 'd':
                this.u.x -= this.speed;
                break;
            case 'q':
                this.u.y -= this.speed;
                break;
            case 'e':
                this.u.y -= -this.speed;
                break;
        }
    }
}
