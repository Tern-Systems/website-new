const generateArray = (count: number): null[] => Array(count).fill(null);

const generateFallbackEntries = (count: number): [string, undefined][] => Array(count).fill(['--', undefined]);

const formatDate = (date: Date | number | string, type: 'short' | 'long' | 'numerical' = 'long'): string => {
    const dateFinal = typeof date !== 'object' ? new Date(date) : date;

    let result: string;
    switch (type) {
        case 'long':
        case 'short':
            result =
                dateFinal.toLocaleString('default', { month: type }) +
                ' ' +
                dateFinal.getDate() +
                'th, ' +
                dateFinal.getFullYear();
            break;
        case 'numerical':
            result = `${dateFinal.getFullYear()}-${String(dateFinal.getMonth() + 1).padStart(2, '0')}-${String(dateFinal.getDate()).padStart(2, '0')}`;
    }

    return result;
};

const arrayToRecord = (array: any): Record<string, string> =>
    Object.fromEntries(array.map((entry: any) => [entry.toString().toLowerCase(), entry.toString()]));

const copyObject = <T extends object>(object: T): T => JSON.parse(JSON.stringify(object));

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const getId = (str: string) =>
    str
        .toLowerCase()
        .split(' ')
        .join('')
        .replaceAll(/[^a-zA-Z\d]/g, '');

const checkNumber = <T extends number | undefined>(value: T): value is Exclude<T, 0 | '' | null | undefined | false> =>
    value !== undefined && value !== null;

export {
    generateArray,
    generateFallbackEntries,
    formatDate,
    copyObject,
    capitalize,
    getId,
    checkNumber,
    arrayToRecord,
};
