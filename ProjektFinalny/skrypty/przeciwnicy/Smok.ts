class Smok extends Prostokat {

    private _animacja: AnimatorPoklatkowy;
    private _iloscZyc: number;
    private _wartoscSinX: number;
    private _wartoscSinY: number;
    private _grawitacja: Wektor;

    /**
     * Tworzy smoka
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     */
    constructor(pozycja: Wektor, wysokosc: number, szerokosc: number) {
        super(pozycja, wysokosc, szerokosc);

        //Animacja
        this._animacja = new AnimatorPoklatkowy(GRAFIKI.przeciwnicy.smok, 8);

        //Ilość żyć
        this._iloscZyc = 5;

        //Poruszanie sie
        this._wartoscSinX = -Math.PI;
        this._wartoscSinY = -Math.PI;

        //Spadanie
        this._grawitacja = new Wektor(0, 1);
    }

    /**
     * Aktualizuje pozycje smoka
     * @param {Prostokat[]} przeszkody Przeszkody do unikania
     */
    public aktualizujPozycje(przeszkody: Prostokat[]): void {
        //Jeżeli zabity -> spada na dół
        if (this._iloscZyc <= 0 && this.pozycja.y < C_WYSOKOSC + this.wysokosc) {
            this._grawitacja.pomnozSkalarnie(1.08);
            this.pozycja.dodaj(this._grawitacja);
            return;
        }

        //Aktualizuje wartości sin
        this._wartoscSinX += 0.04;
        this._wartoscSinY += 0.03;
        if (this._wartoscSinX > Math.PI) this._wartoscSinX = -Math.PI;
        if (this._wartoscSinY > Math.PI) this._wartoscSinY = -Math.PI;

        //Aktualizuje pozycje
        let offsetX: number = Math.mapLinear(Math.sin(this._wartoscSinX), -1, 1, -6, 6);
        let offsetY: number = Math.mapLinear(Math.sin(this._wartoscSinY), -1, 1, -1.5, 1.5);
        Kolizja.AktualizujProstokatUnikajac(this, new Wektor(offsetX, offsetY), przeszkody);
    }

    /**
     * Aktualizuje grafike smoka
     */
    public aktualizujGrafike(): void {
        //Jeżeli zabity -> nie zmieniam
        if (this._iloscZyc <= 0) return;

        //Aktualizuje grafike
        let grafika: HTMLImageElement | null = this._animacja.nastepnaKlatka();
        if (grafika) this.grafika = grafika;
        else {
            this._animacja.cofnijDoPoczatku();
            this.grafika = this._animacja.nastepnaKlatka() || new Image;
        }
    }

    /**
     * Zabija smoka
     */
    public zabij(): void {
        if (this._iloscZyc <= 0) return;
        this._iloscZyc--;
    }
}