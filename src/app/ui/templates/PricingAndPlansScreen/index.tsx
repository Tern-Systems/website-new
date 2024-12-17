import {FC, ReactElement, useState} from "react";
import Image from "next/image";

import {
    Subscription,
    SubscriptionPreview,
    SubscriptionPreviewData,
    SubscriptionRecurrency
} from "@/app/types/subscription";
import {UserSubscription} from "@/app/context/User.context";
import {Route} from "@/app/static";

import {generateFallbackEntries} from "@/app/utils";
import {useNavigate} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {AuthModal, HelpModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";
import {LimitsModal} from "./LimitsModal";


const PLAN_TIME_RANGE: SubscriptionRecurrency[] = ['monthly', 'annual'];


interface Props {
    subscriptionData: SubscriptionPreview | null;
}

const PricingAndPlansScreen: FC<Props> = (props: Props) => {
    const {subscriptionData} = props;

    const modalCtx = useModal();
    const userCtx = useUser();
    const [navigate] = useNavigate();

    const [selectedRecurrency, setSelectedRecurrency] = useState<SubscriptionRecurrency>('monthly');


    const handleSubscribeClick = (type: string) => {
        if (!userCtx.isLoggedIn) {
            const info = 'You must log into a Tern account to subscribe to TernKey. Please login or create an account to purchase a Plan.';
            return modalCtx.openModal(<AuthModal info={info} isLoginAction/>, {hideContent: true});
        }

        if (!subscriptionData)
            return

        const subscription: Subscription = {
            subscription: subscriptionData.subscription,
            type,
            isBasicKind: subscriptionData.isBasicKind,
            priceUSD: subscriptionData.type[type].priceUSD[selectedRecurrency],
            recurrency: selectedRecurrency,
        }
        sessionStorage.setItem('subscription', JSON.stringify(subscription));
        navigate(Route.Subscribe);
    }

    // Elements
    const BillingResolution = (
        <span
            className={'underline cursor-pointer'}
            onClick={() => modalCtx.openModal(<HelpModal type={'brc'}/>, {darkenBg: true})}
        >
            billing resolution center
        </span>
    );

    const renderColumn = (
        userSubscription: UserSubscription | undefined,
        type: string,
        data: SubscriptionPreviewData | undefined,
        idx: number
    ): ReactElement => {
        const benefitsData = data?.benefits ?? generateFallbackEntries(5);
        const Benefits: ReactElement[] = benefitsData.map((benefit, subIndex) => {
            let listImage = 'list-image-[url("../assets/images/icons/bullet.svg")]';
            if (type === 'pro')
                listImage = 'list-image-[url("../assets/images/icons/star.svg")]';

            return (
                <li
                    key={type + subIndex}
                    className={`list-inside ${listImage}`}
                >
                    <span className={'align-top'}>{benefit}</span>
                </li>
            );
        });

        if (idx) {
            const Additional = (
                <div>
                    <span>Everything in {type}, and:</span>
                </div>
            );
            Benefits.unshift(Additional);
        }

        const isAnnualSwitchOption = selectedRecurrency === 'annual';
        const isUserMonthlySubscriber = userSubscription
            ? userSubscription.recurrency === 'monthly'
            : false;
        const isCurrentPlan = userSubscription
            ? userSubscription.type === type
            : false;
        const isCurrentRecurrency = userSubscription
            ? userSubscription.recurrency === selectedRecurrency
            : false;
        const isBtnDisabled =
            type === 'basic' && subscriptionData?.isBasicKind
            || (isCurrentPlan && isCurrentRecurrency || !subscriptionData);

        let subscribeBtnText: string | ReactElement;
        let Links: ReactElement | null;
        const Limits: ReactElement = (
            <span
                className={'underline cursor-pointer'}
                onClick={() => modalCtx.openModal(<LimitsModal/>, {darkenBg: true})}
            >
                Limits apply
            </span>
        );

        if (isBtnDisabled) {
            subscribeBtnText = isBtnDisabled ? 'Your current plan' : 'Subscribe';
            Links = Limits;
        } else {
            if (isCurrentRecurrency) {
                if (isCurrentPlan) {
                    subscribeBtnText = 'Your current plan';
                    Links = (
                        <>
                            <span className={'mb-[0.44rem] underline'}>
                                <PageLink href={Route.ManageSubscriptions} className={'cursor-pointer'}>
                                    Manage subscription
                                </PageLink>
                            </span>
                            <span className={'first-letter:capitalize'}>{BillingResolution}</span>
                        </>
                    );
                } else {
                    subscribeBtnText = (
                        <>{idx ? 'Up' : 'Down'}grade to <span className={'capitalize'}>{type}</span></>
                    );
                    Links = Limits;
                }
            } else {
                subscribeBtnText = (
                    <>
                        Switch to&nbsp;
                        <span className={'capitalize'}>{PLAN_TIME_RANGE[+(isUserMonthlySubscriber)]}</span> Plan
                    </>
                );
                Links = (
                    <>
                        <span className={'mb-[0.44rem]'}>
                            *Price billed {isUserMonthlySubscriber ? 'annually' : 'monthly'}
                        </span>
                        {Limits}
                    </>
                );
            }
        }

        const pricing: string = data
            ? (data.priceUSD[selectedRecurrency] ? '$' + data.priceUSD[selectedRecurrency].toFixed(2) + '/month' : 'Free')
            : '--'

        return (
            <div
                key={type + idx}
                className={`flex flex-col flex-grow p-[--py] w-[25.125rem] max-h-[35.21rem] rounded-[0.5625rem]
                            border-small border-control3 bg-control text-left text-primary`}
            >
                <h2 className={'flex mb-[0.95rem] font-oxygen text-header font-bold capitalize'}>
                    {data?.icon ? <Image src={data.icon} alt={type + ' icon'} className={'mr-[0.32rem]'}/> : '--'}
                    <span>{type}</span>
                </h2>
                <div className={'text-secondary mb-[2.2rem] text-[1.25rem]'}>
                    <span>{pricing + (isAnnualSwitchOption ? '*' : '')}</span>
                </div>
                <Button
                    onClick={() => handleSubscribeClick(type)}
                    className={`bg-control3 font-bold text-[1.125rem] disabled:bg-inherit disabled:border-small disabled:border-control
                                disabled:text-secondary rounded-full py-[1.13rem] w-full`}
                    disabled={isBtnDisabled}
                >
                    {subscribeBtnText}
                </Button>
                <ul className={'flex flex-col gap-[1.5rem] mt-[1.56rem]'}>{Benefits}</ul>
                <div
                    className={'flex flex-col mt-[2.07rem] font-oxygen text-[0.75rem] text-secondary flex-grow justify-end'}>
                    {Links}
                </div>
            </div>
        )
    }

    const renderColumns = (): ReactElement[] => {
        const {userData} = userCtx;
        const userSubscription: UserSubscription | undefined = userData?.subscriptions.find(
            (subscription: UserSubscription) => subscription.subscription === subscriptionData?.subscription
        );
        const isCutBasicColumn = subscriptionData?.isBasicKind === true && userSubscription?.type !== 'basic';

        const columnsData = subscriptionData?.type
            ? Object.entries(subscriptionData.type).slice(+isCutBasicColumn)
            : generateFallbackEntries(isCutBasicColumn ? 1 : 2);

        return columnsData.map(([type, data], idx) => renderColumn(userSubscription, type, data, idx))
    }

    const Switch: ReactElement[] = PLAN_TIME_RANGE.map((entry, idx) => (
            <div
                key={entry + idx}
                className={`px-[1.3rem] py-[0.7rem] rounded-full cursor-pointer font-bold capitalize
                            ${selectedRecurrency === entry ? 'bg-control2' : 'text-secondary'}`}
                onClick={() => setSelectedRecurrency(entry)}
            >
                {entry}
            </div>
        )
    );

    return (
        <>
            <div className={'flex flex-col my-auto'}>
                <div className={'flex place-self-center p-[0.19rem] border-small rounded-full text-small'}>
                    {Switch}
                </div>
                <div className={'flex place-self-center gap-[4.13rem] mt-[3.12rem]'}>
                    {renderColumns()}
                </div>
            </div>
        </>
    )
}


export {PricingAndPlansScreen};
