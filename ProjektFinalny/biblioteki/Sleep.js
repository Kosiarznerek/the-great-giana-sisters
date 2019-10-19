"use strict";
/**
 * Sleep in async function
 * @param {number} ms
 * @returns {Promise<boolean>}
 */
const Sleep = (ms) => new Promise(resolve => setTimeout(() => resolve(true), ms));
