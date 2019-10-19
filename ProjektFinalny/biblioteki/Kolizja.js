"use strict";
class Kolizja {
    /**
     * Sprawdza czy dwa prostokąty nachodzą na siebie
     * https://developer.mozilla.org/kab/docs/Games/Techniques/2D_collision_detection#Axis-Aligned_Bounding_Box
     * @param {Prostokat} prt1
     * @param {Prostokat} prt2
     * @returns {boolean}
     */
    static ProstokatProstokat(prt1, prt2) {
        return prt1.pozycja.y + prt1.wysokosc > prt2.pozycja.y
            && prt1.pozycja.y < prt2.pozycja.y + prt2.wysokosc
            && prt1.pozycja.x + prt1.szerokosc > prt2.pozycja.x
            && prt1.pozycja.x < prt2.pozycja.x + prt2.szerokosc;
    }
    /**
     * Aktualizuje pozycje prostokąta unikając przeszkód
     * @param {Prostokat} obj Obiekt, który przesuwamy
     * @param {Wektor} wekt Wektor o jaki nastąpi przesunięcie obiektu
     * @param {Prostokat[]} przeszkody Przeszkody jakich ma uniknąć obiekt podczas przesuwania o wektor
     */
    static AktualizujProstokatUnikajac(obj, wekt, przeszkody) {
        //Aktualizacja pozycji X
        obj.pozycja.x += wekt.x;
        if (wekt.x > 0) {
            przeszkody.filter(przeszkoda => Kolizja.ProstokatProstokat(obj, przeszkoda)).forEach(prt => {
                if (obj.pozycja.x + obj.szerokosc > prt.pozycja.x) {
                    obj.pozycja.x = prt.pozycja.x - obj.szerokosc;
                }
            });
        }
        else if (wekt.x < 0) {
            przeszkody.filter(przeszkoda => Kolizja.ProstokatProstokat(obj, przeszkoda)).forEach(prt => {
                if (obj.pozycja.x < prt.pozycja.x + prt.szerokosc) {
                    obj.pozycja.x = prt.pozycja.x + prt.szerokosc;
                }
            });
        }
        //Aktualizacja pozycji Y
        obj.pozycja.y += wekt.y;
        if (wekt.y > 0) {
            przeszkody.filter(przeszkoda => Kolizja.ProstokatProstokat(obj, przeszkoda)).forEach(prt => {
                if (obj.pozycja.y + obj.wysokosc > prt.pozycja.y) {
                    obj.pozycja.y = prt.pozycja.y - obj.wysokosc;
                }
            });
        }
        else if (wekt.y < 0) {
            przeszkody.filter(przeszkoda => Kolizja.ProstokatProstokat(obj, przeszkoda)).forEach(prt => {
                if (obj.pozycja.y < prt.pozycja.y + prt.wysokosc) {
                    obj.pozycja.y = prt.pozycja.y + prt.wysokosc;
                }
            });
        }
    }
    /**
     * Oblicza odleglosc miedzy prostokątem a 'ziemia' Infinity jeżeli nic pod sobą nie mam
     * @param {Prostokat} obj Obiekt do sprawdzenia
     * @param {Prostokat[]} przeszkody Przeszkody, które stanowią 'podłoże'
     * @returns {number}
     */
    static WysokoscProstokatProstokatNPM(obj, przeszkody) {
        const wyniki = [];
        przeszkody
            .filter((value => obj.pozycja.y + obj.wysokosc <= value.pozycja.y && //wszystkie podemną
            ((obj.pozycja.x >= value.pozycja.x && obj.pozycja.x <= value.pozycja.x + value.szerokosc) ||
                (obj.pozycja.x + obj.szerokosc >= value.pozycja.x && obj.pozycja.x + obj.szerokosc <= value.pozycja.x + value.szerokosc) ||
                (obj.pozycja.x >= value.pozycja.x && obj.pozycja.x + obj.szerokosc <= value.pozycja.x + value.szerokosc) ||
                (value.pozycja.x >= obj.pozycja.x && value.pozycja.x + value.szerokosc <= obj.pozycja.x + obj.szerokosc))))
            .forEach((value => {
            wyniki.push(Math.abs(value.pozycja.y - (obj.pozycja.y + obj.wysokosc)));
        }));
        //Zwracam najmniejszy
        return Math.abs(Math.min(...wyniki));
    }
    /**
     * Sprawdza kolizje pomiedzy kołem a prostokątem
     * https://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle
     * @param {Kolo} kolo
     * @param {Prostokat} prostokat
     * @returns {boolean}
     */
    static KoloProstokat(kolo, prostokat) {
        let distX = Math.abs(kolo.pozycja.x - prostokat.pozycja.x - prostokat.szerokosc / 2);
        let distY = Math.abs(kolo.pozycja.y - prostokat.pozycja.y - prostokat.wysokosc / 2);
        if (distX > (prostokat.szerokosc / 2 + kolo.promien))
            return false;
        if (distY > (prostokat.wysokosc / 2 + kolo.promien))
            return false;
        if (distX <= (prostokat.szerokosc / 2))
            return true;
        if (distY <= (prostokat.wysokosc / 2))
            return true;
        let dx = distX - prostokat.szerokosc / 2;
        let dy = distY - prostokat.wysokosc / 2;
        return (dx * dx + dy * dy <= (kolo.promien * kolo.promien));
    }
    /**
     * Aktualizuje pozycje kola unikajac przeszkód
     * @param {Kolo} obj Obiekt, który będzie przesuwany
     * @param {Wektor} wekt Wektor o jaki zostanie przesunięty obiekt
     * @param {Prostokat[]} przeszkody Przeszkody jakich ma unikać
     */
    static AktualizujKoloUnikajac(obj, wekt, przeszkody) {
        //Prostokat reprezentujacy kolo
        const p = new Prostokat(new Wektor(obj.pozycja.x - obj.promien, obj.pozycja.y - obj.promien), obj.promien * 2, obj.promien * 2);
        //Aktualizacja pozycji prostokąta
        Kolizja.AktualizujProstokatUnikajac(p, wekt, przeszkody);
        //Przypisanie pozycji prostokata do kola
        obj.pozycja.x = p.pozycja.x + p.szerokosc / 2;
        obj.pozycja.y = p.pozycja.y + p.wysokosc / 2;
    }
    /**
     * Sprawdza czy prostokąt znajduje się na drugim prostokącie
     * @param {Prostokat} obj Prostokąt u góry
     * @param {Prostokat} przeszkoda Prostokąt na dole
     * @returns {boolean}
     */
    static ProstokatNaProstokacie(obj, przeszkoda) {
        return (obj.pozycja.y + obj.wysokosc === przeszkoda.pozycja.y &&
            ((obj.pozycja.x >= przeszkoda.pozycja.x && obj.pozycja.x <= przeszkoda.pozycja.x + przeszkoda.szerokosc) ||
                (obj.pozycja.x + obj.szerokosc >= przeszkoda.pozycja.x && obj.pozycja.x + obj.szerokosc <= przeszkoda.pozycja.x + przeszkoda.szerokosc) ||
                (przeszkoda.pozycja.x >= obj.pozycja.x && przeszkoda.pozycja.x <= obj.pozycja.x + obj.szerokosc) ||
                (przeszkoda.pozycja.x + przeszkoda.szerokosc >= obj.pozycja.x && przeszkoda.pozycja.x + przeszkoda.szerokosc <= obj.pozycja.x + obj.szerokosc)));
    }
}
