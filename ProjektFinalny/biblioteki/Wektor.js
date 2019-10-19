"use strict";
class Wektor {
    /**
     * Tworzy obiekt wektor
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Klonuje obiekt o tych samych współrzędnych
     * @returns {Wektor}
     */
    klonuj() {
        return new Wektor(this.x, this.y);
    }
    /**
     * Dodaje do bierzącego wektora drugi
     * @param {Wektor} wektor
     * @returns {Wektor}
     */
    dodaj(wektor) {
        this.x += wektor.x;
        this.y += wektor.y;
        return this;
    }
    static Dodaj(wektor1, wektor2) {
        let w = new Wektor(0, 0);
        w.x = wektor1.x + wektor2.x;
        w.y = wektor1.y + wektor2.y;
        return w;
    }
    /**
     * Odejmuje dwa wektory
     * @param {Wektor} wektor
     * @returns {Wektor}
     */
    odejmij(wektor) {
        this.x -= wektor.x;
        this.y -= wektor.y;
        return this;
    }
    static Odejmij(wektor1, wektor2) {
        let w = new Wektor(0, 0);
        w.x = wektor1.x - wektor2.x;
        w.y = wektor1.y - wektor2.y;
        return w;
    }
    /**
     * Mnoży sklalarnie bierzący wektor
     * @param {number} liczba
     * @returns {Wektor}
     */
    pomnozSkalarnie(liczba) {
        this.x *= liczba;
        this.y *= liczba;
        return this;
    }
    static PomnozSkalarnie(wektor, liczba) {
        let w = wektor.klonuj();
        w.x *= liczba;
        w.y *= liczba;
        return w;
    }
    /**
     * Dzieli skalarnie bierzący wektor
     * @param {number} liczba
     * @returns {Wektor}
     */
    podzielSkalarnie(liczba) {
        this.x /= liczba;
        this.y /= liczba;
        return this;
    }
    static PodzielSkalarnie(wektor, liczba) {
        let w = wektor.klonuj();
        w.x /= liczba;
        w.y /= liczba;
        return w;
    }
    /**
     * Ustawia długość wektora na wskazaną
     * @param {number} length
     * @returns {Wektor}
     */
    ustawDlugosc(length) {
        //Normalizacja
        let len = Math.sqrt(this.x * this.x + this.y * this.y) || 1;
        this.x /= len;
        this.y /= len;
        //Mnożenie
        this.x *= length;
        this.y *= length;
        return this;
    }
    static UstawDlugosc(wektor, length) {
        //Kopia
        let wekt = wektor.klonuj();
        //Normalizacja
        let len = Math.sqrt(wekt.x * wekt.x + wekt.y * wekt.y) || 1;
        wekt.x /= len;
        wekt.y /= len;
        //Mnożenie
        wekt.x *= length;
        wekt.y *= length;
        return wekt;
    }
    /**
     * Ustawia długość wektora na 1
     */
    normalizuj() {
        let dlugosc = Math.sqrt(this.x * this.x + this.y * this.y) || 1;
        this.x /= dlugosc;
        this.y /= dlugosc;
        return this;
    }
    static Normalizuj(wektor) {
        let wek = wektor.klonuj();
        let dlugosc = Math.sqrt(wek.x * wek.x + wek.y * wek.y) || 1;
        wek.x /= dlugosc;
        wek.y /= dlugosc;
        return wek;
    }
    /**
     * Oblicza odgleglosc do podanego wektoru
     * @param {Wektor} v
     * @returns {number}
     */
    odglegloscDo(v) {
        let dx = this.x - v.x, dy = this.y - v.y;
        let dsq = dx * dx + dy * dy;
        return Math.sqrt(dsq);
    }
    static OdlegloscPomiedzy(v1, v2) {
        let dx = v1.x - v2.x, dy = v1.y - v2.y;
        let dsq = dx * dx + dy * dy;
        return Math.sqrt(dsq);
    }
    /**
     * Sprawdza czy wektory są takie same
     * @param {Wektor} v
     * @returns {boolean}
     */
    takiSam(v) {
        return this.x === v.x && this.y === v.y;
    }
    static TakieSame(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y;
    }
}
