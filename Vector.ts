class Vector {
    public static Zero : Vector = new Vector(0,0,0);
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
    public mul(a : number) : Vector {
        return new Vector(this.x * a, this.y * a, this.z * a);
    }
    public static direction(pitch : number, yaw : number) : Vector {
        return new Vector(
            -Math.sin(yaw) * Math.cos(pitch),
            Math.sin(pitch),
            Math.cos(pitch) * Math.cos(yaw)
        )
    }
}