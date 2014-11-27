/// <reference path="../Utils/Vector.ts" />
class Camera {
    public pitch : number = 0;
    public yaw : number = 0;
    public eye : Vector;
    constructor() {
        this.eye = new Vector(0,0,0);
    }
    public update(deltaTime) {}
}
