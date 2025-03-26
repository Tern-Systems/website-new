require('@testing-library/jest-dom');

global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
};

window.HTMLElement.prototype.scrollIntoView = jest.fn();
