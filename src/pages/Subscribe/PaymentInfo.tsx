import {FC} from "react";

import {Subscription} from "@/app/types/subscription";

import {Button} from "@/app/ui/form";


interface Props {
    subscription: Subscription | null;
}

const PaymentInfo: FC<Props> = (props: Props) => {
    const {subscription} = props;

    const price: string | undefined = subscription?.priceUSD.toFixed(2).toString();
    const subtotal: string | undefined = subscription?.priceUSD
        ? (subscription?.priceUSD * (subscription?.recurrency === 'annual' ? 12 : 1)).toFixed(2)
        : undefined;

    return (
        <div className={'flex-1 pt-[9.14rem] w-1/2 bg-white overflow-y-scroll'}>
            <div className={'w-[28.125rem] mx-auto'}>
                <h2 className={`mb-[1.25rem] font-bold text-[1.3125rem]`}>
                    Subscribe to <span className={'capitalize'}>{subscription?.subscription ?? '--'}</span> Subscription
                </h2>
                <div
                    className={'grid grid-rows-2 grid-cols-[max-content,1fr] gap-x-[0.4rem] mb-[3.75rem] items-center'}>
                    <span className={'row-span-2 text-[3rem] font-bold text-form'}>${price ?? '--'}</span>
                    <span>per</span>
                    <span>month</span>
                </div>
                <div className={'grid grid-rows-2 grid-cols-[1fr,max-content] gap-y-[0.2rem]'}>
                    <span className={'font-bold text-[1.3125rem] capitalize'}>
                        {subscription?.subscription ?? '--'} {subscription?.type ?? '--'} Subscription
                    </span>
                    <span className={'font-bold text-[1.3125rem]'}>${price ?? '--'}</span>
                    <span className={'capitalize'}>Billed {subscription?.recurrency ?? '--'}</span>
                </div>
                <hr className={'my-[1.5rem] border-control3'}/>
                <div className={'grid auto-rows-min grid-cols-2 gap-y-[0.95rem]'}>
                    <span className={'font-bold text-[1.3125rem]'}>Subtotal</span>
                    <span className={`font-bold text-[1.3125rem] justify-self-end`}>${subtotal ?? '--'}</span>
                    <span className={'flex'}><span>Tax&nbsp;</span><Button icon={'info'}/></span>
                    <span className={'justify-self-end'}>Calculated by address</span>
                </div>
                <hr className={'my-[1.5rem] border-control3'}/>
                <div className={`font-bold text-[1.3125rem] flex justify-between`}>
                    <span>Total due today</span>
                    <span>${subtotal ?? '--'}</span>
                </div>
            </div>
        </div>
    );
}

export {PaymentInfo}