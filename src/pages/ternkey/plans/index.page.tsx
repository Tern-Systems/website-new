import React, { FC, useEffect, useState } from 'react';
import { SubscriptionPreview } from '@/app/types/subscription';

import { BillingService } from '@/app/services';

import { PricingAndPlansScreen } from '@/app/ui/templates';
import { MessageModal } from '@/app/ui/modals';
import { useModal } from '@/app/context';

const PricingAndPlansPage: FC = () => {
    const modalCtx = useModal();

    const [subscription, setSubscription] = useState<SubscriptionPreview | null>(null);

    useEffect(() => {
        const fetchPlanDetails = async () => {
            try {
                const { payload: planPreview } = await BillingService.getPlanDetails('TernKey');
                setSubscription(planPreview);
            } catch (error: unknown) {
                if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        };
        fetchPlanDetails();
    }, []);

    return <PricingAndPlansScreen subscriptionData={subscription} />;
};

export default PricingAndPlansPage;
