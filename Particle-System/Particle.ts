/// <reference path="../Utils/Vector.ts"/>
/// <reference path="../Utils/Color.ts"/>

class Particle {
    public prevPos : Vector;
    public prevColor : Color;
    public pos : Vector;
    public dir : Vector;
    public life : number = 0;
    public color : Color;

    public constructor() {
        this.pos = Vector.Zero();
        this.prevPos = Vector.Zero();
    }

    public set(pos : Vector, dir : Vector, life : number, color : Color) {
        this.pos.set(pos)
        this.dir = dir;
        this.life = life;
        this.color = color;
        this.prevPos.set(pos);
        this.prevColor = color;
    }

    public update(deltaTime: number, force : Vector) : boolean {
        this.prevPos.set(this.pos);
        this.pos.addmul(this.dir, deltaTime);
        this.dir.addmul(force, deltaTime);
        this.prevColor = this.color;
        this.color =    this.color;
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