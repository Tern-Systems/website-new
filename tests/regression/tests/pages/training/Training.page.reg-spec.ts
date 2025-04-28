import { Browser, Page } from 'puppeteer';

import { TIMEOUT } from '@/tests/static';
import { RegressionUtil, CheckFunction } from '@/tests/regression/utils/regression.util';

import { Route } from '@/app/static';

describe.only(`Visual Regression Tests for ${Route.Training} page`, () => {
    let browser: Browser;
    let page: Page;
    let check: CheckFunction;

    beforeAll(async () => {
        [browser, page] = await RegressionUtil.prepare(import.meta);
        check = RegressionUtil.requireCheck(page, Route.Training);
    });

    afterAll(async () => await browser.close());

    it(
        `Should check the visual appearance of the lg: breakpoint`,
        async () => await check('training-lg.png'),
        TIMEOUT.testMs,
    );

    it(
        `Should check the visual appearance of the md: breakpoint`,
        async () => await check('training-md.png'),
        TIMEOUT.testMs,
    );

    it(
        `Should check the visual appearance of the sm: breakpoint`,
        async () => await check('training-sm.png'),
        TIMEOUT.testMs,
    );
});
