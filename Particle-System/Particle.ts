/// <reference path="../Utils/Vector.ts"/>
/// <reference path="../Utils/Color.ts"/>

class Particle {
    public pos : Vector;
    public prevPos : Vector;
    public dir : Vector;
    public lifeSpan : number = 0;
    public life : number = 0;
    public startColor : Color;
    public endColor : Color;
    public currentColor : Color = new Color(0,0,0);

    public constructor() {
        this.pos = Vector.Zero();
        this.prevPos = Vector.Zero();
    }

    public set(pos : Vector, dir : Vector, life : number, startColor : Color, endColor : Color) {
        this.pos.set(pos)
        this.dir = dir;
        this.life = life;
        this.lifeSpan = life;
        this.prevPos.set(pos);
        this.startColor = startColor;
        this.endColor = endColor;
    }

    public update(deltaTime: number, force : Vector) : boolean {
        this.prevPos.set(this.pos);
        this.pos.addmul(this.dir, deltaTime);
        this.dir.addmul(force, deltaTime);
        this.currentColor.transition(this.startColor, this.endColor, this.life/this.lifeSpan);
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