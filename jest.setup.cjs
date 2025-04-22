require('@testing-library/jest-dom');

Object.defineProperty(window, 'innerWidth', { value: 2000 });

window.open = jest.fn();
window.HTMLElement.prototype.scrollIntoView = jest.fn();
