import React, {ReactElement, useEffect, useState} from "react";
import {ReactSVG} from "react-svg";
import Image from "next/image";
import cn from "classnames";

import {SavedCardFull} from "@/app/types/billing";
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


const SELECT_H_CN = 'h-[min(5.9dvw,3.25rem)] sm:landscape:h-l';


function ManageSubscriptionsPage() {
    const modalCtx = useModal();
    const {userData} = useUser();
    const isLoggedIn = useLoginCheck();

    const [selectedSubscriptionIdx, setSelectedSubscriptionsIdx] = useState(-1);
    const [isDetailsExpanded, setDetailsExpandedState] = useState(false);
    const [updateCards, setUpdateCards] = useState(true);
    // eslint-disable-next-line
    const [savedCards, setSavedCards] = useState<SavedCardFull[]>([]);

    useEffect(() => {
        const fetchCards = async () => {
            if (!userData || !updateCards)
                return;
            try {
                const {payload: cards} = await BillingService.getEditCards(userData.email);
                setSavedCards(cards);
                setUpdateCards(false);
            } catch (error: unknown) {
                if (typeof error === 'string')
                    modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        }
        fetchCards();
        // eslint-disable-next-line
    }, [setSavedCards, userData, updateCards])

    if (!isLoggedIn)
        return null;

    const subscriptions = userData?.subscriptions
        ?.filter((subscription) => !subscription.type.toLowerCase().includes('basic'));

    const selectedPlan: Subscription | undefined = subscriptions?.[+selectedSubscriptionIdx];
    const subscriptionOptions: Record<string, string> = Object.fromEntries(
        subscriptions?.map((subscription, idx) =>
            [idx, subscription.subscription + ' ' + subscription.type + ' Plan'])
        ?? []
    );

    // Elements
    const RenderPlanInfo = () => {
        if (!selectedPlan)
            return null;

        let SavedCards = savedCards.map((method, idx) => (
            <li key={method.nickName + idx} className={'flex [&&_path]:fill-gray items-center'}>
                <span className={'flex items-center'}>
                    <Image src={SVG_CARD} alt={'card'} className={'w-[1.35rem] h-auto'}/>
                    <span
                        className={cn(
                            'block mx-5xs overflow-x-hidden leading-[1.3] overflow-ellipsis text-nowrap text-heading-s',
                            'sm:max-w-[70%] sm:landscape:text-section-s'
                        )}
                    >
                        {method.nickName ?? (method.cardType + ' **** ' + method.last4)}
                    </span>
                    <span className={cn(
                        `flex items-center px-3xs h-[min(3.5dvw,1.3rem)] rounded-xxs`,
                        `bg-white-d0 text-gray text-center text-basic`,
                        {['hidden']: !method.preferred}
                    )}
                    >
                        Preferred
                    </span>
                </span>
                <ReactSVG
                    src={SVG_PENCIL.src}
                    onClick={() => modalCtx.openModal(
                        <ChangePaymentMethodModal savedCards={savedCards} setUpdateCards={setUpdateCards}/>,
                        {darkenBg: true}
                    )}
                    className={'size-[min(2.4dvw,0.8rem)] [&_path]:fill-primary ml-auto cursor-pointer'}
                />
            </li>
        ));

        if (!SavedCards.length)
            SavedCards = [<li key={0} className={'text-gray'}>No saved cards</li>];

        const Hr = <hr className={'border-white-d0 mt-3xs mb-[min(5.3dvw,1.2rem)]'}/>;

        return (
            <div className={`grid grid-cols-2 text-basic
                            gap-[min(13.3dvw,10rem)] mt-[min(13.3dvw,5.4rem)]
                            sm:x-[grid-cols-1,gap-y-l,mt-l]`}
            >
                <div>
                    <div className={'flex justify-between items-center'}>
                        <h2 className={`text-heading font-bold  sm:landscape:text-heading-s`}>
                            Current Plan
                        </h2>
                        <Button
                            className={'border-s border-white-d0 px-xxs text-section h-h-button-n rounded-full font-bold'}
                            onClick={() => modalCtx.openModal(
                                <CancelModal plan={selectedPlan?.subscription}/>,
                                {darkenBg: true}
                            )}
                        >
                            Cancel Plan
                        </Button>
                    </div>
                    {Hr}
                    <div
                        className={`grid grid-rows-2 grid-cols-[max-content,1fr]
                                    gap-y-xxs mb-xxs
                                    sm:landscape:x-[gap-y-3xs,mb-3xs]`}>
                        <span className={'capitalize'}>
                            {selectedPlan.subscription} {selectedPlan.type} Plan
                        </span>
                        <span className={'text-section text-right sm:landscape:text-section whitespace-pre-line'}>
                            Your plan renews on {formatDate(new Date(selectedPlan.renewDate))}
                        </span>
                        <span className={'font-bold'}>
                            ${selectedPlan.priceUSD.toFixed(2)} per {selectedPlan.recurrency === 'monthly' ? 'month' : 'year'}
                        </span>
                    </div>
                    <Button
                        icon={'chevron'}
                        isIconFlippedY={isDetailsExpanded}
                        className={'flex-row-reverse font-bold [&_svg]:w-[0.625rem] [&_path]:fill-gray justify-end text-section'}
                        onClick={() => setDetailsExpandedState(prevState => !prevState)}
                    >
                        {isDetailsExpanded ? 'Hide' : 'Show'} Details
                    </Button>
                    <div
                        className={cn(
                            `grid grid-rows-5 grid-cols-[1fr,min-content] gap-y-xxs mt-xxs
                             px-s py-xs w-[66%] max-w-[26rem]
                             rounded-l bg-white-d0
                             sm:landscape:mt-3xs`,
                            {['hidden']: !isDetailsExpanded})}
                    >
                        <span className={'capitalize'}>
                            {selectedPlan.subscription} {selectedPlan.type} Subscription
                        </span>
                        <span className={'text-right'}>${selectedPlan.priceUSD.toFixed(2)}</span>
                        <span className={'font-bold'}>Subtotal</span>
                        <span className={'font-bold text-right'}>${selectedPlan.priceUSD.toFixed(2)}</span>
                        <hr className={'border-s border-white-d0 col-span-2 self-center'}/>
                        <span>Tax</span>
                        <span className={'text-right'}>${selectedPlan.tax.toFixed(2)}</span>
                        <span className={'font-bold'}>Total</span>
                        <span
                            className={'font-bold text-right'}>${(selectedPlan.priceUSD + selectedPlan.tax).toFixed(2)}</span>
                    </div>
                </div>
                <div>
                    <h2 className={'text-heading font-bold   sm:landscape:text-heading-s'}>Payment Method</h2>
                    <hr className={'border-white-d0 mt-[0.81rem] mb-[1.17rem]'}/>
                    <ul className={'flex flex-col gap-[0.93rem]'}>
                        {SavedCards}
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className={`pt-[9.1rem] px-[1.8rem]  sm:pt-[1.8rem]`}>
            <h1 className={`font-bold text-heading-l sm:landscape:text-heading-s`}>
                Manage Subscriptions
            </h1>
            <div className={`mt-[5.4rem] px-[min(2.7dvw,0.625rem)] text-nowrap
                            sm:mt-l
                            sm:portrait:px-0`}>
                <Select
                    options={subscriptionOptions}
                    value={selectedSubscriptionIdx.toString()}
                    placeholder={'Select'}
                    onChangeCustom={(value) => setSelectedSubscriptionsIdx(+value)}
                    classNameWrapper={`flex-col gap-y-xxs w-[min(50dvw,29rem)]
                                        sm:landscape:x-[gap-y-[0.75dvw],w-[30dvw],text-section-s]`}
                    classNameLabel={'font-bold place-self-start sm:landscape:text-section-s'}
                    classNameOption={SELECT_H_CN}
                    className={`px-4xs w-full py-[min(2dvw,0.8rem)] border-s rounded-xs
                                    border-white-d0 ${SELECT_H_CN}`}
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
