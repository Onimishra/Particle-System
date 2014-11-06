/// <reference path="Vector.ts"/>
/// <reference path="Color.ts"/>

class Particle {
    public prevPos : Vector;
    public prevColor : Color;
    constructor(
        public pos : Vector,
        public dir : Vector,
        public life : number,
        public color : Color
    ) {
        this.prevPos = pos;
        this.prevColor = color;
    }

    public update(force: Vector, deltaTime: number){
        this.prevPos =  this.pos;
        this.pos =      this.pos.add(this.dir);
        this.dir =      this.dir.add(force);
        this.prevColor= this.color;
        this.color =    new  Color();
        this.life -= deltaTime;
    }
    public draw(g : Object){

    }
}