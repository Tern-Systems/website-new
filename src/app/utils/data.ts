const generateFallbackEntries = (count: number): [string, undefined][] => Array(count).fill(['--', undefined]);

const formatDate = (date: Date): string =>
    date.toLocaleString('default', {month: 'long'}) + ' ' + date.getDate() + 'th, ' + date.getFullYear();

export {generateFallbackEntries, formatDate}