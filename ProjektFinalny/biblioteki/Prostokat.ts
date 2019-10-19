class Prostokat {

    public pozycja: Wektor;
    public wysokosc: number;
    public szerokosc: number;
    public grafika: HTMLImageElement | undefined;

    /**
     * Tworzy obiekt prostokata
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     * @param {HTMLImageElement} grafika
     */
    constructor(pozycja: Wektor, wysokosc: number, szerokosc: number, grafika?: HTMLImageElement) {
        this.pozycja = pozycja.klonuj();
        this.wysokosc = wysokosc;
        this.szerokosc = szerokosc;
        this.grafika = grafika;
    }

    /**
     * Oblicza srodek prostokata
     * @returns {Wektor}
     */
    get srodek(): Wektor {
        let w: Wektor = new Wektor(0, 0);
        w.x = (this.pozycja.x + this.pozycja.x + this.szerokosc) / 2;
        w.y = (this.pozycja.y + this.pozycja.y + this.wysokosc) / 2;
        return w;
    }

    /**
     * Rysuje prostokąt na canvasie
     * @param {Prostokat} prostokat Prostokat do narysowania
     * @param {CanvasRenderingContext2D} ctx
     */
    static Rysuj(prostokat: Prostokat, ctx: CanvasRenderingContext2D): void {
        if (prostokat.grafika === undefined) {
            //Rysowanie bez grafik
            //ctx.fillStyle = 'black';
            //ctx.fillRect(prostokat.pozycja.x, prostokat.pozycja.y, prostokat.szerokosc, prostokat.wysokosc);

            ctx.fillStyle = 'rgba(255, 165, 0, 0.4)';
            ctx.fillRect(prostokat.pozycja.x + 1, prostokat.pozycja.y + 1, prostokat.szerokosc - 2, prostokat.wysokosc - 2);
        } else {
            //Rysowanie z grafikami
            ctx.drawImage(prostokat.grafika, prostokat.pozycja.x, prostokat.pozycja.y, prostokat.szerokosc, prostokat.wysokosc);
        }
    }

    /**
     * Rysuje prostokąt wypełniony grafika na canvasie
     * @param {CanvasRenderingContext2D} ctx
     */
    public rysuj(ctx: CanvasRenderingContext2D): void {
        Prostokat.Rysuj(this, ctx);
    }

    /**
     * Klonuje obiekt prostokat
     * @returns {Prostokat}
     */
    public klonuj(): Prostokat {
        return new Prostokat(this.pozycja.klonuj(), this.wysokosc, this.szerokosc, this.grafika);
    }
}
