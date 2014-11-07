/**
 * Created by mvie on 06/11/14.
 */
/// <reference path="../Rendering/Renderable.ts" />
/// <reference path="Particle.ts" />
/// <reference path="../Utils/Vector.ts" />
/// <reference path="../Utils/Rng.ts" />
/// <reference path="../Rendering/RenderObject.ts" />

class Emitter extends Renderable {
    constructor(
        private position : Vector,
        private limit : number,
        private rate : number,
        private rateVar : number
    ) {
        super();
        this.nextEmit = 1000/this.rate;
        this.particles = [];
        this.deadParticles = [];
        var i;
        for(i = 0; i < limit; i++) {
            this.particles[i] = new Particle();
            this.deadParticles[i] = i;
        }
    }
    //Particle customization variables
    private pitch : number = Math.PI/2;
    private yaw : number = Math.PI/2;
    private pitchVar : number = Math.PI/4;
    private yawVar : number = 0;
    private life : number = 2;
    private lifeVar : number = 1;
    private speed : number = 1;
    private speedVar : number = 0;
    private force : Vector = new Vector(0, -0.5, 0);
    private ro : RenderObject = new RenderObject();

    //System structure variables
    private particles : Particle[];
    private aliveParticles : number = 0;
    private deadParticles : number[];

    public particleCount() : number {
        return this.aliveParticles;
    }

    private emit() {
        //console.log(new Date().getTime()/1000);
        var direction = Vector.direction(this.pitch + Rng.var(this.pitchVar), this.yaw + Rng.var(this.yawVar));
        direction.mul(this.speed + Rng.var(this.speedVar));
        var p = this.findDeadParticle();
        p.set(
            this.position,
            direction,
            this.life + Rng.var(this.lifeVar),
            Color.WHITE
        );
        this.aliveParticles++;
    }

    private findDeadParticle() : Particle {
        return this.particles[this.deadParticles.pop()];
    }
    private nextEmit : number;
    private time : number = 0;
    public update(deltaTime : number) {
        this.time += deltaTime;
        while(this.time > this.nextEmit && this.aliveParticles < this.limit) {
            this.emit();
            this.time = this.time - this.nextEmit;
            this.nextEmit = 1/(this.rate + Rng.var(this.rateVar));
        }
        var alive, p, i;
        for(i = 0; i < this.limit; i++) {
            p = this.particles[i];
            if(!p.isDead()) {
                alive = p.update(deltaTime, this.force);
                if(!alive) {
                    this.aliveParticles--;
                    this.deadParticles.push(i);
                }
            }
        }
    }
    private js_vbo = [];
    public collectDrawData(deltaTime: number) : RenderObject {
        var v, p, i, j = 0;
        for(i=0; i < this.limit; i++) {
            p = this.particles[i];
            if(p.isDead()) continue;
            v = p.pos;
            this.js_vbo[j++] = v.x;
            this.js_vbo[j++] = v.y;
            this.js_vbo[j++] = v.z;
            v = p.prevPos;
            this.js_vbo[j++] = v.x;
            this.js_vbo[j++] = v.y;
            this.js_vbo[j++] = v.z;
        }
        this.ro.pos = this.position;
        this.ro.vertices = this.js_vbo;
        this.ro.count = j;
        return this.ro;
    }
}