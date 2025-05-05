'use client';

import { useEffect, useState } from 'react';

import { SelectOptions } from '@/app/ui/form/Select';
import { SubscriptionBase } from '@/app/types/subscription';

import { SubscribeTool } from '@/app/ui/templates';
import { MessageModal } from '@/app/ui/modals';
import { arrayToRecord, generateArray } from '@/app/utils';
import { useModal } from '@/app/hooks';

// TODO remove templates
const SUBSCRIPTION_TEMPLATE: SubscriptionBase = {
    subscription: 'G25 Course',
    priceUSD: 20,
    recurrency: 'quarterly',
};

const SUBSCRIPTION_TEMPLATES: SubscriptionBase[] = generateArray(13).map((_, idx) => ({
    ...SUBSCRIPTION_TEMPLATE,
    subscription: SUBSCRIPTION_TEMPLATE.subscription + idx,
}));

function SubscribePage() {
    const modalCtx = useModal();

    const [subscriptions, setSubscriptions] = useState<SubscriptionBase[]>([]);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                setSubscriptions(SUBSCRIPTION_TEMPLATES);
            } catch (error: unknown) {
                if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        };
        fetchSubscriptions();
    }, []);

    const options: SelectOptions = arrayToRecord(
        subscriptions,
        (entry) => entry.subscription,
        (entry) => entry.subscription,
    );
    const subscriptionRecords = arrayToRecord(subscriptions, (subscription) => subscription.subscription);

    return <SubscribeTool select={{ title: 'Course', options, subscriptions: subscriptionRecords }} />;
}

export default SubscribePage;
