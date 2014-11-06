/// <reference path="../Utils/Vector.ts"/>
/// <reference path="../Utils/Color.ts"/>

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

    public update(deltaTime: number, force : Vector) : boolean {
        this.prevPos =  this.pos;
        this.pos =      this.pos.add(this.dir.mul(deltaTime));
        this.dir =      this.dir.add(force.mul(deltaTime));
        this.prevColor= this.color;
        this.color =    new  Color();
        this.life -= deltaTime;
        return this.life > 0;
    }

    public collectDrawData() : Vector {
        return this.pos;
    }
}