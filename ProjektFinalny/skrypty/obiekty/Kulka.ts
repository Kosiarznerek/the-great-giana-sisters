class Kulka extends Kolo {

    private _kierunek: Wektor;
    private _predkosc: number;
    private _przeszkody: Prostokat[];
    private _poprzedniaPozycja: Wektor;

    private _animacja: AnimatorPoklatkowy;

    /**
     * Tworzy obiekt piłka
     * @param {Wektor} pozycja
     */
    constructor(pozycja: Wektor) {
        super(pozycja, Kulka.Promien, GRAFIKI.kulka);

        this._kierunek = new Wektor(0, 0);//Kierunek w jakim obecnie zmierza kulka
        this._predkosc = 0;//Prędkość z jaką porusza się kulka
        this._przeszkody = [];//Przeszkody od jakich będzie odbijać się kulka
        this._poprzedniaPozycja = pozycja.klonuj();//Potrzebna by kulka odbijała się

        //Niszczenie kulki
        this._animacja = new AnimatorPoklatkowy(GRAFIKI.niszczenieKulki, 2);
        this._zniszczona = false;
    }

    /**
     * Promien kulki
     * @returns {number}
     */
    public static get Promien() {
        return 7;
    }

    private _zniszczona: boolean;

    /**
     * Sprawdza czy kulka jest 'zaznaczona' jako zniszczona
     * @returns {boolean}
     */
    public get zniszczona(): boolean {
        return this._zniszczona;
    }

    /**
     * Sprawdza czy kulka jest całkowicie zniszczona
     * I jest zaznaczona jako zniszczona i animacja niszczenia została zakończona
     * @returns {boolean}
     */
    public get calkowicieZniszczona(): boolean {
        return this._zniszczona && this._animacja.zakonczona
    }

    /**
     * Rzuca kulke
     * @param {Wektor} kierunek Kierunek w jakim kulka zostanie rzucona
     * @param {number} predkosc Prędkość lotu kulki ('stała wartość')
     * @param {Prostokat[]} przeszkody Przeszkody od jakich będzie się odbijała piła
     */
    public rzucUnikajac(kierunek: Wektor, predkosc: number, przeszkody: Prostokat[]): void {
        this._kierunek = kierunek.klonuj().normalizuj();
        this._predkosc = predkosc;
        this._przeszkody = przeszkody;
    }

    /**
     * Aktualizuje pozycje kulki
     */
    public aktualizujPozycje(): void {
        //Jeżeli zniszczona -> nic nie robie
        if (this._zniszczona) return;

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
            if (this._poprzedniaPozycja.y === this.pozycja.y) this._kierunek.y *= -1;
            if (this._poprzedniaPozycja.x === this.pozycja.x) this._kierunek.x *= -1;
        }
    }

    /**
     * Aktualizuje grafike kulki
     */
    public aktualizujGrafike(): void {
        //Jeżeli została zniszczona -> animacja
        if (this._zniszczona) {
            let grafika: HTMLImageElement | null = this._animacja.nastepnaKlatka();
            if (grafika) this.grafika = grafika;
        } else this.grafika = GRAFIKI.kulka;
    }

    /**
     * Niszczy kulke
     */
    public zniszcz(): void {
        if (!this._zniszczona) this._zniszczona = true;
    }

    /**
     * Sprawdza czy kulka uderzyla w jakiąś przeszkode
     * @param {Prostokat} obiekt Przeszkoda do sprawdzenia
     * @returns {boolean}
     */
    public uderzyla(obiekt: Prostokat): boolean {
        let k1: Kolo = new Kolo(this._poprzedniaPozycja.klonuj(), this.promien);
        let k2: Kolo = new Kolo(this.pozycja.klonuj().dodaj(this._kierunek), this.promien);
        return Kolizja.KoloProstokat(this, obiekt) ||
            Kolizja.KoloProstokat(k1, obiekt) ||
            Kolizja.KoloProstokat(k2, obiekt);
    }
}
