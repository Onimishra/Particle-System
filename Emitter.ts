/**
 * Created by mvie on 06/11/14.
 */
/// <reference path="Particle.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Rng.ts" />

class Emitter {
    constructor(
        private position : Vector,
        private limit : number,
        private rate : number,
        private rateVar : number
    ) {
        this.particles = new Particle[this.limit];
        this.nextEmit = 1000/this.rate;
    }
    //Particle customization variables
    private pitch : number = 0;
    private yaw : number = 0;
    private pitchVar : number = 0;
    private yawVar : number = 0;
    private life : number = 0;
    private lifeVar : number = 0;
    private speed : number = 0;
    private speedVar : number = 0;
    private force : Vector = Vector.Zero;

    //System structure variables
    private particles : Particle[];

    private emit() {
        var direction = Vector.direction(this.pitch + Rng.var(this.pitchVar), this.yaw + Rng.var(this.yawVar));
        this.particles.push( new Particle(
            this.position,
            direction.mul(this.speed + Rng.var(this.speedVar)),
            this.life + Rng.var(this.lifeVar),
            new Color(),
            this.force
        ) );
    }

    private nextEmit : number;
    private time : number = 0;
    public update(deltaTime : number) {
        this.time += deltaTime;
        if(this.time > this.nextEmit) {
            this.emit();
            this.time = this.time - this.nextEmit;
            this.nextEmit = 1000/(this.rate + Rng.var(this.rateVar));
        }

        this.particles.forEach(p => {
            p.update(deltaTime);
            //draw?
        })
    }
}