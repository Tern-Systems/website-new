import router, { NextRouter } from 'next/router';

jest.mock('next/navigation');

const NavigationMock = jest.requireMock('next/navigation');

const RouterMock: NextRouter = {
    ...router,
    push: jest.fn(),
    replace: jest.fn(),
    query: {},
    pathname: '/',
    asPath: '/',
};

export { RouterMock, NavigationMock };
