"use strict";
class ZnikajacySegment extends Prostokat {
    /**
     * Tworzy znikający segment
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     */
    constructor(pozycja, wysokosc, szerokosc) {
        super(pozycja, wysokosc, szerokosc);
        this._maxCzasStania = 20; //Maksymalny czas (w klatkach) jaki można spędzić na segmencie -> potem znika całokowicie
        //Tworze częsci segmentu
        this._lewy = {
            ksztalt: new Prostokat(new Wektor(pozycja.x, pozycja.y), this.wysokosc, this.szerokosc / 2),
            aniamcja: new AnimatorPoklatkowy(GRAFIKI.przeszkody.znikajacySegment.lewy, 1),
            czasStania: 0 //Łączny czas (ilosc klatek) jaki ktoś spędził stojąc na segmencie
        };
        this._prawy = {
            ksztalt: new Prostokat(new Wektor(pozycja.x + this.szerokosc / 2, pozycja.y), this.wysokosc, this.szerokosc / 2),
            aniamcja: new AnimatorPoklatkowy(GRAFIKI.przeszkody.znikajacySegment.prawy, 1),
            czasStania: 0 //Łączny czas (ilosc klatek) jaki ktoś spędził stojąc na segmencie
        };
    }
    /**
     * Rysuje poszczególne częsci segmentu (prawy i lewy) [NAPIDPISANE PROSTOKAT]
     * Rysuje tylko te po których można jeszcze chodzić
     * @param {CanvasRenderingContext2D} ctx
     */
    rysuj(ctx) {
        if (this._lewy.czasStania < this._maxCzasStania)
            this._lewy.ksztalt.rysuj(ctx);
        if (this._prawy.czasStania < this._maxCzasStania)
            this._prawy.ksztalt.rysuj(ctx);
    }
    /**
     * Rozdziela segment na dwie częsci (lewą i prawą), lecz zwraca tylko te, po których można jeszcze chodzić
     * @returns {Prostokat[]}
     */
    przetrwaleCzesci() {
        return [this._lewy, this._prawy]
            .filter(value => value.czasStania < this._maxCzasStania)
            .map(value => value.ksztalt);
    }
    /**
     * Aktualizuje grafike segmentu
     */
    aktualizujGrafike() {
        //Lewy
        let indeksLewego = Math.mapLinear(this._lewy.czasStania, 0, this._maxCzasStania, 0, this._lewy.aniamcja.iloscKlatek() - 1);
        this._lewy.ksztalt.grafika = this._lewy.aniamcja.pobierzKlatke(Math.floor(indeksLewego));
        //Prawy
        let indeksPrawego = Math.mapLinear(this._prawy.czasStania, 0, this._maxCzasStania, 0, this._prawy.aniamcja.iloscKlatek() - 1);
        this._prawy.ksztalt.grafika = this._prawy.aniamcja.pobierzKlatke(Math.floor(indeksPrawego));
    }
    /**
     * Sprawia, że segment zaczyna zanikac
     * @param {Prostokat} obj Obiekt, który 'stoi' na segmencie (potrzebny, gdyż segment składa się z dwóch części)
     */
    zanikaj(obj) {
        //Jeżeli obiekt znajduje się na lewej części
        if (Kolizja.ProstokatNaProstokacie(obj, this._lewy.ksztalt))
            this._lewy.czasStania++;
        //Jeżeli obiekt znajduje się na prawej częsci
        if (Kolizja.ProstokatNaProstokacie(obj, this._prawy.ksztalt))
            this._prawy.czasStania++;
    }
}
