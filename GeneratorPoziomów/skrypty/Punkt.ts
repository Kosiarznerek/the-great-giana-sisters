class Punkt {

    public x: number;
    public y: number;

    /**
     * Klasa punkt
     * @param {number} x
     * @param {number} y
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Klonuje obiekt
     * @returns {Punkt}
     */
    public klonuj(): Punkt {
        return new Punkt(this.x, this.y);
    }
}