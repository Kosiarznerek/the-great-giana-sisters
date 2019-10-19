class SamoporuszajacyProstokat extends Prostokat {

    private _kierunek: Wektor;
    private _predkosc: number;
    private _unikajSpadania: boolean;
    private _poprzedniaPozycja: Wektor;
    private _zatrzymany: boolean;
    private _grawitacjaWlaczona: boolean;

    /**
     * Tworzy obiekt, który jest w stanie samodzielnie poruszać się na lewo i prawo
     * odbijając się od przeszkód
     * @param {Wektor} pozycja Pozycja startowa obiektu
     * @param {Wektor} kierunek Kierunek w którym ma zacząść zmierzać (x:-1,y:0)|(x:1,y:0)
     * @param {number} predkosc Prędkość z jaką ma się poruszać
     * @param {number} wysokosc Wysokość (wymiar)
     * @param {number} szerokosc Szerokość (wymiar)
     * @param {boolean} unikajSpadania Czy prostokąt ma się tak poruszać na prawo i lewo by nie spaść?
     * @param {HTMLImageElement} grafika
     */
    constructor(pozycja: Wektor, kierunek: Wektor, predkosc: number, wysokosc: number, szerokosc: number, unikajSpadania: boolean, grafika?: HTMLImageElement) {
        super(pozycja, wysokosc, szerokosc, grafika);

        this._kierunek = kierunek.klonuj().normalizuj();
        this._kierunek.y = 0;//Ma być tylko prawo lewo, więc y nie może być ustawiony
        this._predkosc = predkosc;
        this._unikajSpadania = unikajSpadania;
        this._grawitacja = new Wektor(0, 4);//Siła, która sprawia, że spada z wysokości
        this._poprzedniaPozycja = pozycja.klonuj();//Potrzebne by wykryć jak obiekt 'utknie'
        this._zatrzymany = false;//sprawia ze prostokat przestaje sie poruszać
        this._grawitacjaWlaczona = true;//Czy grawitacja ma być włączona (domyślnie tak)
    }

    private _grawitacja: Wektor;

    /**
     * Włącza/Wyłącza działanie grawitacji
     * @param {boolean} val
     */
    public set grawitacja(val: boolean) {
        this._grawitacjaWlaczona = val;
    }

    /**
     * Zwraca kieunek w jakim obecnie porusza się prostokąt
     * @returns {Wektor}
     */
    public get obecnyKierunek(): Wektor {
        return this._kierunek.klonuj();
    }

    /**
     * Ustawia kietunek w jakim porusza się obiekt
     * @param {Wektor} v
     */
    public set obecnyKierunek(v: Wektor): void {
        this._kierunek = v.klonuj().normalizuj();
    }

    /**
     * Prostokąt przestaje się ruszać
     */
    public zatrzymaj(): void {
        this._zatrzymany = true;
    }

    /**
     * Aktualizuje pozycje obiektu
     * @param {Prostokat[]} przeszkody Przeszkody, od których 'odbija' się obiekt
     */
    public aktualizujPozycje(przeszkody: Prostokat[]): void {
        //Obliczam pozycje nad ziemia
        const wysokosc: number = Kolizja.WysokoscProstokatProstokatNPM(this, przeszkody);

        //Aktualizuje poprzednia pozycje
        this._poprzedniaPozycja = this.pozycja.klonuj();

        //Wektor o jaki sie przemieszcze
        let wekt: Wektor = new Wektor(0, 0);

        //Dzialanie grawitacji
        if (this._grawitacjaWlaczona) {
            if (wysokosc > 0) this._grawitacja.pomnozSkalarnie(1.1);//Jeżeli spadam to chce spadać coraz szybciej
            else this._grawitacja.y = 4;//Jeżeli nie to wszystko normalnie
            wekt.dodaj(this._grawitacja);
        }

        //Jeżeli mam się poruszać tak by nie spaść
        if (this._unikajSpadania && !this._zatrzymany) {
            //'wychylam' się w kierunku w którym ide, by 'sprawdzic' czy spadne robiąc krok dalej
            this.pozycja.x += this._kierunek.x * this.szerokosc + this._kierunek.x * Number.MIN_VALUE + Wektor.PomnozSkalarnie(this._kierunek, this._predkosc).x;
            //Jeżeli 'spadne' (ale tak, że sie 'zabije') to zmieniam kierunek
            if (Kolizja.WysokoscProstokatProstokatNPM(this, przeszkody) === Infinity) this._kierunek.pomnozSkalarnie(-1);
            //tak czy siak przywracam pozycje, która była bo i tak zmieniłem ją tylko by sprawdzić czy spadne
            this.pozycja = this._poprzedniaPozycja.klonuj();
        }

        //Jeżeli nie jestem zatrzymany to poruszam sie
        if (!this._zatrzymany) wekt.dodaj(Wektor.PomnozSkalarnie(this._kierunek, this._predkosc));

        //Aktualizuje pozycje
        Kolizja.AktualizujProstokatUnikajac(this, wekt, przeszkody);

        //Jeżeli poprzednia pozycja taka jak obecna to znaczy, że gdzieś utkołem i musze zmienić kierunek
        if (Wektor.TakieSame(this._poprzedniaPozycja, this.pozycja)) this._kierunek.pomnozSkalarnie(-1);
    }
}
