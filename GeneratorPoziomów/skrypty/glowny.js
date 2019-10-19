"use strict";
//Eventy
window.addEventListener('load', () => ZaladujWszystkieGrafiki(poWczytaniu));
window.addEventListener('keydown', ev => {
    if ([32, 37, 38, 39, 40].indexOf(ev.keyCode) > -1)
        ev.preventDefault();
    wcisniecieKlawisza(ev.key);
});
window.addEventListener('keyup', ev => zwolnienieKlawisza(ev.key));
//Zmienne canvasu
let CTX;
const C_WYSOKOSC = 400;
const C_SZEROKOSC = 800;
//Elementy HTML
const HTML = {
    CANVAS_POJEMNIK: HTMLElement,
    DOSTEPNE_BLOKI_POJEMNIK: HTMLElement,
    OBECNIE_WYBRANY_POJEMNIK: HTMLElement,
    GENERUJ_JSON: HTMLElement,
    WCZYTAJ_JSON: HTMLElement,
    DANE_JSON: HTMLElement,
    KOLOR_TLA: HTMLElement
};
//Zmienne globalne
let OBECNIE_WYBRANY = null;
let BIERZACE_BLOKI = [];
let KOLOR_TLA = '#dff0d8';
let PUNKT_STARTOWY = null;
let PUNKT_DOCELOWY = null;
let CHECK_POINTY = [];
const KLAWIATURA = {
    StrzalkaLewo: false,
    StrzalkaPrawo: false,
    StrzalkaGora: false,
    StrzalkaDol: false
};
const MYSZ = new Punkt(0, 0);
const OFFSET = new Punkt(0, 0);
let GRID = true;
/**
 * Wywołuje się za każdorazawym poruszeniem myszy na canvasie
 * @param {MouseEvent} ev
 * @param {HTMLCanvasElement} canvas
 */
function ruszenieMysza(ev, canvas) {
    //Przeliczanie pozycji
    MYSZ.x = ev.clientX - canvas.getBoundingClientRect().left;
    MYSZ.y = ev.clientY - canvas.getBoundingClientRect().top;
    MYSZ.x -= OFFSET.x;
    MYSZ.y -= OFFSET.y;
    if (GRID) {
        MYSZ.x = Math.round(MYSZ.x / 20) * 20;
        MYSZ.y = Math.round(MYSZ.y / 20) * 20;
    }
}
/**
 * Klik myszy na canvasie
 */
function klikMyszy() {
    //Jeżeli nie ma obecnie wybranego
    if (OBECNIE_WYBRANY === null)
        return;
    //Dodaje do listy
    BIERZACE_BLOKI.push(OBECNIE_WYBRANY.klonuj());
}
/**
 * Wcisniecie klawisza
 * @param {string} klawisz
 */
function wcisniecieKlawisza(klawisz) {
    if (klawisz === 'ArrowLeft')
        KLAWIATURA.StrzalkaLewo = true;
    if (klawisz === 'ArrowRight')
        KLAWIATURA.StrzalkaPrawo = true;
    if (klawisz === 'ArrowUp')
        KLAWIATURA.StrzalkaGora = true;
    if (klawisz === 'ArrowDown')
        KLAWIATURA.StrzalkaDol = true;
    if (klawisz.toUpperCase() === 'G')
        GRID = !GRID;
    //Start point, End point, Checkpoint
    if (klawisz.toUpperCase() === 'S')
        PUNKT_STARTOWY = new Kolo(5, new Punkt(MYSZ.x, MYSZ.y), '#ff4c00');
    if (klawisz.toUpperCase() === 'E')
        PUNKT_DOCELOWY = new Kolo(5, new Punkt(MYSZ.x, MYSZ.y), '#fffa00');
    if (klawisz.toUpperCase() === 'C')
        CHECK_POINTY.push(new Kolo(5, new Punkt(MYSZ.x, MYSZ.y), '#42ce23'));
    //Usuwanie klockow
    if (klawisz.toUpperCase() === 'D')
        BIERZACE_BLOKI = BIERZACE_BLOKI.filter(value => !Kolizja.PunktWProstokacie(MYSZ, value));
}
/**
 * Zwolnienie klawisza
 * @param {string} klawisz
 */
function zwolnienieKlawisza(klawisz) {
    if (klawisz === 'ArrowLeft')
        KLAWIATURA.StrzalkaLewo = false;
    if (klawisz === 'ArrowRight')
        KLAWIATURA.StrzalkaPrawo = false;
    if (klawisz === 'ArrowUp')
        KLAWIATURA.StrzalkaGora = false;
    if (klawisz === 'ArrowDown')
        KLAWIATURA.StrzalkaDol = false;
}
/**
 * Generuje kod JSON
 */
function GenerujJSON() {
    //Brak ustalonej pozycji startowej lub docelowej
    if (PUNKT_DOCELOWY === null || PUNKT_STARTOWY === null) {
        alert('Nie określono punktu startowego[S] lub docelowego[E]');
        return;
    }
    let dane = {
        bloki: BIERZACE_BLOKI.map(value => {
            return {
                typ: value.typ,
                pozycja: value.pozycja.klonuj(),
                wysokosc: value.wysokosc,
                szerokosc: value.szerokosc
            };
        }),
        canvas: {
            wysokosc: C_WYSOKOSC,
            szerokosc: C_SZEROKOSC
        },
        kolorTla: KOLOR_TLA,
        punktStartowy: PUNKT_STARTOWY.pozycja.klonuj(),
        punktDocelowy: PUNKT_DOCELOWY.pozycja.klonuj(),
        checkPointy: CHECK_POINTY.map(value => value.pozycja.klonuj())
    };
    HTML.DANE_JSON.value = JSON.stringify(dane, null, 5);
}
/**
 * Wczytyje dane JSON
 */
function WczytajJSON() {
    let dane = HTML.DANE_JSON.value;
    try {
        let json = JSON.parse(dane);
        //Niezgodność rozmiaru canvasu
        if (json.canvas.wysokosc !== C_WYSOKOSC || json.canvas.szerokosc !== C_SZEROKOSC)
            throw new Error('Niezgodność rozmiaru canvasu.');
        //Zczytuje bloki
        BIERZACE_BLOKI = json.bloki.map(value => {
            if (DOSTEPNE_BLOKI[value.typ] !== null)
                return new Blok(new Punkt(value.pozycja.x, value.pozycja.y), value.typ);
            else
                throw new Error(`Nieznany typ bloku: ${value.typ}`);
        });
        //Punkt startowy i docelowy
        PUNKT_STARTOWY = new Kolo(5, new Punkt(json.punktStartowy.x, json.punktStartowy.y), '#ff4c00');
        PUNKT_DOCELOWY = new Kolo(5, new Punkt(json.punktDocelowy.x, json.punktDocelowy.y), '#fffa00');
        //Checkpointy
        CHECK_POINTY = json.checkPointy.map(value => new Kolo(5, new Punkt(value.x, value.y), '#42ce23'));
        //Zczytuje kolor tla
        KOLOR_TLA = json.kolorTla;
    }
    catch (e) {
        alert('Niepowodzenie odczytu JSON');
        console.log(e);
    }
}
/**
 * Generuje podgląd dostępnych przedmiotów na podstawie danych
 * @param {Object} dane Dane ('DOSTEPNE_BLOKI' | 'DOSTEPNE_ELEMENTY_TLA') na podstawie których generuje się podgląd
 * @param {HTMLElement} POJEMNIK Pojemnik do którego mają zostać wrzucone elementy podglądu
 * @constructor
 */
function GenerujPodglad(dane, POJEMNIK) {
    for (let nazwaBloku in dane) {
        let div = document.createElement('div');
        let grafika = new Image;
        grafika.src = `grafiki/${nazwaBloku}.png`;
        let podpis = document.createElement('p');
        podpis.innerHTML = nazwaBloku;
        div.appendChild(podpis);
        div.appendChild(grafika);
        POJEMNIK.appendChild(div);
        //Wybranie bloku
        div.addEventListener('click', () => {
            OBECNIE_WYBRANY = new Blok(new Punkt(0, 0), nazwaBloku);
            HTML.OBECNIE_WYBRANY_POJEMNIK.innerHTML = '';
            let podglad = new Image();
            podglad.src = `grafiki/${nazwaBloku}.png`;
            HTML.OBECNIE_WYBRANY_POJEMNIK.appendChild(podglad);
        });
    }
}
/**
 * Funkcja wykona się po wczytaniu strony
 */
function poWczytaniu() {
    //Pobieram pojemniki
    HTML.CANVAS_POJEMNIK = document.getElementById('canvasPojemnik');
    HTML.DOSTEPNE_BLOKI_POJEMNIK = document.getElementById('dostepneBloki');
    HTML.OBECNIE_WYBRANY_POJEMNIK = document.getElementById('obecnieWybrany');
    HTML.GENERUJ_JSON = document.getElementById('generujJSON');
    HTML.WCZYTAJ_JSON = document.getElementById('wczytajJSON');
    HTML.DANE_JSON = document.getElementById('daneJSON');
    HTML.KOLOR_TLA = document.getElementById('inputKolorTla');
    //Tworze canvas
    const canvas = document.createElement('canvas');
    canvas.addEventListener('mousemove', (ev => ruszenieMysza(ev, canvas)));
    canvas.addEventListener('click', klikMyszy);
    canvas.width = C_SZEROKOSC;
    canvas.height = C_WYSOKOSC;
    HTML.CANVAS_POJEMNIK.innerHTML = '';
    HTML.CANVAS_POJEMNIK.appendChild(canvas);
    CTX = canvas.getContext('2d') || new CanvasRenderingContext2D();
    CTX.imageSmoothingEnabled = false;
    //Generuje wszystkie dostepne bloki
    GenerujPodglad(DOSTEPNE_BLOKI, HTML.DOSTEPNE_BLOKI_POJEMNIK);
    //Generowanie JSON
    HTML.GENERUJ_JSON.addEventListener('click', GenerujJSON);
    //Wczytywanie JSON
    HTML.WCZYTAJ_JSON.addEventListener('click', WczytajJSON);
    //Zmiana tła
    HTML.KOLOR_TLA.addEventListener('input', function () {
        KOLOR_TLA = this.value;
    });
    //Rozpoczynam animacje
    animacja();
}
function animacja() {
    //Tło
    CTX.fillStyle = KOLOR_TLA;
    CTX.fillRect(0, 0, C_SZEROKOSC, C_WYSOKOSC);
    //Ruch kamery
    if (KLAWIATURA.StrzalkaLewo)
        OFFSET.x += 3;
    if (KLAWIATURA.StrzalkaPrawo)
        OFFSET.x -= 3;
    if (KLAWIATURA.StrzalkaGora)
        OFFSET.y += 3;
    if (KLAWIATURA.StrzalkaDol)
        OFFSET.y -= 3;
    CTX.save();
    CTX.translate(OFFSET.x, OFFSET.y);
    //Os układu Y
    CTX.strokeStyle = 'black';
    CTX.lineWidth = 2;
    CTX.beginPath();
    CTX.moveTo(0, -10000);
    CTX.lineTo(0, 10000);
    CTX.stroke();
    //Oś układu X
    CTX.strokeStyle = 'black';
    CTX.lineWidth = 2;
    CTX.beginPath();
    CTX.moveTo(-10000, C_WYSOKOSC);
    CTX.lineTo(10000, C_WYSOKOSC);
    CTX.stroke();
    //Aktualizowanie pozycji obecnie wyranego
    if (OBECNIE_WYBRANY) {
        let w = new Punkt(MYSZ.x - OBECNIE_WYBRANY.szerokosc / 2, MYSZ.y - OBECNIE_WYBRANY.wysokosc / 2);
        w.x -= OBECNIE_WYBRANY.pozycja.x;
        w.y -= OBECNIE_WYBRANY.pozycja.y;
        Kolizja.AktualizujProstokatUnikajac(OBECNIE_WYBRANY, w, BIERZACE_BLOKI);
    }
    //Rysowanie
    if (OBECNIE_WYBRANY !== null)
        OBECNIE_WYBRANY.rysuj(CTX);
    BIERZACE_BLOKI.forEach(value => value.rysuj(CTX));
    if (PUNKT_STARTOWY !== null)
        PUNKT_STARTOWY.rysuj(CTX);
    if (PUNKT_DOCELOWY !== null)
        PUNKT_DOCELOWY.rysuj(CTX);
    CHECK_POINTY.forEach(value => value.rysuj(CTX));
    //Request
    CTX.restore();
    requestAnimationFrame(animacja);
}
