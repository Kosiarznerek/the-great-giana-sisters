class Kolo {
    public promien: number;
    public pozycja: Punkt;
    public kolor: string;

    /**
     * Tworzy koło
     * @param {number} promien
     * @param {Punkt} pozycja
     * @param {string} kolor
     */
    constructor(promien: number, pozycja: Punkt, kolor: string) {
        this.promien = promien;
        this.pozycja = pozycja.klonuj();
        this.kolor = kolor;
    }

    /**
     * Rysuje kolo na canvasie
     * @param {CanvasRenderingContext2D} ctx
     */
    public rysuj(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.kolor;
        ctx.beginPath();
        ctx.arc(this.pozycja.x, this.pozycja.y, this.promien, 0, 2 * Math.PI);
        ctx.fill();
    }
}