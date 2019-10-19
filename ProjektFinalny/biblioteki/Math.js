"use strict";
/**
 * Mapowanie wartości x z zakresu [a1, a2] to zakresu [b1, b2].
 * @param {number} x Wartość do zmapowania
 * @param {number} a1 Minimalny wartość z zakresu A
 * @param {number} a2 Maksymalna wartość z zakresu A
 * @param {number} b1 Minimalny wartość z zakresu B
 * @param {number} b2 Maksymalna wartość z zakresu B
 * @returns {number}
 */
Math.mapLinear = (x, a1, a2, b1, b2) => {
    return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
};
/**
 * Zwraca losową liczbę całkowitą z podanego zakresu
 * @param {number} min Minamalna wartość (włącznie)
 * @param {number} max Maksymalna wartość (włącznie)
 * @returns {number}
 */
Math.randomInt = (min, max) => {
    //https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
