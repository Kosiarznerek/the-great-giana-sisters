//Dotępne typy uciekających nagród (wypadają z niespodzianek)
enum UCIEKAJACE_NAGRODY {
    BOMBA = 'BOMBA',
    BUDZIK = 'BUDZIK',
    KROPELKA = 'KROPELKA',
    LIZACZEK = 'LIZACZEK',
    PODWOJNA_BLYSKAWICA = 'PODWOJNA_BLYSKAWICA',
    POJEDYNCZA_BLYSKAWICA = 'POJEDYNCZA_BLYSKAWICA',
    TRUSKAWKA = 'TRUSKAWKA',
    PILKA = 'PILKA'
}

//Klasa UciekajacejNagrody
class UciekajacaNagroda extends SamoporuszajacyProstokat {

    public readonly typ: UCIEKAJACE_NAGRODY;
    private _animacja: null | {
        lewo: AnimatorPoklatkowy,
        prawo: AnimatorPoklatkowy
    };

    /**
     * Tworzy chodzącą nagrode, która wypada z niespodzianki
     * @param {Wektor} pozycja
     * @param {UCIEKAJACE_NAGRODY} typ
     */
    constructor(pozycja: Wektor, typ: UCIEKAJACE_NAGRODY) {
        //W zależności od typu uciekającej nagrody odpowiednie ustawienia dla samoporuszajacego sie prostokata
        switch (typ) {
            case 'BOMBA':
                super(pozycja, new Wektor(1, 0), 3, 32, 32, false, GRAFIKI.ukryteWPrzeszkodach.uciekajaceNagrody.bomba);
                this._animacja = null;
                break;
            case 'BUDZIK':
                super(pozycja, new Wektor(1, 0), 3, 32, 32, false, GRAFIKI.ukryteWPrzeszkodach.uciekajaceNagrody.budzik);
                this._animacja = null;
                break;
            case 'KROPELKA':
                super(pozycja, new Wektor(1, 0), 3, 32, 32, false, GRAFIKI.ukryteWPrzeszkodach.uciekajaceNagrody.kropelka);
                this._animacja = null;
                break;
            case 'LIZACZEK':
                super(pozycja, new Wektor(1, 0), 3, 32, 32, false, GRAFIKI.ukryteWPrzeszkodach.uciekajaceNagrody.lizaczek);
                this._animacja = null;
                break;
            case 'PODWOJNA_BLYSKAWICA':
                super(pozycja, new Wektor(1, 0), 3, 32, 32, false, GRAFIKI.ukryteWPrzeszkodach.uciekajaceNagrody.podwojnaBlyskawica);
                this._animacja = null;
                break;
            case 'POJEDYNCZA_BLYSKAWICA':
                super(pozycja, new Wektor(1, 0), 3, 32, 32, false, GRAFIKI.ukryteWPrzeszkodach.uciekajaceNagrody.pojedynczaBlyskawica);
                this._animacja = null;
                break;
            case 'TRUSKAWKA':
                super(pozycja, new Wektor(1, 0), 3, 32, 32, false, GRAFIKI.ukryteWPrzeszkodach.uciekajaceNagrody.truskawka);
                this._animacja = null;
                break;
            case 'PILKA':
                super(pozycja, new Wektor(1, 0), 3, 32, 32, false);
                this._animacja = {
                    lewo: new AnimatorPoklatkowy(GRAFIKI.ukryteWPrzeszkodach.uciekajaceNagrody.pilka.lewo, 2),
                    prawo: new AnimatorPoklatkowy(GRAFIKI.ukryteWPrzeszkodach.uciekajaceNagrody.pilka.prawo, 2)
                };
                break;
            default:
                throw new Error(`Typ ${typ} nie istnieje`);
        }
        this.typ = typ;
    }

    /**
     * Aktualizacja grafiki
     */
    public aktualizujGrafike(): void {
        //Tylko jeżeli jest animacja
        if (this._animacja === null) return;

        //Jeżeli porusza się w prawo
        if (this.obecnyKierunek.x > 0) {
            let grafika: HTMLImageElement | null = this._animacja.prawo.nastepnaKlatka();
            if (grafika !== null) this.grafika = grafika;
            else {
                this._animacja.prawo.cofnijDoPoczatku();
                this.grafika = this._animacja.prawo.nastepnaKlatka() || new Image;
            }
            this._animacja.lewo.cofnijDoPoczatku();
        }

        //Jeżeli porusza się w lewo
        else {
            let grafika: HTMLImageElement | null = this._animacja.lewo.nastepnaKlatka();
            if (grafika !== null) this.grafika = grafika;
            else {
                this._animacja.lewo.cofnijDoPoczatku();
                this.grafika = this._animacja.lewo.nastepnaKlatka() || new Image;
            }
            this._animacja.prawo.cofnijDoPoczatku();
        }
    }
}