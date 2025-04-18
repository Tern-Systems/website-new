require('@testing-library/jest-dom');

global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
};
