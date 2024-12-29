import React, {FC, ReactElement, useEffect, useState} from "react";
import {ReactSVG} from "react-svg";
import Image from "next/image";
import cn from "classnames";

import {CardData} from "@/app/types/billing";

import {SubscriptionData} from "@/app/ui/templates/PaymentMethodTool";
import {Route} from "@/app/static";

import {formatDate} from "@/app/utils";
import {useLoginCheck} from "@/app/hooks";
import {useModal} from "@/app/context";

import {ScrollEnd} from "@/app/ui/misc";
import {BaseModal} from "@/app/ui/modals";
import {FullScreenLayout} from "@/app/ui/layout";
import {Button, Select} from "@/app/ui/form";
import {CancelModal} from "./CancelModal";
import {ChangePaymentMethodModal} from "./ChangePaymentMethodModal";


import SVG_CARD from "@/assets/images/icons/card.svg";
import SVG_PENCIL from "@/assets/images/icons/edit.svg";

const SELECT_H_CN = 'h-[min(5.9dvw,3.25rem)] sm:landscape:h-[--2dr]';

const SUBSCRIPTIONS_TEMPLATE: SubscriptionData[] = [
    {
        plan: {
            subscription: 'arch',
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
            subscription: 'ternKey',
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
    const modalCtx = useModal();
    const isLoggedIn = useLoginCheck();

    const [subscriptions, setSubscriptions] = useState<SubscriptionData[] | null>(null);
    const [selectedSubscriptionIdx, setSelectedSubscriptionsIdx] = useState(-1);
    const [isDetailsExpanded, setDetailsExpandedState] = useState(false);
    // eslint-disable-next-line
    const [savedCards, setSavedCards] = useState<CardData[]>([]);

    useEffect(() => {
        // TODO fetch data
        setSubscriptions(SUBSCRIPTIONS_TEMPLATE);
    }, [])

    if (!isLoggedIn)
        return null;

    const selectedPlan: SubscriptionData | undefined = subscriptions?.[+selectedSubscriptionIdx];
    const subscriptionOptions: Record<string, string> = Object.fromEntries(
        subscriptions?.map((subscription, idx) =>
            [idx, 'ARCH ' + subscription.plan.type + ' Plan'])
        ?? []
    );

    let Cards: ReactElement[] = savedCards.map((card, idx) => (
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
        )
    );

    if (!Cards.length) {
        Cards = [<span key={0}>No saved cards</span>];
    }

    // Elements
    const RenderPlanInfo = () => {
        if (!selectedPlan)
            return null;

        let SavedCards = selectedPlan.savedCards.map((method, idx) => (
            <li key={method.nickName + idx} className={'flex [&&_path]:fill-gray items-center'}>
                <span className={'flex gap-x-[--s-d2l-smallest] items-center'}>
                    <Image src={SVG_CARD} alt={'card'} className={'w-[1.35rem]'}/>
                    <span className={'text-content sm:landscape:text-content-small'}>{method.nickName}</span>
                    <span className={`flex items-center px-[--s-d-small] h-[min(3.5dvw,1.3rem)] rounded-smallest1
                                    bg-control-white-d0 text-gray text-center text-note font-oxygen`}>
                        Preferred
                    </span>
                </span>
                <ReactSVG
                    src={SVG_PENCIL.src}
                    onClick={() => modalCtx.openModal(
                        <ChangePaymentMethodModal
                            savedCards={subscriptions?.[+selectedSubscriptionIdx].savedCards ?? []}/>,
                        {darkenBg: true}
                    )}
                    className={'size-[min(2.4dvw,0.8rem)] [&_path]:fill-primary ml-auto cursor-pointer'}
                />
            </li>
        ));

        if (!SavedCards.length)
            SavedCards = [<li key={0} className={'text-gray'}>No saved cards</li>];

        let renewDate: Date;
        const billingDate = new Date(selectedPlan.plan.lastBillingDate ?? 0);
        if (selectedPlan.plan.recurrency === 'monthly')
            renewDate = new Date(new Date(billingDate).setMonth(billingDate.getMonth() + 1));
        else
            renewDate = new Date(new Date(billingDate).setFullYear(billingDate.getFullYear() + 1));

        const Hr = <hr className={'border-control-white-d0 mt-[--s-small] mb-[min(5.3dvw,1.2rem)]'}/>;

        return (
            <div className={`grid grid-cols-2
                            gap-[min(13.3dvw,10rem)] mt-[min(13.3dvw,5.4rem)]
                            sm:x-[grid-cols-1,gap-y-[--2dr],mt-[--2dr]]`}
            >
                <div>
                    <div className={'flex justify-between items-center'}>
                        <h2 className={`text-header font-bold  sm:landscape:text-content`}>
                            Current Plan
                        </h2>
                        <Button
                            className={'border-small border-control-white-d0 px-[--1drs] text-small h-[--h-control] rounded-full font-bold'}
                            onClick={() => modalCtx.openModal(<CancelModal/>, {darkenBg: true})}
                        >
                            Cancel Plan
                        </Button>
                    </div>
                    {Hr}
                    <div
                        className={`grid grid-rows-2 grid-cols-[max-content,1fr] text-[--1drl]
                                    gap-y-[--1dr] mb-[--1dr]
                                    sm:landscape:x-[gap-y-[--s-d-small],mb-[--s-d-small]]`}>
                        <span className={'capitalize'}>
                            {selectedPlan.plan.subscription} {selectedPlan.plan.type} Plan
                        </span>
                        <span className={'text-content-small text-right sm:landscape:text-small'}>
                            Your plan renews on {formatDate(renewDate)}
                        </span>
                        <span className={'font-bold'}>
                            ${selectedPlan.plan.priceUSD.toFixed(2)} per {selectedPlan.plan.recurrency === 'monthly' ? 'month' : 'year'}
                        </span>
                    </div>
                    <Button
                        icon={'chevron'}
                        isIconFlippedY={isDetailsExpanded}
                        className={'flex-row-reverse font-bold [&_svg]:w-[0.625rem] [&_path]:fill-gray justify-end text-small'}
                        onClick={() => setDetailsExpandedState(prevState => !prevState)}
                    >
                        {isDetailsExpanded ? 'Hide' : 'Show'} Details
                    </Button>
                    <div
                        className={cn(
                            `grid grid-rows-5 grid-cols-[1fr,min-content] gap-y-[--1dr] mt-[--1dr]
                             px-[--s-normal] py-[--1qdrs] w-[66%] max-w-[26rem]
                             rounded-[--s-normal] bg-control-white-d0 text-default
                             sm:landscape:mt-[--s-d-small]`,
                            {['hidden']: !isDetailsExpanded})}
                    >
                        <span className={'capitalize'}>
                            {selectedPlan.plan.subscription} {selectedPlan.plan.type} Subscription
                        </span>
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
                    <h2 className={'text-header font-bold   sm:landscape:text-content'}>Payment Method</h2>
                    <hr className={'border-control-white-d0 mt-[0.81rem] mb-[1.17rem]'}/>
                    <ul className={'flex flex-col gap-[0.93rem]'}>
                        {SavedCards}
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className={`pt-[9.1rem] px-[1.8rem]  sm:pt-[1.8rem]`}>
            <h1 className={`font-bold text-header-l sm:landscape:text-content`}>
                Manage Subscriptions
            </h1>
            <div className={`grid gap-[10rem] grid-rows-1 grid-cols-2
                            mt-[5.4rem]
                            sm:mt-[--1dr]`}>
                <div className={'w-[min(50dvw,29rem)] text-nowrap sm:landscape:w-[30dvw]'}>
                    <Select
                        options={subscriptionOptions}
                        value={selectedSubscriptionIdx.toString()}
                        placeholder={'Select'}
                        onChangeCustom={(value) => setSelectedSubscriptionsIdx(+value)}
                        classNameWrapper={'flex-col gap-y-[--1dr]   sm:landscape:x-[gap-y-[0.75dvw],text-content-small]'}
                        classNameLabel={'font-bold place-self-start sm:landscape:text-content-small'}
                        classNameOption={SELECT_H_CN}
                        className={`px-[--s-d2l-smallest] w-full py-[min(2dvw,0.8rem)] border-small rounded-smallest
                                    border-control-white-d0 ${SELECT_H_CN}`}
                    >
                        Choose Subscription to Manage
                    </Select>
                </div>
            </div>
            {RenderPlanInfo()}
            <ScrollEnd/>
        </div>
    );
}


ManageSubscriptionsPage.getLayout = (page: ReactElement) => (
    <FullScreenLayout backButtonSection={Route.Billing}>{page}</FullScreenLayout>
);
ManageSubscriptionsPage.getMobileLayout = ManageSubscriptionsPage.getLayout;


const ManageSubscriptionsModal: FC = () => (
    <BaseModal adaptSmScreen
               className={'[&]:bg-control-white'}
               classNameContent={'sm:overflow-y-scroll sm:h-[90dvh] font-oxygen'}>
        <ManageSubscriptionsPage/>
    </BaseModal>
);


export {ManageSubscriptionsModal};
export default ManageSubscriptionsPage;
