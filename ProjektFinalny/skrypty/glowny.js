"use strict";
//Dodaje event po wczytaniu strony
window.addEventListener('load', () => {
    Promise.all(new Array()
        .concat(PrzygotujGrafiki())
        .concat(PrzygotujPoziomy(12))
        .concat([document.fonts.load("12px PressStart2P", "ß")]))
        .then(poWczytaniu)
        .then(petlaAnimacji);
});
//Obsluga klawiatury
window.addEventListener('keydown', (ev => {
    if (ev.key === ' ')
        ev.preventDefault();
    klawiszDol(ev.key);
}));
window.addEventListener('keyup', (ev => {
    ev.preventDefault();
    klawiszGora(ev.key);
}));
//Canvas
const C_SZEROKOSC = 800; //szerokosc canvasu
const C_WYSOKOSC = 400; //wysokosc canvasu
let CTX; //ctx canvasu
//RequestAnimationFrameID
let REQ_ID;
//Dane bierzacego poziomu
let BIERZ_POZ;
//Kontroler rozgrywki
const KONTROLER = new KontrolerRozgrywki(new Wektor(0, 0), 40, C_SZEROKOSC, 12);
//const GRAFIKI={} //lokalizacja w pliku /skrypty/grafiki.js
//const AUDIO={} //lokalizacja w pliku /skrypty/audio.js
let detonator = 0;
/**
 * Funkcja wykonuje się po załadowaniu grafik
 */
async function poWczytaniu() {
    //Tworzę canvas i dodaje do strony
    const canvas = document.createElement('canvas');
    canvas.width = C_SZEROKOSC;
    canvas.height = C_WYSOKOSC;
    document.getElementById('canvasGra').innerHTML = '';
    document.getElementById('canvasGra').appendChild(canvas);
    //Pobieram context
    CTX = canvas.getContext('2d') || new CanvasRenderingContext2D();
    CTX.imageSmoothingEnabled = false;
    //Wczytuje poziom
    await KONTROLER.rysujBanerPoziomu(CTX, C_WYSOKOSC, C_SZEROKOSC);
    KONTROLER.resetuj();
    AudioKontroler.OdtwarzajWielokrotnie(AUDIO.tlo);
    BIERZ_POZ = WczytajPoziom(KONTROLER.statystyki.poziom, 'normalny');
}
/**
 * Funkcja wykonuje sie po wciscnieciu klawisza
 * @param {string} klawisz
 */
function klawiszDol(klawisz) {
    switch (klawisz.toUpperCase()) {
        case 'A':
            BIERZ_POZ.gracz.ruch.lewo = true;
            break;
        case 'D':
            BIERZ_POZ.gracz.ruch.prawo = true;
            break;
        case ' ':
            BIERZ_POZ.gracz.ruch.skok = true;
            break;
        case 'P':
            if (!KONTROLER.uprawnienia.rzutKulka)
                return;
            BIERZ_POZ.gracz.rzucKulke(new Array() //przeszkody od jakich odbija się pilka
                .concat(BIERZ_POZ.przeszkody.aktywne)
                .concat(BIERZ_POZ.przeciwnicy.chodzacy.zywi)
                .concat(BIERZ_POZ.przeciwnicy.skaczacy)
                .concat(BIERZ_POZ.przeciwnicy.pajaki)
                .concat(BIERZ_POZ.przeciwnicy.smoki), new Array() //zywi przeciwnicy do jakich celuje gracz
                .concat(BIERZ_POZ.przeciwnicy.chodzacy.zywi)
                .concat(BIERZ_POZ.przeciwnicy.skaczacy)
                .concat(BIERZ_POZ.przeciwnicy.pajaki)
                .concat(BIERZ_POZ.przeciwnicy.smoki));
            break;
        case 'B':
            if (!KONTROLER.uprawnienia.detonacjaBomby)
                return;
            BIERZ_POZ.gracz.detonujBombe(BIERZ_POZ.przeciwnicy.chodzacy.zywi).forEach(value => value.zabij());
            if (!KONTROLER.uprawnienia.wielokrotnaDetonacja)
                KONTROLER.uprawnienia.detonacjaBomby = false;
            detonator = 50;
            break;
    }
}
/**
 * Funkcja wykonuje się po zwolnieniu klawisza
 * @param {string} klawisz
 */
function klawiszGora(klawisz) {
    switch (klawisz.toUpperCase()) {
        case 'A':
            BIERZ_POZ.gracz.ruch.lewo = false;
            break;
        case 'D':
            BIERZ_POZ.gracz.ruch.prawo = false;
            break;
        case ' ':
            BIERZ_POZ.gracz.ruch.skok = false;
            break;
    }
}
/**
 * Pętla animacji wykonuje się 60 klatek na sekunde
 */
async function petlaAnimacji() {
    //Tło
    if (detonator <= 0)
        CTX.fillStyle = BIERZ_POZ.kolorTla;
    else if (detonator > 0) {
        if (detonator % 6 === 0)
            CTX.fillStyle = '#000000';
        else
            CTX.fillStyle = '#ffffff';
        detonator--;
    }
    CTX.fillRect(0, 0, C_SZEROKOSC, C_WYSOKOSC);
    //Ruch 'kamery' za graczem
    BIERZ_POZ.aktualizujKadr();
    CTX.save();
    CTX.translate(-BIERZ_POZ.kadr.pozycja.x, -BIERZ_POZ.kadr.pozycja.y);
    //Aktualizuje aktywne przeszkody
    BIERZ_POZ.aktualizujAktywnePrzeszkody();
    //Aktualizuje tablice zywych przeciwnikow
    BIERZ_POZ.aktualizujZywychPrzeciwnikow();
    //Aktualizacja gracza
    BIERZ_POZ.gracz.aktualizujAnimacje();
    BIERZ_POZ.gracz.aktualizujPozycje(BIERZ_POZ.przeszkody.aktywne);
    BIERZ_POZ.gracz.aktualizujKulke(BIERZ_POZ.kadr);
    //Aktualizacja przeszkód
    BIERZ_POZ.przeszkody.znikajace_cegly.forEach(value => value.aktualizujGrafike());
    BIERZ_POZ.przeszkody.niespodzianki.forEach(value => {
        value.aktualizujGrafike();
        value.aktualizujUkryte(); //tylko w przypadku diamenciku
    });
    BIERZ_POZ.przeszkody.stalowe_cegly.forEach(value => {
        value.aktualizujGrafike();
        value.aktualizujUkryte();
    });
    BIERZ_POZ.przeszkody.znikajace_segmenty.forEach(value => value.aktualizujGrafike());
    //Aktualizacja diamentów
    BIERZ_POZ.diamenty.forEach(value => value.aktualizujGrafike());
    //Aktualizacja uciekajacych nagród
    BIERZ_POZ.uciekajace_nagrody.forEach(value => {
        value.aktualizujPozycje(BIERZ_POZ.przeszkody.aktywne);
        value.aktualizujGrafike();
    });
    //Aktualizacja przeciwnikow (tych co są w kadrze)
    BIERZ_POZ.przeciwnicy.chodzacy.wszyscy
        .filter(value => Kolizja.ProstokatProstokat(BIERZ_POZ.kadr, value))
        .forEach(value => {
        value.aktualizujPozycje(BIERZ_POZ.przeszkody.aktywne);
        value.aktualizujGrafike();
    });
    BIERZ_POZ.przeciwnicy.skaczacy
        .filter(value => Kolizja.ProstokatProstokat(BIERZ_POZ.kadr, value))
        .forEach(value => {
        value.aktualizujPozycje();
        value.aktualizujGrafike();
    });
    BIERZ_POZ.przeciwnicy.pajaki
        .filter(value => Kolizja.ProstokatProstokat(BIERZ_POZ.kadr, value))
        .forEach(value => {
        value.aktualizujKierunek();
        value.aktualizujPozycje(BIERZ_POZ.przeszkody.aktywne);
        value.aktualizujGrafike();
    });
    BIERZ_POZ.przeciwnicy.smoki
        .filter(value => Kolizja.ProstokatProstokat(BIERZ_POZ.kadr, value))
        .forEach(value => {
        value.aktualizujPozycje(BIERZ_POZ.przeszkody.aktywne);
        value.aktualizujGrafike();
    });
    //Aktualizacja elementów tła (jeżeli są w kadrze)
    BIERZ_POZ.elementyTla
        .filter(value => Kolizja.ProstokatProstokat(BIERZ_POZ.kadr, value))
        .forEach(value => value.aktualizujGrafike());
    //Aktualizaja wind
    BIERZ_POZ.windy.forEach(value => value.aktualiujPlatforme([BIERZ_POZ.gracz]));
    //Sprawdzam czy gracz uderzył jakąś znikającą cegle od spodu
    if (BIERZ_POZ.gracz.obecnyTryb === 'paralityk')
        BIERZ_POZ.gracz.uderzylOdSpodu(BIERZ_POZ.przeszkody.znikajace_cegly).forEach(value => {
            KONTROLER.statystyki.punkty += 100;
            AudioKontroler.Odtworz(AUDIO.rozwalenieCegly);
            value.zniszcz();
        });
    //Sprawdzam czy gracz uderzył jakąś niespodzianke od spodu
    BIERZ_POZ.gracz.uderzylOdSpodu(BIERZ_POZ.przeszkody.niespodzianki).forEach(value => {
        //Odbieram to co mogło 'wyskoczyć' podczas uderzenia ('DIAMENCIK' | UciekajacaNagroda | null)
        let nagroda = value.zamienWStal();
        if (nagroda === 'DIAMENCIK') {
            AudioKontroler.Odtworz(AUDIO.uderzenie);
            KONTROLER.statystyki.bonusy++;
        }
        if (nagroda instanceof UciekajacaNagroda)
            BIERZ_POZ.uciekajace_nagrody.push(nagroda);
    });
    //Sprawdzam czy gracz uderzył jaka stalowa cegle od spodu
    BIERZ_POZ.gracz.uderzylOdSpodu(BIERZ_POZ.przeszkody.stalowe_cegly).forEach(value => {
        if (value.uderzOdSpodu()) {
            AudioKontroler.Odtworz(AUDIO.uderzenie);
            KONTROLER.statystyki.bonusy++;
        }
    });
    //Jeżeli gracz wejdzie na diament
    BIERZ_POZ.diamenty = BIERZ_POZ.diamenty.filter(value => {
        //Jeżeli go zebral nie musze juz go wyswietlać na mapie
        if (BIERZ_POZ.gracz.wszedlNa(value)) {
            KONTROLER.statystyki.bonusy++;
            AudioKontroler.Odtworz(AUDIO.zebranyPrzedmiot);
            return false;
        }
        else
            return true;
    });
    //Jeżeli gracz skoczyl na jakiegoś żywego chodzącego przeciwnika -> przeciwnik umiera
    BIERZ_POZ.gracz.wskoczylNa(BIERZ_POZ.przeciwnicy.chodzacy.zywi).forEach(value => {
        value.zabij();
        AudioKontroler.Odtworz(AUDIO.zabiciePrzeciwnika);
        KONTROLER.statystyki.punkty += 100;
    });
    //Jeżeli gracz trafil kulka w jakiegos zywego chodzacego przeciwnika -> przeciwnik umiera
    BIERZ_POZ.gracz.trafilKulka(BIERZ_POZ.przeciwnicy.chodzacy.zywi)
        .forEach(value => {
        value.zabij();
        AudioKontroler.Odtworz(AUDIO.zabiciePrzeciwnika);
        BIERZ_POZ.gracz.zniszczKulke();
        KONTROLER.statystyki.punkty += 100;
    });
    BIERZ_POZ.gracz.trafilKulka(BIERZ_POZ.przeciwnicy.smoki)
        .forEach(value => {
        value.zabij();
        AudioKontroler.Odtworz(AUDIO.zabiciePrzeciwnika);
        BIERZ_POZ.gracz.zniszczKulke();
        KONTROLER.statystyki.punkty += 400;
    });
    //Jeżeli gracz po prostu wszedł na jakiegoś zywego przeciwnika -> gracz umiera
    if (BIERZ_POZ.przeciwnicy.chodzacy.zywi.filter(value => BIERZ_POZ.gracz.wszedlNa(value)).length > 0)
        if (!KONTROLER.uprawnienia.niesmiertelnosc)
            BIERZ_POZ.gracz.zabij(() => {
                BIERZ_POZ.powrotNaCheckPoint();
                KONTROLER.statystyki.zycia--;
                AudioKontroler.Odtworz(AUDIO.smierc);
            });
    if (BIERZ_POZ.przeciwnicy.skaczacy.filter(value => BIERZ_POZ.gracz.wszedlNa(value)).length > 0)
        if (!KONTROLER.uprawnienia.niesmiertelnosc)
            BIERZ_POZ.gracz.zabij(() => {
                BIERZ_POZ.powrotNaCheckPoint();
                KONTROLER.statystyki.zycia--;
                AudioKontroler.Odtworz(AUDIO.smierc);
            });
    if (BIERZ_POZ.przeciwnicy.pajaki.filter(value => BIERZ_POZ.gracz.wszedlNa(value)).length > 0)
        if (!KONTROLER.uprawnienia.niesmiertelnosc)
            BIERZ_POZ.gracz.zabij(() => {
                BIERZ_POZ.powrotNaCheckPoint();
                KONTROLER.statystyki.zycia--;
                AudioKontroler.Odtworz(AUDIO.smierc);
            });
    if (BIERZ_POZ.przeciwnicy.smoki.filter(value => BIERZ_POZ.gracz.wszedlNa(value)).length > 0)
        if (!KONTROLER.uprawnienia.niesmiertelnosc)
            BIERZ_POZ.gracz.zabij(() => {
                BIERZ_POZ.powrotNaCheckPoint();
                KONTROLER.statystyki.zycia--;
                AudioKontroler.Odtworz(AUDIO.smierc);
            });
    //Jeżeli gracz wejdzie na uciekajaca nagrode
    BIERZ_POZ.uciekajace_nagrody = BIERZ_POZ.uciekajace_nagrody.filter(value => {
        //Jeżeli jeszcze tego nie zebrał to zostaw to na mapie
        if (!BIERZ_POZ.gracz.wszedlNa(value))
            return true;
        //Sprawdzam co zebral gracz
        switch (value.typ) {
            case UCIEKAJACE_NAGRODY.BOMBA:
                KONTROLER.uprawnienia.detonacjaBomby = true;
                break;
            case UCIEKAJACE_NAGRODY.BUDZIK:
                KONTROLER.statystyki.czas += 10 * 1000;
                break;
            case UCIEKAJACE_NAGRODY.KROPELKA:
                KONTROLER.uprawnienia.rzutKulka = true;
                break;
            case UCIEKAJACE_NAGRODY.LIZACZEK:
                KONTROLER.statystyki.zycia++;
                break;
            case UCIEKAJACE_NAGRODY.PODWOJNA_BLYSKAWICA:
                KONTROLER.uprawnienia.rzutKulka = true;
                break;
            case UCIEKAJACE_NAGRODY.POJEDYNCZA_BLYSKAWICA:
                KONTROLER.uprawnienia.rzutKulka = true;
                break;
            case UCIEKAJACE_NAGRODY.TRUSKAWKA:
                KONTROLER.statystyki.zycia++;
                break;
            case UCIEKAJACE_NAGRODY.PILKA:
                BIERZ_POZ.gracz.transformuj('paralityk');
                break;
            default:
                throw new Error(`Zebrano nieznany typ uciekajacej nagrody ${value.typ}`);
        }
        //Dzwiek
        AudioKontroler.Odtworz(AUDIO.zebranyPrzedmiot);
        //Jeżeli go zebral nie musze juz go wyswietlać na mapie
        return false;
    });
    //Jeżeli gracz stoi na znikającym segmencie
    BIERZ_POZ.gracz.znajdujeSieNa(BIERZ_POZ.przeszkody.znikajace_segmenty)
        .forEach(value => value.zanikaj(BIERZ_POZ.gracz));
    //Gracz nie moze uciekać na lewo
    if (BIERZ_POZ.gracz.pozycja.x < BIERZ_POZ.kadr.pozycja.x)
        BIERZ_POZ.gracz.pozycja.x = BIERZ_POZ.kadr.pozycja.x;
    //Jeżeli gracz spadł po za mape -> ginie
    if (BIERZ_POZ.gracz.pozycja.y + BIERZ_POZ.gracz.wysokosc >= BIERZ_POZ.kadr.pozycja.y + BIERZ_POZ.kadr.wysokosc)
        BIERZ_POZ.gracz.zabij(() => {
            KONTROLER.statystyki.zycia--;
            BIERZ_POZ.powrotNaCheckPoint();
            AudioKontroler.Odtworz(AUDIO.smierc);
        });
    //Jeżeli gracz zakończył poziom -> przechodze do nastepnego (lub od 1 jeżeli przeszedłem wszystkie)
    if (BIERZ_POZ.zakonczony) {
        await KONTROLER.rysujPunktyZaCzas(CTX, C_WYSOKOSC, C_SZEROKOSC);
        KONTROLER.statystyki.poziom++;
        await KONTROLER.rysujBanerPoziomu(CTX, C_WYSOKOSC, C_SZEROKOSC);
        KONTROLER.czas = 99 * 1000;
        AudioKontroler.OdtwarzajWielokrotnie(AUDIO.tlo);
        BIERZ_POZ = WczytajPoziom(KONTROLER.statystyki.poziom, BIERZ_POZ.gracz.obecnyTryb);
    }
    //Rysuje obiekty zwiazane z gra
    BIERZ_POZ.elementyTla.forEach(value => value.rysuj(CTX));
    BIERZ_POZ.windy.forEach(value => value.rysuj(CTX));
    BIERZ_POZ.gracz.rysuj(CTX);
    BIERZ_POZ.gracz.rysujKulke(CTX);
    BIERZ_POZ.przeszkody.aktywne.forEach(value => value.rysuj(CTX));
    BIERZ_POZ.diamenty.forEach(value => value.rysuj(CTX));
    BIERZ_POZ.uciekajace_nagrody.forEach(value => value.rysuj(CTX));
    BIERZ_POZ.przeciwnicy.chodzacy.wszyscy.forEach(value => value.rysuj(CTX));
    BIERZ_POZ.przeciwnicy.skaczacy.forEach(value => value.rysuj(CTX));
    BIERZ_POZ.przeciwnicy.pajaki.forEach(value => value.rysuj(CTX));
    BIERZ_POZ.przeciwnicy.smoki.forEach(value => value.rysuj(CTX));
    //Restore
    CTX.restore();
    //Statystyki
    KONTROLER.aktualizujCzas();
    KONTROLER.rysujStatystyki(CTX);
    //Jeżeli brak żyć -> gra od nowa
    if (KONTROLER.statystyki.zycia === 0) {
        await KONTROLER.rysujPodsumowanieRozgrywki(CTX, C_WYSOKOSC, C_SZEROKOSC);
        KONTROLER.statystyki.poziom = 1;
        await KONTROLER.rysujBanerPoziomu(CTX, C_WYSOKOSC, C_SZEROKOSC);
        KONTROLER.resetuj();
        AudioKontroler.OdtwarzajWielokrotnie(AUDIO.tlo);
        BIERZ_POZ = WczytajPoziom(KONTROLER.statystyki.poziom, 'normalny');
    }
    //Jeżeli skończył się czas poziom zaczyna się od nowa lub jak nie mam już żyć, resetuje wszystko
    if (KONTROLER.czas === 0)
        BIERZ_POZ.gracz.zabij(async () => {
            cancelAnimationFrame(REQ_ID);
            KONTROLER.statystyki.zycia--;
            AudioKontroler.Odtworz(AUDIO.smierc);
            if (KONTROLER.statystyki.zycia === 0) {
                await KONTROLER.rysujPodsumowanieRozgrywki(CTX, C_WYSOKOSC, C_SZEROKOSC);
                KONTROLER.resetuj();
            }
            BIERZ_POZ = WczytajPoziom(KONTROLER.statystyki.poziom, 'normalny');
            await KONTROLER.rysujBanerPoziomu(CTX, C_WYSOKOSC, C_SZEROKOSC);
            KONTROLER.czas = 99 * 1000;
            AudioKontroler.OdtwarzajWielokrotnie(AUDIO.tlo);
            REQ_ID = requestAnimationFrame(petlaAnimacji);
        });
    //Przejscie do innego poziomu (z poziomu konsoli)
    if (KONTROLER.statystyki.poziom != BIERZ_POZ.numerPoziomu) {
        await KONTROLER.rysujBanerPoziomu(CTX, C_WYSOKOSC, C_SZEROKOSC);
        KONTROLER.czas = 99 * 1000;
        AudioKontroler.OdtwarzajWielokrotnie(AUDIO.tlo);
        BIERZ_POZ = WczytajPoziom(KONTROLER.statystyki.poziom, BIERZ_POZ.gracz.obecnyTryb);
    }
    //RequestAnimationFrame
    REQ_ID = requestAnimationFrame(petlaAnimacji);
}
