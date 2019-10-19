"use strict";
//Wszystkie grafiki
const GRAFIKI = {
    //Statyczne przeszkody
    BRUKOWY_KLOCEK: new Image,
    KOMIN_DUZY: new Image,
    KOMIN_MALY: new Image,
    PLATFORMA: new Image,
    STALOWY_KLOCEK: new Image,
    KAMIENNY_LEWY: new Image,
    KAMIENNY_CENTRALNY: new Image,
    KAMIENNY_PRAWY: new Image,
    //Zwykle przeszkody
    NIESPODZIANKA: new Image,
    STALOWA_CEGLA: new Image,
    ZNIKAJACA_CEGLA: new Image,
    ZNIKAJACY_SEGMENT: new Image,
    //Przeciwnicy
    GIBEK: new Image,
    KRAB: new Image,
    OSMIORNICA: new Image,
    PANCERNIK: new Image,
    PSZCZOLA: new Image,
    SOWA: new Image,
    ZLOWIK: new Image,
    SLIME: new Image,
    RYBKA: new Image,
    //Bossy
    BOSS_PAJAK: new Image,
    BOSS_SMOK: new Image,
    //Elementy tla
    CHMURKA_DUZA: new Image,
    CHMURKA_MALA: new Image,
    DRZEWKO_DUZE: new Image,
    DRZEWKO_MALE: new Image,
    DRZEWKO_PODWUJNE: new Image,
    GRZYBEK: new Image,
    KRZACZKI: new Image,
    WODA: new Image,
    PALMA_DUZA: new Image,
    PALMA_MALA: new Image,
    WROTA: new Image,
    ZAMEK: new Image,
    //Winda
    WINDA: new Image,
    //Diamenty do zbierania
    DIAMENT: new Image
};
/**
 * Wczytuje pojedyncza grafike
 * @param {HTMLImageElement} grafika
 * @param {string} sciezka
 * @returns {Promise<HTMLImageElement>}
 */
function WczytajGrafike(grafika, sciezka) {
    return new Promise((resolve, reject) => {
        grafika.src = sciezka;
        grafika.addEventListener('load', () => resolve(grafika));
        grafika.addEventListener('error', reject);
    });
}
/**
 * Wczytuje wszystkie grafiki potrzebne do skrytpu
 * @param {Function} callback
 */
function ZaladujWszystkieGrafiki(callback) {
    Promise.all(Object.keys(GRAFIKI).map(value => {
        return WczytajGrafike(GRAFIKI[value], `grafiki/${value}.png`);
    })).then(callback);
}
