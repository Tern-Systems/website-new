import { FC, PropsWithChildren, ReactNode } from 'react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';

import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';

import { RouterMock } from '@/__tests__/mocks';
import '@/__tests__/mocks';
import { TIMEOUT } from '@/__tests__/static';

import { Provider } from '@/app/providers';
import { screen, waitFor } from '@testing-library/dom';

const TestProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => (
    <RouterContext.Provider value={RouterMock}>
        <Provider>{props.children}</Provider>
    </RouterContext.Provider>
);

const appRender = (element: ReactNode, options?: RenderOptions) =>
    render(element, { wrapper: TestProvider, ...options });

const conditionExpect = <T = any,>(elem?: T, be?: boolean) => (be ? expect(elem) : expect(elem).not);
const findByTestId = async (id: string) => await screen.findByTestId(id, {}, { timeout: TIMEOUT.requestMs });
const findAllByTestId = async (id: string) => await screen.findAllByTestId(id, {}, { timeout: TIMEOUT.requestMs });
const findByText = async (text: string) => await screen.findByText(text, {}, { timeout: TIMEOUT.requestMs });
const findAllByText = async (text: string) => await screen.findAllByText(text, {}, { timeout: TIMEOUT.requestMs });
const waitForCustom = async (handler: () => Promise<any> | any) =>
    await waitFor(handler, { timeout: TIMEOUT.requestMs });

export * from '@testing-library/react';
export {
    TestProvider,
    appRender as render,
    conditionExpect,
    findByTestId,
    findAllByTestId,
    findByText,
    findAllByText,
    waitForCustom as waitFor,
};
