import { FC, PropsWithChildren, ReactNode } from 'react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';

import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { act, render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';

import { RouterMock } from '@/tests/mocks';
import '@/tests/mocks';
import { TIMEOUT } from '@/tests/static';

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

const getElements = async (ElementOrID: string | HTMLElement): Promise<HTMLElement[]> => {
    if (typeof ElementOrID === 'string') return (await findAllByTestId(ElementOrID)) as any;
    else return [ElementOrID] as any;
};

const getMatchers = (element: HTMLElement, be: boolean) => {
    const matchers = expect(element);
    return be ? matchers : matchers.not;
};

const conditionExpect = <T = any,>(elem?: T, be?: boolean) => (be ? expect(elem) : expect(elem).not);
const findByTestId = async (id: string) => await screen.findByTestId(id, {}, { timeout: TIMEOUT.requestMs });
const findAllByTestId = async (id: string) => await screen.findAllByTestId(id, {}, { timeout: TIMEOUT.requestMs });
const findByText = async (text: string) => await screen.findByText(text, {}, { timeout: TIMEOUT.requestMs });
const findAllByText = async (text: string) => await screen.findAllByText(text, {}, { timeout: TIMEOUT.requestMs });
const waitForCustom = async (handler: () => Promise<any> | any) =>
    await waitFor(handler, { timeout: TIMEOUT.requestMs });

const checkToBeInDocument = async (ElementOrID: string | HTMLElement, amount?: number, be: boolean = true) => {
    const elements = await getElements(ElementOrID);
    if (amount !== undefined && be) expect(elements).toHaveLength(amount);
    else {
        const element = elements[0];
        getMatchers(element, be).toBeInTheDocument();
        return element;
    }
};

const checkTextContent = async (testID: string, content: string, be: boolean = true, idx?: 'all' | number) => {
    const elements = await findAllByTestId(testID);
    if (idx === 'all') elements.forEach((element) => getMatchers(element, be).toHaveTextContent(content));
    else getMatchers(elements[idx ?? 0], be).toHaveTextContent(content);
};

const checkToHaveValue = async (testID: string, value: string | number, be: boolean = true) => {
    const matchers = expect(await findByTestId(testID));
    if (be) matchers.toHaveValue(value);
    else matchers.not.toHaveValue(value);
};

const click = async (ElementOrID: HTMLElement | string) => {
    const [Element] = await getElements(ElementOrID);
    await act(async () => fireEvent.click(Element));
};

const change = async (testID: string, value: string | number, options?: Record<string, string | number>) =>
    await act(async () =>
        fireEvent.change(await findByTestId(testID), {
            target: { value, ...options },
        }),
    );

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
    checkToHaveValue,
    checkToBeInDocument,
    click,
    change,
};
