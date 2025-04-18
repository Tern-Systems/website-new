import { RenderResult } from '@testing-library/react';

import { DataTestID, TIMEOUT } from '@/tests/static';

import {
    BillingTestUtil,
    BillingTestUtilImpl,
    change,
    checkTextContent,
    checkToBeInDocument,
    checkToHaveValue,
    click,
    findAllByTestId,
    findByTestId,
    render,
    waitFor,
} from '@/tests/utils';

// App
import { UserData } from '@/app/contexts/user.context';
import { PlanName, RecurrencyEnum, Subscription } from '@/app/types/subscription';
import { Route } from '@/app/static';

import { BillingService } from '@/app/services';

import { downloadFile } from '@/app/utils';

import { PaymentMethodTool } from '@/app/ui/templates';
import PricingAndPlansPage from '@/pages/product/plans/index.page';
import SubscribePage from '@/pages/subscribe/tidal/index.page';
import BillingPage from '@/pages/profile/billing/index.page';
import PurchasingInformationPage from '@/pages/profile/billing/purchasing_information/index.page';
import ManageSubscriptionsPage from '@/pages/profile/billing/manage_subscriptions/index.page';

const { page, modal } = DataTestID;
const { tidal, subscribe, profile } = page;
const { plans } = tidal;
const { card } = plans;

const UseUserMock = jest.requireMock('@/app/hooks/context/useUser');
const UIUtilsMock = jest.requireMock('@/app/utils/ui');

describe('E2E related to ' + BillingTestUtilImpl.name, () => {
    const { dummyCard } = BillingTestUtilImpl.DATA;

    beforeAll(async () => await BillingTestUtil.clean());
    beforeEach(() => {
        BillingTestUtil.mockRouter();
        BillingTestUtil.mockPathName('/');
    });
    afterAll(async () => await BillingTestUtil.clean());

    describe(PricingAndPlansPage.name, () => {
        const { plans } = tidal;
        const { card } = plans;

        it(
            `Should correctly render available plans on ${Route.TidalPlans} page for an unlogged user`,
            async () => {
                // Preparation
                const subscriptionMock: Subscription[] = [
                    {
                        subscription: 'Tidal',
                        basicKind: true,
                        type: 'Basic',
                        recurrency: 'monthly',
                        totalUSD: 0,
                        renewDate: 0,
                        tax: {
                            amount: 0,
                            rate: 0,
                        },
                        priceUSD: 0,
                    },
                ];
                BillingTestUtil.mockGetUserPlans(subscriptionMock);

                // TODO mock userdata

                await render(<PricingAndPlansPage />);

                // Test
                await checkToBeInDocument(card.container, 2);

                await waitFor(async () => await checkTextContent(card.name, '--', false, 'all'));

                await checkTextContent(card.price, '--', false, 'all');
                await checkTextContent(card.benefit, '--', false, 'all');

                const SubscribeButtons = await findAllByTestId(card.subscribeButton);

                expect(SubscribeButtons[0]).toBeDisabled();
                await checkToBeInDocument(card.links.manage);
                await checkToBeInDocument(card.links.brc.simple);

                expect(SubscribeButtons[1]).not.toBeDisabled();
                await checkTextContent(card.extension, 'Everything in --, and:', false);
                await checkToBeInDocument(card.links.limits);
                await checkToBeInDocument(card.links.brc.simple);
            },
            TIMEOUT.testMs,
        );
    });

    describe(BillingService.postExportTransaction.name, () => {
        afterEach(async () => await BillingTestUtil.clean());

        const { purchasingInformation } = profile.billing;
        const { entry, exporting } = purchasingInformation.page.history;

        it(
            'Should successfully export transactions history',
            async () => {
                // Preparation
                await BillingTestUtil.subscribePlan('Pro', RecurrencyEnum.monthly);
                await BillingTestUtil.renderLoggedIn(<PurchasingInformationPage />, false);

                await checkToBeInDocument(entry.row);
                await checkTextContent(entry.id, '', false);
                await checkTextContent(entry.date, '', false);
                await checkTextContent(entry.price, '', false);
                await checkTextContent(entry.status, '', false);
                await checkTextContent(entry.card, '', false);
                await checkTextContent(entry.plan, '', false);

                // Test
                await click(exporting.toggle);
                const ExportHistoryModal = await checkToBeInDocument(exporting.modal.modal);
                if (!ExportHistoryModal) throw 'No modal found';

                const downloadFileSpy = jest.spyOn(UIUtilsMock, downloadFile.name);

                await change(exporting.modal.rangeSelect, '1'); // TODO
                await click(exporting.modal.exportButton);

                await waitFor(async () => expect(downloadFileSpy).toHaveBeenCalledTimes(1));
                expect(downloadFileSpy).toHaveBeenLastCalledWith(
                    expect.stringContaining('data:application/octet-stream;charset=utf-8,'),
                );

                await checkToBeInDocument(ExportHistoryModal, 1, false);
            },
            TIMEOUT.testMs,
        );
    });

    describe(BillingService.postCancelSubscription.name, () => {
        afterEach(async () => await BillingTestUtil.clean());

        const { manageSubscription } = profile.billing;
        const { currentPlan, paymentMethod } = manageSubscription.info;
        const { cancel } = currentPlan;

        it(
            'Should successfully cancel a subscription',
            async () => {
                // Preparation
                await BillingTestUtil.subscribePlan('Pro', RecurrencyEnum.monthly);
                await BillingTestUtil.renderLoggedIn(<ManageSubscriptionsPage />, false);

                await click(currentPlan.details.toggle);
                const PlanDetailsBlock = await checkToBeInDocument(currentPlan.details.block);
                if (!PlanDetailsBlock) throw 'No details found';

                const PaymentMethodEntry = await checkToBeInDocument(paymentMethod.entry.row);
                if (!PaymentMethodEntry) throw 'No entry found';

                await checkTextContent(paymentMethod.entry.nickname, '', false);

                // Test
                await click(cancel.toggle);

                const CancelSubscriptionModal = await checkToBeInDocument(cancel.modal.modal);
                if (!CancelSubscriptionModal) throw 'No modal found';

                await click(cancel.modal.submitButton);

                await waitFor(async () => await checkToBeInDocument(PaymentMethodEntry, 1, false));

                await checkToBeInDocument(CancelSubscriptionModal, 1, false);
                await checkToBeInDocument(PlanDetailsBlock, 1, false);
            },
            TIMEOUT.testMs,
        );
    });

    describe(PurchasingInformationPage.name + ' ' + PaymentMethodTool.name + ' - related', () => {
        const { purchasingInformation } = profile.billing;
        const { paymentMethodTool, page } = purchasingInformation;
        const { input } = paymentMethodTool.form;

        const submitForm = async (edit?: true) => {
            if (edit) {
                await checkToBeInDocument(input.nickname);
                await change(input.nickname, dummyCard.misc.nickname.edit);
            } else {
                await change(input.cardNumber, dummyCard.general.cardNumber);
                await change(input.expirationDate, dummyCard.general.expirationDate);
                await change(input.nickname, dummyCard.misc.nickname.initial);

                await change(input.cardholderName, dummyCard.general.cardholderName);
                await change(input.addressLine1, dummyCard.address.addressLine1);
                await change(input.addressLine2, dummyCard.address.addressLine2);
                await change(input.city, dummyCard.address.city);
                await change(input.zip, dummyCard.address.zip);
                await change(input.state, dummyCard.address.state);
                await change(input.country, dummyCard.address.country);
            }

            await change(input.cvc, dummyCard.general.cvc);
            await click(input.preferredCheckbox);

            await click(paymentMethodTool.form.submitButton);
        };

        const checkSavedCards = async <T extends boolean = true>(
            be: T,
            nickname: T extends true ? string : null,
            preferred: T extends true ? boolean : null,
        ) => {
            await waitFor(
                async () =>
                    await checkToBeInDocument(be ? page.savedCards.entry.nickname : page.savedCards.noEntries, 1),
            );

            if (be && nickname) {
                await checkTextContent(page.savedCards.entry.nickname, nickname);
                if (preferred) await checkToBeInDocument(page.savedCards.entry.preferred);
                await checkTextContent(page.billing.name, '--', false);
                await checkToBeInDocument(page.billing.address);
            }
        };

        describe(BillingService.postDeleteCard.name, () => {
            afterEach(async () => await BillingTestUtil.clean());

            it(
                'Should successfully delete saved card',
                async () => {
                    // Preparation
                    await BillingTestUtil.saveCard();
                    const { render: PaymentTool } = await BillingTestUtil.renderLoggedIn(<PaymentMethodTool />);

                    // Test
                    await click(paymentMethodTool.removeCard.toggle);

                    const RemoveCardModal = await checkToBeInDocument(paymentMethodTool.removeCard.modal);
                    if (!RemoveCardModal) throw 'No modal found';

                    await click(paymentMethodTool.removeCard.submitButton);

                    await waitFor(async () => await checkToBeInDocument(RemoveCardModal, 1, false));

                    PaymentTool.unmount();
                    await BillingTestUtil.renderLoggedIn(<PurchasingInformationPage />, false);
                    await checkSavedCards(false, null, null);
                },
                TIMEOUT.testMs,
            );
        });

        describe(BillingService.postSaveCard.name + ' ' + BillingService.getCards.name + ' - related', () => {
            afterEach(async () => await BillingTestUtil.clean());

            it(
                `Should save a new card on ${Route.AddPaymentMethod} page`,
                async () => {
                    // Preparation
                    const { render: PurchasingInfoPage } = await BillingTestUtil.renderLoggedIn(
                        <PurchasingInformationPage />,
                    );
                    await click(page.savedCards.addButton);

                    PurchasingInfoPage.unmount();
                    const { render: PaymentToolPage } = await BillingTestUtil.renderLoggedIn(
                        <PaymentMethodTool creation />,
                        false,
                    );

                    // Test
                    await submitForm();
                    await waitFor(async () => await checkToBeInDocument(paymentMethodTool.successModal));

                    PaymentToolPage.unmount();
                    await BillingTestUtil.renderLoggedIn(<PurchasingInformationPage />, false);
                    await checkSavedCards(true, dummyCard.misc.nickname.initial, true);
                },
                TIMEOUT.testMs,
            );
        });

        describe(BillingService.postUpdateCard.name + ' ' + BillingService.getEditCards.name + ' - related', () => {
            afterEach(async () => await BillingTestUtil.clean());

            it(
                `Should edit saved card on ${Route.EditPaymentMethod} page`,
                async () => {
                    // Preparation
                    await BillingTestUtil.saveCard();
                    const { render: PurchasingInfoPage } = await BillingTestUtil.renderLoggedIn(
                        <PurchasingInformationPage />,
                    );
                    await checkSavedCards(true, dummyCard.misc.nickname.initial, true);
                    await click(page.savedCards.editButton);

                    PurchasingInfoPage.unmount();
                    const { render: PaymentTool } = await BillingTestUtil.renderLoggedIn(<PaymentMethodTool />, false);

                    await checkToHaveValue(input.cardNumber, dummyCard.general.cardNumber, false);
                    await checkToHaveValue(input.expirationDate, dummyCard.general.expirationDate);
                    await checkToHaveValue(input.nickname, dummyCard.misc.nickname.initial);

                    await checkToHaveValue(input.cardholderName, dummyCard.general.cardholderName);
                    await checkToHaveValue(input.addressLine1, dummyCard.address.addressLine1);
                    await checkToHaveValue(input.addressLine2, dummyCard.address.addressLine2);
                    await checkToHaveValue(input.city, dummyCard.address.city);
                    await checkToHaveValue(input.zip, +dummyCard.address.zip);
                    await checkToHaveValue(input.state, dummyCard.address.state);
                    await checkToHaveValue(input.country, dummyCard.address.country);

                    await checkToHaveValue(input.cvc, '');

                    const checkboxMatchers = expect(await findByTestId(input.preferredCheckbox));
                    if (dummyCard.misc.preferred) checkboxMatchers.toBeChecked();
                    else checkboxMatchers.not.toBeChecked();

                    // Test
                    await submitForm(true);
                    await waitFor(async () => await checkToBeInDocument(paymentMethodTool.successModal));

                    PaymentTool.unmount();
                    await BillingTestUtil.renderLoggedIn(<PurchasingInformationPage />, false);
                    await checkSavedCards(true, dummyCard.misc.nickname.edit, false);
                },
                TIMEOUT.testMs,
            );
        });
    });

    describe(BillingService.getInvoices.name, () => {
        const { invoice } = profile.billing.page;

        afterEach(async () => await BillingTestUtil.clean());

        it(
            `Should show payments history on ${Route.Billing} page`,
            async () => {
                // Preparation
                await BillingTestUtil.subscribePlan('Pro', RecurrencyEnum.monthly);
                await BillingTestUtil.renderLoggedIn(<BillingPage />, false);

                // Test
                await waitFor(async () => await checkToBeInDocument(invoice.row, 1));
                await checkTextContent(invoice.name, 'Tidal' as PlanName);
            },
            TIMEOUT.testMs,
        );
    });

    describe(SubscribePage.name, () => {
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
                                    } as Subscription),
                                ]),
                            } as Pick<UserData, 'subscriptions' | 'ternKeyPurchased'>),
                        }),
                    ),
                );
            };
        };

        const doSubscribe = async (
            loggedIn: boolean,
            success: boolean,
            config?: { savedCard?: true; fullAddress?: string },
        ) => {
            const { savedCard, fullAddress } = config || {};

            let Page: RenderResult;
            if (loggedIn) {
                const { render } = await BillingTestUtil.renderLoggedIn(<PricingAndPlansPage />);
                Page = render;
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

            if (!savedCard) {
                await change(paymentForm.input.cardNumber, dummyCard.general.cardNumber);
                await change(paymentForm.input.expirationDate, dummyCard.general.expirationDate);
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
            } else await waitFor(async () => await checkToBeInDocument(paymentForm.input.savedCardIdx));

            await change(paymentForm.input.cvc, dummyCard.general.cvc);

            await click(paymentForm.input.termsCheckbox);

            await click(paymentForm.submitButton);

            await waitFor(
                async () => await checkToBeInDocument(success ? paymentForm.successModal : paymentForm.errorModal),
            );

            await check(success);
        };

        describe(BillingService.postProcessSavedPayment.name, () => {
            afterEach(async () => await BillingTestUtil.clean());

            it(
                `Should subscribe for Pro Monthly plan (using saved card)`,
                async () => {
                    // Preparation
                    await BillingTestUtil.saveCard();
                    // Test
                    await doSubscribe(true, true, { savedCard: true });
                },
                TIMEOUT.testMs,
            );
        });

        describe(BillingService.postProcessPayment.name, () => {
            afterEach(async () => await BillingTestUtil.clean());

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
                async () => await doSubscribe(true, true, { fullAddress: dummyCard.fullAddress.normal }),
                TIMEOUT.testMs,
            );

            it(
                `Should not subscribe for Pro Monthly plan (entering wrong full address)`,
                async () => await doSubscribe(true, false, { fullAddress: dummyCard.fullAddress.wrong }),
                TIMEOUT.testMs,
            );
        });
    });

    describe(BillingService.getPlanDetails.name + ' ' + BillingService.getUserActivePlans.name + ' - related', () => {
        const { links } = card;

        afterEach(async () => await BillingTestUtil.clean());

        const checkCards = async (count: number, buttonsDisabled: boolean[], links: string[], extension?: true) => {
            await waitFor(async () => await checkTextContent(card.name, '--', false, 'all'));
            await waitFor(async () => await checkToBeInDocument(card.container, count));

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
