class Poziom {

    //Obiekty gry
    public readonly gracz: Gracz;
    public przeszkody: {
        aktywne: Prostokat[], //łączy wszystkie tablice zawierające przeszkody po których można skakać w jedną
        statyczne: StatycznaPrzeszkoda[],//tablica ze statycznymi przeszkodami
        znikajace_cegly: ZnikajacaCegla[],//tablica ze znikajacymi ceglami (po uderzeniu rozpada sie i znika)
        niespodzianki: Niespodzianka[],//tablica z niespodziankami (po uderzeniu z nich wypadaja nagrody)
        stalowe_cegly: StalowaCegla[],//tablica ze stalowymi cegłami (po uderzeniu zamienia sie w stal)
        znikajace_segmenty: ZnikajacySegment[]//tablica ze znikającymi segmentami ('rozpadaja sie' pod stopami)
    };
    public uciekajace_nagrody: UciekajacaNagroda[];//tablica zawiera poruszające się nagrody, które wyskoczyły z niespodzianek
    public diamenty: Diament[];//tablica z diamentami do zbierania przez gracza
    public przeciwnicy: {
        chodzacy: {
            wszyscy: ChodzacyPrzeciwnik[],//łaczy wszystkie tablice z przeciwnikami (zywi i niezywi)
            zywi: ChodzacyPrzeciwnik[]//łaczy wszystkie tablice z przeciwnikami (tylko żywi)
        },
        skaczacy: SkaczacyPrzeciwnik[],
        pajaki: Pajak[], // tablica z pajakami
        smoki: Smok[]//tablica ze smokami
    };
    public elementyTla: ElementTla[];//tablica z elementami tla
    public windy: Winda[];//Tablica z windami

    //Pozostałe informacje
    public kolorTla: string;
    public punktStartowy: Wektor;
    public punktDocelowy: Wektor;
    public checkPointy: Wektor[];
    public readonly canvas: {
        wysokosc: number,
        szerokosc: number
    };
    public kadr: Prostokat;
    public readonly numerPoziomu: number;

    /**
     * Tworzy dane paziomu
     * @param {number} cWysokosc Wysokość canvasu
     * @param {number} cSzerokosc Szerokosc canvasu
     * @param {Gracz} gracz Gracz
     * @param {number} numerPoziomu
     */
    constructor(cWysokosc: number, cSzerokosc: number, gracz: Gracz, numerPoziomu: number) {
        //Obiekty gry
        this.gracz = gracz;
        this.przeszkody = {
            aktywne: [],
            statyczne: [],
            znikajace_cegly: [],
            niespodzianki: [],
            stalowe_cegly: [],
            znikajace_segmenty: []
        };
        this.uciekajace_nagrody = [];
        this.diamenty = [];
        this.przeciwnicy = {
            chodzacy: {
                wszyscy: [],
                zywi: []
            },
            skaczacy: [],
            pajaki: [],
            smoki: []
        };
        this.elementyTla = [];
        this.windy = [];

        //Pozostałe dane
        this.kolorTla = '';
        this.punktStartowy = new Wektor(0, 0);
        this.punktDocelowy = new Wektor(0, 0);
        this.checkPointy = [];
        this.canvas = {
            wysokosc: cWysokosc,
            szerokosc: cSzerokosc
        };
        this.kadr = new Prostokat(
            new Wektor(this.gracz.pozycja.x + this.gracz.szerokosc / 2 - this.canvas.szerokosc / 2, 0),
            this.canvas.wysokosc,
            this.canvas.szerokosc
        );
        this.numerPoziomu = numerPoziomu;
    }

    /**
     * Sprawdza czy gracz osiagnął punkt docelowy (czyli czy zakończył poziom)
     * @returns {boolean}
     */
    public get zakonczony(): boolean {
        return this.gracz.pozycja.x >= this.punktDocelowy.x;
    }

    /**
     * Aktualizuje pozycje kadru
     */
    public aktualizujKadr(): void {
        if (this.gracz.pozycja.x + this.gracz.szerokosc / 2 - this.canvas.szerokosc / 2 >= this.kadr.pozycja.x)
            this.kadr.pozycja.x = this.gracz.pozycja.x + this.gracz.szerokosc / 2 - this.canvas.szerokosc / 2;
    }

    /**
     * Aktualizuje aktywne przeszkody -> to właśnie po nich chodzi gracz i od nich odbija się piłka
     */
    public aktualizujAktywnePrzeszkody(): void {
        this.przeszkody.aktywne = new Array().concat(
            this.przeszkody.statyczne,
            this.przeszkody.znikajace_cegly,
            this.przeszkody.niespodzianki,
            this.przeszkody.stalowe_cegly,
            //Tylko częsci po których można jeszcze chodzić
            this.przeszkody.znikajace_segmenty.reduce((previousValue: Prostokat[], currentValue: ZnikajacySegment) => {
                return previousValue.concat(currentValue.przetrwaleCzesci())
            }, []),
            //Tylko platforma windy
            this.windy.map(value => value.platforma)
        );

        //Usuwam znikające cegły, które zostały zniszczone (znikły)
        this.przeszkody.znikajace_cegly = this.przeszkody.znikajace_cegly.filter(value => !value.zniszczona);
    }

    /**
     * Aktualizuje tablice żywych przeciwnikow
     */
    public aktualizujZywychPrzeciwnikow(): void {
        this.przeciwnicy.chodzacy.zywi = this.przeciwnicy.chodzacy.wszyscy.filter(value => value.jestZywy);
    }

    /**
     * Cofa gracza do najbliżesze checkpointu (za nim) lub do pozycji startowej, jeżeli żaden checkpoint nie został osiągnięty
     */
    public powrotNaCheckPoint(): void {
        //Gracz wraca na checkpoint
        this.gracz.pozycja = this.checkPointy.concat([this.punktStartowy])
            .filter(value => this.gracz.pozycja.x >= value.x)
            .reduce((previousValue: Wektor, currentValue: Wektor): Wektor => {
                return previousValue.odglegloscDo(this.gracz.pozycja) < currentValue.odglegloscDo(this.gracz.pozycja)
                    ? previousValue
                    : currentValue
            }, this.punktStartowy)
            .klonuj();

        //Aktualizacja kadru
        this.kadr.pozycja.x = this.gracz.pozycja.x + this.gracz.szerokosc / 2 - this.canvas.szerokosc / 2;
    }
}
