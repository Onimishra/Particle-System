/**
 * Created by mvie on 06/11/14.
 */

class Color {
    static WHITE = new Color(1.0, 1.0, 1.0);
    static BLUE = new Color(0.1, 0.1, 1.0);
    static ORANGE = new Color(0.9, 0.6, 0.3);

    constructor(
        public r : number,
        public g : number,
        public b : number,
        public intensity : number = 1.0
    ){}

    public set(r : number, g : number, b : number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    public transition(startColor : Color, endColor : Color, p : number) {
        this.r = startColor.r * p + endColor.r * (1-p);
        this.g = startColor.g * p + endColor.g * (1-p);
        this.b = startColor.b * p + endColor.b * (1-p);
    }
}