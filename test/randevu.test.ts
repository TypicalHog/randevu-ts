import { rdv, rdvt } from '../src/randevu';

describe('rdv function', () => {
    test('calculates rdv for "COREJOURNEY" on "2024-05-10"', () => {
        expect(rdv("COREJOURNEY", new Date("2024-05-10"))).toBe(0);
    });

    test('calculates rdv for "GTA_V_FLYING_MUSIC_Z7RfRLsqECI" on "2024-05-10"', () => {
        expect(rdv("GTA_V_FLYING_MUSIC_Z7RfRLsqECI", new Date("2024-05-10"))).toBe(7);
    });

    test('calculates rdv for "THE_COVENANT_2023" on "2024-05-10"', () => {
        expect(rdv("THE_COVENANT_2023", new Date("2024-05-10"))).toBe(8);
    });

    test('calculates rdv for "NO_BOILERPLATE" on "2024-05-10"', () => {
        expect(rdv("NO_BOILERPLATE", new Date("2024-05-10"))).toBe(9);
    });
});

describe('rdvt function', () => {
    test('calculates rdvt0 for "COREJOURNEY" on "2024-05-10"', () => {
        expect(rdvt(0, "COREJOURNEY", new Date("2024-05-10"))).toStrictEqual(new Date("2024-05-10T08:34:51.226Z"));
    });

    test('calculates rdvt1 for "GTA_V_FLYING_MUSIC_Z7RfRLsqECI" on "2024-05-10"', () => {
        expect(rdvt(1, "GTA_V_FLYING_MUSIC_Z7RfRLsqECI", new Date("2024-05-10"))).toStrictEqual(new Date("2024-05-10T19:33:44.824Z"));
    });

    test('calculates rdvt10 for "THE_COVENANT_2023" on "2024-05-10"', () => {
        expect(rdvt(10, "THE_COVENANT_2023", new Date("2024-05-10"))).toStrictEqual(new Date("2024-05-10T16:58:30.927Z"));
    });

    test('calculates rdvt100 for "NO_BOILERPLATE" on "2024-05-10"', () => {
        expect(rdvt(100, "NO_BOILERPLATE", new Date("2024-05-10"))).toStrictEqual(new Date("2024-05-10T00:27:37.142Z"));
    });
});
