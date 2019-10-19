"use strict";
class ZnikajacaCegla extends Prostokat {
    /**
     * Tworzy znikającą cegłe
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     */
    constructor(pozycja, wysokosc, szerokosc) {
        super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.czystaCegla);
        this.zniszczona = false; //Zawiera informacje czy cegła została zniszczona czy nie
        this._doZniszczenia = false;
        this._animacja = new AnimatorPoklatkowy(GRAFIKI.przeszkody.znikanieCegly, 5);
    }
    /**
     * Sprawia, że cegła zaczyna znikać
     */
    zniszcz() {
        //Jeżeli już została zniszczona lub jest już przygotowana do zniszczenia to nic nie robie
        if (this.zniszczona || this._doZniszczenia)
            return;
        //Cegła zostaje ustawiona do zniszczenia
        this._doZniszczenia = true;
    }
    /**
     * Aktualizacja obecnie wyświetlanej grafiki znikającej cegły
     */
    aktualizujGrafike() {
        //Jeżeli cegła nie została zniszczona i nie jest ustawiona do zniszczenia -> zwykły obrazek
        if (!this.zniszczona && !this._doZniszczenia)
            this.grafika = GRAFIKI.przeszkody.czystaCegla;
        //Jeżeli nie została zniszczona, ale trzeba ja zniszczyc -> animacja
        if (!this.zniszczona && this._doZniszczenia) {
            let grafika = this._animacja.nastepnaKlatka();
            if (grafika !== null)
                this.grafika = grafika;
            else {
                this.zniszczona = true;
                this._doZniszczenia = false;
            }
        }
        //Jeżeli już została zniszczona, a animacja została w pełni odegrana -> wstawiam pusty obrazek
        if (this.zniszczona && !this._doZniszczenia)
            this.grafika = new Image;
    }
}
