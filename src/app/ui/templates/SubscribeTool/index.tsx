'use client';

import { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import { SubscriptionBase } from '@/app/types/subscription';

import { useLoginCheck } from '@/app/hooks';

import { BreadcrumbRoute, Content, Section } from '@/app/ui/atoms';
import { PaymentInfo, SubscriptionOptions } from './PaymentInfo';
import { PaymentForm } from './PaymentForm';

interface Props extends SubscriptionOptions {}

const SubscribeTool: FC<Props> = (props: Props) => {
    const { select } = props;

    const [subscription, setSubscription] = useState<SubscriptionBase | null>(null);
    const loggedIn = useLoginCheck();

    useEffect(() => {
        const subscriptionData = sessionStorage.getItem('subscription');
        if (subscriptionData) setSubscription(JSON.parse(subscriptionData) as SubscriptionBase);
    }, []);

    if (!loggedIn) return null;

    return (
        <Content
            type={'blue-to-right'}
            className={'pt-5xl'}
        >
            <Section>
                <BreadcrumbRoute className={'text-18'} />
                <div
                    className={cn(
                        `grid pt-6xl h-full`,
                        `sm:grid-cols-1 grid-cols-2`,
                        `sm:gap-y-6xl-1 md:gap-x-xxl lg:gap-x-7xl-1`,
                        `sm:text-16 text-21`,
                    )}
                >
                    <PaymentInfo
                        subscriptionState={[subscription, setSubscription]}
                        select={select}
                    />
                    <PaymentForm
                        type={subscription?.type}
                        recurrency={subscription?.recurrency}
                        priceUSD={subscription?.priceUSD}
                    />
                </div>
            </Section>
        </Content>
    );
};

SubscribeTool.displayName = SubscribeTool.name;

export { SubscribeTool };
