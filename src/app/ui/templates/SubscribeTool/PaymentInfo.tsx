import {FC} from "react";
import Image from "next/image";

import {SubscriptionBase} from "@/app/types/subscription";

import SVG_INFO from '@/assets/images/icons/info.svg';


interface Props {
    subscription: SubscriptionBase | null;
}

const PaymentInfo: FC<Props> = (props: Props) => {
    const {subscription} = props;

    const price: string | undefined = subscription?.priceUSD.toFixed(2).toString();
    const subtotal: string | undefined = subscription?.priceUSD
        ? (subscription?.priceUSD * (subscription?.recurrency === 'annual' ? 12 : 1)).toFixed(2)
        : undefined;

    const Hr = <hr className={'border-control-gray-l0   my-[1.88rem]    sm:my-[0.94rem]'}/>;

    return (
        <div className={`relative flex-1 w-1/2 h-full overflow-y-scroll bg-white shadow-2xl
                        pt-[7.44rem] 
                        sm:x-[overflow-y-visible,p-[--p-content-sm],w-full,shadow-none,border-small,border-control-gray-l0]`}
        >
            <div className={`mx-auto max-w-[28rem] w-full font-bold`}>
                <h2 className={`mb-[--p-content-sm]`}>
                    Subscribe to {subscription?.subscription ?? '--'} Subscription
                </h2>
                <div
                    className={`grid grid-rows-2 grid-cols-[max-content,1fr] items-center 
                                gap-x-[0.4rem] mb-[3.75rem]
                                sm:mb-[--p-content-sm]`}
                >
                    <span className={`row-span-2  text-[3rem]  sm:text-heading-l`}>${price ?? '--'}</span>
                    <span className={'contents font-normal  text-section-s  sm:text-section-xxs'}>
                        <span>per</span>
                        <span>month</span>
                    </span>
                </div>
                <div className={`grid grid-rows-2 grid-cols-[1fr,max-content] capitalize gap-y-[0.6rem]`}
                >
                    <span>{subscription?.subscription ?? '--'} {subscription?.type ?? '--'} Subscription</span>
                    <span>${price ?? '--'}</span>
                    <span className={'font-normal   text-basic  sm:text-section-xxxs'}>Billed {subscription?.recurrency ?? '--'}</span>
                </div>
                {Hr}
                <div className={`grid auto-rows-min grid-cols-2 gap-y-[0.6rem]`}
                >
                    <span>Subtotal</span>
                    <span className={` justify-self-end`}>${subtotal ?? '--'}</span>
                    <span className={'contents font-normal   text-basic  sm:text-section-xxxs'}>
                        <span className={'flex items-center'}>
                            <span>Tax</span>
                            <Image src={SVG_INFO} alt={'info'} className={'inline ml-[0.2rem] w-[0.6875rem] h-auto'}/>
                        </span>
                        <span className={'justify-self-end'}>Calculated by address</span>
                    </span>
                    <span className={'justify-self-end text-content-small'}>Calculated by address</span>
                </div>
                {Hr}
                <div className={`flex justify-between`}>
                    <span>Total due today</span>
                    <span>${subtotal ?? '--'}</span>
                </div>
            </div>
        </div>
    );
}

export {PaymentInfo}