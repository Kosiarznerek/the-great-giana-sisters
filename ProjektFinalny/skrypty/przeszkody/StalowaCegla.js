"use strict";
class StalowaCegla extends Prostokat {
    /**
     * Tworzy cegłe, która po uderzeniu przez gracza zamienia się w stal
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     */
    constructor(pozycja, wysokosc, szerokosc) {
        super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.czystaCegla);
        this._zycia = 3; //tyle razy musi zostać uderzona od spodu, by zamieniła się w stal
        this._uderzona = false; //jeżeli prawda -> animacja mrugania jest odgrywana
        //Odgrywana za każdym, kiedy cegła zostanie uderzona od spodu
        this._animacjaMrugania = new AnimatorPoklatkowy(GRAFIKI.przeszkody.mruganieCegly, 4);
        //diamencik ukryty w przeszkodzie -> 'wyskakuje' z przeszkody po uderzeniu
        this._diamencik = new Diamencik(new Wektor(pozycja.x + this.szerokosc / 2, pozycja.y + this.wysokosc / 2));
    }
    /**
     * Rysuje przeszkode na canvasie [NADPISANE PROSTOKAT]
     * @param {CanvasRenderingContext2D} ctx
     */
    rysuj(ctx) {
        Prostokat.Rysuj(this._diamencik, ctx);
        Prostokat.Rysuj(this, ctx);
    }
    /**
     * Wywołana, jeśli stalowa cegła została 'uderzona' od spodu
     * @returns {boolean} Prawda jeżeli wypadł diamencik
     */
    uderzOdSpodu() {
        //Jeżeli już została uderzona wcześniej (animacja mrugania nadal jest wyświetlana) -> wychodze
        if (this._uderzona)
            return false;
        //Jeżeli ilość żyć <=0 (jest już stala) to po uderzeniu nic sie nie dzieje
        if (this._zycia <= 0)
            return false;
        //Zaznaczam do uderzenia (by wyświetliła się animacja mrugania)
        this._uderzona = true;
        //'Wypada' diamencik
        this._diamencik.podskocz();
        return true;
    }
    /**
     * Aktualizuje stan ukrytego diamenciku w przeszkodzie
     */
    aktualizujUkryte() {
        this._diamencik.aktualizujPozycje();
    }
    /**
     * Aktualizuje obecnie wyświetlaną grafikę
     */
    aktualizujGrafike() {
        //Jeżeli nie ma już żyć to znaczy, że jest czystą stalą
        if (this._zycia <= 0)
            this.grafika = GRAFIKI.przeszkody.statyczne.stalowyKlocek;
        //Jeżeli ilość żyć > 0 i została uderzona -> animacja mrugania
        if (this._zycia > 0 && this._uderzona) {
            let grafika = this._animacjaMrugania.nastepnaKlatka();
            if (grafika !== null)
                this.grafika = grafika;
            else {
                this._uderzona = false;
                this._zycia--;
                this._animacjaMrugania.cofnijDoPoczatku();
            }
        }
        //Jeżeli ilość żyć > 0 i nie zostala uderzona (animacja nie jest odgrygana) -> grafika cegły
        if (this._zycia > 0 && !this._uderzona)
            this.grafika = GRAFIKI.przeszkody.czystaCegla;
    }
}
