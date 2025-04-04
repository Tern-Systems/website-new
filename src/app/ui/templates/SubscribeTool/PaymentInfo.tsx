'use client';

import { FC } from 'react';
import Image from 'next/image';

import { SubscriptionBase } from '@/app/types/subscription';

import { checkNumber } from '@/app/utils';

import SVG_INFO from '@/assets/images/icons/info.svg';

const Hr = <hr className={'my-n border-gray-l0 sm:my-xxs'} />;

interface Props {
    subscription: SubscriptionBase | null;
}

const PaymentInfo: FC<Props> = (props: Props) => {
    const { subscription } = props;

    const price: string = checkNumber(subscription?.priceUSD)
        ? '$' + subscription.priceUSD.toFixed(2)
        : '-- missing price --';
    const subtotal: string =
        checkNumber(subscription?.priceUSD) && subscription.recurrency
            ? '$' + (subscription.priceUSD * (subscription.recurrency === 'annual' ? 12 : 1)).toFixed(2)
            : '-- unable to calculate subtotal --';

    const subscriptionName = subscription?.subscription ?? '-- missing name --';

    return (
        <div
            className={`relative h-full w-1/2 flex-1 overflow-y-scroll bg-white pt-6xl shadow-2xl sm:x-[overflow-y-visible,p-xs,w-full,shadow-none,border-s,border-gray-l0]`}
        >
            <div className={`mx-auto w-full max-w-[28rem] font-bold`}>
                <h2 className={`mb-xs`}>Subscribe to {subscriptionName} Subscription</h2>
                <div
                    className={`mb-3xl grid grid-cols-[max-content,1fr] grid-rows-2 items-center gap-x-4xs-2 sm:mb-xs`}
                >
                    <span className={`row-span-2 text-48 sm:text-36`}>{price}</span>
                    <span className={'contents text-18 font-normal sm:text-12'}>
                        <span>per</span>
                        <span>month</span>
                    </span>
                </div>
                <div className={`grid grid-cols-[1fr,max-content] grid-rows-2 gap-y-4xs capitalize`}>
                    <span>
                        {subscriptionName} {subscription?.type ?? '-- missing type --'} Subscription
                    </span>
                    <span>{price}</span>
                    <span className={'sm:text-12 text-16 font-normal'}>
                        {subscription?.recurrency ? 'Billed ' + subscription?.recurrency : '-- missing recurrency --'}
                    </span>
                </div>
                {Hr}
                <div className={`grid auto-rows-min grid-cols-2 gap-y-4xs`}>
                    <span>Subtotal</span>
                    <span className={`justify-self-end`}>{subtotal}</span>
                    <span className={'sm:text-12 contents text-16 font-normal'}>
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
                    <span>{subtotal ?? '--'}</span>
                </div>
            </div>
        </div>
    );
};

PaymentInfo.displayName = PaymentInfo.name;

export { PaymentInfo };
