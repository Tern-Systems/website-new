import { generateFallbackEntries } from '@/app/utils/data';

describe('Data utils test', () => {
    test(generateFallbackEntries.name + " - should generate an array of 'undefined' fallback entries", () => {
        const COUNT = 2;
        const expected = Array(COUNT).fill(['--', undefined]);

        expect(generateFallbackEntries(COUNT)).toEqual(expected);
    });
});
