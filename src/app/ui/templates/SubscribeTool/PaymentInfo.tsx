'use client';

import { Dispatch, FC, SetStateAction } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { DataTestID } from '@/tests/static';

import { SubscriptionBase } from '@/app/types/subscription';
import { Fallback } from '@/app/static';

import { H3 } from '@/app/ui/atoms';
import { Select, SelectOptions } from '@/app/ui/form/Select';

import { checkNumber } from '@/app/utils';

import SVG_INFO from '@/assets/images/icons/info.svg';

import styles from './Subscribe.module.css';

const TestID = DataTestID.page.subscribe.paymentInfo;

type SubscriptionOptions = {
    select?: {
        title: string;
        options: SelectOptions;
        subscriptions: Record<string, SubscriptionBase>;
    };
};

const Hr = <hr className={'my-n border-gray-l0 sm:my-xxs'} />;

interface Props extends SubscriptionOptions {
    subscriptionState: [SubscriptionBase | null, Dispatch<SetStateAction<SubscriptionBase | null>>];
}

const PaymentInfo: FC<Props> = (props: Props) => {
    const { subscriptionState, select } = props;
    const [subscription, setSubscription] = subscriptionState;

    const price: string = checkNumber(subscription?.priceUSD) ? '$' + subscription.priceUSD.toFixed(2) : Fallback;
    const subtotal: string =
        checkNumber(subscription?.priceUSD) && subscription.recurrency
            ? '$' + (subscription.priceUSD * (subscription.recurrency === 'annual' ? 12 : 1)).toFixed(2)
            : Fallback;

    const subscriptionName = subscription?.subscription ?? Fallback;

    return (
        <div className={cn(`font-bold`, styles.form)}>
            {select ? (
                <Select
                    options={select.options}
                    value={subscription?.subscription?.toLowerCase()}
                    onChange={(value) => setSubscription(select.subscriptions[value])}
                    className={{
                        wrapper: 'flex-col !items-start gap-y-3xs-1 pb-xl',
                        select: styles.select,
                        option: styles.control,
                        label: 'font-normal',
                    }}
                >
                    {select.title} Subscription(s)
                </Select>
            ) : null}
            <p
                data-testid={TestID.heading}
                className={`mb-xs text-21`}
            >
                Subscribe to {subscriptionName} Subscription
            </p>
            <div className={`grid grid-cols-[max-content,1fr] grid-rows-2 items-center gap-x-4xs-2  sm:mb-xs mb-3xl`}>
                <span
                    data-testid={TestID.price}
                    className={`row-span-2 text-48 sm:text-36`}
                >
                    {price}
                </span>
                <span className={'contents text-18 font-normal sm:text-12'}>
                    <span>per</span>
                    <span>month</span>
                </span>
            </div>
            <div className={`grid grid-cols-[1fr,max-content] grid-rows-2 gap-y-4xs capitalize`}>
                <span data-testid={TestID.subscription}>
                    {subscriptionName} {subscription?.type ? subscription?.type + ' ' : ''} Subscription
                </span>
                <span data-testid={TestID.price}>{price}</span>
                <span className={'sm:text-12 text-16 font-normal'}>
                    {'Billed ' + (subscription?.recurrency ?? Fallback)}
                </span>
            </div>
            {Hr}
            <div className={`grid auto-rows-min grid-cols-2 gap-y-4xs`}>
                <span>Subtotal</span>
                <span
                    data-testid={TestID.subtotal}
                    className={`justify-self-end`}
                >
                    {subtotal}
                </span>
                <span className={'contents font-normal  sm:text-12 text-16'}>
                    <span className={'flex items-center'}>
                        <span>Tax</span>
                        <Image
                            src={SVG_INFO}
                            alt={'info'}
                            className={'ml-6xs inline h-auto w-[0.6875rem]'}
                        />
                    </span>
                    <span className={'justify-self-end'}>Calculated by address</span>
                </span>
            </div>
            {Hr}
            <div className={`flex justify-between`}>
                <span>Total due today</span>
                <span data-testid={TestID.due}>{subtotal ?? Fallback}</span>
            </div>
        </div>
    );
};

PaymentInfo.displayName = PaymentInfo.name;

export type { SubscriptionOptions };
export { PaymentInfo };
