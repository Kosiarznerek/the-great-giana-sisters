//Dostępne elementy tła
enum ELEMENT_TLA {
    CHMURKA_DUZA = 'CHMURKA_DUZA',
    CHMURKA_MALA = 'CHMURKA_MALA',
    DRZEWKO_DUZE = 'DRZEWKO_DUZE',
    DRZEWKO_MALE = 'DRZEWKO_MALE',
    DRZEWKO_PODWUJNE = 'DRZEWKO_PODWUJNE',
    GRZYBEK = 'GRZYBEK',
    KRZACZKI = 'KRZACZKI',
    WODA = 'WODA',
    PALMA_DUZA = 'PALMA_DUZA',
    PALMA_MALA = 'PALMA_MALA',
    WROTA = 'WROTA',
    ZAMEK = 'ZAMEK'
}

class ElementTla extends Prostokat {

    public readonly typ: ELEMENT_TLA;
    private readonly _animacja: AnimatorPoklatkowy | null;

    /**
     * Tworzy element tla
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     * @param {ELEMENT_TLA} typ
     */
    constructor(pozycja: Wektor, wysokosc: number, szerokosc: number, typ: ELEMENT_TLA) {
        //Konstruktor nadrzędny
        super(pozycja, wysokosc, szerokosc);
        this._animacja = null;
        this.grafika = undefined;

        //W zależności od typu albo grafika albo animacja
        switch (typ) {
            case 'CHMURKA_DUZA':
                this.grafika = GRAFIKI.elementyTla.chmurkaDuza;
                break;
            case 'CHMURKA_MALA':
                this.grafika = GRAFIKI.elementyTla.chmurkaMala;
                break;
            case 'DRZEWKO_DUZE':
                this.grafika = GRAFIKI.elementyTla.drzewkoDuze;
                break;
            case 'DRZEWKO_MALE':
                this.grafika = GRAFIKI.elementyTla.drzewkoDuze;
                break;
            case 'DRZEWKO_PODWUJNE':
                this.grafika = GRAFIKI.elementyTla.drzewkoPodwujne;
                break;
            case 'GRZYBEK':
                this.grafika = GRAFIKI.elementyTla.grzybek;
                break;
            case 'PALMA_DUZA':
                this.grafika = GRAFIKI.elementyTla.palmaDuza;
                break;
            case 'PALMA_MALA':
                this.grafika = GRAFIKI.elementyTla.palmaMala;
                break;
            case 'KRZACZKI':
                this._animacja = new AnimatorPoklatkowy(GRAFIKI.elementyTla.krzaczki, 8);
                break;
            case 'WODA':
                this._animacja = new AnimatorPoklatkowy(GRAFIKI.elementyTla.woda, 8);
                break;
            case 'WROTA':
                this.grafika = GRAFIKI.elementyTla.wrota;
                break;
            case 'ZAMEK':
                this.grafika = GRAFIKI.elementyTla.zamek;
                break;
            default:
                throw new Error(`Nieznany typ elementu tła: ${typ}`);
        }
        this.typ = typ;
    }

    /**
     * Aktualizuje grafike w przypadku animowanych elementów tla
     */
    public aktualizujGrafike(): void {
        //Jeżeli nie ma animacji -> wychodze
        if (this._animacja === null) return;

        //Aktualizuje
        let grafika: HTMLImageElement | null = this._animacja.nastepnaKlatka();
        if (grafika !== null) this.grafika = grafika;
        else {
            this._animacja.cofnijDoPoczatku();
            this.grafika = this._animacja.nastepnaKlatka() || new Image;
        }
    }
}