class Vector {
    public constructor (
        private x : number,
        private y : number,
        private z : number){}
    public X() { return this.x; }
    public Y() { return this.y; }
    public Z() { return this.z; }
    public add(v : Vector) : Vector {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    public sub(v : Vector) : Vector {
        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    public static Direction(pitch : number, yaw : number) : Vector {
        return new Vector(
            -Math.sin(yaw) * Math.cos(pitch),
            Math.sin(pitch),
            Math.cos(pitch) * Math.cos(yaw)
        )
    }
}