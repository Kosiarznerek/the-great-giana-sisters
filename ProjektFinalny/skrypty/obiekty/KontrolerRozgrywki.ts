class Statystyki {
    private _maxPoziomow: number;

    /**
     * Tworzy statystyki
     * @param {number} maxPoziomow
     */
    constructor(maxPoziomow: number) {
        this._maxPoziomow = maxPoziomow;
        this.resetuj();
    }

    private _punkty: number;

    /**
     * Punkty
     */
    public get punkty(): number {
        return this._punkty;
    }

    public set punkty(value: number) {
        if (value < 0) value = 0;
        if (value > 999999) value = 999999;
        this._punkty = value;
    }

    private _bonusy: number;

    /**
     * Bonusy
     */
    public get bonusy(): number {
        return this._bonusy;
    }

    public set bonusy(value: number) {
        if (value < 0) value = 0;
        if (value > 99) value = 99;
        this._bonusy = value;
    }

    private _zycia: number;

    /**
     * Zycia
     */
    public get zycia(): number {
        return this._zycia;
    }

    public set zycia(value: number) {
        if (value < 0) value = 0;
        if (value > 99) value = 99;
        this._zycia = value;
    }

    private _poziom: number;

    /**
     * Poziom
     */
    public get poziom(): number {
        return this._poziom;
    }

    public set poziom(value: number) {
        if (value < 1) value = 1;
        if (value > this._maxPoziomow) value = 1;
        this._poziom = value;
    }

    private _czas: number;

    /**
     * Czas w milisekundach
     */
    public get czas(): number {
        return this._czas;
    }

    public set czas(value: number) {
        //<0, 59min 59sek>
        if (value < 0) value = 0;
        if (value > 3599000) value = 3599000;
        this._czas = value;
    }

    /**
     * Resetuje statystyki
     */
    public resetuj(): void {
        this._punkty = 0;
        this._bonusy = 0;
        this._zycia = 3;
        this._poziom = 1;
        this._czas = 99 * 1000;
    }
}

class KontrolerRozgrywki {

    public uprawnienia: {
        rzutKulka: boolean,
        detonacjaBomby: boolean,
        wielokrotnaDetonacja: boolean,
        niesmiertelnosc: boolean
    };
    public statystyki: Statystyki;
    private _pozycja: Wektor;
    private _wysokosc: number;
    private _szerokosc: number;
    private _czasPoprzedni: Date;

    /**
     * Tworzy kontroler rozgrywki
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     * @param {number} maxPoziom
     */
    constructor(pozycja: Wektor, wysokosc: number, szerokosc: number, maxPoziom: number) {
        //Zapisuje wymiary
        this._pozycja = pozycja.klonuj();
        this._wysokosc = wysokosc;
        this._szerokosc = szerokosc;

        //Resetuje statystyki
        this.statystyki = new Statystyki(maxPoziom);
        this.resetuj();
    }

    public get czas(): number {
        return this.statystyki.czas;
    }

    public set czas(v: number) {
        this.statystyki.czas = v;
        this._czasPoprzedni = new Date();
    }

    /**
     * Zwraca najlepszy uzyskany winik
     * @returns {number | null}
     * @private
     */
    private get _najlepsyWynik(): number | null {
        //Pobieram
        const najlepszy: string | null = localStorage.getItem('najlepszy');

        //Zwracam
        return najlepszy !== null ? parseInt(najlepszy) : null;
    }

    /**
     * Resetuje wszystkie dane
     */
    public resetuj(): void {

        //Uprawnienia jakie posiada gracz
        this.uprawnienia = {
            rzutKulka: false,
            detonacjaBomby: false,
            wielokrotnaDetonacja: false,
            niesmiertelnosc: false
        };

        //Statystyki gracza
        this.statystyki.resetuj();

        //Poprzedni czas
        this._czasPoprzedni = new Date();
    }

    /**
     * Aktualizuje czas
     */
    public aktualizujCzas(): void {
        this.statystyki.czas -= Math.abs(new Date().valueOf() - this._czasPoprzedni.valueOf());
        this._czasPoprzedni = new Date();
    }

    /**
     * Rysuje statystyki na canvasie
     * @param {CanvasRenderingContext2D} ctx
     */
    public rysujStatystyki(ctx: CanvasRenderingContext2D): void {
        //Ustawienia czcionki
        ctx.font = `${this._wysokosc / 2}px PressStart2P`;
        ctx.fillStyle = '#fafa8b';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';

        //Szerokość jednego 'box-a'
        const szerokosc: number = this._szerokosc / 5;

        //Punkty
        ctx.fillText('PUNKTY', 1 * szerokosc - szerokosc / 2, 0);
        ctx.fillText(`${this.statystyki.punkty}`.padStart(6, '0'), 1 * szerokosc - szerokosc / 2, this._wysokosc / 2);

        //Bonusy
        ctx.fillText('BONUSY', 2 * szerokosc - szerokosc / 2, 0);
        ctx.fillText(`${this.statystyki.bonusy}`.padStart(2, '0'), 2 * szerokosc - szerokosc / 2, this._wysokosc / 2);

        //Życia
        ctx.fillText('ZYCIA', 3 * szerokosc - szerokosc / 2, 0);
        ctx.fillText(`${this.statystyki.zycia}`.padStart(2, '0'), 3 * szerokosc - szerokosc / 2, this._wysokosc / 2);

        //Poziom
        ctx.fillText('POZIOM', 4 * szerokosc - szerokosc / 2, 0);
        ctx.fillText(`${this.statystyki.poziom}`.padStart(2, '0'), 4 * szerokosc - szerokosc / 2, this._wysokosc / 2);

        //Czas
        const sek: string = `${new Date(this.statystyki.czas).getSeconds()}`.padStart(2, '0');
        const min: string = `${new Date(this.statystyki.czas).getMinutes()}`.padStart(2, '0');
        ctx.fillText('CZAS', 5 * szerokosc - szerokosc / 2, 0);
        ctx.fillText(`${min}:${sek}`, 5 * szerokosc - szerokosc / 2, this._wysokosc / 2);
    }

    /**
     * Rysuje baner poziomu
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} wysokosc
     * @param {number} szerokosc
     */
    public async rysujBanerPoziomu(ctx: CanvasRenderingContext2D, wysokosc: number, szerokosc: number) {
        //Restore
        ctx.restore();

        //Tło
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, szerokosc, wysokosc);

        //Ustawienia czcionki
        const rCzcionki: number = 24;
        ctx.font = `${rCzcionki}px PressStart2P`;
        ctx.fillStyle = '#fafa8b';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';

        //Napis
        ctx.fillText('THE GREAT GIANA SISTERS', szerokosc / 2, wysokosc / 2 - rCzcionki / 2);
        ctx.fillText(`POZIOM ${this.statystyki.poziom}`, szerokosc / 2, wysokosc / 2 + rCzcionki / 2);

        //Sleep na X[ms]
        await Sleep(4000);
    }

    /**
     * Przelicza pozostały czas na dodatkowe punkty dla gracza
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} wysokosc
     * @param {number} szerokosc
     * @returns {Promise<void>}
     */
    public rysujPunktyZaCzas(ctx: CanvasRenderingContext2D, wysokosc: number, szerokosc: number): Promise<void> {
        //Restore
        ctx.restore();

        //Promise
        return new Promise<void>(resolve => {
            //Pętla animacji
            const animacja = async () => {
                //Tło
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, szerokosc, wysokosc);

                //Ustawienia czcionki
                const rCzcionki: number = 24;
                ctx.font = `${rCzcionki}px PressStart2P`;
                ctx.fillStyle = '#fafa8b';
                ctx.textBaseline = 'top';
                ctx.textAlign = 'center';

                //Napis
                ctx.fillText(
                    'DODATEK ZA POZOSTALY CZAS',
                    szerokosc / 2,
                    wysokosc / 2 - rCzcionki / 2
                );
                ctx.fillText(
                    `CZAS ${this.statystyki.czas} -> PUNKTY ${this.statystyki.punkty}`,
                    szerokosc / 2,
                    wysokosc / 2 + rCzcionki / 2
                );

                //Przeliczam pozostały czas na punkty
                this.statystyki.czas -= 100;
                if (this.statystyki.czas !== 0) this.statystyki.punkty += 1;

                //Jeżeli jeszcze mam z czego odejmować
                if (this.statystyki.czas !== 0) requestAnimationFrame(animacja);
                else resolve();
            };

            //Uruchamiam animacje
            animacja();
        });
    }

    /**
     * Rysuje podsumowanie punktacji po zakończonej rozgrywce
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} wysokosc
     * @param {number} szerokosc
     * @returns {Promise<void>}
     */
    public async rysujPodsumowanieRozgrywki(ctx: CanvasRenderingContext2D, wysokosc: number, szerokosc: number): Promise<void> {
        //Zapisuje wynik
        this._zapiszPunkty(this.statystyki.punkty);

        //Restore
        ctx.restore();

        //Tło
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, szerokosc, wysokosc);

        //Ustawienia czcionki
        const rCzcionki: number = 24;
        ctx.font = `${rCzcionki}px PressStart2P`;
        ctx.fillStyle = '#fafa8b';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';

        //Napis
        ctx.fillText(
            `ZAKONCZONO Z WYNIKIEM ${this.statystyki.punkty}`,
            szerokosc / 2,
            wysokosc / 2 - rCzcionki / 2
        );
        ctx.fillText(
            `NAJLEPSZY WYNIK ${this._najlepsyWynik ? this._najlepsyWynik : 'BRAK'}`,
            szerokosc / 2,
            wysokosc / 2 + rCzcionki / 2
        );

        //Sleep na X[ms]
        await Sleep(4000);
    }

    /**
     * Zapisuje w localstorage wynik jeżeli jest lepszy od poprzedniego
     * @param {number} punky Punkty do zapisania
     */
    private _zapiszPunkty(punky: number): void {
        //Klucz do wyniku
        const klucz = 'najlepszy';

        //Pobieram obecnie zapisany wynik
        const obecny: string | null = localStorage.getItem(klucz);

        //Jeżeli nie ma żadnego to zapisuje
        if (obecny === null) localStorage.setItem(klucz, punky.toString());

        //Jeżeli jest to porównuje i zapisuje lepszy
        else if (parseInt(obecny) < punky) localStorage.setItem(klucz, punky.toString());
    }
}
