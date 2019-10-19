class ZnikajacaCegla extends Prostokat {

    public zniszczona: boolean;
    private _doZniszczenia: boolean;
    private _animacja: AnimatorPoklatkowy;

    /**
     * Tworzy znikającą cegłe
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     */
    constructor(pozycja: Wektor, wysokosc: number, szerokosc: number) {
        super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.czystaCegla);

        this.zniszczona = false; //Zawiera informacje czy cegła została zniszczona czy nie
        this._doZniszczenia = false;

        this._animacja = new AnimatorPoklatkowy(GRAFIKI.przeszkody.znikanieCegly, 5);
    }

    /**
     * Sprawia, że cegła zaczyna znikać
     */
    public zniszcz(): void {
        //Jeżeli już została zniszczona lub jest już przygotowana do zniszczenia to nic nie robie
        if (this.zniszczona || this._doZniszczenia) return;

        //Cegła zostaje ustawiona do zniszczenia
        this._doZniszczenia = true;
    }

    /**
     * Aktualizacja obecnie wyświetlanej grafiki znikającej cegły
     */
    public aktualizujGrafike(): void {
        //Jeżeli cegła nie została zniszczona i nie jest ustawiona do zniszczenia -> zwykły obrazek
        if (!this.zniszczona && !this._doZniszczenia) this.grafika = GRAFIKI.przeszkody.czystaCegla;

        //Jeżeli nie została zniszczona, ale trzeba ja zniszczyc -> animacja
        if (!this.zniszczona && this._doZniszczenia) {
            let grafika: HTMLImageElement | null = this._animacja.nastepnaKlatka();
            if (grafika !== null) this.grafika = grafika;
            else {//Brak dostępnych klatek animacji znaczy, że przeszkoda została zniszczona
                this.zniszczona = true;
                this._doZniszczenia = false;
            }
        }

        //Jeżeli już została zniszczona, a animacja została w pełni odegrana -> wstawiam pusty obrazek
        if (this.zniszczona && !this._doZniszczenia) this.grafika = new Image;
    }
}