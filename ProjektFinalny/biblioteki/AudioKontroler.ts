//Wspomaga korzystanie z plików audio
class AudioKontroler {

    /**
     * Odtwarza dzwiek wielokrotnie
     * @param {HTMLAudioElement} audio
     * @param {number} razy
     */
    public static OdtwarzajWielokrotnie(audio: HTMLAudioElement, razy = Infinity): void {
        audio.currentTime = 0;
        audio.addEventListener('ended', () => {
            audio.currentTime = 0;
            razy--;
            if (razy > 0) audio.play();
        }, false);
        audio.play();
    }

    /**
     * Odtwarza dźwięk audio
     * @param {HTMLAudioElement} audio
     */
    public static Odtworz(audio: HTMLAudioElement): void {
        audio.currentTime = 0;
        audio.play();
    }

    /**
     * Zatrzymuje audio
     * @param {HTMLAudioElement} audio
     */
    public static Zatrzymaj(audio: HTMLAudioElement): void {
        audio.pause();
    }

}