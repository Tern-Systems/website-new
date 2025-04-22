const BaseConfig = require('./jest.config.base.cjs');

module.exports = {
    ...BaseConfig,
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: [...BaseConfig.setupFilesAfterEnv, '<rootDir>/jest.setup.cjs'],
};
