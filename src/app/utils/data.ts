const generateFallbackEntries = (count: number): [string, undefined][] => Array(count).fill(['--', undefined]);

const formatDate = (date: Date, month: 'short' | 'long' = 'long'): string =>
    date.toLocaleString('default', { month }) + ' ' + date.getDate() + 'th, ' + date.getFullYear();

const copyObject = <T extends object>(object: T): T => JSON.parse(JSON.stringify(object));

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const getId = (str: string) =>
    str
        .toLowerCase()
        .split(' ')
        .join('')
        .replaceAll(/[^a-zA-Z\d]/g, '');

export { generateFallbackEntries, formatDate, copyObject, capitalize, getId };
