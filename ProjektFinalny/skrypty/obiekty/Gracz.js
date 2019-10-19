"use strict";
class Gracz extends Prostokat {
    /**
     * Tworzy obiekt gracza
     * @param {Wektor} pozycja
     * @param {number} wysokosc
     * @param {number} szerokosc
     * @param {"normalny" | "paralityk"} tryb
     */
    constructor(pozycja, wysokosc, szerokosc, tryb) {
        super(pozycja, wysokosc, szerokosc, GRAFIKI.gracz.paralityk.prawo.spoczynek);
        this.ruch = {
            lewo: false,
            prawo: false,
            skok: false
        };
        this._przesuniecie = new Wektor(0, 0); //O taki wektor zostanie zaktualizowana pozycja gracza
        this._startowaSkoku = null; //Wysokość na jakiej gracz rozpoczął skok (potrzebna by gracz nie mógł skakać za wysoko i cały czas)
        this._poprzedniaPozycja = this.pozycja.klonuj(); //Potrzebny do wyłapania wbiegnięcia w klocec
        this._kierunekPatrzenia = new Wektor(1, 0); //Domyślnie gracz patrzy na prawo (potrzebne do ustalania animacji)
        //Animacje postaci
        this._animacje = {
            normalny: {
                lewoChodzenie: new AnimatorPoklatkowy(GRAFIKI.gracz.normalny.lewo.chodzenie, 10),
                prawoChodzenie: new AnimatorPoklatkowy(GRAFIKI.gracz.normalny.prawo.chodzenie, 10)
            },
            paralityk: {
                lewoChodzenie: new AnimatorPoklatkowy(GRAFIKI.gracz.paralityk.lewo.chodzenie, 10),
                prawoChodzenie: new AnimatorPoklatkowy(GRAFIKI.gracz.paralityk.prawo.chodzenie, 10)
            },
            transformacja: new AnimatorPoklatkowy(GRAFIKI.gracz.transformacja, 5)
        };
        this._obecnyTryb = tryb; //Tryb w jakim obecnie jest gracz 'normalny' | 'paralityk'
        this._zadanyTryb = tryb; //Tryb na jaki trzeba zmienic 'normalny' | 'paralityk'
        this._kulka = null; //Tu jest kulka którą rzuca gracz albo null jeżeli żadnej nie rzucił
        this._zabity = false; //Przechowuje informacje czy gracz jest zabity
    }
    /**
     * Zwraca obecny tryb w jakim jest gracz
     * @returns {"normalny" | "paralityk"}
     */
    get obecnyTryb() {
        return this._obecnyTryb;
    }
    /**
     * Aktualizuje pozycje gracza na ekranie
     * @param {Prostokat[]} przeszkody
     */
    aktualizujPozycje(przeszkody) {
        //Jeżeli zabity gracz 'spada' po za mape
        if (this._zabity) {
            this._przesuniecie.y += 3;
            this.pozycja.y += Math.mapLinear(this._przesuniecie.y, -100, 100, -5, 5);
            return;
        }
        //Odleglosc od 'ziemi'
        const wysokosc = Kolizja.WysokoscProstokatProstokatNPM(this, przeszkody);
        //Kontrola (prawo-lewo)
        if (this.ruch.lewo && this._przesuniecie.x > -4)
            this._przesuniecie.x -= 0.32;
        if (this.ruch.prawo && this._przesuniecie.x < 4)
            this._przesuniecie.x += 0.32;
        //Spowolnienie (prawo-lewo)
        if (this._przesuniecie.x > 0)
            this._przesuniecie.x -= 0.08;
        if (this._przesuniecie.x < 0)
            this._przesuniecie.x += 0.08;
        //Jeżeli prawo-lewo w zakresie (0,0.1) to ustaw ja na 0
        if (Math.abs(this._przesuniecie.x) > 0 && Math.abs(this._przesuniecie.x) < 0.1)
            this._przesuniecie.x = 0;
        //Skok
        if (this.ruch.skok && this._startowaSkoku === null && wysokosc !== 0)
            this.ruch.skok = false; //Ktoś próbował skoczyć nie będąc na podłodze
        if (this.ruch.skok && this._startowaSkoku === null)
            this._startowaSkoku = 0; //Rozpoczęcie skoku
        if (this.ruch.skok && this._przesuniecie.y >= -10 && this._startowaSkoku !== null && this._startowaSkoku < 100)
            this._przesuniecie.y -= 5;
        if (this._startowaSkoku !== null && this._przesuniecie.y < 0)
            this._startowaSkoku += Math.abs(this._przesuniecie.y); //obliczanie wysokości
        //Aktualizacja poprzedniej pozycji
        this._poprzedniaPozycja = this.pozycja.klonuj();
        //Grawitacja
        if (wysokosc > 0)
            this._przesuniecie.y += 1.5;
        if (wysokosc === 0 && this._startowaSkoku === null)
            this._przesuniecie.y = 0;
        //Aktualizacja pozycji
        Kolizja.AktualizujProstokatUnikajac(this, this._przesuniecie, przeszkody);
        //Skok zakonczony normalnie
        if (this._startowaSkoku !== null && wysokosc === 0 && this._startowaSkoku != Math.abs(this._przesuniecie.y))
            this._startowaSkoku = null;
        //Podczas skoku gracz uderzyl sie w glowe
        if (przeszkody.filter(value => Kolizja.ProstokatNaProstokacie(value, this)).length !== 0) {
            this._przesuniecie.y = 0;
            this._startowaSkoku = Infinity;
        }
        //Gracz wbiegł w klocek -> zatrzymać go trzeba
        if (this._poprzedniaPozycja.x === this.pozycja.x)
            this._przesuniecie.x = 0;
    }
    /**
     * Aktualizuje obeznie wyświetlany obrazek gracza
     */
    aktualizujAnimacje() {
        //Jeżeli jest zabity
        if (this._zabity) {
            this.grafika = GRAFIKI.gracz.zabity;
            return;
        }
        //Jeżeli trzeba zmienic tryb gracza
        if (this._obecnyTryb !== this._zadanyTryb) {
            let grafika = this._animacje.transformacja.nastepnaKlatka();
            if (grafika !== null)
                this.grafika = grafika;
            else {
                this._animacje.transformacja.cofnijDoPoczatku();
                this._obecnyTryb = this._zadanyTryb;
            }
            return;
        }
        //Aktualizuje kierunek patrzenia
        if (this.ruch.prawo)
            this._kierunekPatrzenia.x = 1;
        if (this.ruch.lewo)
            this._kierunekPatrzenia.x = -1;
        //Gracz stoi i patrzy w prawo
        if (this._przesuniecie.x === 0 && this._przesuniecie.y === 0 && this._kierunekPatrzenia.x === 1) {
            this.grafika = GRAFIKI.gracz[this._obecnyTryb].prawo.spoczynek;
        }
        //Gracz stoi i patrzy w lewo
        if (this._przesuniecie.x === 0 && this._przesuniecie.y === 0 && this._kierunekPatrzenia.x === -1) {
            this.grafika = GRAFIKI.gracz[this._obecnyTryb].lewo.spoczynek;
        }
        //Gracz spada lub skacze patrzac w prawo
        if (this._przesuniecie.y !== 0 && this._kierunekPatrzenia.x === 1) {
            this.grafika = GRAFIKI.gracz[this._obecnyTryb].prawo.skok;
        }
        //Gracz spada lub skacze patrzac w lewo
        if (this._przesuniecie.y !== 0 && this._kierunekPatrzenia.x === -1) {
            this.grafika = GRAFIKI.gracz[this._obecnyTryb].lewo.skok;
        }
        //Gracz idzie w prawo
        if (this._przesuniecie.x > 0 && this._przesuniecie.y === 0) {
            let grafika = this._animacje[this._obecnyTryb].prawoChodzenie.nastepnaKlatka();
            if (grafika !== null)
                this.grafika = grafika;
            else {
                this._animacje[this._obecnyTryb].prawoChodzenie.cofnijDoPoczatku();
                this.grafika = this._animacje[this._obecnyTryb].prawoChodzenie.nastepnaKlatka() || new Image;
            }
        }
        else {
            this._animacje.normalny.prawoChodzenie.cofnijDoPoczatku();
            this._animacje.paralityk.prawoChodzenie.cofnijDoPoczatku();
        }
        //Gracz idzie w lewo
        if (this._przesuniecie.x < 0 && this._przesuniecie.y === 0) {
            let grafika = this._animacje[this._obecnyTryb].lewoChodzenie.nastepnaKlatka();
            if (grafika !== null)
                this.grafika = grafika;
            else {
                this._animacje[this._obecnyTryb].lewoChodzenie.cofnijDoPoczatku();
                this.grafika = this._animacje[this._obecnyTryb].lewoChodzenie.nastepnaKlatka() || new Image;
            }
        }
        else {
            this._animacje.normalny.lewoChodzenie.cofnijDoPoczatku();
            this._animacje.paralityk.lewoChodzenie.cofnijDoPoczatku();
        }
    }
    /**
     * Sprawdza czy gracz uderzył w przeszkode od spodu
     * @param {T[]} przeszkody Przeszkody do sprawdzenia (rozszerzają Prostokat)
     * @returns {T[]} Przeszkody które zostały udeżone
     */
    uderzylOdSpodu(przeszkody) {
        return przeszkody.filter(value => Kolizja.ProstokatNaProstokacie(value, this));
    }
    /**
     * Sprawdza czy gracz wszedł ciałem na jakiś przedmiot
     * @param {T} przedmiot Przedmiot do sprawdzenia
     * @returns {boolean}
     */
    wszedlNa(przedmiot) {
        //Musi na niego wejść 1/4 ciała
        let poz = new Wektor(this.pozycja.x + this.szerokosc / 4, this.pozycja.y + this.wysokosc / 4);
        let gracz = new Prostokat(poz, this.wysokosc / 2, this.szerokosc / 2);
        return Kolizja.ProstokatProstokat(gracz, przedmiot);
    }
    /**
     * Sprawdza na jakich obecnie przeszkodach stoi gracz
     * @param {T[]} przeszkody Przeszkody do sprawdzenia
     * @returns {T[]} Przeszkody na których stoi
     */
    znajdujeSieNa(przeszkody) {
        return przeszkody.filter(value => Kolizja.ProstokatNaProstokacie(this, value));
    }
    /**
     * Sprawdza czy gracz wskoczył na jakąs przeszkode
     * @param {T[]} przeszkody Przeszkody do sprawdzenia
     * @returns {T[]} Przeszkody na jakie skoczyl
     */
    wskoczylNa(przeszkody) {
        //Przesuwam gracza 'idealnie'
        let poz = new Wektor(this.pozycja.x + this.szerokosc / 4, this.pozycja.y);
        let gracz = new Prostokat(poz, this.wysokosc, this.szerokosc / 2);
        Kolizja.AktualizujProstokatUnikajac(gracz, this._przesuniecie, przeszkody);
        return przeszkody.filter(value => Kolizja.ProstokatNaProstokacie(gracz, value));
    }
    /**
     * Rozwala kulke, którą rzucił gracz
     */
    zniszczKulke() {
        if (this._kulka)
            this._kulka.zniszcz();
    }
    /**
     * Gracz rzuca kulke
     * @param {Prostokat[]} przeszkody Przeszkody od jakich ma się odbijać kulka
     * @param {Prostokat[]} przeciwnicy Przeciwnicy do jakich można trafiać
     */
    rzucKulke(przeszkody, przeciwnicy) {
        //Kulka jest już w locie więc nie żucam 2 raz
        if (this._kulka !== null)
            return;
        //Kierunek w jakim bede rzucal
        let kierunekRzutu;
        //Przeciwnik do ktorego mam najblizej
        let najblizszy = przeciwnicy.reduce((previousValue, currentValue) => {
            if (previousValue.pozycja.odglegloscDo(this.pozycja) < currentValue.pozycja.odglegloscDo(this.pozycja))
                return previousValue;
            else
                return currentValue;
        }, new Prostokat(new Wektor(Infinity, Infinity), 0, 0));
        //Jeżeli odległość do najbliższego przeciwnika jest mniejsza niz X to właśnie do niego bede rzucal
        if (najblizszy.pozycja.odglegloscDo(this.pozycja) < 500) {
            kierunekRzutu = Wektor.Odejmij(najblizszy.srodek, this.pozycja);
        }
        else {
            //Rzucam kulke w kierunku w ktorym jestem zwrócony, ale na dół
            kierunekRzutu = this._kierunekPatrzenia.klonuj();
            kierunekRzutu.x *= 100;
            kierunekRzutu.y = 30;
        }
        //Tworze kulke w miejscu gracza
        const posStartowa = this.pozycja.klonuj();
        if (kierunekRzutu.x > 0)
            posStartowa.x += this.szerokosc + Kulka.Promien; //po jego prawej
        else
            posStartowa.x -= Kulka.Promien; //po jego lewej
        this._kulka = new Kulka(posStartowa);
        //Rzucam kulke
        this._kulka.rzucUnikajac(kierunekRzutu, 10, przeszkody);
    }
    /**
     * Rysuje kulke jaką żucił gracz (o ile rzucił)
     * @param {CanvasRenderingContext2D} ctx
     */
    rysujKulke(ctx) {
        if (this._kulka !== null)
            this._kulka.rysuj(ctx);
    }
    /**
     * Aktualizuje pozycje kulki (jeżeli została żucona)
     * @param {Prostokat | undefined} ekran Ekran po którego opuszczeniu kulka jest 'usuwana'
     */
    aktualizujKulke(ekran) {
        if (this._kulka === null)
            return;
        //Aktualizuje pozycje kulki
        this._kulka.aktualizujPozycje();
        //Aktualizuje grafike kulki
        this._kulka.aktualizujGrafike();
        //Jeżeli kulka uderzyła gracza (wróciła do niego) to mogę rzucać jeszcze raz
        if (Kolizja.KoloProstokat(this._kulka, this))
            this._kulka = null;
        //Jeżeli kulka jest zniszczona -> moge rzucać jeszcze raz
        if (this._kulka !== null && this._kulka.calkowicieZniszczona)
            this._kulka = null;
        //Jeżeli nie ma 'ograniczen' ekranowych
        if (ekran === undefined)
            return;
        //Jeżeli kulka wyleci po za ekran to mogę rzucać jeszcze raz
        if (this._kulka && !Kolizja.KoloProstokat(this._kulka, ekran))
            this._kulka = null;
    }
    /**
     * Sprawdza czy gracz trafil kulka w jakies przeszkody
     * @param {T[]} przedmioty Przeszkody do sprawdzenia
     * @returns {T[]} Przeszkody w jakie trafil
     */
    trafilKulka(przedmioty) {
        //Jeżeli kulka jest zniszczona to nie mogła nic trafić
        if (this._kulka !== null && this._kulka.zniszczona)
            return [];
        //Sprawdzam co trafiło
        return przedmioty.filter(value => {
            if (this._kulka !== null && !this._kulka.calkowicieZniszczona)
                return this._kulka.uderzyla(value);
            else
                return false;
        });
    }
    /**
     * Transformacja postaci do wybrango trybu
     * @param {"normalny" | "parality"} tryb
     */
    transformuj(tryb) {
        //Jeżeli tryb już jest wybrany to nic nie tobie
        if (this._obecnyTryb === tryb)
            return;
        //Jeżeli postać obecnie jest w trybie tranformacji to nic nie robie
        if (this._obecnyTryb !== this._zadanyTryb)
            return;
        //Zmieniam tryb
        this._zadanyTryb = tryb;
    }
    /**
     * Gracz detonuje bombe
     * @param {T[]} przeciwincy Przeciwnicy, których bomba niszczy
     * @returns {T[]} Przeciwnicy jacy zostali zabici w wyniku wybuchu
     */
    detonujBombe(przeciwincy) {
        //Wszyscy w zaciegu X pikseli
        return przeciwincy.filter(value => value.srodek.odglegloscDo(this.pozycja) < 500);
    }
    /**
     * Zabija gracza
     * @param {Function | undefined} callback Callback po wykonanej animacji
     */
    zabij(callback) {
        //Jeżeli już jest zabity
        if (this._zabity)
            return;
        //Zabijam i callback po [X]ms
        this._zabity = true;
        this._przesuniecie.pomnozSkalarnie(0);
        this._przesuniecie.y = -100;
        setTimeout(() => {
            this._przesuniecie.pomnozSkalarnie(0);
            this._zabity = false;
            if (callback)
                callback();
        }, 2000);
    }
}
