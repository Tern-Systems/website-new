import React, {FC, useEffect, useState} from "react";
import Image from "next/image";

import {useModal} from "@/app/context";

import {Subscription, PaymentMethodToolView} from "./PaymentMethodTool";

import {CancelModal} from "./CancelModal";
import {ChangePaymentMethodModal} from "./ChangePaymentMethodModal";

import {Button, Editable, Select} from "@/app/components/form";

import SVG_CARD from "@/assets/images/icons/card.svg";


const ManageSubscriptionsView: FC = () => {
    const modalCtx = useModal();

    const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
    const [selectedSubscriptionIdx, setSelectedSubscriptionsIdx] = useState(-1);
    const [isDetailsExpanded, setDetailsExpandedState] = useState(false);

    useEffect(() => {
        // TODO fetch data
        setSubscriptions([
            {
                plan: {
                    planType: 'pro',
                    planRecurrency: 'monthly',
                    tax: 4.5,
                    priceUSD: 55.2,
                    lastBillingDate: 123,
                },
                savedCards: [
                    {
                        type: 'visa',
                        cardNumber: '1234123412341234',
                        expirationDate: '01/01',
                        cvc: '000',
                        cardholderName: 'NAME SURNAME',
                        billingCountry: 'US',
                        billingAddress: '123 St',
                        addressLine1: '',
                        addressLine2: '',
                        city: 'City',
                        postalCode: '98738',
                        state: 'State',
                        nickName: 'John’s Personal Debit Card',
                        isDefault: true
                    }
                ]
            },
            {
                plan: {
                    planType: 'standard',
                    planRecurrency: 'annual',
                    tax: 5.5,
                    priceUSD: 40.1,
                    lastBillingDate: 1234
                },
                savedCards: [],
            },
        ]);
    }, [])

    const selectedPlan: Subscription | undefined = subscriptions?.[+selectedSubscriptionIdx];
    const subscriptionOptions: Record<string, string> = Object.fromEntries(
        subscriptions?.map((subscription, index) =>
            [index, 'ARCH ' + subscription.plan.planType + ' Plan'])
        ?? []
    );

    // Elements
    const RenderPlanInfo = () => {
        if (!selectedPlan)
            return null;

        let SavedCards = selectedPlan.savedCards.map((method, index) => (
            <li key={method.nickName + index} className={'flex'}>
                <Image src={SVG_CARD} alt={'card'} className={'w-[1.35rem] mr-[0.65rem]'}/>
                <Editable
                    initialValue={method.nickName}
                    customEdit={() => modalCtx.openModal(
                        <ChangePaymentMethodModal savedCards={selectedPlan.savedCards}/>
                    )}
                />
            </li>
        ));

        if (!SavedCards.length)
            SavedCards = [<li key={0}>No saved cards</li>];

        let renewDate: Date;
        const billingDate = new Date(selectedPlan.plan.lastBillingDate ?? 0);
        if (selectedPlan.plan.planRecurrency === 'monthly')
            renewDate = new Date(new Date(billingDate).setMonth(billingDate.getMonth() + 1));
        else
            renewDate = new Date(new Date(billingDate).setFullYear(billingDate.getFullYear() + 1));

        return (
            <div className={'grid gap-[10rem] grid-rows-1 grid-cols-2 mt-[5.4rem]'}>
                <div>
                    <div className={'flex justify-between items-center'}>
                        <h2 className={'text-[1.6875rem] font-bold'}>Current Plan</h2>
                        <Button
                            className={'border-small border-control3 px-[1rem] text-[0.875rem] h-[1.44rem] rounded-full font-bold'}
                            onClick={() => modalCtx.openModal(<CancelModal/>)}
                        >
                            Cancel Plan
                        </Button>
                    </div>
                    <hr className={'border-control3 mt-[0.81rem] mb-[1.17rem]'}/>
                    <div className={'grid grid-rows-2 grid-cols-[max-content,1fr] gap-y-[0.93rem] mb-[0.93rem]'}>
                        <span>ARCH {selectedPlan.plan.planType} Plan</span>
                        <span className={'text-[1.125rem] text-right'}>
                            Your plan renews on {renewDate.toLocaleString('default', {month: 'long'})} {renewDate.getDate()}th, {renewDate.getFullYear()}
                        </span>
                        <span className={'font-bold'}>
                            ${selectedPlan.plan.priceUSD.toFixed(2)} per {selectedPlan.plan.planRecurrency === 'monthly' ? 'month' : 'year'}
                        </span>
                    </div>
                    <Button
                        icon={'chevron'}
                        isIconFlippedY={isDetailsExpanded}
                        className={'flex-row-reverse text-[1rem] font-bold w-[6.875rem] [&_img]:w-[0.625rem] [&_img]:brightness-[30%] justify-end'}
                        onClick={() => setDetailsExpandedState(prevState => !prevState)}
                    >
                        {isDetailsExpanded ? 'Hide' : 'Show'} Details
                    </Button>
                    <div
                        hidden={!isDetailsExpanded}
                        className={`grid grid-rows-5 grid-cols-[1fr,min-content] bg-[#D9D9D9] w-[25.9375rem]
                                rounded-[1.4375rem] px-[1.56rem] py-[1.22rem] gap-y-[1rem] mt-[1rem]`}>
                        <span>ARCH {selectedPlan.plan.planType} Subscription</span>
                        <span className={'text-right'}>${selectedPlan.plan.priceUSD.toFixed(2)}</span>
                        <span className={'font-bold'}>Subtotal</span>
                        <span className={'font-bold text-right'}>${selectedPlan.plan.priceUSD.toFixed(2)}</span>
                        <hr className={'border-small border-control3 col-span-2 self-center'}/>
                        <span>Tax</span>
                        <span className={'text-right'}>${selectedPlan.plan.tax.toFixed(2)}</span>
                        <span className={'font-bold'}>Total</span>
                        <span
                            className={'font-bold text-right'}>${(selectedPlan.plan.priceUSD + selectedPlan.plan.tax).toFixed(2)}</span>
                    </div>
                </div>
                <div>
                    <h2 className={'text-[1.6875rem] font-bold'}>Payment Method</h2>
                    <hr className={'border-control3 mt-[0.81rem] mb-[1.17rem]'}/>
                    <ul className={'flex flex-col gap-[0.93rem]'}>
                        {SavedCards}
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={'w-[29.0625rem] text-nowrap'}>
                <h1 className={'text-[3rem] font-bold mb-[3.12rem] mt-[4.17rem]'}>
                    Manage Subscriptions
                </h1>
                <Select
                    options={subscriptionOptions}
                    value={selectedSubscriptionIdx.toString()}
                    placeholder={'Select'}
                    onChangeCustom={(value) => setSelectedSubscriptionsIdx(+value)}
                    classNameWrapper={'flex-col gap-y-[0.94rem]'}
                    className={`px-[0.62rem] w-full py-[0.8rem] h-[3.25rem] border-small rounded-[0.375rem] border-control3`}
                    classNameLabel={'font-bold place-self-start'}
                >
                    Choose Subscription to Manage
                </Select>
            </div>
            {RenderPlanInfo()}
            <span className={'block pt-[--py]'}/>
        </>
    );
}

export {ManageSubscriptionsView, PaymentMethodToolView}