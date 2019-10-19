"use strict";
class Winda {
    /**
     * Tworzy winde dla gracza
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     */
    constructor(pozycja, wysokosc, szerokosc) {
        //Tworzenie stelarza i platformy (platforma na środku stelarza)
        this._stelarz = new Prostokat(pozycja, wysokosc, 40, GRAFIKI.winda.stelarz);
        this._platforma = new Prostokat(this._stelarz.srodek, 20, szerokosc, GRAFIKI.winda.platforma);
        this._platforma.pozycja.x -= Math.abs(this._platforma.pozycja.x - this._platforma.srodek.x);
        //Kierunek w jakim obecnie porusza się platforma windy
        this._kierunek = new Wektor(0, -1);
        //Prędkość poruszania się platformy
        this._predkosc = 1;
    }
    /**
     * Getter dla stelarza
     */
    get stelarz() {
        return this._stelarz.klonuj();
    }
    /**
     * Getter dla platformy
     */
    get platforma() {
        return this._platforma.klonuj();
    }
    /**
     * Rysuje winde na canvasie
     * @param {CanvasRenderingContext2D} ctx
     */
    rysuj(ctx) {
        this._stelarz.rysuj(ctx);
        this._platforma.rysuj(ctx);
    }
    /**
     * Aktualizuje pozycje platformy
     * @param {Prostokat[]} urzytkownicy Tablica obiektów, które korzystają z windy
     */
    aktualiujPlatforme(urzytkownicy) {
        //Jeżeli już nie mogę poruszać się w kierunku, w którym obecnie się poruszam -> zmieniam kierunek
        if (Wektor.Dodaj(this._platforma.pozycja, Wektor.PomnozSkalarnie(this._kierunek, this._predkosc)).y <= this._stelarz.pozycja.y ||
            Wektor.Dodaj(this._platforma.pozycja, Wektor.PomnozSkalarnie(this._kierunek, this._predkosc)).y + this._platforma.wysokosc >= this._stelarz.pozycja.y + this._stelarz.wysokosc) {
            this._kierunek.pomnozSkalarnie(-1);
        }
        //Elementy które obecnie są na platformie
        const naPlatormie = urzytkownicy.filter(value => Kolizja.ProstokatNaProstokacie(value, this._platforma));
        //Aktualizacja pozycji platformy
        if (this._kierunek.y > 0)
            Kolizja.AktualizujProstokatUnikajac(this._platforma, Wektor.PomnozSkalarnie(this._kierunek, this._predkosc), urzytkownicy);
        else
            this._platforma.pozycja.dodaj(Wektor.PomnozSkalarnie(this._kierunek, this._predkosc));
        //To co było na platformie pozostaje na niej
        naPlatormie.forEach(value => value.pozycja.y = this._platforma.pozycja.y - value.wysokosc);
    }
}
