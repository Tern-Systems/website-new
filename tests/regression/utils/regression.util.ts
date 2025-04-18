import fs from 'fs';

import path from 'node:path';
import pixelmatch from 'pixelmatch';
import { fileURLToPath } from 'url';
import puppeteer, { Browser, Page } from 'puppeteer';
import { PNG, PNGWithMetadata } from 'pngjs';

import { Route } from '@/app/static';

type ResolvedFile = { path: string; insertSuffix: (suffix: string) => string };
type CheckFunction = (baselineFile: string) => Promise<void>;

const THRESHOLD_FALLBACK = '0.1';

interface RegressionUtil {
    prepare(meta: ImportMeta): Promise<[Browser, Page]>;

    clean(browser: Browser): Promise<void>;

    requireCheck(page: Page, route: Route, baselineFile: string): CheckFunction;
}

class RegressionUtilImpl implements RegressionUtil {
    private _metaUrl: string = '';
    private readonly _threshold: number;

    constructor() {
        const { NEXT_PUBLIC_REGRESSION_THRESHOLD } = process.env;

        this._threshold = parseFloat(NEXT_PUBLIC_REGRESSION_THRESHOLD ?? THRESHOLD_FALLBACK);
    }

    public async prepare(meta: ImportMeta): Promise<[Browser, Page]> {
        this._metaUrl = meta.url;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        return [browser, page];
    }

    public async clean(browser: Browser): Promise<void> {
        await browser.close();
    }

    public requireCheck(page: Page, route: Route): CheckFunction {
        return async (baselineFile: string): Promise<void> => {
            const baseline: ResolvedFile = this._resolve(baselineFile);
            const baselinePNG: PNGWithMetadata = PNG.sync.read(fs.readFileSync(baseline.path));
            const { width, height } = baselinePNG;

            await page.setViewport({ width, height });
            await page.goto('http://127.0.0.1:3000' + route, { waitUntil: 'networkidle2' });

            const screenshot = await page.screenshot();

            const diff = new PNG({ width, height });

            fs.writeFileSync(baseline.insertSuffix('out'), screenshot);

            const currentPNG: PNGWithMetadata = PNG.sync.read(Buffer.from(screenshot));

            const differencePixels: number = pixelmatch(currentPNG.data, baselinePNG.data, diff.data, width, height, {
                threshold: this._threshold,
            });

            // Write difference only after pixelmatch call
            fs.writeFileSync(baseline.insertSuffix('diff'), PNG.sync.write(diff));

            expect(differencePixels).toBeLessThanOrEqual(this._threshold * width * height);
        };
    }

    // Utils

    private _resolve(file: string): ResolvedFile {
        const filepath = path.join(path.dirname(fileURLToPath(this._metaUrl)), file);

        const dirname = path.dirname(filepath);
        const [filename, ext] = path.basename(filepath).split('.');

        const insertSuffix = (...suffix: string[]): string => [path.join(dirname, filename), ...suffix, ext].join('.');

        return { path: filepath, insertSuffix };
    }
}

const RegressionUtil = new RegressionUtilImpl();

export type { CheckFunction };
export { RegressionUtil };
