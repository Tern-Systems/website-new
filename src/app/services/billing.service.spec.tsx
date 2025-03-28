import { DataTestID, TIMEOUT } from '@/__tests__/static';

import {
    BillingTestUtil,
    checkTextContent,
    checkToBeInDocument,
    findAllByTestId,
    render,
    waitFor,
} from '@/__tests__/utils';

import { Subscription } from '@/app/types/subscription';
import { Route } from '@/app/static';

import { BillingServiceImpl } from '@/app/services/billing.service';

import PricingAndPlansPage from '@/pages/product/plans/index.page';

const { page } = DataTestID;
const { tidal } = page;

describe(BillingServiceImpl.name, () => {
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
});
