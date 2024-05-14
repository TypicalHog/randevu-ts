/**
 * The official TypeScript implementation of the RANDEVU algorithm
 * 
 * @remarks
 * More information is available on [GITHUB](https://github.com/TypicalHog/randevu-ts)
 * 
 * @example
 * ```typescript
 * import { rdv, rdvt } from 'randevu';
 * 
 * const object: string = "THE_SIMPSONS";
 * const date: Date = new Date();
 * const rdvValue: number = rdv(object, date);
 * const rdvtValue: Date = rdvt(0, object, date);
 * 
 * console.log(`Object ${object} has RDV${rdvValue} today with RDVT0 at ${rdvtValue}`);
 * ```
 */

import { blake3 } from '@noble/hashes/blake3';

/**
 * Returns the 32-byte KEY `Uint8Array` created from a given DATE `Date` and an optional RANK `number | undefined`
 * 
 * @param {Date} date DATE
 * @param {number} [rank] RANK (optional)
 * @returns {Uint8Array} KEY
 */
function createKey(date: Date, rank?: number): Uint8Array {
    let key = new Uint8Array(32);

    let prefix = ""
    const year = date.getUTCFullYear();
    if (year < 0) {
        prefix = "-"
    } else if (year > 9999) {
        prefix = "+"
    }

    const yearString = Math.abs(year).toString().padStart(4, '0');
    const monthString = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const dayString = date.getUTCDate().toString().padStart(2, '0');

    // Write the ISO 8601 formatted date (YYYY-MM-DD) into key
    let dateString = `${prefix}${yearString}-${monthString}-${dayString}`;
    for (let i = 0; i < dateString.length; i++) {
        key[i] = dateString.charCodeAt(i);
    }

    // If a rank is provided, write it into the key after the date, separated by an '_'
    if (rank !== undefined) {
        key[10] = '_'.charCodeAt(0);

        const rankString = rank.toString();
        for (let i = 0; i < rankString.length; i++) {
            key[11 + i] = rankString.charCodeAt(i);
        }
    }

    return key;
}

/**
 * Returns the RDV value `number` for an OBJECT `string` on a specific DATE (UTC) `Date`
 * Note: The function might return incorrect values if given a Date() that's not in the UTC timezone
 * 
 * **RDV = number of leading zero bits in blake3::keyed_hash(key: DATE, data: OBJECT)**
 * 
 * @param {string} object OBJECT
 * @param {Date} date DATE
 * @returns {number} RDV
 */
export function rdv(object: string, date: Date): number {
    const hash = blake3(object, { key: createKey(date) });

    // Count the number of leading zero bits in the hash
    let rdv_value = 0;
    for (const byte of hash) {
        const zerosCount = byte.toString(2).padStart(8, '0').indexOf('1');

        if (zerosCount === -1) {
            rdv_value += 8;
        } else {
            rdv_value += zerosCount;
            break;
        }
    }

    return rdv_value;
}

/**
 * Returns the RDVT time (UTC) `Date` of a given RANK `number` for an OBJECT `string` on a specific DATE (UTC) `Date`
 * Note: The function might return incorrect values if given a Date() that's not in the UTC timezone
 * 
 * @param {number} rank RANK
 * @param {string} object OBJECT
 * @param {Date} date DATE
 * @returns {Date} RDVT
 */
export function rdvt(rank: number, object: string, date: Date): Date {
    const hash = blake3(object, { key: createKey(date, rank) });

    // Calculate the time using bits from the hash
    let total = 0.0;
    let increment = 12.0 * 60.0 * 60.0 * 1_000.0; // 12h in milliseconds
    for (let i = 0; i < hash.length; i++) {
        for (let j = 7; j >= 0; j--) {
            const bit = (hash[i] >> j) & 1;
            if (bit === 1) {
                total += increment;
            }
            increment /= 2.0;
        }
        // Stop once increments become too small to affect the total
        if (i > 2 && (2.0 * increment) < (1.0 - total % 1)) {
            break;
        }
    }

    // Construct the RDVT time from total
    const rdvtTime = new Date(date);
    rdvtTime.setUTCHours(0, 0, 0, 0);
    rdvtTime.setTime(rdvtTime.getTime() + total);

    return rdvtTime;
}
