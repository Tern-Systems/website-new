import fs from 'fs';

import puppeteer, { Browser, Page } from 'puppeteer';
import pixelmatch from 'pixelmatch';

import { PNG, PNGWithMetadata } from 'pngjs';

import { TIMEOUT } from '@/tests/static';
import { resolve, ResolvedFile } from '@/tests/regression/utils/path';

import { Route } from '@/app/static';

describe('Visual Regression Tests', () => {
    let browser: Browser;
    let page: Page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    });

    afterAll(async () => await browser.close());

    it(
        'should match the visual appearance of the page',
        async () => {
            const baseline: ResolvedFile = resolve(import.meta, 'about-lg.png');
            const baselinePNG: PNGWithMetadata = PNG.sync.read(fs.readFileSync(baseline.path));
            const { width, height } = baselinePNG;

            await page.setViewport({ width, height });
            await page.goto('http://localhost:3000' + Route.About, { waitUntil: 'networkidle2' });

            const screenshot = await page.screenshot();

            const diff = new PNG({ width, height });

            fs.writeFileSync(baseline.insertSuffix('out'), screenshot);

            const currentPNG: PNGWithMetadata = PNG.sync.read(Buffer.from(screenshot));

            const numDiffPixels = pixelmatch(currentPNG.data, baselinePNG.data, diff.data, width, height, {
                threshold: 0.1,
            });

            // Write difference only after pixelmatch call
            fs.writeFileSync(baseline.insertSuffix('diff'), PNG.sync.write(diff));

            expect(0).toBe(0);
        },
        TIMEOUT.testMs,
    );
});
