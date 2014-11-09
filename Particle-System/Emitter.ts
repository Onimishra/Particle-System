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

        this.js_vbo = new Float32Array(this.limit * 6); //3 per particle, both current and prev so 6 in total
        var i;
        for(i = 0; i < limit; i++) {
            this.particles[i] = new Particle();
            this.deadParticles[i] = i;
        }
    }
    //Particle customization variables
    private pitch : number = 0;
    private yaw : number = Math.PI/2;
    private pitchVar : number = Math.PI/4;
    private yawVar : number = 0;
    private life : number = 5;
    private lifeVar : number = 0;
    private speed : number = 1;
    private speedVar : number = 0;
    private force : Vector = new Vector(0, -1, 0);
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
        //var direction = Vector.direction(this.pitch + Rng.var(this.pitchVar), this.yaw + Rng.var(this.yawVar));
        //direction.mul(this.speed + Rng.var(this.speedVar));
        var p = this.findDeadParticle();
        p.set(
            this.position,
            this.pitch + Rng.var(this.pitchVar),
            this.yaw + Rng.var(this.yawVar),
            this.speed + Rng.var(this.speedVar),
            this.life + Rng.var(this.lifeVar),
            Color.ORANGE,
            Color.BLUE
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
    private js_cbo = [];
    public collectDrawData(deltaTime: number) : RenderObject {
        var v : Vector, p: Particle, i : number, j = 0, ci = 0, c : Color;
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

            c = p.currentColor;
            this.js_cbo[ci++] = c.r;
            this.js_cbo[ci++] = c.g;
            this.js_cbo[ci++] = c.b;
            this.js_cbo[ci++] = c.intensity;

            this.js_cbo[ci++] = c.r;
            this.js_cbo[ci++] = c.g;
            this.js_cbo[ci++] = c.b;
            this.js_cbo[ci++] = c.intensity;
        }
        this.ro.pos = this.position;
        this.ro.vertices = this.js_vbo;
        this.ro.count = j;
        this.ro.colors = this.js_cbo;
        return this.ro;
    }
}