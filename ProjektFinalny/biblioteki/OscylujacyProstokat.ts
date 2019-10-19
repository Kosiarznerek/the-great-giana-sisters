class OscylujacyProstokat extends Prostokat {

    private _srodekOscylacji: Wektor;
    private _szybkosc: number;
    private _maxOdchylenie: number;
    private _kierunekOscylacji: Wektor;

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
    constructor(pozycja: Wektor, wysokosc: number, szerokosc: number, szybkosc: number, maxOdchylenie: number, kOsc: Wektor, grafika?: HTMLImageElement) {
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
    public get obecnyKierunek(): Wektor {
        return this._kierunekOscylacji.klonuj();
    }

    /**
     * Aktualizuje bierzącą pozycje
     */
    public aktualizujPozycje(): void {
        //Aktualizacja pozycji
        this.pozycja.dodaj(Wektor.PomnozSkalarnie(this._kierunekOscylacji, this._szybkosc));

        //Jeżeli wychyliłem się za bardzo -> zmieniam kierunek
        if (this.pozycja.odglegloscDo(this._srodekOscylacji) >= this._maxOdchylenie / 2) this._kierunekOscylacji.pomnozSkalarnie(-1);
    }
}