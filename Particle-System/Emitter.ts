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
        public position : Vector,
        private limit : number,
        options : any
    ) {
        super();

        this.pitch =    options.pitch ?     options.pitch       : 0;
        this.pitchVar = options.pitchVar ?  options.pitchVar    : 1.57; // pi/2
        this.yaw =      options.yaw ?       options.yaw         : 1.57;
        this.yawVar =   options.yawVar ?    options.yawVar      : 0;
        this.life =     options.life ?      options.life        : 1;
        this.lifeVar =  options.lifeVar ?   options.lifeVar     : 0;
        this.speed =    options.speed ?     options.speed       : 1;
        this.speedVar = options.speedVar ?  options.speedVar    : 0;
        this.force =    options.force ?     options.force       : new Vector(0,0,0);
        this.rate =     options.rate ?      options.rate        : this.limit/this.life;
        this.rateVar =  options.rateVar ?   options.rateVar     : 0;

        this.nextEmit = 1/this.rate;
        this.js_vbo = new Float32Array(this.limit * 6); //3 per particle, both current and prev so 6 in total
        this.js_cbo = new Float32Array(this.limit * 8); //4 channels per particle

        this.particles = [];
        this.deadParticles = [];
        var i, p : Particle;
        for(i = 0; i < limit; i++) {
            p = new Particle();
            this.particles[i] = p;
            this.deadParticles[i] = p;
        }
    }
    //Particle customization variables
    public rate : number;
    public rateVar : number;
    public pitch : number;
    public yaw : number;
    public pitchVar : number;
    public yawVar : number;
    public life : number;
    public lifeVar : number;
    public speed : number;
    public speedVar : number;
    public force : Vector;


    //System structure variables
    private particles : Particle[];
    private aliveParticles : number = 0;
    private deadParticles : Particle[];
    private ro : RenderObject = new RenderObject();

    public particleCount() : number {
        return this.aliveParticles;
    }

    private emit() : Particle {
        var p = this.findDeadParticle();
        p.set(
            this.position,
            this.pitch + Rng.var(this.pitchVar),
            this.yaw + Rng.var(this.yawVar),
            this.speed + Rng.to(this.speedVar),
            this.life + Rng.var(this.lifeVar),
            Color.ORANGE,
            Color.BLUE
        );
        this.aliveParticles++;
        return p;
    }

    private findDeadParticle() : Particle {
        return this.deadParticles.pop();
    }
    private nextEmit : number;
    private time : number = 0;
    public update(deltaTime : number) {
        var alive, p : Particle, i;
        for(i = 0; i < this.limit; i++) {
            p = this.particles[i];
            if(!p.isDead()) {
                alive = p.update(deltaTime, this.force);
                if(!alive) {
                    this.killParticle(p);
                }
            }
        }
        this.time += deltaTime;
        while(this.time > this.nextEmit && this.aliveParticles < this.limit) {
            this.time = this.time - this.nextEmit;
            p = this.emit();
            p.update(this.time - this.nextEmit, this.force);
            if(!p.update(this.nextEmit, this.force))
                this.killParticle(p);
            this.nextEmit = 1/(this.rate + Rng.var(this.rateVar));
        }
        if(this.time > this.nextEmit)
            this.time = this.time % this.nextEmit;

    }

    private killParticle(p : Particle) {
        this.aliveParticles--;
        this.deadParticles.push(p);
    }


    private js_vbo;
    private js_cbo;
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