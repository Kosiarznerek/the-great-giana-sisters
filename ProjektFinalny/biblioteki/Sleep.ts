/**
 * Sleep in async function
 * @param {number} ms
 * @returns {Promise<boolean>}
 */
const Sleep = (ms: number): Promise<boolean> => new Promise(resolve => setTimeout(() => resolve(true), ms));