/**
 * Created by mvie on 06/11/14.
 */
/// <reference path="Particle.ts" />
/// <reference path="../Utils/Vector.ts" />
/// <reference path="../Utils/Rng.ts" />

class Emitter {
    constructor(
        private position : Vector,
        private limit : number,
        private rate : number,
        private rateVar : number
    ) {
        this.particles = [];
        this.nextEmit = 1000/this.rate;
    }
    //Particle customization variables
    private pitch : number = Math.PI/2;
    private yaw : number = 0;
    private pitchVar : number = Math.PI/2;
    private yawVar : number = Math.PI/2;
    private life : number = 2000;
    private lifeVar : number = 1000;
    private speed : number = 0.001;
    private speedVar : number = 0;
    private force : Vector = Vector.Zero;

    //System structure variables
    private particles : Particle[];

    private emit() {
        //console.log(new Date().getTime()/1000);
        var direction = Vector.direction(this.pitch + Rng.var(this.pitchVar), this.yaw + Rng.var(this.yawVar));
        this.particles.push( new Particle(
            this.position,
            direction.mul(this.speed + Rng.var(this.speedVar)),
            this.life + Rng.var(this.lifeVar),
            new Color()
        ) );
    }

    private nextEmit : number;
    private time : number = 0;
    public update(deltaTime : number) {
        this.time += deltaTime;
        while(this.time > this.nextEmit) {
            this.emit();
            this.time = this.time - this.nextEmit;
            this.nextEmit = 1000/(this.rate + Rng.var(this.rateVar));
        }

        this.particles = this.particles.filter(p => {
            return p.update(deltaTime, this.force);
        });
    }

    public collectDrawData(deltaTime: number) {
        var js_vbo = [];
        this.particles.forEach(p => {
            var v = p.collectDrawData();
            js_vbo.push(v.X());
            js_vbo.push(v.Y());
            js_vbo.push(v.Z());
            v = p.prevPos;
            js_vbo.push(v.X());
            js_vbo.push(v.Y());
            js_vbo.push(v.Z());
        });
        return js_vbo;
    }
}