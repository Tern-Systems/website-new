const generateFallbackEntries = (count: number): [string, undefined][] => Array(count).fill(['--', undefined]);

export {generateFallbackEntries}