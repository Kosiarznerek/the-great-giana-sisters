"use strict";
//Dostępne w grze bloki
var DOSTEPNE_BLOKI;
(function (DOSTEPNE_BLOKI) {
    //Statyczne przeszkody
    DOSTEPNE_BLOKI["KOMIN_DUZY"] = "KOMIN_DUZY";
    DOSTEPNE_BLOKI["KOMIN_MALY"] = "KOMIN_MALY";
    DOSTEPNE_BLOKI["STALOWY_KLOCEK"] = "STALOWY_KLOCEK";
    DOSTEPNE_BLOKI["PLATFORMA"] = "PLATFORMA";
    DOSTEPNE_BLOKI["BRUKOWY_KLOCEK"] = "BRUKOWY_KLOCEK";
    DOSTEPNE_BLOKI["KAMIENNY_LEWY"] = "KAMIENNY_LEWY";
    DOSTEPNE_BLOKI["KAMIENNY_CENTRALNY"] = "KAMIENNY_CENTRALNY";
    DOSTEPNE_BLOKI["KAMIENNY_PRAWY"] = "KAMIENNY_PRAWY";
    //Zwykle przeszkody
    DOSTEPNE_BLOKI["NIESPODZIANKA"] = "NIESPODZIANKA";
    DOSTEPNE_BLOKI["STALOWA_CEGLA"] = "STALOWA_CEGLA";
    DOSTEPNE_BLOKI["ZNIKAJACA_CEGLA"] = "ZNIKAJACA_CEGLA";
    DOSTEPNE_BLOKI["ZNIKAJACY_SEGMENT"] = "ZNIKAJACY_SEGMENT";
    //Przeciwnicy
    DOSTEPNE_BLOKI["GIBEK"] = "GIBEK";
    DOSTEPNE_BLOKI["KRAB"] = "KRAB";
    DOSTEPNE_BLOKI["OSMIORNICA"] = "OSMIORNICA";
    DOSTEPNE_BLOKI["PANCERNIK"] = "PANCERNIK";
    DOSTEPNE_BLOKI["PSZCZOLA"] = "PSZCZOLA";
    DOSTEPNE_BLOKI["SOWA"] = "SOWA";
    DOSTEPNE_BLOKI["ZLOWIK"] = "ZLOWIK";
    DOSTEPNE_BLOKI["SLIME"] = "SLIME";
    DOSTEPNE_BLOKI["RYBKA"] = "RYBKA";
    //Bossy
    DOSTEPNE_BLOKI["BOSS_PAJAK"] = "BOSS_PAJAK";
    DOSTEPNE_BLOKI["BOSS_SMOK"] = "BOSS_SMOK";
    //Winda
    DOSTEPNE_BLOKI["WINDA"] = "WINDA";
    //Elementy tła
    DOSTEPNE_BLOKI["CHMURKA_DUZA"] = "CHMURKA_DUZA";
    DOSTEPNE_BLOKI["CHMURKA_MALA"] = "CHMURKA_MALA";
    DOSTEPNE_BLOKI["DRZEWKO_DUZE"] = "DRZEWKO_DUZE";
    DOSTEPNE_BLOKI["DRZEWKO_MALE"] = "DRZEWKO_MALE";
    DOSTEPNE_BLOKI["DRZEWKO_PODWUJNE"] = "DRZEWKO_PODWUJNE";
    DOSTEPNE_BLOKI["GRZYBEK"] = "GRZYBEK";
    DOSTEPNE_BLOKI["KRZACZKI"] = "KRZACZKI";
    DOSTEPNE_BLOKI["WODA"] = "WODA";
    DOSTEPNE_BLOKI["PALMA_DUZA"] = "PALMA_DUZA";
    DOSTEPNE_BLOKI["PALMA_MALA"] = "PALMA_MALA";
    DOSTEPNE_BLOKI["WROTA"] = "WROTA";
    DOSTEPNE_BLOKI["ZAMEK"] = "ZAMEK";
    //Diamenty do zbierania
    DOSTEPNE_BLOKI["DIAMENT"] = "DIAMENT";
})(DOSTEPNE_BLOKI || (DOSTEPNE_BLOKI = {}));
//Tu będą znajdowały się wszyzstkie poziomy (index odpowiada numerowi poziomu)
const DANE_POZIOMOW = [];
/**
 * Wczytuje poziom z pliku JSON i wrzuca go do DANE_POZIOMOW
 * @param {number} numerPoziomu
 * @param {string} sciezka
 * @returns {Promise<LEVEL_JSON>}
 */
async function ZaladujPoziom(numerPoziomu, sciezka) {
    const daneJSON = await fetch(sciezka);
    const dane = await daneJSON.json();
    DANE_POZIOMOW[numerPoziomu] = dane;
    return dane;
}
/**
 * Przygotowywuje wszystkie poziomy do przeładowania
 * @param {number} maxPoziom
 * @returns {Promise<LEVEL_JSON>[]}
 */
function PrzygotujPoziomy(maxPoziom) {
    return new Array(maxPoziom)
        .fill(0)
        .map((value, index) => ZaladujPoziom(index, `danePoziomow/poziom${index + 1}.json`));
}
/**
 * Tworzy obiekty gry potrzebne do danego poziomu
 * @param {number} numerPoziomu
 * @param {"normalny" | "paralityk"} trybGracza
 * @returns {Poziom}
 */
function WczytajPoziom(numerPoziomu, trybGracza) {
    //Brak poziomu
    if (DANE_POZIOMOW[numerPoziomu - 1] === undefined)
        throw new Error(`Brak poziomu o numerze ${numerPoziomu}`);
    //Dane poziomu
    let dane = DANE_POZIOMOW[numerPoziomu - 1];
    //Niezgodność rozmiarów
    if (dane.canvas.wysokosc !== C_WYSOKOSC || dane.canvas.szerokosc !== C_SZEROKOSC)
        throw new Error('Niezgodność rozmiarów.');
    //Poziom
    let rozgrywka = new Poziom(dane.canvas.wysokosc, dane.canvas.szerokosc, new Gracz(new Wektor(dane.punktStartowy.x, dane.punktStartowy.y), 44, 32, trybGracza), numerPoziomu);
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
                rozgrywka.przeszkody.statyczne.push(new StatycznaPrzeszkoda(new Wektor(value.pozycja.x, value.pozycja.y), value.wysokosc, value.szerokosc, STATYCZNA_PRZESZKODA[value.typ]));
                break;
            //Zwykle przeszkody
            case 'NIESPODZIANKA':
                //Losowa nagroda
                const dostepne = new Array()
                    .concat(Object.keys(UCIEKAJACE_NAGRODY))
                    .concat(['DIAMENCIK']);
                const losowa = dostepne[Math.randomInt(0, dostepne.length - 1)];
                rozgrywka.przeszkody.niespodzianki.push(new Niespodzianka(new Wektor(value.pozycja.x, value.pozycja.y), value.wysokosc, value.szerokosc, losowa));
                break;
            case 'STALOWA_CEGLA':
                rozgrywka.przeszkody.stalowe_cegly.push(new StalowaCegla(new Wektor(value.pozycja.x, value.pozycja.y), value.wysokosc, value.szerokosc));
                break;
            case 'ZNIKAJACA_CEGLA':
                rozgrywka.przeszkody.znikajace_cegly.push(new ZnikajacaCegla(new Wektor(value.pozycja.x, value.pozycja.y), value.wysokosc, value.szerokosc));
                break;
            case 'ZNIKAJACY_SEGMENT':
                rozgrywka.przeszkody.znikajace_segmenty.push(new ZnikajacySegment(new Wektor(value.pozycja.x, value.pozycja.y), value.wysokosc, value.szerokosc));
                break;
            //Chodzący przeciwnicy
            case 'GIBEK':
            case 'KRAB':
            case 'OSMIORNICA':
            case 'PANCERNIK':
            case 'PSZCZOLA':
            case 'SOWA':
            case 'ZLOWIK':
                rozgrywka.przeciwnicy.chodzacy.wszyscy.push(new ChodzacyPrzeciwnik(new Wektor(value.pozycja.x, value.pozycja.y), value.wysokosc, value.szerokosc, CHODZAY_PRZECIWNICY[value.typ]));
                break;
            //Skaczacy przeciwnicy
            case 'SLIME':
            case 'RYBKA':
                rozgrywka.przeciwnicy.skaczacy.push(new SkaczacyPrzeciwnik(new Wektor(value.pozycja.x, value.pozycja.y), value.wysokosc, value.szerokosc, SKACZACY_PRZECIWNIK[value.typ]));
                break;
            //Bossy
            case 'BOSS_PAJAK':
                rozgrywka.przeciwnicy.pajaki.push(new Pajak(new Wektor(value.pozycja.x, value.pozycja.y), value.wysokosc, value.szerokosc));
                break;
            case 'BOSS_SMOK':
                rozgrywka.przeciwnicy.smoki.push(new Smok(new Wektor(value.pozycja.x, value.pozycja.y), value.wysokosc, value.szerokosc));
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
                rozgrywka.elementyTla.push(new ElementTla(new Wektor(value.pozycja.x, value.pozycja.y), value.wysokosc, value.szerokosc, ELEMENT_TLA[value.typ]));
                break;
            //Winda
            case 'WINDA':
                rozgrywka.windy.push(new Winda(new Wektor(value.pozycja.x, value.pozycja.y), value.wysokosc, value.szerokosc));
                break;
            //Diamenty do zbierania
            case 'DIAMENT':
                rozgrywka.diamenty.push(new Diament(new Wektor(value.pozycja.x, value.pozycja.y), value.wysokosc, value.szerokosc));
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
