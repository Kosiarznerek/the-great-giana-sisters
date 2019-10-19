"use strict";
class Diamencik extends Prostokat {
    /**
     * Tworzy diamencik (ten co wypada po uderzeniu w okreslone przeszkody od spodu)
     * @param {Wektor} pozycja
     */
    constructor(pozycja) {
        //Pozycja wględem środka
        pozycja.x -= 15 / 2;
        pozycja.y -= 15 / 2;
        super(pozycja, 15, 15, GRAFIKI.ukryteWPrzeszkodach.diamencik);
        this._poczatkowaPozycja = pozycja.klonuj(); //Początkowa pozycja (przez skokiem)
        this._wLocie = false; //zawiera informacje czy diamencik obecnie podskakuje (jest w locie)
        this._kierunek = new Wektor(0, -1); //Początkowo skierowany by 'wystrzelić' w góre
        this._predkosc = 7; //szybkość wznoszenia się lub opadania
        this._maxWysokosc = 90; //Maksymalna wysokość na jąką może podskoczyć diamencik
    }
    /**
     * Diamencik podskakuje
     */
    podskocz() {
        //Jeżeli jest w locie to podskok zaczyna się od nowa
        if (this._wLocie) {
            this.pozycja = this._poczatkowaPozycja.klonuj();
            this._kierunek = new Wektor(0, -1);
        }
        else
            this._wLocie = true;
    }
    /**
     * Aktualizuje pozycje diamenciku
     */
    aktualizujPozycje() {
        //Jak nie jest w locie to nie mam co aktualizować
        if (!this._wLocie)
            return;
        //Jeżeli nadal lece do góry a już nie powinieniem (bo osiągłąłem max pułap) zmieniam kierunek na dół
        if (this._kierunek.y < 0 && this._poczatkowaPozycja.odglegloscDo(this.pozycja) >= this._maxWysokosc) {
            this._kierunek.pomnozSkalarnie(-1);
        }
        //Aktualizuje pozycje
        const w = Wektor.PomnozSkalarnie(this._kierunek, this._predkosc);
        this.pozycja.dodaj(w);
        //Jeżeli nadal spadam w dół a wróciłem do pozycji początkowej -> koniec skoku
        if (this._kierunek.y > 0 && this._poczatkowaPozycja.odglegloscDo(this.pozycja) === 0) {
            this._wLocie = false;
            this._kierunek = new Wektor(0, -1);
        }
    }
}
