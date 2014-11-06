class Rng {
    /**
     * @returns {number} a number between -1 and 1
     */
    public static Get() : number {
        //random returns between 0 and 1, -0.5 moves this to -0.5 to 0.5, times two increases the range to -1 to 1
        return (Math.random() - 0.5) * 2
    }
}
