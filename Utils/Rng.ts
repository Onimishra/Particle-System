class Rng {
    /**
     * @returns {number} a number between -1 and 1
     */
    public static get() : number {
        //random returns between 0 and 1, -0.5 moves this to -0.5 to 0.5, times two increases the range to -1 to 1
        return (Math.random() - 0.5) * 2
    }
    public static var(variance : number) : number {
        return variance * this.get();
    }
    public static to(upper : number) : number {
        return Math.random() * upper;
    }
}
