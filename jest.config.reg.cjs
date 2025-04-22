const BaseConfig = require('./jest.config.base.cjs');

module.exports = {
    ...BaseConfig,
    preset: 'ts-jest/presets/default-esm',
    globalSetup: 'jest-environment-puppeteer/setup',
    globalTeardown: 'jest-environment-puppeteer/teardown',
    testEnvironment: 'jest-environment-puppeteer',
    setupFilesAfterEnv: [...BaseConfig.setupFilesAfterEnv,'expect-puppeteer'],
};
