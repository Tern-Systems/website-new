import {FC} from "react";

import {PLAN} from "@/app/components/views/Pricing";

import {PlanRecurrency, PlanType} from "@/app/context";

import {Button} from "@/app/components/form";

interface PaymentInfoProps {
    planType: NonNullable<PlanType>;
    reccurency: PlanRecurrency;
}

const PaymentInfo: FC<PaymentInfoProps> = (props: PaymentInfoProps) => {
    const {planType, reccurency} = props;

    const price = PLAN[planType]?.priceUSD[reccurency].toFixed(2);
    const subtotal = (+price * (reccurency === 'annual' ? 12 : 1)).toFixed(2);

    return (
        <div className={'flex-1 pt-[7.44rem] w-1/2 bg-white overflow-y-scroll'}>
            <div className={'w-[28.125rem] mx-auto'}>
                <h2 className={`mb-[1.25rem] font-bold text-[1.3125rem]`}>
                    Subscribe to TernKey Pro Subscription
                </h2>
                <div
                    className={'grid grid-rows-2 grid-cols-[min-content,1fr] gap-x-[0.4rem] mb-[3.75rem] items-center'}>
                    <span className={'row-span-2 text-[3rem] font-bold text-form'}>${price}</span>
                    <span>per</span>
                    <span>month</span>
                </div>
                <div className={'grid grid-rows-2 grid-cols-[1fr,min-content] gap-y-[0.2rem]'}>
                    <span className={'font-bold text-[1.3125rem]'}>ARCH {planType} Subscription</span>
                    <span className={'font-bold text-[1.3125rem]'}>${price}</span>
                    <span>Billed {reccurency}</span>
                </div>
                <hr className={'my-[1.5rem] border-control3'}/>
                <div className={'grid auto-rows-min grid-cols-2 gap-y-[0.95rem]'}>
                    <span className={'font-bold text-[1.3125rem]'}>Subtotal</span>
                    <span className={`font-bold text-[1.3125rem] justify-self-end`}>${subtotal}</span>
                    <span className={'flex'}><span>Tax&nbsp;</span><Button icon={'info'}/></span>
                    <span className={'justify-self-end'}>Calculated by address</span>
                </div>
                <hr className={'my-[1.5rem] border-control3'}/>
                <div className={`${'font-bold text-[1.3125rem]'} flex justify-between`}>
                    <span>Total due today</span>
                    <span>${subtotal}</span>
                </div>
            </div>
        </div>
    );
}

export {PaymentInfo}