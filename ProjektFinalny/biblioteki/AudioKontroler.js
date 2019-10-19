"use strict";
//Wspomaga korzystanie z plików audio
class AudioKontroler {
    /**
     * Odtwarza dzwiek wielokrotnie
     * @param {HTMLAudioElement} audio
     * @param {number} razy
     */
    static OdtwarzajWielokrotnie(audio, razy = Infinity) {
        audio.currentTime = 0;
        audio.addEventListener('ended', () => {
            audio.currentTime = 0;
            razy--;
            if (razy > 0)
                audio.play();
        }, false);
        audio.play();
    }
    /**
     * Odtwarza dźwięk audio
     * @param {HTMLAudioElement} audio
     */
    static Odtworz(audio) {
        audio.currentTime = 0;
        audio.play();
    }
    /**
     * Zatrzymuje audio
     * @param {HTMLAudioElement} audio
     */
    static Zatrzymaj(audio) {
        audio.pause();
    }
}
