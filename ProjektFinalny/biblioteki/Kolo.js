"use strict";
class Kolo {
    /**
     * Tworzy obiekt koło
     * @param {Wektor} pozycja
     * @param {number} promien
     * @param {HTMLImageElement} grafika
     */
    constructor(pozycja, promien, grafika) {
        this.pozycja = pozycja.klonuj();
        this.promien = promien;
        this.grafika = grafika;
    }
    /**
     * Rysuje koło na canvasie
     * @param {CanvasRenderingContext2D} ctx
     */
    rysuj(ctx) {
        if (this.grafika === undefined) {
            //Rysowanie bez grafik
            ctx.beginPath();
            ctx.arc(this.pozycja.x, this.pozycja.y, this.promien, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'green';
            ctx.fill();
            ctx.closePath();
        }
        else {
            //Rysowanie z grafiką
            ctx.drawImage(this.grafika, this.pozycja.x - this.promien, this.pozycja.y - this.promien, this.promien * 2, this.promien * 2);
        }
    }
}
