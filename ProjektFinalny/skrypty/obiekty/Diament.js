"use strict";
class Diament extends Prostokat {
    /**
     * Tworzy obiekt diament, które może zbierać gracz na mapie
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     */
    constructor(pozycja, wysokosc, szerokosc) {
        super(pozycja, wysokosc, szerokosc, new Image);
        //Animacja diamentu
        this._animacja = new AnimatorPoklatkowy(GRAFIKI.diament, 7);
    }
    /**
     * Aktualizuje obecnie wyświetlaną grafike
     */
    aktualizujGrafike() {
        let grafika = this._animacja.nastepnaKlatka();
        if (grafika !== null)
            this.grafika = grafika;
        else {
            this._animacja.cofnijDoPoczatku();
            this.grafika = this._animacja.nastepnaKlatka() || new Image;
        }
    }
}
