import path from 'node:path';
import { fileURLToPath } from 'url';

type ResolvedFile = { path: string; insertSuffix: (suffix: string) => string };

const resolve = (meta: ImportMeta, file: string): ResolvedFile => {
    const filepath = path.join(path.dirname(fileURLToPath(meta.url)), file);

    const dirname = path.dirname(filepath);
    const [filename, ext] = path.basename(filepath).split('.');

    const insertSuffix = (...suffix: string[]): string => [path.join(dirname, filename), ...suffix, ext].join('.');

    return { path: filepath, insertSuffix };
};

export type { ResolvedFile };
export { resolve };
