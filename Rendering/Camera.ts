/// <reference path="../Utils/Vector.ts" />
class Camera {
    public pitch : number;
    public yaw : number;
    public eye : Vector;
    constructor() {
        this.eye = new Vector(0,0,0);
    }
    public update(deltaTime) {}
}
