require('@testing-library/jest-dom');

global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
};

Object.defineProperty(window, 'innerWidth', { value: 2000 });

window.open = jest.fn();
window.HTMLElement.prototype.scrollIntoView = jest.fn();
