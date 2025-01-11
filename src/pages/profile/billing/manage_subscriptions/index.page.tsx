import React, {ReactElement, useEffect, useState} from "react";
import {ReactSVG} from "react-svg";
import Image from "next/image";
import cn from "classnames";

import {SavedCard} from "@/app/types/billing";
import {Subscription} from "@/app/types/subscription";
import {Route} from "@/app/static";

import {BillingService} from "@/app/services";

import {formatDate} from "@/app/utils";
import {useLoginCheck} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {ScrollEnd} from "@/app/ui/misc";
import {MessageModal} from "@/app/ui/modals";
import {FullScreenLayout} from "@/app/ui/layout";
import {Button, Select} from "@/app/ui/form";
import {CancelModal} from "./CancelModal";
import {ChangePaymentMethodModal} from "./ChangePaymentMethodModal";


import SVG_CARD from "/public/images/icons/card.svg";
import SVG_PENCIL from "/public/images/icons/edit.svg";


const SELECT_H_CN = 'h-[min(5.9dvw,3.25rem)] sm:landscape:h-[--2dr]';


function ManageSubscriptionsPage() {
    const modalCtx = useModal();
    const {userData} = useUser();
    const isLoggedIn = useLoginCheck();

    const [selectedSubscriptionIdx, setSelectedSubscriptionsIdx] = useState(-1);
    const [isDetailsExpanded, setDetailsExpandedState] = useState(false);
    // eslint-disable-next-line
    const [savedCards, setSavedCards] = useState<SavedCard[]>([]);

    useEffect(() => {
        const fetchCards = async () => {
            if (!userData)
                return;
            try {
                const {payload: cards} = await BillingService.getCards(userData.email);
                setSavedCards(cards);
            } catch (error: unknown) {
                if (typeof error === 'string')
                    modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        }
        fetchCards();
        // eslint-disable-next-line
    }, [setSavedCards, userData])

    if (!isLoggedIn)
        return null;

    const subscriptions = userData?.subscriptions;

    const selectedPlan: Subscription | undefined = subscriptions?.[+selectedSubscriptionIdx];
    const subscriptionOptions: Record<string, string> = Object.fromEntries(
        subscriptions?.map((subscription, idx) =>
            [idx, subscription.subscription.toUpperCase() + ' ' + subscription.type + ' Plan'])
        ?? []
    );

    // Elements
    const RenderPlanInfo = () => {
        if (!selectedPlan)
            return null;

        let SavedCards = savedCards.map((method, idx) => (
            <li key={method.nickName + idx} className={'flex [&&_path]:fill-gray items-center'}>
                <span className={'flex gap-x-[--s-d2l-smallest] items-center'}>
                    <Image src={SVG_CARD} alt={'card'} className={'w-[1.35rem] h-auto'}/>
                    <span className={'text-content sm:landscape:text-content-small'}>{method.nickName}</span>
                    <span className={`flex items-center px-[--s-d-small] h-[min(3.5dvw,1.3rem)] rounded-smallest1
                                    bg-control-white-d0 text-gray text-center text-note font-oxygen`}>
                        Preferred
                    </span>
                </span>
                <ReactSVG
                    src={SVG_PENCIL.src}
                    onClick={() => modalCtx.openModal(
                        <ChangePaymentMethodModal savedCards={savedCards}/>,
                        {darkenBg: true}
                    )}
                    className={'size-[min(2.4dvw,0.8rem)] [&_path]:fill-primary ml-auto cursor-pointer'}
                />
            </li>
        ));

        if (!SavedCards.length)
            SavedCards = [<li key={0} className={'text-gray'}>No saved cards</li>];

        const Hr = <hr className={'border-control-white-d0 mt-[--s-small] mb-[min(5.3dvw,1.2rem)]'}/>;

        return (
            <div className={`grid grid-cols-2 text-default
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
                        className={`grid grid-rows-2 grid-cols-[max-content,1fr]
                                    gap-y-[--1dr] mb-[--1dr]
                                    sm:landscape:x-[gap-y-[--s-d-small],mb-[--s-d-small]]`}>
                        <span className={'capitalize'}>
                            {selectedPlan.subscription} {selectedPlan.type} Plan
                        </span>
                        <span className={'text-small text-right sm:landscape:text-small whitespace-pre-line'}>
                            Your plan renews on {formatDate(new Date(selectedPlan.renewDate))}
                        </span>
                        <span className={'font-bold'}>
                            ${selectedPlan.priceUSD.toFixed(2)} per {selectedPlan.recurrency === 'monthly' ? 'month' : 'year'}
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
                             rounded-[--s-normal] bg-control-white-d0
                             sm:landscape:mt-[--s-d-small]`,
                            {['hidden']: !isDetailsExpanded})}
                    >
                        <span className={'capitalize'}>
                            {selectedPlan.subscription} {selectedPlan.type} Subscription
                        </span>
                        <span className={'text-right'}>${selectedPlan.priceUSD.toFixed(2)}</span>
                        <span className={'font-bold'}>Subtotal</span>
                        <span className={'font-bold text-right'}>${selectedPlan.priceUSD.toFixed(2)}</span>
                        <hr className={'border-small border-control-white-d0 col-span-2 self-center'}/>
                        <span>Tax</span>
                        <span className={'text-right'}>${selectedPlan.tax.toFixed(2)}</span>
                        <span className={'font-bold'}>Total</span>
                        <span
                            className={'font-bold text-right'}>${(selectedPlan.priceUSD + selectedPlan.tax).toFixed(2)}</span>
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
            <div className={`mt-[5.4rem] px-[min(2.7dvw,0.625rem)] text-nowrap
                            sm:mt-[--2dr]
                            sm:portrait:px-0`}>
                <Select
                    options={subscriptionOptions}
                    value={selectedSubscriptionIdx.toString()}
                    placeholder={'Select'}
                    onChangeCustom={(value) => setSelectedSubscriptionsIdx(+value)}
                    classNameWrapper={`flex-col gap-y-[--1dr] w-[min(50dvw,29rem)]
                                        sm:landscape:x-[gap-y-[0.75dvw],w-[30dvw],text-content-small]`}
                    classNameLabel={'font-bold place-self-start sm:landscape:text-content-small'}
                    classNameOption={SELECT_H_CN}
                    className={`px-[--s-d2l-smallest] w-full py-[min(2dvw,0.8rem)] border-small rounded-smallest
                                    border-control-white-d0 ${SELECT_H_CN}`}
                >
                    Choose Subscription to Manage
                </Select>
                {RenderPlanInfo()}
            </div>
            <ScrollEnd/>
        </div>
    );
}


ManageSubscriptionsPage.getLayout = (page: ReactElement) => (
    <FullScreenLayout backButtonSection={Route.Billing}>{page}</FullScreenLayout>
);
ManageSubscriptionsPage.getMobileLayout = ManageSubscriptionsPage.getLayout;


export default ManageSubscriptionsPage;
