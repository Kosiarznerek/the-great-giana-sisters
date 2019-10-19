"use strict";
class Pajak extends SamoporuszajacyProstokat {
    /**
     * Tworzy pająka
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     */
    constructor(pozycja, wysokosc, szerokosc) {
        super(pozycja, new Wektor(-1, 0), 4, wysokosc, szerokosc, true);
        //Animacja
        this._animacja = new AnimatorPoklatkowy(GRAFIKI.przeciwnicy.pajak, 6);
        //Poruszanie sie
        this._wartoscSin = 0;
    }
    /**
     * Aktualizuje kierunek w jakim porusza sie pajak
     */
    aktualizujKierunek() {
        //Zwiększam sin
        this._wartoscSin += 0.008;
        if (this._wartoscSin > Math.PI / 2)
            this._wartoscSin = 0;
        //Aktualizuje
        let n = Math.mapLinear(Math.sin(this._wartoscSin), 0, 1, -1, 1);
        this.obecnyKierunek = new Wektor(n, 0);
    }
    /**
     * Aktualizuje bierzącą grafike pajaka
     */
    aktualizujGrafike() {
        let grafika = this._animacja.nastepnaKlatka();
        if (grafika)
            this.grafika = grafika;
        else {
            this._animacja.cofnijDoPoczatku();
            this.grafika = this._animacja.nastepnaKlatka() || new Image;
        }
    }
}
