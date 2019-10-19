"use strict";
//Obiekt zawierający wszystkie potrzebne do gry grafiki
const GRAFIKI = {
    gracz: {
        normalny: {
            lewo: {
                chodzenie: [new Image, new Image, new Image],
                spoczynek: new Image,
                skok: new Image
            },
            prawo: {
                chodzenie: [new Image, new Image, new Image],
                spoczynek: new Image,
                skok: new Image
            }
        },
        paralityk: {
            lewo: {
                chodzenie: [new Image, new Image, new Image],
                spoczynek: new Image,
                skok: new Image
            },
            prawo: {
                chodzenie: [new Image, new Image, new Image],
                spoczynek: new Image,
                skok: new Image
            }
        },
        transformacja: [new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image,],
        zabity: new Image
    },
    przeszkody: {
        czystaCegla: new Image,
        mruganieCegly: [new Image, new Image, new Image, new Image, new Image, new Image, new Image],
        niespodziankaAnimacja: [new Image, new Image, new Image, new Image, new Image, new Image],
        mruganieNiespodzianki: [new Image, new Image, new Image, new Image, new Image, new Image],
        znikanieCegly: [new Image, new Image, new Image, new Image, new Image, new Image, new Image],
        znikajacySegment: {
            lewy: [new Image, new Image, new Image, new Image],
            prawy: [new Image, new Image, new Image, new Image]
        },
        statyczne: {
            kominDuzy: new Image,
            kominMaly: new Image,
            stalowyKlocek: new Image,
            platforma: new Image,
            brukowyKlocek: new Image,
            kamiennyLewy: new Image,
            kamiennyCentralny: new Image,
            kamiennyPrawy: new Image,
        }
    },
    ukryteWPrzeszkodach: {
        uciekajaceNagrody: {
            bomba: new Image,
            budzik: new Image,
            kropelka: new Image,
            lizaczek: new Image,
            podwojnaBlyskawica: new Image,
            pojedynczaBlyskawica: new Image,
            truskawka: new Image,
            pilka: {
                lewo: [new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image],
                prawo: [new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image]
            }
        },
        diamencik: new Image,
    },
    kulka: new Image,
    niszczenieKulki: [new Image, new Image, new Image, new Image, new Image],
    diament: [new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image],
    przeciwnicy: {
        krab: {
            chodzenie: {
                lewo: [new Image, new Image, new Image],
                prawo: [new Image, new Image, new Image]
            },
            zabity: new Image
        },
        osmiornica: {
            chodzenie: {
                lewo: [new Image, new Image],
                prawo: [new Image, new Image]
            },
            zabita: new Image
        },
        pancernik: {
            chodzenie: [new Image, new Image],
            zabity: new Image
        },
        sowa: {
            chodzenie: [new Image, new Image],
            zabita: new Image
        },
        zlowik: {
            chodzenie: {
                lewo: [new Image, new Image, new Image],
                prawo: [new Image, new Image, new Image]
            },
            zabity: new Image
        },
        pszczola: {
            latanie: {
                lewo: [new Image, new Image],
                prawo: [new Image, new Image]
            },
            zabita: new Image
        },
        gibek: {
            lewo: [new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image],
            prawo: [new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image]
        },
        rybka: {
            gora: [new Image, new Image, new Image],
            dol: [new Image, new Image, new Image]
        },
        slime: [new Image, new Image, new Image, new Image],
        pajak: [new Image, new Image, new Image, new Image, new Image, new Image],
        smok: [new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image]
    },
    elementyTla: {
        chmurkaDuza: new Image,
        chmurkaMala: new Image,
        drzewkoDuze: new Image,
        drzewkoMale: new Image,
        drzewkoPodwujne: new Image,
        grzybek: new Image,
        krzaczki: [new Image, new Image, new Image],
        woda: [new Image, new Image, new Image, new Image],
        palmaDuza: new Image,
        palmaMala: new Image,
        wrota: new Image,
        zamek: new Image
    },
    winda: {
        stelarz: new Image,
        platforma: new Image
    }
};
/**
 * Funkcja wczytuje pojedyncza grafike
 * @param {HTMLImageElement} obrazek
 * @param {string} sciezka
 * @returns {Promise<HTMLImageElement>}
 */
function ZaladujGrafike(obrazek, sciezka) {
    return new Promise((resolve, reject) => {
        obrazek.src = sciezka;
        obrazek.addEventListener('load', () => resolve(obrazek));
        obrazek.addEventListener('error', reject);
    });
}
/**
 * Funkcja przygotowywuje wszystkie grafiki do przeładowania
 * @param {GRAFIKI} obj
 * @param {string} stack
 * @param {Promise<HTMLImageElement>[]} array
 * @returns {Promise<HTMLImageElement>[]}
 */
function PrzygotujGrafiki(obj = GRAFIKI, stack = '', array = []) {
    for (let property in obj) {
        if (!obj.hasOwnProperty(property))
            throw new Error('Nieoczekiwany błąd');
        if (typeof obj[property] == "object" && !(obj[property] instanceof Array) && !(obj[property] instanceof Image)) {
            PrzygotujGrafiki(obj[property], stack + '.' + property, array);
        }
        else if (obj[property] instanceof Image) {
            let sciezka = `grafiki${stack}.${property}`.replace(/\./g, '/') + '.png';
            array.push(ZaladujGrafike(obj[property], sciezka));
        }
        else if (obj[property] instanceof Array) {
            obj[property].forEach((value, index) => {
                let sciezka = `grafiki${stack}.${property}`.replace(/\./g, '/') + `/${index}.png`;
                array.push(ZaladujGrafike(obj[property][index], sciezka));
            });
        }
    }
    return (array);
}
