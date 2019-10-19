class Diament extends Prostokat {

    private _animacja: AnimatorPoklatkowy;

    /**
     * Tworzy obiekt diament, które może zbierać gracz na mapie
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     */
    constructor(pozycja: Wektor, wysokosc: number, szerokosc: number) {
        super(pozycja, wysokosc, szerokosc, new Image);

        //Animacja diamentu
        this._animacja = new AnimatorPoklatkowy(GRAFIKI.diament, 7);
    }

    /**
     * Aktualizuje obecnie wyświetlaną grafike
     */
    public aktualizujGrafike(): void {
        let grafika: HTMLImageElement | null = this._animacja.nastepnaKlatka();
        if (grafika !== null) this.grafika = grafika;
        else {//Cofam animacje do początku
            this._animacja.cofnijDoPoczatku();
            this.grafika = this._animacja.nastepnaKlatka() || new Image;
        }
    }
}