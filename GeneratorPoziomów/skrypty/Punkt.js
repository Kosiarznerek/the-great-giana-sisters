"use strict";
class Punkt {
    /**
     * Klasa punkt
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Klonuje obiekt
     * @returns {Punkt}
     */
    klonuj() {
        return new Punkt(this.x, this.y);
    }
}
