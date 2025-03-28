import { RenderResult } from '@testing-library/react';

import { DataTestID, TIMEOUT } from '@/__tests__/static';

import {
    BillingTestUtil,
    BillingTestUtilImpl,
    change,
    checkTextContent,
    checkToBeInDocument,
    click,
    findAllByTestId,
    render,
    waitFor,
} from '@/__tests__/utils';

// App
import { UserData } from '@/app/contexts/user.context';
import { RecurrencyEnum } from '@/app/types/subscription';
import { Route } from '@/app/static';

import { BillingService, UserService } from '@/app/services';

import PricingAndPlansPage from '@/pages/product/plans/index.page';
import SubscribePage from '@/pages/subscribe/tidal/index.page';
import { screen } from '@testing-library/dom';

const { page, modal } = DataTestID;
const { tidal, subscribe } = page;
const { plans } = tidal;
const { card } = plans;

const UseUserMock = jest.requireMock('@/app/hooks/context/useUser');

describe('E2E related to ' + BillingTestUtilImpl.name, () => {
    const { dummyCard, dummyEmail } = BillingTestUtilImpl.DATA;

    beforeAll(async () => await BillingTestUtil.clean());
    beforeEach(() => {
        BillingTestUtil.mockRouter();
        BillingTestUtil.mockPathName('/');
    });
    afterAll(async () => await BillingTestUtil.clean());

    // describe(BillingService.getCards.name, () => {
    //     it('Should render card cards', async () => {
    //         // Preparation
    //         await AuthTestUtil.signupUser();
    //
    //         const card: CardData = {
    //             ...CARD_DATA_DEFAULT,
    //             ...dummyCard.general,
    //             ...dummyCard.address,
    //         };
    //         await BillingService.postSaveCard(card, dummyEmail);
    //
    //         await BillingTestUtil.renderLoggedIn(<PurchasingInformationPage />);
    //
    //         // Test
    //
    //     });
    // });

    describe(BillingService.postProcessPayment.name, () => {
        afterEach(async () => await BillingTestUtil.clean());

        const { paymentForm, paymentInfo } = subscribe;

        const requireCheckSubscription = () => {
            const useUserSpy = jest.spyOn(UseUserMock, 'useUser');
            return async (exists: boolean) => {
                const arrayMatchers = exists ? expect : expect.not;
                await waitFor(() =>
                    expect(useUserSpy).toHaveLastReturnedWith(
                        expect.objectContaining({
                            userData: expect.objectContaining({
                                ternKeyPurchased: exists,
                                subscriptions: arrayMatchers.arrayContaining([
                                    expect.objectContaining({
                                        subscription: 'Tidal',
                                        recurrency: 'monthly',
                                        type: 'Pro',
                                        basicKind: true,
                                    }),
                                ]),
                            } as Pick<UserData, 'subscriptions' | 'ternKeyPurchased'>),
                        }),
                    ),
                );
            };
        };

        const doSubscribe = async (loggedIn: boolean, success: boolean, fullAddress?: string) => {
            let Page: RenderResult;
            if (loggedIn) {
                const { page } = await BillingTestUtil.renderLoggedIn(<PricingAndPlansPage />);
                Page = page;
            } else Page = await render(<PricingAndPlansPage />);

            // Monthly Pro

            await checkToBeInDocument(card.subscribeButton, 2);

            const [_, SubscribeButton] = await findAllByTestId(card.subscribeButton);
            expect(SubscribeButton).not.toBeDisabled();
            await click(SubscribeButton);

            if (!loggedIn) return await checkToBeInDocument(modal.auth.modal);

            Page.unmount();
            const check = requireCheckSubscription();

            if (loggedIn) await BillingTestUtil.renderLoggedIn(<SubscribePage />, false);
            else await render(<SubscribePage />);

            // Info
            await checkTextContent(paymentInfo.price, '-- missing price --', false, 'all');
            await checkTextContent(
                paymentInfo.subscription,
                '-- missing name -- -- missing type -- Subscription',
                false,
            );
            await checkTextContent(paymentInfo.heading, 'Subscribe to -- missing name -- Subscription', false);
            await checkTextContent(paymentInfo.subtotal, '-- unable to calculate subtotal --', false);
            await checkTextContent(paymentInfo.due, '-- unable to calculate subtotal --', false);

            // Form
            await change(paymentForm.input.cardNumber, dummyCard.general.cardNumber);
            await change(paymentForm.input.expirationDate, dummyCard.general.expirationDate);
            await change(paymentForm.input.cvc, dummyCard.general.cvc);
            await change(paymentForm.input.cardholderName, dummyCard.general.cardholderName);

            await change(paymentForm.input.country, dummyCard.address.country);

            if (fullAddress) await change(paymentForm.input.billingAddress, fullAddress);
            else {
                await click(paymentForm.expandButton);
                await change(paymentForm.input.addressLine1, dummyCard.address.addressLine1);
                await change(paymentForm.input.addressLine2, dummyCard.address.addressLine2);
                await change(paymentForm.input.city, dummyCard.address.city);
                await change(paymentForm.input.zip, dummyCard.address.zip);
                await change(paymentForm.input.state, dummyCard.address.state);
            }

            await click(paymentForm.input.termsCheckbox);

            await click(paymentForm.submitButton);

            await checkToBeInDocument(success ? paymentForm.successModal : paymentForm.errorModal);

            await check(success);
        };

        it(
            `Should show registration modal if a user is unlogged`,
            async () => await doSubscribe(false, false),
            TIMEOUT.testMs,
        );

        it(
            `Should subscribe for Pro Monthly plan (entering address manually)`,
            async () => await doSubscribe(true, true),
            TIMEOUT.testMs,
        );

        it(
            `Should subscribe for Pro Monthly plan (entering correct full address)`,
            async () => await doSubscribe(true, true, dummyCard.fullAddress.normal),
            TIMEOUT.testMs,
        );

        it(
            `Should not subscribe for Pro Monthly plan (entering wrong full address)`,
            async () => await doSubscribe(true, false, dummyCard.fullAddress.wrong),
            TIMEOUT.testMs,
        );
    });

    describe(BillingService.getPlanDetails.name + ' ' + UserService.getUserActivePlans.name + ' - related', () => {
        const { links } = card;

        afterEach(async () => await BillingTestUtil.clean());

        const checkCards = async (count: number, buttonsDisabled: boolean[], links: string[], extension?: true) => {
            await waitFor(async () => await checkTextContent(card.name, '--', false, 'all'));

            await checkToBeInDocument(card.container, count);

            await checkTextContent(card.price, '--', false, 'all');
            await checkTextContent(card.benefit, '--', false, 'all');

            const SubscribeButtons = await findAllByTestId(card.subscribeButton);
            SubscribeButtons.forEach((button, idx) => {
                const matchers = expect(button);
                if (buttonsDisabled[idx]) matchers.toBeDisabled();
                else matchers.not.toBeDisabled();
            });

            if (extension) await checkTextContent(card.extension, 'Everything in --, and:', false);

            for (const link of links) await checkToBeInDocument(link);
        };

        it(
            `Should correctly render available plans on ${Route.TidalPlans} page for an unlogged user`,
            async () => {
                // Preparation
                await render(<PricingAndPlansPage />);
                // Tests
                await checkCards(
                    2,
                    [true, false],
                    [links.manage, links.brc.simple, links.limits, links.brc.related],
                    true,
                );
            },
            TIMEOUT.testMs,
        );

        it(
            `Should correctly render available plans on ${Route.TidalPlans} page for a Pro user`,
            async () => {
                // Preparation
                await BillingTestUtil.subscribePlan('Pro', RecurrencyEnum.annual);
                await BillingTestUtil.renderLoggedIn(<PricingAndPlansPage />, false);

                // Tests
                await checkCards(1, [false], [links.limits]);
                await click(plans.recurrencySwitch.annual);
                await checkCards(1, [true], [links.manage, links.brc.simple]);
            },
            TIMEOUT.testMs,
        );
    });
});
