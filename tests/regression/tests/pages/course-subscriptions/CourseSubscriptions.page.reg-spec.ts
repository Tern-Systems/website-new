import { Browser, Page } from 'puppeteer';

import { TIMEOUT } from '@/tests/static';
import { RegressionUtil, CheckFunction } from '@/tests/regression/utils/regression.util';

import { Route } from '@/app/static';

describe(`Visual Regression Tests for ${Route.SubscriptionsCourse} page`, () => {
    let browser: Browser;
    let page: Page;
    let check: CheckFunction;

    beforeAll(async () => {
        [browser, page] = await RegressionUtil.prepare(import.meta);
        check = RegressionUtil.requireCheck(page, Route.SubscriptionsCourse);
    });

    afterAll(async () => await browser.close());

    it(
        `Should check the visual appearance of the lg: breakpoint`,
        async () => await check('course-subscriptions-lg.png'),
        TIMEOUT.testMs,
    );
});
