import React, {ReactElement, useEffect, useState} from "react";
import Image from "next/image";

import {Subscription} from "@/app/ui/templates/PaymentMethodTool";
import {Route} from "@/app/static";

import {formatDate} from "@/app/utils";
import {useModal, useUser} from "@/app/context";

import {Button, Select} from "@/app/ui/form";
import {CancelModal} from "./CancelModal";

import {FullPageLayout} from "@/app/ui/layout";

import SVG_CARD from "@/assets/images/icons/card.svg";
import {useLoginCheck} from "@/app/hooks";
import {CardData} from "@/app/types/billing";


const SUBSCRIPTIONS_TEMPLATE: Subscription[] = [
    {
        plan: {
            type: 'pro',
            recurrency: 'monthly',
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
                state: 'SC',
                nickName: 'John’s Personal Debit Card',
                isDefault: true
            }
        ]
    },
    {
        plan: {
            type: 'standard',
            recurrency: 'annual',
            tax: 5.5,
            priceUSD: 40.1,
            lastBillingDate: 1234
        },
        savedCards: [],
    },
];

function ManageSubscriptionsPage() {
    const userCtx = useUser();
    const modalCtx = useModal();
    const isLoggedIn = useLoginCheck();

    const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
    const [selectedSubscriptionIdx, setSelectedSubscriptionsIdx] = useState(-1);
    const [isDetailsExpanded, setDetailsExpandedState] = useState(false);
    // eslint-disable-next-line
    const [savedCards, setSavedCards] = useState<CardData[]>([]);
    const [defaultCardIdx, setDefaultCardIdx] = useState(-1);

    console.log('selectedSubscriptionIdx: ', selectedSubscriptionIdx)

    useEffect(() => {
        // TODO fetch data
        setSubscriptions(SUBSCRIPTIONS_TEMPLATE);
    }, [])

    if (!isLoggedIn)
        return null;

    const selectedPlan: Subscription | undefined = subscriptions?.[+selectedSubscriptionIdx];
    const subscriptionOptions: Record<string, string> = Object.fromEntries(
        subscriptions?.map((subscription, idx) =>
            [idx, 'ARCH ' + subscription.plan.type + ' Plan'])
        ?? []
    );

    let Cards: ReactElement[] = savedCards.map((card, idx) => {
        if (card.isDefault)
            setDefaultCardIdx(idx);
        return (
            <li key={card.cardNumber + idx} className={'flex gap-[0.65rem] text-content items-center'}>
                <Image src={SVG_CARD} alt={'card'} className={'size-[1.35419rem]'}/>
                <span>{card.nickName}</span>
                <span
                    hidden={!card.isDefault}
                    className={'text-note py-[0.28rem] px-[0.76rem] bg-control-white-d0 rounded-smallest1'}
                >
                Preferred
            </span>
            </li>
        );
    })

    if (!Cards.length) {
        Cards = [<span key={0}>No saved cards</span>];
    }

    // Elements
    const RenderPlanInfo = () => {
        if (!selectedPlan)
            return null;

        let SavedCards = selectedPlan.savedCards.map((method, idx) => (
            <li key={method.nickName + idx} className={'flex'}>
                <Image src={SVG_CARD} alt={'card'} className={'w-[1.35rem] mr-[0.65rem]'}/>
                {/*<Editable*/}
                {/*    icon={'pencil'}*/}
                {/*    initialValue={method.nickName}*/}
                {/*    customEdit={() => modalCtx.openModal(*/}
                {/*        <ChangePaymentMethodModal savedCards={selectedPlan.savedCards}/>*/}
                {/*    )}*/}
                {/*/>*/}
            </li>
        ));

        if (!SavedCards.length)
            SavedCards = [<li key={0}>No saved cards</li>];

        let renewDate: Date;
        const billingDate = new Date(selectedPlan.plan.lastBillingDate ?? 0);
        if (selectedPlan.plan.recurrency === 'monthly')
            renewDate = new Date(new Date(billingDate).setMonth(billingDate.getMonth() + 1));
        else
            renewDate = new Date(new Date(billingDate).setFullYear(billingDate.getFullYear() + 1));

        return (
            <div className={'grid gap-[10rem] grid-rows-1 grid-cols-2 mt-[5.4rem]'}>
                <div>
                    <div className={'flex justify-between items-center'}>
                        <h2 className={'text-header font-bold'}>Current Plan</h2>
                        <Button
                            className={'border-small border-control-white-d0 px-[1rem] text-small h-[1.44rem] rounded-full font-bold'}
                            onClick={() => modalCtx.openModal(<CancelModal/>, {darkenBg: true})}
                        >
                            Cancel Plan
                        </Button>
                    </div>
                    <hr className={'border-control-white-d0 mt-[0.81rem] mb-[1.17rem]'}/>
                    <div className={'grid grid-rows-2 grid-cols-[max-content,1fr] gap-y-[0.93rem] mb-[0.93rem]'}>
                        <span>ARCH {selectedPlan.plan.type} Plan</span>
                        <span className={'text-content-small text-right'}>
                            Your plan renews on {formatDate(renewDate)}
                        </span>
                        <span className={'font-bold'}>
                            ${selectedPlan.plan.priceUSD.toFixed(2)} per {selectedPlan.plan.recurrency === 'monthly' ? 'month' : 'year'}
                        </span>
                    </div>
                    <Button
                        icon={'chevron'}
                        isIconFlippedY={isDetailsExpanded}
                        className={'flex-row-reverse font-bold w-[6.875rem] [&_img]:w-[0.625rem] [&_img]:brightness-[30%] justify-end'}
                        onClick={() => setDetailsExpandedState(prevState => !prevState)}
                    >
                        {isDetailsExpanded ? 'Hide' : 'Show'} Details
                    </Button>
                    <div
                        className={`grid grid-rows-5 grid-cols-[1fr,min-content] bg-control-white-d0 w-[25.9375rem]
                                rounded-[1.4375rem] px-[1.56rem] py-[1.22rem] gap-y-[1rem] mt-[1rem] ${isDetailsExpanded ? '' : 'hidden'}`}>
                        <span>ARCH {selectedPlan.plan.type} Subscription</span>
                        <span className={'text-right'}>${selectedPlan.plan.priceUSD.toFixed(2)}</span>
                        <span className={'font-bold'}>Subtotal</span>
                        <span className={'font-bold text-right'}>${selectedPlan.plan.priceUSD.toFixed(2)}</span>
                        <hr className={'border-small border-control-white-d0 col-span-2 self-center'}/>
                        <span>Tax</span>
                        <span className={'text-right'}>${selectedPlan.plan.tax.toFixed(2)}</span>
                        <span className={'font-bold'}>Total</span>
                        <span
                            className={'font-bold text-right'}>${(selectedPlan.plan.priceUSD + selectedPlan.plan.tax).toFixed(2)}</span>
                    </div>
                </div>
                <div>
                    <h2 className={'text-header font-bold'}>Payment Method</h2>
                    <hr className={'border-control-white-d0 mt-[0.81rem] mb-[1.17rem]'}/>
                    <ul className={'flex flex-col gap-[0.93rem]'}>
                        {SavedCards}
                    </ul>
                    <div className={'mt-[150px]'}>
                        <h2 className={'text-header font-bold'}>Billing Details</h2>
                        <hr className={'border-control-white-d0 mt-[0.81rem] mb-[1.57rem]'}/>
                        <div className={'grid grid-rows-2 grid-cols-[max-content,max-content] gap-[3rem]'}>
                            <span>Name</span>
                            <span>{userCtx.userData?.email ?? '--'}</span>
                            <span>Billing Address</span>
                            <span>{savedCards?.[defaultCardIdx]?.billingAddress ?? '--'}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={'pt-[9.14rem] px-[1.83rem]'}>
        <h1 className={'text-[3rem] font-bold mb-[3.12rem]'}>
            Manage Subscriptions
        </h1>
        <div className={'grid gap-[10rem] grid-rows-1 grid-cols-2 mt-[5.4rem]'}>
            <div className={'w-[29.0625rem] text-nowrap ml-[100px]'}>
                <Select
                    options={subscriptionOptions}
                    value={selectedSubscriptionIdx.toString()}
                    placeholder={'Select'}
                    onChangeCustom={(value) => setSelectedSubscriptionsIdx(+value)}
                    classNameWrapper={'flex-col gap-y-[0.94rem]'}
                    className={`px-[0.62rem] w-full py-[0.8rem] h-[3.25rem] border-small rounded-smallest border-control-white-d0`}
                    classNameLabel={'font-bold place-self-start'}
                >
                    Choose Subscription to Manage
                </Select>
            </div>
            {selectedSubscriptionIdx === -1 && <div className={'mt-[10px]'}>
                <h2 className={'text-header font-bold'}>Billing Details</h2>
                <hr className={'border-control-white-d0 mt-[0.81rem] mb-[1.57rem]'}/>
                <div className={'grid grid-rows-2 grid-cols-[max-content,max-content] gap-[3rem]'}>
                    <span>Name</span>
                    <span>{userCtx.userData?.email ?? '--'}</span>
                    <span>Billing Address</span>
                    <span>{savedCards?.[defaultCardIdx]?.billingAddress ?? '--'}</span>
                </div>
            </div>}
        </div>
            {RenderPlanInfo()}
            <span className={'block pt-[--p-small]'}/>
        </div>
    );
}


ManageSubscriptionsPage.getLayout = (page: ReactElement) => (
    <FullPageLayout backButtonSection={Route.Billing}>{page}</FullPageLayout>
);


export default ManageSubscriptionsPage