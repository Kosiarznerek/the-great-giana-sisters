//Dostępne w grze bloki
enum DOSTEPNE_BLOKI {
    //Statyczne przeszkody
    KOMIN_DUZY = 'KOMIN_DUZY',
    KOMIN_MALY = 'KOMIN_MALY',
    STALOWY_KLOCEK = 'STALOWY_KLOCEK',
    PLATFORMA = 'PLATFORMA',
    BRUKOWY_KLOCEK = 'BRUKOWY_KLOCEK',
    KAMIENNY_LEWY = 'KAMIENNY_LEWY',
    KAMIENNY_CENTRALNY = 'KAMIENNY_CENTRALNY',
    KAMIENNY_PRAWY = 'KAMIENNY_PRAWY',

    //Zwykle przeszkody
    NIESPODZIANKA = 'NIESPODZIANKA',
    STALOWA_CEGLA = 'STALOWA_CEGLA',
    ZNIKAJACA_CEGLA = 'ZNIKAJACA_CEGLA',
    ZNIKAJACY_SEGMENT = 'ZNIKAJACY_SEGMENT',

    //Przeciwnicy
    GIBEK = 'GIBEK',
    KRAB = 'KRAB',
    OSMIORNICA = 'OSMIORNICA',
    PANCERNIK = 'PANCERNIK',
    PSZCZOLA = 'PSZCZOLA',
    SOWA = 'SOWA',
    ZLOWIK = 'ZLOWIK',
    SLIME = 'SLIME',
    RYBKA = 'RYBKA',

    //Bossy
    BOSS_PAJAK = 'BOSS_PAJAK',
    BOSS_SMOK = 'BOSS_SMOK',

    //Winda
    WINDA = 'WINDA',

    //Elementy tła
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
    ZAMEK = 'ZAMEK',

    //Diamenty do zbierania
    DIAMENT = 'DIAMENT',
}

class Blok {

    public pozycja: Punkt;
    public readonly wysokosc: number;
    public readonly szerokosc: number;
    public readonly typ: DOSTEPNE_BLOKI;
    public readonly grafika: HTMLImageElement;

    /**
     * Tworzy blok gry
     * @param {Punkt} pozycja
     * @param {DOSTEPNE_BLOKI} typ
     */
    constructor(pozycja: Punkt, typ: DOSTEPNE_BLOKI) {
        this.pozycja = pozycja.klonuj();
        this.typ = typ;
        this.grafika = GRAFIKI[typ];

        //W zależności od typu odpowiednie wartosci
        switch (this.typ) {
            //Statyczne przeszkody
            case 'KOMIN_DUZY':
                this.wysokosc = 65;
                this.szerokosc = 65;
                break;
            case 'KOMIN_MALY':
                this.wysokosc = 32;
                this.szerokosc = 32;
                break;
            case 'STALOWY_KLOCEK':
                this.wysokosc = 32;
                this.szerokosc = 32;
                break;
            case 'PLATFORMA':
                this.wysokosc = 24;
                this.szerokosc = 72;
                break;
            case 'BRUKOWY_KLOCEK':
                this.wysokosc = 32;
                this.szerokosc = 32;
                break;
            case 'KAMIENNY_LEWY':
                this.wysokosc = 48;
                this.szerokosc = 48;
                break;
            case 'KAMIENNY_CENTRALNY':
                this.wysokosc = 48;
                this.szerokosc = 48;
                break;
            case 'KAMIENNY_PRAWY':
                this.wysokosc = 48;
                this.szerokosc = 48;
                break;

            //Zwykle przeszkody
            case 'NIESPODZIANKA':
                this.wysokosc = 32;
                this.szerokosc = 32;
                break;
            case 'STALOWA_CEGLA':
                this.wysokosc = 32;
                this.szerokosc = 32;
                break;
            case 'ZNIKAJACA_CEGLA':
                this.wysokosc = 32;
                this.szerokosc = 32;
                break;
            case 'ZNIKAJACY_SEGMENT':
                this.wysokosc = 10;
                this.szerokosc = 32;
                break;

            //Przeciwnicy
            case 'GIBEK':
                this.wysokosc = 32;
                this.szerokosc = 32;
                break;
            case 'KRAB':
                this.wysokosc = 32;
                this.szerokosc = 32;
                break;
            case 'OSMIORNICA':
                this.wysokosc = 32;
                this.szerokosc = 32;
                break;
            case 'PANCERNIK':
                this.wysokosc = 32;
                this.szerokosc = 32;
                break;
            case 'PSZCZOLA':
                this.wysokosc = 32;
                this.szerokosc = 32;
                break;
            case 'SOWA':
                this.wysokosc = 32;
                this.szerokosc = 32;
                break;
            case 'ZLOWIK':
                this.wysokosc = 24;
                this.szerokosc = 24;
                break;
            case 'SLIME':
                this.wysokosc = 32;
                this.szerokosc = 32;
                break;
            case 'RYBKA':
                this.wysokosc = 32;
                this.szerokosc = 32;
                break;

            //Bossy
            case 'BOSS_PAJAK':
                this.wysokosc = 38;
                this.szerokosc = 78;
                break;
            case 'BOSS_SMOK':
                this.wysokosc = 31;
                this.szerokosc = 108;
                break;

            //Elementy tla
            case 'CHMURKA_DUZA':
                this.wysokosc = 22;
                this.szerokosc = 60;
                break;
            case 'CHMURKA_MALA':
                this.wysokosc = 22;
                this.szerokosc = 48;
                break;
            case 'DRZEWKO_DUZE':
                this.wysokosc = 33;
                this.szerokosc = 120;
                break;
            case 'DRZEWKO_MALE':
                this.wysokosc = 35;
                this.szerokosc = 48;
                break;
            case 'DRZEWKO_PODWUJNE':
                this.wysokosc = 35;
                this.szerokosc = 60;
                break;
            case 'GRZYBEK':
                this.wysokosc = 36;
                this.szerokosc = 48;
                break;
            case 'KRZACZKI':
                this.wysokosc = 22;
                this.szerokosc = 40;
                break;
            case 'WODA':
                this.wysokosc = 32;
                this.szerokosc = 32;
                break;
            case 'PALMA_DUZA':
                this.wysokosc = 60;
                this.szerokosc = 36;
                break;
            case 'PALMA_MALA':
                this.wysokosc = 36;
                this.szerokosc = 36;
                break;
            case 'WROTA':
                this.wysokosc = 69;
                this.szerokosc = 84;
                break;
            case 'ZAMEK':
                this.wysokosc = 202;
                this.szerokosc = 240;
                break;

            //Winda
            case 'WINDA':
                this.wysokosc = 244;
                this.szerokosc = 130;
                break;

            //Diamenty do zbierania
            case 'DIAMENT':
                this.wysokosc = 32;
                this.szerokosc = 32;
                break;
        }

    }

    /**
     * Rysuje blok na canvasie
     * @param {CanvasRenderingContext2D} ctx
     */
    public rysuj(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.grafika, this.pozycja.x, this.pozycja.y, this.szerokosc, this.wysokosc);
    }

    /**
     * Klonuje blok
     * @returns {Blok}
     */
    public klonuj(): Blok {
        return new Blok(this.pozycja.klonuj(), this.typ);
    }
}