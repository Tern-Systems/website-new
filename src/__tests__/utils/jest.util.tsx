import { FC, PropsWithChildren, ReactNode } from 'react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';

import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { act, render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';

import { RouterMock } from '@/__tests__/mocks';
import '@/__tests__/mocks';
import { TIMEOUT } from '@/__tests__/static';

import { Provider } from '@/app/providers';

import { Layout } from '@/app/ui/layout';

const TestProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => (
    <RouterContext.Provider value={RouterMock}>
        <Provider>
            <Layout>{props.children}</Layout>
        </Provider>
    </RouterContext.Provider>
);

const appRender = async (element: ReactNode, options?: RenderOptions) => {
    jest.useFakeTimers();

    const result = await act(() => render(element, { wrapper: TestProvider, ...options }));

    jest.clearAllTimers();
    jest.useRealTimers();

    return result;
};

const conditionExpect = <T = any,>(elem?: T, be?: boolean) => (be ? expect(elem) : expect(elem).not);
const findByTestId = async (id: string) => await screen.findByTestId(id, {}, { timeout: TIMEOUT.requestMs });
const findAllByTestId = async (id: string) => await screen.findAllByTestId(id, {}, { timeout: TIMEOUT.requestMs });
const findByText = async (text: string) => await screen.findByText(text, {}, { timeout: TIMEOUT.requestMs });
const findAllByText = async (text: string) => await screen.findAllByText(text, {}, { timeout: TIMEOUT.requestMs });
const waitForCustom = async (handler: () => Promise<any> | any) =>
    await waitFor(handler, { timeout: TIMEOUT.requestMs });

const checkToBeInDocument = async (testID: string, amount?: number) => {
    const elements = await findAllByTestId(testID);
    if (amount !== undefined) {
        if (amount === 0) expect(elements).toHaveLength(amount);
        expect(elements).toHaveLength(amount);
    } else expect(elements[0]).toBeInTheDocument();
};

const checkTextContentHelper = (element: HTMLElement, content: string, be: boolean) => {
    const matchers = expect(element);
    if (be) return matchers.toHaveTextContent(content);
    else return matchers.not.toHaveTextContent(content);
};

const checkTextContent = async (testID: string, content: string, be: boolean = true, idx?: 'all' | number) => {
    const elements = await findAllByTestId(testID);
    if (idx === 'all') return elements.forEach((element) => checkTextContentHelper(element, content, be));
    checkTextContentHelper(elements[idx ?? 0], content, be);
};

const click = async (ElementOrID: HTMLElement | string) => {
    const Element = typeof ElementOrID === 'string' ? await findByTestId(ElementOrID) : ElementOrID;
    await act(async () => fireEvent.click(Element));
};

const change = async (testID: string, value: string, options?: Record<string, string | number>) =>
    await act(async () => fireEvent.change(await findByTestId(testID), { target: { value, ...options } }));

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
    checkTextContent,
    checkToBeInDocument,
    click,
    change,
};
