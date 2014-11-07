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
    /* uses (0,0,1) as base
    public static direction(pitch : number, yaw : number) : Vector {
        return new Vector(
            -Math.sin(yaw) * Math.cos(pitch),
            Math.sin(pitch),
            Math.cos(pitch) * Math.cos(yaw)
        )
    }
    */
    // uses (0,1,0) as base
    public static direction(pitch : number, yaw : number) : Vector {
        return new Vector(
            Math.sin(pitch) * Math.sin(yaw),
            Math.cos(pitch),
            -Math.sin(pitch) * Math.cos(yaw)
        )
    }

}