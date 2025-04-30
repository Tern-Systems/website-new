type DateType = Date | number | string;

const generateArray = (count: number): null[] => Array(count).fill(null);

const generateFallbackEntries = (count: number): [string, undefined][] => Array(count).fill(['--', undefined]);

const formatDate = (
    date: DateType,
    type: 'short' | 'long' | 'numerical' | 'day' | 'daymonth' | 'timerange' = 'long',
    options?: { sm?: boolean; dateEnd?: DateType },
): string => {
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
            break;
        case 'day':
            result = dateFinal.toLocaleString('en-US', {
                weekday: 'short',
                month: options?.sm ? undefined : 'short',
                day: options?.sm ? undefined : '2-digit',
                year: options?.sm ? undefined : 'numeric',
            });
            break;
        case 'daymonth':
            result = dateFinal.toLocaleString('en-US', {
                month: options?.sm ? undefined : 'short',
                day: options?.sm ? undefined : '2-digit',
            });
            break;
        case 'timerange':
            const formatted = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(dateFinal);
            const timeZone = formatted.find((part) => part.type === 'timeZoneName')?.value ?? 'Timezone is unknown';
            result = `${String(dateFinal.getHours()).padStart(2, '0')}00 - ${String(dateFinal.getHours() + 1).padStart(2, '0')}00 hrs (${timeZone})`;
            break;
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
        .replaceAll(/[^a-zA-Z_\d]/g, '');

const checkNumber = <T extends number | undefined>(value: T): value is Exclude<T, 0 | '' | null | undefined | false> =>
    value !== undefined && value !== null;

const exclude = <T>(array: T[], item: T | number): T[] => {
    const idx: number = typeof item === 'number' ? item : array.indexOf(item);
    return [...array.slice(0, idx), ...array.slice(idx + 1)];
};

export {
    generateArray,
    generateFallbackEntries,
    formatDate,
    copyObject,
    capitalize,
    getId,
    checkNumber,
    arrayToRecord,
    exclude,
};
