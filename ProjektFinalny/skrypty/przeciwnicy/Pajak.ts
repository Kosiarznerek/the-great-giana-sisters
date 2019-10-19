class Pajak extends SamoporuszajacyProstokat {

    private _animacja: AnimatorPoklatkowy;
    private _wartoscSin: number;

    /**
     * Tworzy pająka
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     */
    constructor(pozycja: Wektor, wysokosc: number, szerokosc: number) {
        super(pozycja, new Wektor(-1, 0), 4, wysokosc, szerokosc, true);

        //Animacja
        this._animacja = new AnimatorPoklatkowy(GRAFIKI.przeciwnicy.pajak, 6);

        //Poruszanie sie
        this._wartoscSin = 0;
    }

    /**
     * Aktualizuje kierunek w jakim porusza sie pajak
     */
    public aktualizujKierunek(): void {
        //Zwiększam sin
        this._wartoscSin += 0.008;
        if (this._wartoscSin > Math.PI / 2) this._wartoscSin = 0;

        //Aktualizuje
        let n: number = Math.mapLinear(Math.sin(this._wartoscSin), 0, 1, -1, 1);
        this.obecnyKierunek = new Wektor(n, 0);
    }

    /**
     * Aktualizuje bierzącą grafike pajaka
     */
    public aktualizujGrafike(): void {
        let grafika: HTMLImageElement | null = this._animacja.nastepnaKlatka();
        if (grafika) this.grafika = grafika;
        else {
            this._animacja.cofnijDoPoczatku();
            this.grafika = this._animacja.nastepnaKlatka() || new Image;
        }
    }
}