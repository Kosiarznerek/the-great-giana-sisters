class AnimatorPoklatkowy {

    private _klatkiAnimacji: HTMLImageElement[];
    private _indeks: number;

    /**
     * Tworzy obiekt, która ułatwia zarządzanie animacjami
     * @param {HTMLImageElement[]} klatkiAnimacji
     * @param {number} mnoznikAnimacji
     */
    constructor(klatkiAnimacji: HTMLImageElement[], mnoznikAnimacji: number) {

        //Tworze tablice animacji poklatkowej
        this._klatkiAnimacji = klatkiAnimacji.reduce((acc: HTMLImageElement[], val: HTMLImageElement) => {
            return acc.concat(new Array(mnoznikAnimacji).fill(val));
        }, []);

        //Obecny indeks animacji
        this._indeks = 0;
    }

    /**
     * Sprawdza czy animacja została zakonczona
     * @returns {boolean}
     */
    public get zakonczona(): boolean {
        return this._indeks >= this._klatkiAnimacji.length
    }

    /**
     * Zwraca natępną klatke, jakia powinna zostać wyświetlona, lub null, jeżeli animacja zakończyła się
     * @returns {HTMLImageElement | null}
     */
    public nastepnaKlatka(): HTMLImageElement | null {
        //Jeżeli indeks jest wiekszy od rozmiaru tablicy -> zwracam null
        if (this._indeks >= this._klatkiAnimacji.length) return null;

        //Zwiekszam indeks
        this._indeks++;

        //I zwracam klatke
        return this._klatkiAnimacji[this._indeks - 1];
    }

    /**
     * Zwraca liczbe klatek animacji
     * @returns {number}
     */
    public iloscKlatek(): number {
        return this._klatkiAnimacji.length;
    }

    /**
     * Pobiera klatke o wskazanym indeksie
     * @param {number} indeks
     * @returns {HTMLImageElement}
     */
    public pobierzKlatke(indeks: number): HTMLImageElement {
        return this._klatkiAnimacji[indeks];
    }

    /**
     * Przewija animaje do początku
     */
    public cofnijDoPoczatku(): void {
        this._indeks = 0;
    }

}
