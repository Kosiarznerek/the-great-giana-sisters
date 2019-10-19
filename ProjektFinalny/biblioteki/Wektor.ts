class Wektor {

    public x: number;
    public y: number;

    /**
     * Tworzy obiekt wektor
     * @param {number} x
     * @param {number} y
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public static Dodaj(wektor1: Wektor, wektor2: Wektor): Wektor {
        let w: Wektor = new Wektor(0, 0);
        w.x = wektor1.x + wektor2.x;
        w.y = wektor1.y + wektor2.y;
        return w;
    }

    public static Odejmij(wektor1: Wektor, wektor2: Wektor): Wektor {
        let w: Wektor = new Wektor(0, 0);
        w.x = wektor1.x - wektor2.x;
        w.y = wektor1.y - wektor2.y;
        return w;
    }

    public static PomnozSkalarnie(wektor: Wektor, liczba: number): Wektor {
        let w: Wektor = wektor.klonuj();
        w.x *= liczba;
        w.y *= liczba;
        return w;
    }

    public static PodzielSkalarnie(wektor: Wektor, liczba: number): Wektor {
        let w: Wektor = wektor.klonuj();
        w.x /= liczba;
        w.y /= liczba;
        return w;
    }

    public static UstawDlugosc(wektor: Wektor, length: number): Wektor {
        //Kopia
        let wekt: Wektor = wektor.klonuj();

        //Normalizacja
        let len: number = Math.sqrt(wekt.x * wekt.x + wekt.y * wekt.y) || 1;
        wekt.x /= len;
        wekt.y /= len;

        //Mnożenie
        wekt.x *= length;
        wekt.y *= length;
        return wekt;
    }

    public static Normalizuj(wektor: Wektor): Wektor {
        let wek: Wektor = wektor.klonuj();
        let dlugosc: number = Math.sqrt(wek.x * wek.x + wek.y * wek.y) || 1;
        wek.x /= dlugosc;
        wek.y /= dlugosc;
        return wek;
    }

    public static OdlegloscPomiedzy(v1: Wektor, v2: Wektor): number {
        let dx: number = v1.x - v2.x, dy = v1.y - v2.y;
        let dsq: number = dx * dx + dy * dy;
        return Math.sqrt(dsq);
    }

    public static TakieSame(v1: Wektor, v2: Wektor): boolean {
        return v1.x === v2.x && v1.y === v2.y;
    }

    /**
     * Klonuje obiekt o tych samych współrzędnych
     * @returns {Wektor}
     */
    public klonuj(): Wektor {
        return new Wektor(this.x, this.y);
    }

    /**
     * Dodaje do bierzącego wektora drugi
     * @param {Wektor} wektor
     * @returns {Wektor}
     */
    public dodaj(wektor: Wektor): Wektor {
        this.x += wektor.x;
        this.y += wektor.y;
        return this;
    }

    /**
     * Odejmuje dwa wektory
     * @param {Wektor} wektor
     * @returns {Wektor}
     */
    public odejmij(wektor: Wektor): Wektor {
        this.x -= wektor.x;
        this.y -= wektor.y;
        return this;
    }

    /**
     * Mnoży sklalarnie bierzący wektor
     * @param {number} liczba
     * @returns {Wektor}
     */
    public pomnozSkalarnie(liczba: number): Wektor {
        this.x *= liczba;
        this.y *= liczba;
        return this;
    }

    /**
     * Dzieli skalarnie bierzący wektor
     * @param {number} liczba
     * @returns {Wektor}
     */
    public podzielSkalarnie(liczba: number): Wektor {
        this.x /= liczba;
        this.y /= liczba;
        return this;
    }

    /**
     * Ustawia długość wektora na wskazaną
     * @param {number} length
     * @returns {Wektor}
     */
    public ustawDlugosc(length: number): Wektor {
        //Normalizacja
        let len: number = Math.sqrt(this.x * this.x + this.y * this.y) || 1;
        this.x /= len;
        this.y /= len;

        //Mnożenie
        this.x *= length;
        this.y *= length;
        return this;
    }

    /**
     * Ustawia długość wektora na 1
     */
    public normalizuj(): Wektor {
        let dlugosc: number = Math.sqrt(this.x * this.x + this.y * this.y) || 1;
        this.x /= dlugosc;
        this.y /= dlugosc;
        return this;
    }

    /**
     * Oblicza odgleglosc do podanego wektoru
     * @param {Wektor} v
     * @returns {number}
     */
    public odglegloscDo(v: Wektor): number {
        let dx: number = this.x - v.x, dy = this.y - v.y;
        let dsq: number = dx * dx + dy * dy;
        return Math.sqrt(dsq);
    }

    /**
     * Sprawdza czy wektory są takie same
     * @param {Wektor} v
     * @returns {boolean}
     */
    public takiSam(v: Wektor): boolean {
        return this.x === v.x && this.y === v.y;
    }
}
