import {FC, ReactElement, useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import Image from "next/image";

import {Subscription, SubscriptionPreview, SubscriptionPreviewData, SubscriptionRecurrency} from "@/app/static/types";
import {SectionsEnum} from "@/app/utils/sections";

import {generateFallbackEntries} from "@/app/utils/data";

import {useNavigate} from "@/app/hooks/useNavigate";

import {useModal, UserSubscription, useUser} from "@/app/context";

import {AuthModal, BillingModal} from "@/app/components/modals";
import {LimitsModal} from "./LimitsModal";

import {Button} from "@/app/components/form";

import SVG_DIAMOND_ACE from "@/assets/images/icons/diamond-ace.svg";
import SVG_DIAMOND from "@/assets/images/icons/diamond.svg";


const PLAN_TEMPLATE: SubscriptionPreview = {
    subscription: 'ternKey',
    isBasicKind: true,
    type: {
        basic: {
            icon: SVG_DIAMOND_ACE,
            priceUSD: {monthly: 10, annual: 8},
            benefits: [
                'Create and manage one AR code',
                '100 scans per month',
                'Detailed scan analytics',
                'Custom personalization features',
                'Data import and export',
            ]
        },
        pro: {
            icon: SVG_DIAMOND,
            priceUSD: {monthly: 50, annual: 40},
            benefits: [
                'Manage up to 5 AR codes',
                '1,000 scans per month',
                'AR code design customization',
                'Video support up to 30 seconds',
                'Access to dedicated support team'
            ]
        }
    }
}


const PLAN_TIME_RANGE: SubscriptionRecurrency[] = ['monthly', 'annual'];

const PricingView: FC = () => {
    const [navigate] = useNavigate();
    const params = useSearchParams();
    const modalCtx = useModal();
    const userCtx = useUser();

    const [selectedRecurrency, setSelectedRecurrency] = useState<SubscriptionRecurrency>('monthly');
    const [subscriptionPreview, setSubscriptionPreview] = useState<SubscriptionPreview | null>(null);


    useEffect(() => {
        if (subscriptionPreview)
            return;

        try {
            // TODO fetch data
            const subscriptionData: SubscriptionPreview = PLAN_TEMPLATE
            setSubscriptionPreview(subscriptionData);
        } catch (error: unknown) {
        }
    }, [subscriptionPreview, params])


    const handleSubscribeClick = (type: string) => {
        if (!userCtx.isLoggedIn) {
            const info = 'You must log into a Tern account to subscribe to TernKey. Please login or create an account to purchase a Plan.';
            return modalCtx.openModal(<AuthModal info={info} isLoginAction={false}/>);
        }

        if (!subscriptionPreview)
            return

        const subscription: Subscription = {
            subscription: subscriptionPreview.subscription,
            type,
            isBasicKind: subscriptionPreview.isBasicKind,
            priceUSD: subscriptionPreview.type[type].priceUSD[selectedRecurrency],
            recurrency: selectedRecurrency,
        }
        localStorage.setItem('subscription', JSON.stringify(subscription));
        navigate(SectionsEnum.Subscribe);
    }

    // Elements
    const BillingResolution = (
        <span
            className={'underline cursor-pointer'}
            onClick={() => modalCtx.openModal(<BillingModal/>)}
        >
            billing resolution center
        </span>
    );

    const renderColumn = (
        userSubscription: UserSubscription | undefined,
        type: string,
        data: SubscriptionPreviewData | undefined,
        index: number
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

        if (index) {
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
        const isBtnDisabled = isCurrentPlan && isCurrentRecurrency || !subscriptionPreview;

        let subscribeBtnText: string | ReactElement;
        let Links: ReactElement | null;
        const Limits: ReactElement = (
            <span
                className={'underline cursor-pointer'}
                onClick={() => modalCtx.openModal(<LimitsModal/>)}
            >
                Limits apply
            </span>
        );

        if (!userSubscription) {
            subscribeBtnText = 'Subscribe';
            Links = Limits;
        } else {
            if (isCurrentRecurrency) {
                if (isCurrentPlan) {
                    subscribeBtnText = 'Your current plan';
                    Links = (
                        <>
                            <span className={'mb-[0.44rem] underline'}>
                                <span
                                    className={'cursor-pointer'}
                                    onClick={() => navigate(SectionsEnum.ManageSubscriptions)}
                                >
                                    Manage subscription
                                </span>
                            </span>
                            <span className={'first-letter:capitalize'}>{BillingResolution}</span>
                        </>
                    );
                } else {
                    subscribeBtnText = <>{index ? 'Up' : 'Down'}grade to <span
                        className={'capitalize'}>{type}</span></>;
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
            ? data.priceUSD[selectedRecurrency].toFixed(2).toString()
            : '--'

        return (
            <div
                key={type + index}
                className={`flex flex-col flex-grow p-[--py] w-[25.125rem] max-h-[35.21rem] rounded-[0.5625rem]
                            border-small border-control3 bg-control text-left text-primary`}
            >
                <h2 className={'flex mb-[0.95rem] font-oxygen text-header font-bold capitalize'}>
                    {data?.icon ? <Image src={data.icon} alt={type + ' icon'} className={'mr-[0.32rem]'}/> : '--'}
                    <span>{type}</span>
                </h2>
                <div className={'text-secondary mb-[2.2rem] text-[1.25rem]'}>
                    <span>${pricing + '/month' + (isAnnualSwitchOption ? '*' : '')}</span>
                </div>
                <Button
                    onClick={() => handleSubscribeClick(type)}
                    className={`bg-control3 font-bold text-[1.125rem] disabled:bg-inherit disabled:border-small disabled:border-control
                                disabled:text-secondary rounded-full py-[1.13rem]`}
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
            (subscription: UserSubscription) => subscription.subscription === subscriptionPreview?.subscription
        );
        const isBasicView = userSubscription?.isBasicKind === subscriptionPreview?.isBasicKind;

        const columnsData = subscriptionPreview?.type
            ? Object.entries(subscriptionPreview.type).slice(+isBasicView)
            : generateFallbackEntries(isBasicView ? 1 : 2);

        return columnsData.map(([type, data], index) =>
            renderColumn(userSubscription, type, data, index)
        )
    }

    const Switch: ReactElement[] = PLAN_TIME_RANGE.map((entry) => (
            <div
                key={entry}
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

export {PricingView}