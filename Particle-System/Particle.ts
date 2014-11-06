/// <reference path="../Utils/Vector.ts"/>
/// <reference path="../Utils/Color.ts"/>

class Particle {
    public prevPos : Vector;
    public prevColor : Color;
    public pos : Vector;
    public dir : Vector;
    public life : number = 0;
    public color : Color;

    public set(pos : Vector, dir : Vector, life : number, color : Color) {
        this.pos = pos;
        this.dir = dir;
        this.life = life;
        this.color = color;
        this.prevPos = pos;
        this.prevColor = color;
    }

    public update(deltaTime: number, force : Vector) : boolean {
        this.prevPos =  this.pos.copy();
        this.pos.addmul(this.dir, deltaTime);
        this.dir.addmul(force, deltaTime);
        this.prevColor = this.color;
        this.color =    new  Color();
        this.life -= deltaTime;
        return this.life > 0;
    }

    public collectDrawData() : Vector {
        return this.pos;
    }
    public isDead() : boolean {
        return this.life <= 0;
    }
}