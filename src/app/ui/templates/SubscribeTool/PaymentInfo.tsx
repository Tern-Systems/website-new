import { FC } from 'react';
import Image from 'next/image';

import { SubscriptionBase } from '@/app/types/subscription';

import SVG_INFO from '/public/images/icons/info.svg';

interface Props {
    subscription: SubscriptionBase | null;
}

const PaymentInfo: FC<Props> = (props: Props) => {
    const { subscription } = props;

    const price: string | undefined = subscription?.priceUSD.toFixed(2).toString();
    const subtotal: string | undefined = subscription?.priceUSD
        ? (subscription?.priceUSD * (subscription?.recurrency === 'annual' ? 12 : 1)).toFixed(2)
        : undefined;

    const Hr = <hr className={'my-n border-gray-l0 sm:my-[0.94rem]'} />;

    return (
        <div
            className={`relative h-full w-1/2 flex-1 overflow-y-scroll bg-white pt-[7.44rem] shadow-2xl sm:x-[overflow-y-visible,p-xs,w-full,shadow-none,border-s,border-gray-l0]`}
        >
            <div className={`mx-auto w-full max-w-[28rem] font-bold`}>
                <h2 className={`mb-xs`}>Subscribe to {subscription?.subscription ?? '--'} Subscription</h2>
                <div
                    className={`mb-[3.75rem] grid grid-cols-[max-content,1fr] grid-rows-2 items-center gap-x-[0.4rem] sm:mb-xs`}
                >
                    <span className={`row-span-2 text-[3rem] sm:text-heading-l`}>${price ?? '--'}</span>
                    <span className={'contents text-section-s font-normal sm:text-section-xxs'}>
                        <span>per</span>
                        <span>month</span>
                    </span>
                </div>
                <div className={`grid grid-cols-[1fr,max-content] grid-rows-2 gap-y-[0.6rem] capitalize`}>
                    <span>
                        {subscription?.subscription ?? '--'} {subscription?.type ?? '--'} Subscription
                    </span>
                    <span>${price ?? '--'}</span>
                    <span className={'sm:text-section-xxxs text-basic font-normal'}>
                        Billed {subscription?.recurrency ?? '--'}
                    </span>
                </div>
                {Hr}
                <div className={`grid auto-rows-min grid-cols-2 gap-y-[0.6rem]`}>
                    <span>Subtotal</span>
                    <span className={`justify-self-end`}>${subtotal ?? '--'}</span>
                    <span className={'sm:text-section-xxxs contents text-basic font-normal'}>
                        <span className={'flex items-center'}>
                            <span>Tax</span>
                            <Image
                                src={SVG_INFO}
                                alt={'info'}
                                className={'ml-[0.2rem] inline h-auto w-[0.6875rem]'}
                            />
                        </span>
                        <span className={'justify-self-end'}>Calculated by address</span>
                    </span>
                </div>
                {Hr}
                <div className={`flex justify-between`}>
                    <span>Total due today</span>
                    <span>${subtotal ?? '--'}</span>
                </div>
            </div>
        </div>
    );
};

export { PaymentInfo };
