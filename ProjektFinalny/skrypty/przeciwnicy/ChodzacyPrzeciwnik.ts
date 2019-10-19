//Rodzaje dostępnych przeciwników
enum CHODZAY_PRZECIWNICY {
    KRAB = 'KRAB',
    OSMIORNICA = 'OSMIORNICA',
    PANCERNIK = 'PANCERNIK',
    PSZCZOLA = 'PSZCZOLA',
    SOWA = 'SOWA',
    ZLOWIK = 'ZLOWIK',
    GIBEK = 'GIBEK'
}

//Klasa ChodzacyPrzeciwnik
class ChodzacyPrzeciwnik extends SamoporuszajacyProstokat {

    public readonly typ: CHODZAY_PRZECIWNICY;
    private _zywy: boolean;
    private _animacjaChodzenia: {
        lewo: AnimatorPoklatkowy,
        prawo: AnimatorPoklatkowy
    };
    private _zabityGrafika: HTMLImageElement | null;

    /**
     * Tworzy chodzącego przeciwnika
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     * @param {CHODZAY_PRZECIWNICY} typ
     */
    constructor(pozycja: Wektor, wysokosc: number, szerokosc: number, typ: CHODZAY_PRZECIWNICY) {
        //W zależności od typu przeciwnika odpowiednie dane są uzupełniane
        switch (typ) {
            case 'KRAB':
                super(pozycja, new Wektor(-1, 0), 2, wysokosc, szerokosc, true);
                this._animacjaChodzenia = {
                    lewo: new AnimatorPoklatkowy(GRAFIKI.przeciwnicy.krab.chodzenie.lewo, 8),
                    prawo: new AnimatorPoklatkowy(GRAFIKI.przeciwnicy.krab.chodzenie.prawo, 8)
                };
                this._zabityGrafika = GRAFIKI.przeciwnicy.krab.zabity;
                break;
            case 'OSMIORNICA':
                super(pozycja, new Wektor(-1, 0), 2, wysokosc, szerokosc, true);
                this._animacjaChodzenia = {
                    lewo: new AnimatorPoklatkowy(GRAFIKI.przeciwnicy.osmiornica.chodzenie.lewo, 10),
                    prawo: new AnimatorPoklatkowy(GRAFIKI.przeciwnicy.osmiornica.chodzenie.prawo, 10)
                };
                this._zabityGrafika = GRAFIKI.przeciwnicy.osmiornica.zabita;
                break;
            case 'PANCERNIK':
                super(pozycja, new Wektor(-1, 0), 2, wysokosc, szerokosc, true);
                this._animacjaChodzenia = {
                    lewo: new AnimatorPoklatkowy(GRAFIKI.przeciwnicy.pancernik.chodzenie, 10),
                    prawo: new AnimatorPoklatkowy(GRAFIKI.przeciwnicy.pancernik.chodzenie, 10)
                };
                this._zabityGrafika = GRAFIKI.przeciwnicy.pancernik.zabity;
                break;
            case 'PSZCZOLA':
                super(pozycja, new Wektor(-1, 0), 2, wysokosc, szerokosc, false);
                this._animacjaChodzenia = {
                    lewo: new AnimatorPoklatkowy(GRAFIKI.przeciwnicy.pszczola.latanie.lewo, 12),
                    prawo: new AnimatorPoklatkowy(GRAFIKI.przeciwnicy.pszczola.latanie.prawo, 12)
                };
                this._zabityGrafika = GRAFIKI.przeciwnicy.pszczola.zabita;
                this.grawitacja = false;
                break;
            case 'SOWA':
                super(pozycja, new Wektor(-1, 0), 2, wysokosc, szerokosc, true);
                this._animacjaChodzenia = {
                    lewo: new AnimatorPoklatkowy(GRAFIKI.przeciwnicy.sowa.chodzenie, 15),
                    prawo: new AnimatorPoklatkowy(GRAFIKI.przeciwnicy.sowa.chodzenie, 15)
                };
                this._zabityGrafika = GRAFIKI.przeciwnicy.sowa.zabita;
                break;
            case 'ZLOWIK':
                super(pozycja, new Wektor(-1, 0), 3, wysokosc, szerokosc, true);
                this._animacjaChodzenia = {
                    lewo: new AnimatorPoklatkowy(GRAFIKI.przeciwnicy.zlowik.chodzenie.lewo, 6),
                    prawo: new AnimatorPoklatkowy(GRAFIKI.przeciwnicy.zlowik.chodzenie.prawo, 6)
                };
                this._zabityGrafika = GRAFIKI.przeciwnicy.zlowik.zabity;
                break;
            case 'GIBEK':
                super(pozycja, new Wektor(-1, 0), 2, wysokosc, szerokosc, true);
                this._animacjaChodzenia = {
                    lewo: new AnimatorPoklatkowy(GRAFIKI.przeciwnicy.gibek.lewo, 4),
                    prawo: new AnimatorPoklatkowy(GRAFIKI.przeciwnicy.gibek.prawo, 4)
                };
                this._zabityGrafika = null;
                break;
            default:
                throw new Error(`Nieznany typ chodzącego przeciwnika: ${typ}`);
        }
        this.typ = typ;
        this._zywy = true;
    }

    /**
     * Sprawdza czy przeciwnik jeszcze żyje
     * @returns {boolean}
     */
    public get jestZywy(): boolean {
        return this._zywy;
    }

    /**
     * Zabija przeciwnika
     */
    public zabij(): void {
        //Jeżeli jest to przeciwnik, którego nie da się zabić to go nie zabijam
        if (this.typ === 'GIBEK') return;

        //Jeżeli już zabity to nic nie robie
        if (!this._zywy) return;

        //Zabijam i zatrzymuje go w miejscu
        this._zywy = false;
        this.grawitacja = true;
        this.zatrzymaj();
    }

    /**
     * Aktuaizuje ubecnie wyswietlana grafike
     */
    public aktualizujGrafike(): void {
        //Jeżeli jest zabity i jest jakaś grafika zabitego to ja wyświetlam
        if (!this._zywy && this._zabityGrafika != null) {
            this.grafika = this._zabityGrafika;
            return;
        }

        //Jeżeli żyje to w zależności od tego, w którą strone się porzusza odpowiednia animacja
        if (this.obecnyKierunek.x > 0) {//prawo
            let grafika: HTMLImageElement | null = this._animacjaChodzenia.prawo.nastepnaKlatka();
            if (grafika !== null) this.grafika = grafika;
            else {
                this._animacjaChodzenia.prawo.cofnijDoPoczatku();
                this.grafika = this._animacjaChodzenia.prawo.nastepnaKlatka() || new Image;
            }
            this._animacjaChodzenia.lewo.cofnijDoPoczatku();
        } else {//lewo
            let grafika: HTMLImageElement | null = this._animacjaChodzenia.lewo.nastepnaKlatka();
            if (grafika !== null) this.grafika = grafika;
            else {
                this._animacjaChodzenia.lewo.cofnijDoPoczatku();
                this.grafika = this._animacjaChodzenia.lewo.nastepnaKlatka() || new Image;
            }
            this._animacjaChodzenia.prawo.cofnijDoPoczatku();
        }
    }
}
