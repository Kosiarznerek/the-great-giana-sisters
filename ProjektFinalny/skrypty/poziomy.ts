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

//Tak wygląda JSON jednego z poziomów wygenerowany generatorem poziomów
interface LEVEL_JSON {
    canvas: {
        wysokosc: number,
        szerokosc: number
    },
    bloki: {
        typ: DOSTEPNE_BLOKI,
        pozycja: { x: number, y: number },
        wysokosc: number,
        szerokosc: number
    }[],
    kolorTla: string,
    punktStartowy: { x: number, y: number },
    punktDocelowy: { x: number, y: number },
    checkPointy: { x: number, y: number }[]
}

//Tu będą znajdowały się wszyzstkie poziomy (index odpowiada numerowi poziomu)
const DANE_POZIOMOW: LEVEL_JSON[] = [];

/**
 * Wczytuje poziom z pliku JSON i wrzuca go do DANE_POZIOMOW
 * @param {number} numerPoziomu
 * @param {string} sciezka
 * @returns {Promise<LEVEL_JSON>}
 */
async function ZaladujPoziom(numerPoziomu: number, sciezka: string): Promise<LEVEL_JSON> {
    const daneJSON = await fetch(sciezka);
    const dane: LEVEL_JSON = await daneJSON.json();
    DANE_POZIOMOW[numerPoziomu] = dane;
    return dane;
}

/**
 * Przygotowywuje wszystkie poziomy do przeładowania
 * @param {number} maxPoziom
 * @returns {Promise<LEVEL_JSON>[]}
 */
function PrzygotujPoziomy(maxPoziom: number): Promise<LEVEL_JSON>[] {
    return new Array(maxPoziom)
        .fill(0)
        .map((value, index) => ZaladujPoziom(index, `danePoziomow/poziom${index + 1}.json`))
}

/**
 * Tworzy obiekty gry potrzebne do danego poziomu
 * @param {number} numerPoziomu
 * @param {"normalny" | "paralityk"} trybGracza
 * @returns {Poziom}
 */
function WczytajPoziom(numerPoziomu: number, trybGracza: 'normalny' | 'paralityk'): Poziom {

    //Brak poziomu
    if (DANE_POZIOMOW[numerPoziomu - 1] === undefined) throw new Error(`Brak poziomu o numerze ${numerPoziomu}`);

    //Dane poziomu
    let dane: LEVEL_JSON = DANE_POZIOMOW[numerPoziomu - 1];

    //Niezgodność rozmiarów
    if (dane.canvas.wysokosc !== C_WYSOKOSC || dane.canvas.szerokosc !== C_SZEROKOSC)
        throw new Error('Niezgodność rozmiarów.');

    //Poziom
    let rozgrywka: Poziom = new Poziom(
        dane.canvas.wysokosc,
        dane.canvas.szerokosc,
        new Gracz(new Wektor(dane.punktStartowy.x, dane.punktStartowy.y), 44, 32, trybGracza),
        numerPoziomu
    );

    //Wczytuje bloki
    dane.bloki.forEach(value => {
        switch (value.typ) {
            //Statyczne przeszkody
            case 'KOMIN_DUZY':
            case 'KOMIN_MALY':
            case 'STALOWY_KLOCEK':
            case 'PLATFORMA':
            case 'BRUKOWY_KLOCEK':
            case 'KAMIENNY_LEWY':
            case 'KAMIENNY_CENTRALNY':
            case 'KAMIENNY_PRAWY':
                rozgrywka.przeszkody.statyczne.push(new StatycznaPrzeszkoda(
                    new Wektor(value.pozycja.x, value.pozycja.y),
                    value.wysokosc,
                    value.szerokosc,
                    STATYCZNA_PRZESZKODA[value.typ],
                ));
                break;

            //Zwykle przeszkody
            case 'NIESPODZIANKA':
                //Losowa nagroda
                const dostepne = new Array()
                    .concat(Object.keys(UCIEKAJACE_NAGRODY))
                    .concat(['DIAMENCIK']);
                const losowa = dostepne[Math.randomInt(0, dostepne.length - 1)];

                rozgrywka.przeszkody.niespodzianki.push(new Niespodzianka(
                    new Wektor(value.pozycja.x, value.pozycja.y),
                    value.wysokosc,
                    value.szerokosc,
                    losowa
                ));
                break;
            case 'STALOWA_CEGLA':
                rozgrywka.przeszkody.stalowe_cegly.push(new StalowaCegla(
                    new Wektor(value.pozycja.x, value.pozycja.y),
                    value.wysokosc,
                    value.szerokosc
                ));
                break;
            case 'ZNIKAJACA_CEGLA':
                rozgrywka.przeszkody.znikajace_cegly.push(new ZnikajacaCegla(
                    new Wektor(value.pozycja.x, value.pozycja.y),
                    value.wysokosc,
                    value.szerokosc
                ));
                break;
            case 'ZNIKAJACY_SEGMENT':
                rozgrywka.przeszkody.znikajace_segmenty.push(new ZnikajacySegment(
                    new Wektor(value.pozycja.x, value.pozycja.y),
                    value.wysokosc,
                    value.szerokosc
                ));
                break;

            //Chodzący przeciwnicy
            case 'GIBEK':
            case 'KRAB':
            case 'OSMIORNICA':
            case 'PANCERNIK':
            case 'PSZCZOLA':
            case 'SOWA':
            case 'ZLOWIK':
                rozgrywka.przeciwnicy.chodzacy.wszyscy.push(new ChodzacyPrzeciwnik(
                    new Wektor(value.pozycja.x, value.pozycja.y),
                    value.wysokosc,
                    value.szerokosc,
                    CHODZAY_PRZECIWNICY[value.typ]
                ));
                break;

            //Skaczacy przeciwnicy
            case 'SLIME':
            case 'RYBKA':
                rozgrywka.przeciwnicy.skaczacy.push(new SkaczacyPrzeciwnik(
                    new Wektor(value.pozycja.x, value.pozycja.y),
                    value.wysokosc,
                    value.szerokosc,
                    SKACZACY_PRZECIWNIK[value.typ]
                ));
                break;

            //Bossy
            case 'BOSS_PAJAK':
                rozgrywka.przeciwnicy.pajaki.push(new Pajak(
                    new Wektor(value.pozycja.x, value.pozycja.y),
                    value.wysokosc,
                    value.szerokosc
                ));
                break;
            case 'BOSS_SMOK':
                rozgrywka.przeciwnicy.smoki.push(new Smok(
                    new Wektor(value.pozycja.x, value.pozycja.y),
                    value.wysokosc,
                    value.szerokosc
                ));
                break;

            //Elementy tla
            case 'CHMURKA_DUZA':
            case 'CHMURKA_MALA':
            case 'DRZEWKO_DUZE':
            case 'DRZEWKO_MALE':
            case 'DRZEWKO_PODWUJNE':
            case 'GRZYBEK':
            case 'KRZACZKI':
            case 'WODA':
            case 'PALMA_DUZA':
            case 'PALMA_MALA':
            case 'WROTA':
            case 'ZAMEK':
                rozgrywka.elementyTla.push(new ElementTla(
                    new Wektor(value.pozycja.x, value.pozycja.y),
                    value.wysokosc,
                    value.szerokosc,
                    ELEMENT_TLA[value.typ]
                ));
                break;

            //Winda
            case 'WINDA':
                rozgrywka.windy.push(new Winda(
                    new Wektor(value.pozycja.x, value.pozycja.y),
                    value.wysokosc,
                    value.szerokosc
                ));
                break;

            //Diamenty do zbierania
            case 'DIAMENT':
                rozgrywka.diamenty.push(new Diament(
                    new Wektor(value.pozycja.x, value.pozycja.y),
                    value.wysokosc,
                    value.szerokosc
                ));
                break;

            //Brak klocka
            default:
                throw new Error(`Blok ${value.typ} nie jest znany`);
        }
    });

    //Wczytuje pozostale dane
    rozgrywka.kolorTla = dane.kolorTla;
    rozgrywka.punktStartowy = new Wektor(dane.punktStartowy.x, dane.punktStartowy.y);
    rozgrywka.punktDocelowy = new Wektor(dane.punktDocelowy.x, dane.punktDocelowy.y);
    rozgrywka.checkPointy = dane.checkPointy.map(value => new Wektor(value.x, value.y));

    //Zwracam rozgrywke
    return rozgrywka;
}