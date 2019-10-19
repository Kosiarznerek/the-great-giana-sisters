"use strict";
class Kolo {
    /**
     * Tworzy koło
     * @param {number} promien
     * @param {Punkt} pozycja
     * @param {string} kolor
     */
    constructor(promien, pozycja, kolor) {
        this.promien = promien;
        this.pozycja = pozycja.klonuj();
        this.kolor = kolor;
    }
    /**
     * Rysuje kolo na canvasie
     * @param {CanvasRenderingContext2D} ctx
     */
    rysuj(ctx) {
        ctx.fillStyle = this.kolor;
        ctx.beginPath();
        ctx.arc(this.pozycja.x, this.pozycja.y, this.promien, 0, 2 * Math.PI);
        ctx.fill();
    }
}
