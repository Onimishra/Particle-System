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
        this.setField(options, "pitch",     0);
        this.setField(options, "pitchVar",  1.57);
        this.setField(options, "yaw",       1.57);
        this.setField(options, "yawVar",    0);
        this.setField(options, "life",      1);
        this.setField(options, "lifeVar",   0);
        this.setField(options, "speed",     1);
        this.setField(options, "speedVar",  0);
        this.setField(options, "force",     new Vector(0,0,0));
        this.setField(options, "rate",      this.limit/this.life);
        this.setField(options, "rateVar",   0);
        this.setField(options, "startColor",Color.ORANGE());
        this.setField(options, "endColor",  Color.BLUE());

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
    private setField(options, field, defaultVal) {
        if(options.hasOwnProperty(field)) this[field] = options[field];
        else this[field] = defaultVal;
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
    public startColor : Color;
    public endColor : Color;


    //System structure variables
    private particles : Particle[];
    private aliveParticles : number = 0;
    private deadParticles : Particle[];
    private ro : RenderObject = new RenderObject();

    public particleCount() : number {
        return this.aliveParticles;
    }
    public capacity() : number {
        return this.limit;
    }

    private emit() : Particle {
        var p = this.findDeadParticle();
        p.set(
            this.position,
            this.pitch + Rng.var(this.pitchVar),
            this.yaw + Rng.var(this.yawVar),
            this.speed + Rng.to(this.speedVar),
            this.life + Rng.var(this.lifeVar),
            this.startColor,
            this.endColor
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
        var alive, p:Particle, i;
        for (i = 0; i < this.limit; i++) {
            p = this.particles[i];
            if (!p.isDead()) {
                alive = p.update(deltaTime, this.force);
                if (!alive) {
                    this.killParticle(p);
                }
            }
        }
        this.time += deltaTime;
        var offset = Math.min(deltaTime, this.nextEmit);
        while (this.time > this.nextEmit && this.aliveParticles < this.limit) {
            this.time = this.time - this.nextEmit;
            p = this.emit();
            p.update(this.time - offset, this.force);
            if (!p.update(offset, this.force))
                this.killParticle(p);
            this.nextEmit = 1 / (this.rate + Rng.to(this.rateVar));
        }
        if (this.time > this.nextEmit)
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