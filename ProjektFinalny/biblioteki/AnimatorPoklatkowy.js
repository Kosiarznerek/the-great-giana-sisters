"use strict";
class AnimatorPoklatkowy {
    /**
     * Tworzy obiekt, która ułatwia zarządzanie animacjami
     * @param {HTMLImageElement[]} klatkiAnimacji
     * @param {number} mnoznikAnimacji
     */
    constructor(klatkiAnimacji, mnoznikAnimacji) {
        //Tworze tablice animacji poklatkowej
        this._klatkiAnimacji = klatkiAnimacji.reduce((acc, val) => {
            return acc.concat(new Array(mnoznikAnimacji).fill(val));
        }, []);
        //Obecny indeks animacji
        this._indeks = 0;
    }
    /**
     * Zwraca natępną klatke, jakia powinna zostać wyświetlona, lub null, jeżeli animacja zakończyła się
     * @returns {HTMLImageElement | null}
     */
    nastepnaKlatka() {
        //Jeżeli indeks jest wiekszy od rozmiaru tablicy -> zwracam null
        if (this._indeks >= this._klatkiAnimacji.length)
            return null;
        //Zwiekszam indeks
        this._indeks++;
        //I zwracam klatke
        return this._klatkiAnimacji[this._indeks - 1];
    }
    /**
     * Zwraca liczbe klatek animacji
     * @returns {number}
     */
    iloscKlatek() {
        return this._klatkiAnimacji.length;
    }
    /**
     * Sprawdza czy animacja została zakonczona
     * @returns {boolean}
     */
    get zakonczona() {
        return this._indeks >= this._klatkiAnimacji.length;
    }
    /**
     * Pobiera klatke o wskazanym indeksie
     * @param {number} indeks
     * @returns {HTMLImageElement}
     */
    pobierzKlatke(indeks) {
        return this._klatkiAnimacji[indeks];
    }
    /**
     * Przewija animaje do początku
     */
    cofnijDoPoczatku() {
        this._indeks = 0;
    }
}
