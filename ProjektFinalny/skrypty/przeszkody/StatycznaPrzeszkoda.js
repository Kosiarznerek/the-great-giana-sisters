"use strict";
//Rodzaje statycznych przeszkod
var STATYCZNA_PRZESZKODA;
(function (STATYCZNA_PRZESZKODA) {
    STATYCZNA_PRZESZKODA["KOMIN_DUZY"] = "KOMIN_DUZY";
    STATYCZNA_PRZESZKODA["KOMIN_MALY"] = "KOMIN_MALY";
    STATYCZNA_PRZESZKODA["STALOWY_KLOCEK"] = "STALOWY_KLOCEK";
    STATYCZNA_PRZESZKODA["PLATFORMA"] = "PLATFORMA";
    STATYCZNA_PRZESZKODA["BRUKOWY_KLOCEK"] = "BRUKOWY_KLOCEK";
    STATYCZNA_PRZESZKODA["KAMIENNY_LEWY"] = "KAMIENNY_LEWY";
    STATYCZNA_PRZESZKODA["KAMIENNY_CENTRALNY"] = "KAMIENNY_CENTRALNY";
    STATYCZNA_PRZESZKODA["KAMIENNY_PRAWY"] = "KAMIENNY_PRAWY";
})(STATYCZNA_PRZESZKODA || (STATYCZNA_PRZESZKODA = {}));
//Klasa StatycznaPrzeszkoda
class StatycznaPrzeszkoda extends Prostokat {
    /**
     *
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     * @param {STATYCZNA_PRZESZKODA} typ
     */
    constructor(pozycja, wysokosc, szerokosc, typ) {
        //W zależności od typu odpowiednie dane
        switch (typ) {
            case 'KOMIN_DUZY':
                super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.statyczne.kominDuzy);
                break;
            case 'KOMIN_MALY':
                super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.statyczne.kominMaly);
                break;
            case 'STALOWY_KLOCEK':
                super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.statyczne.stalowyKlocek);
                break;
            case 'PLATFORMA':
                super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.statyczne.platforma);
                break;
            case 'BRUKOWY_KLOCEK':
                super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.statyczne.brukowyKlocek);
                break;
            case 'KAMIENNY_LEWY':
                super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.statyczne.kamiennyLewy);
                break;
            case 'KAMIENNY_CENTRALNY':
                super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.statyczne.kamiennyCentralny);
                break;
            case 'KAMIENNY_PRAWY':
                super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.statyczne.kamiennyPrawy);
                break;
            default:
                throw new Error(`Nieznany typ ${typ} statystycznej przeszkody`);
        }
        this.typ = typ;
    }
}
