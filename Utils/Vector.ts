class Vector {
    public static Zero() : Vector { return new Vector(0,0,0); }
    public constructor (
        public x : number,
        public y : number,
        public z : number){}
    public add(v : Vector) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }
    public sub(v : Vector) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    }
    public mul(a : number) {
        this.x *= a;
        this.y *= a;
        this.z *= a;
    }
    public addmul(v : Vector, a : number) {
        this.x += v.x * a;
        this.y += v.y * a;
        this.z += v.z * a;
    }

    public copy() : Vector {
        return new Vector(this.x, this.y, this.z);
    }
    public set(v : Vector) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }

    public dot(v : Vector) : number {
        return this.x*v.x + this.y*v.y + this.z*v.z;
    }

    public rotate(pitch : number, yaw : number) {
        var x = this.x; var y = this.y; var z = this.z; var sin = Math.sin; var cos = Math.cos;
        this.x = x * cos(yaw) + y *  sin(pitch)* sin(yaw) +  z * -sin(yaw) * cos(pitch);
        this.y =                y *  cos(pitch)           +  z *  sin(pitch);
        this.z = x * sin(yaw) + y * -sin(pitch)* cos(yaw) +  z *  cos(pitch) * cos(yaw);
    }

    public direction(pitch : number, yaw : number, speed : number) {
        this.x = Math.sin(pitch) * Math.sin(yaw) * speed;
        this.y = Math.cos(pitch) * speed;
        this.z = -Math.sin(pitch) * Math.cos(yaw) * speed;
    }

}