"use strict";
class Statystyki {
    /**
     * Tworzy statystyki
     * @param {number} maxPoziomow
     */
    constructor(maxPoziomow) {
        this._maxPoziomow = maxPoziomow;
        this.resetuj();
    }
    /**
     * Punkty
     */
    get punkty() {
        return this._punkty;
    }
    set punkty(value) {
        if (value < 0)
            value = 0;
        if (value > 999999)
            value = 999999;
        this._punkty = value;
    }
    /**
     * Bonusy
     */
    get bonusy() {
        return this._bonusy;
    }
    set bonusy(value) {
        if (value < 0)
            value = 0;
        if (value > 99)
            value = 99;
        this._bonusy = value;
    }
    /**
     * Zycia
     */
    get zycia() {
        return this._zycia;
    }
    set zycia(value) {
        if (value < 0)
            value = 0;
        if (value > 99)
            value = 99;
        this._zycia = value;
    }
    /**
     * Poziom
     */
    get poziom() {
        return this._poziom;
    }
    set poziom(value) {
        if (value < 1)
            value = 1;
        if (value > this._maxPoziomow)
            value = 1;
        this._poziom = value;
    }
    /**
     * Czas w milisekundach
     */
    get czas() {
        return this._czas;
    }
    set czas(value) {
        //<0, 59min 59sek>
        if (value < 0)
            value = 0;
        if (value > 3599000)
            value = 3599000;
        this._czas = value;
    }
    /**
     * Resetuje statystyki
     */
    resetuj() {
        this._punkty = 0;
        this._bonusy = 0;
        this._zycia = 3;
        this._poziom = 1;
        this._czas = 99 * 1000;
    }
}
class KontrolerRozgrywki {
    /**
     * Tworzy kontroler rozgrywki
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     * @param {number} maxPoziom
     */
    constructor(pozycja, wysokosc, szerokosc, maxPoziom) {
        //Zapisuje wymiary
        this._pozycja = pozycja.klonuj();
        this._wysokosc = wysokosc;
        this._szerokosc = szerokosc;
        //Resetuje statystyki
        this.statystyki = new Statystyki(maxPoziom);
        this.resetuj();
    }
    /**
     * Resetuje wszystkie dane
     */
    resetuj() {
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
    aktualizujCzas() {
        this.statystyki.czas -= Math.abs(new Date().valueOf() - this._czasPoprzedni.valueOf());
        this._czasPoprzedni = new Date();
    }
    set czas(v) {
        this.statystyki.czas = v;
        this._czasPoprzedni = new Date();
    }
    get czas() {
        return this.statystyki.czas;
    }
    /**
     * Rysuje statystyki na canvasie
     * @param {CanvasRenderingContext2D} ctx
     */
    rysujStatystyki(ctx) {
        //Ustawienia czcionki
        ctx.font = `${this._wysokosc / 2}px PressStart2P`;
        ctx.fillStyle = '#fafa8b';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        //Szerokość jednego 'box-a'
        const szerokosc = this._szerokosc / 5;
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
        const sek = `${new Date(this.statystyki.czas).getSeconds()}`.padStart(2, '0');
        const min = `${new Date(this.statystyki.czas).getMinutes()}`.padStart(2, '0');
        ctx.fillText('CZAS', 5 * szerokosc - szerokosc / 2, 0);
        ctx.fillText(`${min}:${sek}`, 5 * szerokosc - szerokosc / 2, this._wysokosc / 2);
    }
    /**
     * Rysuje baner poziomu
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} wysokosc
     * @param {number} szerokosc
     */
    async rysujBanerPoziomu(ctx, wysokosc, szerokosc) {
        //Restore
        ctx.restore();
        //Tło
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, szerokosc, wysokosc);
        //Ustawienia czcionki
        const rCzcionki = 24;
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
    rysujPunktyZaCzas(ctx, wysokosc, szerokosc) {
        //Restore
        ctx.restore();
        //Promise
        return new Promise(resolve => {
            //Pętla animacji
            const animacja = async () => {
                //Tło
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, szerokosc, wysokosc);
                //Ustawienia czcionki
                const rCzcionki = 24;
                ctx.font = `${rCzcionki}px PressStart2P`;
                ctx.fillStyle = '#fafa8b';
                ctx.textBaseline = 'top';
                ctx.textAlign = 'center';
                //Napis
                ctx.fillText('DODATEK ZA POZOSTALY CZAS', szerokosc / 2, wysokosc / 2 - rCzcionki / 2);
                ctx.fillText(`CZAS ${this.statystyki.czas} -> PUNKTY ${this.statystyki.punkty}`, szerokosc / 2, wysokosc / 2 + rCzcionki / 2);
                //Przeliczam pozostały czas na punkty
                this.statystyki.czas -= 100;
                if (this.statystyki.czas !== 0)
                    this.statystyki.punkty += 1;
                //Jeżeli jeszcze mam z czego odejmować
                if (this.statystyki.czas !== 0)
                    requestAnimationFrame(animacja);
                else
                    resolve();
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
    async rysujPodsumowanieRozgrywki(ctx, wysokosc, szerokosc) {
        //Zapisuje wynik
        this._zapiszPunkty(this.statystyki.punkty);
        //Restore
        ctx.restore();
        //Tło
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, szerokosc, wysokosc);
        //Ustawienia czcionki
        const rCzcionki = 24;
        ctx.font = `${rCzcionki}px PressStart2P`;
        ctx.fillStyle = '#fafa8b';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        //Napis
        ctx.fillText(`ZAKONCZONO Z WYNIKIEM ${this.statystyki.punkty}`, szerokosc / 2, wysokosc / 2 - rCzcionki / 2);
        ctx.fillText(`NAJLEPSZY WYNIK ${this._najlepsyWynik ? this._najlepsyWynik : 'BRAK'}`, szerokosc / 2, wysokosc / 2 + rCzcionki / 2);
        //Sleep na X[ms]
        await Sleep(4000);
    }
    /**
     * Zapisuje w localstorage wynik jeżeli jest lepszy od poprzedniego
     * @param {number} punky Punkty do zapisania
     */
    _zapiszPunkty(punky) {
        //Klucz do wyniku
        const klucz = 'najlepszy';
        //Pobieram obecnie zapisany wynik
        const obecny = localStorage.getItem(klucz);
        //Jeżeli nie ma żadnego to zapisuje
        if (obecny === null)
            localStorage.setItem(klucz, punky.toString());
        else if (parseInt(obecny) < punky)
            localStorage.setItem(klucz, punky.toString());
    }
    /**
     * Zwraca najlepszy uzyskany winik
     * @returns {number | null}
     * @private
     */
    get _najlepsyWynik() {
        //Pobieram
        const najlepszy = localStorage.getItem('najlepszy');
        //Zwracam
        return najlepszy !== null ? parseInt(najlepszy) : null;
    }
}
