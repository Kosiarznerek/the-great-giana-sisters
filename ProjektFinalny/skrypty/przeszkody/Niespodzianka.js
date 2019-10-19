"use strict";
class Niespodzianka extends Prostokat {
    /**
     * Tworzy obiekt niespodzianka
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     * @param {UCIEKAJACE_NAGRODY | "DIAMENCIK"} zawartosc
     */
    constructor(pozycja, wysokosc, szerokosc, zawartosc) {
        super(pozycja, wysokosc, szerokosc, new Image);
        this._zamienionaWStal = false; //Trzyma informacje czy niespodzianka została już zamieniona w stal
        this._doZamianyWStal = false; //Trzyma informacje czy trzeba 'niespodzianke' zaminic w stal
        this._animacje = {
            glowna: new AnimatorPoklatkowy(GRAFIKI.przeszkody.niespodziankaAnimacja, 7),
            mruganie: new AnimatorPoklatkowy(GRAFIKI.przeszkody.mruganieNiespodzianki, 5)
        };
        this._zawartosc = zawartosc; //Zawartość, która wypadnie po uderzeniu
        this._diamencik = null; //zostanie stworzony, gdy zawartościa jest diamencik i ktoś uderzył w niespodzianke
    }
    /**
     * Rysuje przeszkode na canvasie [NADPISANE PROSTOKAT]
     * @param {CanvasRenderingContext2D} ctx
     */
    rysuj(ctx) {
        if (this._diamencik !== null)
            Prostokat.Rysuj(this._diamencik, ctx);
        Prostokat.Rysuj(this, ctx);
    }
    /**
     * Aktualizuje obecnie wyswietlana grafike
     */
    aktualizujGrafike() {
        //Jeżeli została zamieniona w stal
        if (this._zamienionaWStal)
            this.grafika = GRAFIKI.przeszkody.statyczne.stalowyKlocek;
        //Jeżeli nie została zamieniona w stal, i nie trzeba jej zamieniać -> animacja główna
        if (!this._zamienionaWStal && !this._doZamianyWStal) {
            let grafika = this._animacje.glowna.nastepnaKlatka();
            if (grafika !== null)
                this.grafika = grafika;
            else {
                this._animacje.glowna.cofnijDoPoczatku();
                this.grafika = this._animacje.glowna.nastepnaKlatka() || new Image;
            }
        }
        //Jeżeli nie została zamieniona w stal, ale trzeba ją zamienić -> animacja mrugania
        if (!this._zamienionaWStal && this._doZamianyWStal) {
            let grafika = this._animacje.mruganie.nastepnaKlatka();
            if (grafika !== null)
                this.grafika = grafika;
            else {
                this._zamienionaWStal = true;
                this._doZamianyWStal = false;
            }
        }
    }
    /**
     * Zamienia niespodzianke w stal i zwraca to co z niej wyskoczyło (nagroda)
     * @returns {UciekajacaNagroda | "DIAMENCIK" | null}
     */
    zamienWStal() {
        //Jeżeli już została zamieniona lub już jest oznaczona do zamiany -> do widzenia
        if (this._zamienionaWStal || this._doZamianyWStal)
            return null;
        //Jeżeli nie -> ustawiam, że trzeba zamienić
        this._doZamianyWStal = true;
        //Wyskakuje bonusik
        switch (this._zawartosc) {
            case 'DIAMENCIK':
                this._diamencik = new Diamencik(new Wektor(this.pozycja.x + this.szerokosc / 2, this.pozycja.y + this.wysokosc / 2));
                this._diamencik.podskocz();
                return 'DIAMENCIK';
            default:
                return new UciekajacaNagroda(new Wektor(this.pozycja.x, this.pozycja.y - this.wysokosc), this._zawartosc);
        }
    }
    /**
     * Aktualizacja tylko w przypadku gdy jest zawartością jest diamencik
     */
    aktualizujUkryte() {
        if (this._diamencik === null)
            return;
        this._diamencik.aktualizujPozycje();
    }
}
