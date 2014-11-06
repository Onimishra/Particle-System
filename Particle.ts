/// <reference path="Vector.ts"/>
/// <reference path="Color.ts"/>

class Particle {
    constructor(
        public pos : Vector,
        public prevPos : Vector,
        public dir : Vector,
        public life : number,
        public color : Color,
        public prevColor : Color
    ) {}

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