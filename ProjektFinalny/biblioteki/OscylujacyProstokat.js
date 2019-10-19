"use strict";
class OscylujacyProstokat extends Prostokat {
    /**
     * Tworzy prostokąt który, samodzielnie skacze w górę i w dół
     * @param {Wektor} pozycja Pozycja od jakiej ma się rozpocząć skok
     * @param {number} wysokosc Szerokość obiektu
     * @param {number} szerokosc Wysokość obiektu
     * @param {number} szybkosc Szybkosc wykonywanie ruchu <0, PI/2>
     * @param {number} maxOdchylenie Maksymalna odchylenie wględem pozycji początkowej
     * @param {Wektor} kOsc Kierunek oscylacji
     * @param {HTMLImageElement} grafika
     */
    constructor(pozycja, wysokosc, szerokosc, szybkosc, maxOdchylenie, kOsc, grafika) {
        super(pozycja, wysokosc, szerokosc, grafika);
        this._kierunekOscylacji = kOsc.klonuj().normalizuj();
        this._srodekOscylacji = pozycja.klonuj().dodaj(Wektor.PomnozSkalarnie(this._kierunekOscylacji, maxOdchylenie / 2));
        this._szybkosc = szybkosc;
        this._maxOdchylenie = maxOdchylenie;
    }
    /**
     * Zwraca obecny kieruek w jakim porusza się prostokat
     * @returns {Wektor}
     */
    get obecnyKierunek() {
        return this._kierunekOscylacji.klonuj();
    }
    /**
     * Aktualizuje bierzącą pozycje
     */
    aktualizujPozycje() {
        //Aktualizacja pozycji
        this.pozycja.dodaj(Wektor.PomnozSkalarnie(this._kierunekOscylacji, this._szybkosc));
        //Jeżeli wychyliłem się za bardzo -> zmieniam kierunek
        if (this.pozycja.odglegloscDo(this._srodekOscylacji) >= this._maxOdchylenie / 2)
            this._kierunekOscylacji.pomnozSkalarnie(-1);
    }
}
