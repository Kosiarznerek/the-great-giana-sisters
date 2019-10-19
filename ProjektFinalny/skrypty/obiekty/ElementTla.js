"use strict";
//Dostępne elementy tła
var ELEMENT_TLA;
(function (ELEMENT_TLA) {
    ELEMENT_TLA["CHMURKA_DUZA"] = "CHMURKA_DUZA";
    ELEMENT_TLA["CHMURKA_MALA"] = "CHMURKA_MALA";
    ELEMENT_TLA["DRZEWKO_DUZE"] = "DRZEWKO_DUZE";
    ELEMENT_TLA["DRZEWKO_MALE"] = "DRZEWKO_MALE";
    ELEMENT_TLA["DRZEWKO_PODWUJNE"] = "DRZEWKO_PODWUJNE";
    ELEMENT_TLA["GRZYBEK"] = "GRZYBEK";
    ELEMENT_TLA["KRZACZKI"] = "KRZACZKI";
    ELEMENT_TLA["WODA"] = "WODA";
    ELEMENT_TLA["PALMA_DUZA"] = "PALMA_DUZA";
    ELEMENT_TLA["PALMA_MALA"] = "PALMA_MALA";
    ELEMENT_TLA["WROTA"] = "WROTA";
    ELEMENT_TLA["ZAMEK"] = "ZAMEK";
})(ELEMENT_TLA || (ELEMENT_TLA = {}));
class ElementTla extends Prostokat {
    /**
     * Tworzy element tla
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     * @param {ELEMENT_TLA} typ
     */
    constructor(pozycja, wysokosc, szerokosc, typ) {
        //Konstruktor nadrzędny
        super(pozycja, wysokosc, szerokosc);
        this._animacja = null;
        this.grafika = undefined;
        //W zależności od typu albo grafika albo animacja
        switch (typ) {
            case 'CHMURKA_DUZA':
                this.grafika = GRAFIKI.elementyTla.chmurkaDuza;
                break;
            case 'CHMURKA_MALA':
                this.grafika = GRAFIKI.elementyTla.chmurkaMala;
                break;
            case 'DRZEWKO_DUZE':
                this.grafika = GRAFIKI.elementyTla.drzewkoDuze;
                break;
            case 'DRZEWKO_MALE':
                this.grafika = GRAFIKI.elementyTla.drzewkoDuze;
                break;
            case 'DRZEWKO_PODWUJNE':
                this.grafika = GRAFIKI.elementyTla.drzewkoPodwujne;
                break;
            case 'GRZYBEK':
                this.grafika = GRAFIKI.elementyTla.grzybek;
                break;
            case 'PALMA_DUZA':
                this.grafika = GRAFIKI.elementyTla.palmaDuza;
                break;
            case 'PALMA_MALA':
                this.grafika = GRAFIKI.elementyTla.palmaMala;
                break;
            case 'KRZACZKI':
                this._animacja = new AnimatorPoklatkowy(GRAFIKI.elementyTla.krzaczki, 8);
                break;
            case 'WODA':
                this._animacja = new AnimatorPoklatkowy(GRAFIKI.elementyTla.woda, 8);
                break;
            case 'WROTA':
                this.grafika = GRAFIKI.elementyTla.wrota;
                break;
            case 'ZAMEK':
                this.grafika = GRAFIKI.elementyTla.zamek;
                break;
            default:
                throw new Error(`Nieznany typ elementu tła: ${typ}`);
        }
        this.typ = typ;
    }
    /**
     * Aktualizuje grafike w przypadku animowanych elementów tla
     */
    aktualizujGrafike() {
        //Jeżeli nie ma animacji -> wychodze
        if (this._animacja === null)
            return;
        //Aktualizuje
        let grafika = this._animacja.nastepnaKlatka();
        if (grafika !== null)
            this.grafika = grafika;
        else {
            this._animacja.cofnijDoPoczatku();
            this.grafika = this._animacja.nastepnaKlatka() || new Image;
        }
    }
}
