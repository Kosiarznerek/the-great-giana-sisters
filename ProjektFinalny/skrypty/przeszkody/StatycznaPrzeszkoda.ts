//Rodzaje statycznych przeszkod
enum STATYCZNA_PRZESZKODA {
    KOMIN_DUZY = 'KOMIN_DUZY',
    KOMIN_MALY = 'KOMIN_MALY',
    STALOWY_KLOCEK = 'STALOWY_KLOCEK',
    PLATFORMA = 'PLATFORMA',
    BRUKOWY_KLOCEK = 'BRUKOWY_KLOCEK',
    KAMIENNY_LEWY = 'KAMIENNY_LEWY',
    KAMIENNY_CENTRALNY = 'KAMIENNY_CENTRALNY',
    KAMIENNY_PRAWY = 'KAMIENNY_PRAWY',
}


//Klasa StatycznaPrzeszkoda
class StatycznaPrzeszkoda extends Prostokat {

    public readonly typ: STATYCZNA_PRZESZKODA;

    /**
     *
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     * @param {STATYCZNA_PRZESZKODA} typ
     */
    constructor(pozycja: Wektor, wysokosc: number, szerokosc: number, typ: STATYCZNA_PRZESZKODA) {
        //W zależności od typu odpowiednie dane
        switch (typ) {
            case 'KOMIN_DUZY':
                super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.statyczne.kominDuzy);
                break;
            case 'KOMIN_MALY':
                super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.statyczne.kominMaly);
                break;
            case 'STALOWY_KLOCEK':
                super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.statyczne.stalowyKlocek);
                break;
            case 'PLATFORMA':
                super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.statyczne.platforma);
                break;
            case 'BRUKOWY_KLOCEK':
                super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.statyczne.brukowyKlocek);
                break;
            case 'KAMIENNY_LEWY':
                super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.statyczne.kamiennyLewy);
                break;
            case 'KAMIENNY_CENTRALNY':
                super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.statyczne.kamiennyCentralny);
                break;
            case 'KAMIENNY_PRAWY':
                super(pozycja, wysokosc, szerokosc, GRAFIKI.przeszkody.statyczne.kamiennyPrawy);
                break;
            default:
                throw new Error(`Nieznany typ ${typ} statystycznej przeszkody`);
        }
        this.typ = typ;
    }
}