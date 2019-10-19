"use strict";
class Kulka extends Kolo {
    /**
     * Tworzy obiekt piłka
     * @param {Wektor} pozycja
     */
    constructor(pozycja) {
        super(pozycja, Kulka.Promien, GRAFIKI.kulka);
        this._kierunek = new Wektor(0, 0); //Kierunek w jakim obecnie zmierza kulka
        this._predkosc = 0; //Prędkość z jaką porusza się kulka
        this._przeszkody = []; //Przeszkody od jakich będzie odbijać się kulka
        this._poprzedniaPozycja = pozycja.klonuj(); //Potrzebna by kulka odbijała się
        //Niszczenie kulki
        this._animacja = new AnimatorPoklatkowy(GRAFIKI.niszczenieKulki, 2);
        this._zniszczona = false;
    }
    /**
     * Promien kulki
     * @returns {number}
     */
    static get Promien() {
        return 7;
    }
    /**
     * Rzuca kulke
     * @param {Wektor} kierunek Kierunek w jakim kulka zostanie rzucona
     * @param {number} predkosc Prędkość lotu kulki ('stała wartość')
     * @param {Prostokat[]} przeszkody Przeszkody od jakich będzie się odbijała piła
     */
    rzucUnikajac(kierunek, predkosc, przeszkody) {
        this._kierunek = kierunek.klonuj().normalizuj();
        this._predkosc = predkosc;
        this._przeszkody = przeszkody;
    }
    /**
     * Aktualizuje pozycje kulki
     */
    aktualizujPozycje() {
        //Jeżeli zniszczona -> nic nie robie
        if (this._zniszczona)
            return;
        //Obliczam przesuniecie kulki
        this._kierunek.ustawDlugosc(this._predkosc);
        //Przesuwam dwa razy o połowe kierunku
        //(naprawia problem niepoprawnego odbijania się kulki od poruszających się obiektów)
        for (let i = 0; i < 2; i++) {
            //Aktualizacja poprzedniej pozycji
            this._poprzedniaPozycja = this.pozycja.klonuj();
            //Aktualizacja pozycji
            Kolizja.AktualizujKoloUnikajac(this, Wektor.PodzielSkalarnie(this._kierunek, 2), this._przeszkody);
            //Pozycja bez zmian, trzeba się odbić
            if (this._poprzedniaPozycja.y === this.pozycja.y)
                this._kierunek.y *= -1;
            if (this._poprzedniaPozycja.x === this.pozycja.x)
                this._kierunek.x *= -1;
        }
    }
    /**
     * Aktualizuje grafike kulki
     */
    aktualizujGrafike() {
        //Jeżeli została zniszczona -> animacja
        if (this._zniszczona) {
            let grafika = this._animacja.nastepnaKlatka();
            if (grafika)
                this.grafika = grafika;
        }
        else
            this.grafika = GRAFIKI.kulka;
    }
    /**
     * Niszczy kulke
     */
    zniszcz() {
        if (!this._zniszczona)
            this._zniszczona = true;
    }
    /**
     * Sprawdza czy kulka jest całkowicie zniszczona
     * I jest zaznaczona jako zniszczona i animacja niszczenia została zakończona
     * @returns {boolean}
     */
    get calkowicieZniszczona() {
        return this._zniszczona && this._animacja.zakonczona;
    }
    /**
     * Sprawdza czy kulka jest 'zaznaczona' jako zniszczona
     * @returns {boolean}
     */
    get zniszczona() {
        return this._zniszczona;
    }
    /**
     * Sprawdza czy kulka uderzyla w jakiąś przeszkode
     * @param {Prostokat} obiekt Przeszkoda do sprawdzenia
     * @returns {boolean}
     */
    uderzyla(obiekt) {
        let k1 = new Kolo(this._poprzedniaPozycja.klonuj(), this.promien);
        let k2 = new Kolo(this.pozycja.klonuj().dodaj(this._kierunek), this.promien);
        return Kolizja.KoloProstokat(this, obiekt) ||
            Kolizja.KoloProstokat(k1, obiekt) ||
            Kolizja.KoloProstokat(k2, obiekt);
    }
}
