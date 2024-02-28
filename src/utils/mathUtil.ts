/**
 * 
 * @param min Inclusive
 * @param max Exclusive
 * @returns integer
 */
function randomInt(min: number, max: number): number {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export {randomInt}