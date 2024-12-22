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

    const Hr = <hr className={'my-[min(4dvw,1.5rem)] border-control-gray-l0'}/>;

    return (
        <div
            className={'relative flex-1 pt-[min(5.3dvw,9.1rem)] w-1/2 bg-control-white overflow-y-scroll shadow-2xl sm:overflow-y-visible sm:w-full sm:shadow-none'}>
            <div className={'max-w-[min(90dvw,28rem)] mx-auto'}>
                <h2 className={`mb-[1.25rem] font-bold text-content`}>
                    Subscribe to <span className={'capitalize'}>{subscription?.subscription ?? '--'}</span> Subscription
                </h2>
                <div
                    className={'grid grid-rows-2 grid-cols-[max-content,1fr] gap-x-[min(1.3dvw,0.4rem)] mb-[min(4dvw,3.75rem)] items-center'}>
                    <span className={'row-span-2 text-[3rem] font-bold text-gray'}>${price ?? '--'}</span>
                    <span>per</span>
                    <span>month</span>
                </div>
                <div className={'grid grid-rows-2 grid-cols-[1fr,max-content] gap-y-[min(2.7dvw,0.2rem)]'}>
                    <span className={'font-bold text-content capitalize'}>
                        {subscription?.subscription ?? '--'} {subscription?.type ?? '--'} Subscription
                    </span>
                    <span className={'font-bold text-content'}>${price ?? '--'}</span>
                    <span className={'capitalize text-content-small'}>Billed {subscription?.recurrency ?? '--'}</span>
                </div>
                {Hr}
                <div className={'grid auto-rows-min grid-cols-2 gap-y-[min(2.7dvw,0.2rem)]'}>
                    <span className={'font-bold text-content'}>Subtotal</span>
                    <span className={`font-bold text-content justify-self-end`}>${subtotal ?? '--'}</span>
                    <span className={'flex text-content-small'}>
                        <Button icon={'info'} className={'cursor-default flex-row-reverse'}>Tax</Button>
                    </span>
                    <span className={'justify-self-end text-content-small'}>Calculated by address</span>
                </div>
                {Hr}
                <div className={`font-bold text-content flex justify-between`}>
                    <span>Total due today</span>
                    <span>${subtotal ?? '--'}</span>
                </div>
            </div>
        </div>
    );
}

export {PaymentInfo}