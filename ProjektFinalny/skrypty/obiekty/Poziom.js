"use strict";
class Poziom {
    /**
     * Tworzy dane paziomu
     * @param {number} cWysokosc Wysokość canvasu
     * @param {number} cSzerokosc Szerokosc canvasu
     * @param {Gracz} gracz Gracz
     * @param {number} numerPoziomu
     */
    constructor(cWysokosc, cSzerokosc, gracz, numerPoziomu) {
        //Obiekty gry
        this.gracz = gracz;
        this.przeszkody = {
            aktywne: [],
            statyczne: [],
            znikajace_cegly: [],
            niespodzianki: [],
            stalowe_cegly: [],
            znikajace_segmenty: []
        };
        this.uciekajace_nagrody = [];
        this.diamenty = [];
        this.przeciwnicy = {
            chodzacy: {
                wszyscy: [],
                zywi: []
            },
            skaczacy: [],
            pajaki: [],
            smoki: []
        };
        this.elementyTla = [];
        this.windy = [];
        //Pozostałe dane
        this.kolorTla = '';
        this.punktStartowy = new Wektor(0, 0);
        this.punktDocelowy = new Wektor(0, 0);
        this.checkPointy = [];
        this.canvas = {
            wysokosc: cWysokosc,
            szerokosc: cSzerokosc
        };
        this.kadr = new Prostokat(new Wektor(this.gracz.pozycja.x + this.gracz.szerokosc / 2 - this.canvas.szerokosc / 2, 0), this.canvas.wysokosc, this.canvas.szerokosc);
        this.numerPoziomu = numerPoziomu;
    }
    /**
     * Aktualizuje pozycje kadru
     */
    aktualizujKadr() {
        if (this.gracz.pozycja.x + this.gracz.szerokosc / 2 - this.canvas.szerokosc / 2 >= this.kadr.pozycja.x)
            this.kadr.pozycja.x = this.gracz.pozycja.x + this.gracz.szerokosc / 2 - this.canvas.szerokosc / 2;
    }
    /**
     * Aktualizuje aktywne przeszkody -> to właśnie po nich chodzi gracz i od nich odbija się piłka
     */
    aktualizujAktywnePrzeszkody() {
        this.przeszkody.aktywne = new Array().concat(this.przeszkody.statyczne, this.przeszkody.znikajace_cegly, this.przeszkody.niespodzianki, this.przeszkody.stalowe_cegly, 
        //Tylko częsci po których można jeszcze chodzić
        this.przeszkody.znikajace_segmenty.reduce((previousValue, currentValue) => {
            return previousValue.concat(currentValue.przetrwaleCzesci());
        }, []), 
        //Tylko platforma windy
        this.windy.map(value => value.platforma));
        //Usuwam znikające cegły, które zostały zniszczone (znikły)
        this.przeszkody.znikajace_cegly = this.przeszkody.znikajace_cegly.filter(value => !value.zniszczona);
    }
    /**
     * Aktualizuje tablice żywych przeciwnikow
     */
    aktualizujZywychPrzeciwnikow() {
        this.przeciwnicy.chodzacy.zywi = this.przeciwnicy.chodzacy.wszyscy.filter(value => value.jestZywy);
    }
    /**
     * Cofa gracza do najbliżesze checkpointu (za nim) lub do pozycji startowej, jeżeli żaden checkpoint nie został osiągnięty
     */
    powrotNaCheckPoint() {
        //Gracz wraca na checkpoint
        this.gracz.pozycja = this.checkPointy.concat([this.punktStartowy])
            .filter(value => this.gracz.pozycja.x >= value.x)
            .reduce((previousValue, currentValue) => {
            return previousValue.odglegloscDo(this.gracz.pozycja) < currentValue.odglegloscDo(this.gracz.pozycja)
                ? previousValue
                : currentValue;
        }, this.punktStartowy)
            .klonuj();
        //Aktualizacja kadru
        this.kadr.pozycja.x = this.gracz.pozycja.x + this.gracz.szerokosc / 2 - this.canvas.szerokosc / 2;
    }
    /**
     * Sprawdza czy gracz osiagnął punkt docelowy (czyli czy zakończył poziom)
     * @returns {boolean}
     */
    get zakonczony() {
        return this.gracz.pozycja.x >= this.punktDocelowy.x;
    }
}
