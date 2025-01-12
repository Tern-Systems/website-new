import {FC, ReactElement, useState} from "react";
import Image from "next/image";
import cn from "classnames";

import {
    PlanType,
    SubscriptionBase,
    SubscriptionPreview,
    SubscriptionPreviewData,
    SubscriptionRecurrency,
} from "@/app/types/subscription";
import {Route} from "@/app/static";

import {generateFallbackEntries} from "@/app/utils";
import {useBreakpointCheck, useNavigate} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {AuthModal, HelpModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";
import {LimitsModal} from "./LimitsModal";
import {Collapsible, ScrollEnd} from "@/app/ui/misc";

import SVG_BULLET from "/public/images/icons/bullet.svg";
import SVG_STAR from "/public/images/icons/star.svg";

import styles from "@/app/common.module.css";


const PLAN_TIME_RANGE: SubscriptionRecurrency[] = ["monthly", "annual"];
const LINKS_MB_CN = "mb-[min(1.3dvw,0.45rem)]";


interface Props {
    subscriptionData: SubscriptionPreview | null;
}

const PricingAndPlansScreen: FC<Props> = (props: Props) => {
    const {subscriptionData} = props;

    const modalCtx = useModal();
    const userCtx = useUser();
    const [navigate] = useNavigate();
    const isSmScreen = useBreakpointCheck();

    const [selectedRecurrency, setSelectedRecurrency] =
        useState<SubscriptionRecurrency>("monthly");

    const handleSubscribeClick = (type: PlanType) => {
        if (!userCtx.isLoggedIn) {
            const info = `You must log into a Tern account to subscribe to ${subscriptionData?.subscription}. Please login or create an account to purchase a Plan.`;
            return modalCtx.openModal(<AuthModal info={info} isLoginAction/>, {
                hideContent: true,
            });
        }

        if (!subscriptionData) return;

        const subscription: SubscriptionBase = {
            subscription: subscriptionData.subscription,
            type,
            isBasicKind: subscriptionData.isBasicKind,
            priceUSD: subscriptionData.type[type].priceUSD[selectedRecurrency],
            recurrency: selectedRecurrency,
        };
        sessionStorage.setItem("subscription", JSON.stringify(subscription));
        navigate(subscriptionData.route);
    };

    // Elements
    const BillingResolution = (
        <span
            className={"underline cursor-pointer"}
            onClick={() =>
                modalCtx.openModal(<HelpModal type={"brc"}/>, {darkenBg: true})
            }
        >
      billing resolution center
    </span>
    );

    const renderColumn = (
        userSubscription: SubscriptionBase | undefined,
        type: PlanType,
        data: SubscriptionPreviewData | undefined,
        idx: number,
        cutBasicColumn: boolean,
    ): ReactElement => {
        const benefitsData = data?.benefits ?? generateFallbackEntries(5);
        const Benefits: ReactElement[] = benefitsData.map((benefit, subIndex) => (
            <li key={type + subIndex}
                className={'flex items-start gap-x-[--p-content-4xs] whitespace-pre-wrap leading-[120%]'}>
                <Image src={type === 'Pro' ? SVG_STAR : SVG_BULLET} alt={'list-icon'} className={'inline'}/>
                <span>{benefit}</span>
            </li>
        ));

        if (idx) {
            const Additional = (
                <div key={"additional"}>
                    <span>Everything in {type}, and:</span>
                </div>
            );
            Benefits.unshift(Additional);
        }

        const isAnnualSwitchOption = selectedRecurrency === "annual";
        const isBasicPlan = type === "Basic";
        const hasUserBasicPlan = userSubscription?.type === 'Basic';
        const isUserMonthlySubscriber = userSubscription
            ? userSubscription.recurrency === "monthly"
            : false;
        const isCurrentPlan = userSubscription
            ? userSubscription.type === type
            : false;
        const isCurrentRecurrency = userSubscription
            ? userSubscription.recurrency === selectedRecurrency
            : false;
        const isBtnDisabled =
            (isBasicPlan && subscriptionData?.isBasicKind) ||
            (isCurrentPlan && isCurrentRecurrency) ||
            !subscriptionData;

        let subscribeBtnText: string | ReactElement;
        let Links: ReactElement | null;
        const Limits: ReactElement = (
            <span
                className={"underline cursor-pointer"}
                onClick={() => modalCtx.openModal(<LimitsModal/>, {darkenBg: true})}
            >
            Limits apply
          </span>
        );

        if (isCurrentRecurrency || isBasicPlan || hasUserBasicPlan || !userSubscription) {
            if (isCurrentPlan || isBasicPlan || !userSubscription) {
                subscribeBtnText = isBtnDisabled || isBasicPlan ? "Your current plan" : "Subscribe";
                Links =
                    isBasicPlan
                        ? (
                            <span>
                                Have an existing plan? See the&nbsp;
                                <span onClick={() => modalCtx.openModal(<HelpModal type={'brc'}/>, {darkenBg: true})}
                                      className={`${styles.clickable} underline`}>
                                    billing resolution center
                                </span>
                            </span>
                        )
                        : (
                            <>
                                <span className={`${LINKS_MB_CN} underline`}>
                                    <PageLink
                                        href={Route.ManageSubscriptions}
                                        className={"cursor-pointer"}
                                    >
                                        Manage subscription
                                    </PageLink>
                                </span>
                                <span className={"first-letter:capitalize"}>
                                    {BillingResolution}
                                </span>
                            </>
                        );
            } else {
                subscribeBtnText = (
                    <>
                        {idx + +cutBasicColumn ? "Up" : "Down"}grade to&nbsp;
                        <span className={"capitalize"}>{type}</span>
                    </>
                );
                const billedText = isAnnualSwitchOption
                    ? (
                        <span className={LINKS_MB_CN}>
                           *Price billed annually
                        </span>
                    )
                    : null;
                Links = (
                    <>
                        {billedText}
                        {Limits}
                    </>
                );
            }
        } else {
            subscribeBtnText = (
                <>
                    Switch to&nbsp;
                    <span className={"capitalize"}>
                        {PLAN_TIME_RANGE[+isUserMonthlySubscriber]}
                    </span>
                    &nbsp;Plan
                </>
            );

            const billedText = isAnnualSwitchOption
                ? (
                    <span className={LINKS_MB_CN}>
                       *Price billed annually
                    </span>
                )
                : null;

            Links = (
                <>
                    {billedText}
                    {Limits}
                </>
            );
        }

        const pricing: string = data
            ? data.priceUSD[selectedRecurrency]
                ? "$" + data.priceUSD[selectedRecurrency].toFixed(2) + "/month"
                : "Free"
            : "--";

        const CollapsedContentSm = (
            <>
                <h2 className={cn(
                    `flex items-center mb-[--p-content-xxs] font-oxygen text-heading font-bold capitalize`,
                    `sm:x-[mb-[--p-content-4xs],text-heading-s]`,
                )}
                >
                    {data?.icon
                        ? <Image src={data.icon} alt={type + ' icon'}
                                 className={`mr-[--p-content-5xs] h-auto    w-[1.375rem]    sm:w-[0.9375rem]`}/>
                        : '--'}
                    <span>{type}</span>
                </h2>
                <div className={cn(
                    'mb-[2.2rem] text-secondary',
                    'text-section',
                    'sm:x-[mb-[--p-content-4xs]]',
                    'sm:landscape:text-section-s'
                )}
                >
                    <span>{pricing + (isAnnualSwitchOption ? '*' : '')}</span>
                </div>
                <Button
                    onClick={() => handleSubscribeClick(type)}
                    className={cn(
                        `w-full rounded-full bg-control-blue font-bold text-section-s`,
                        `py-[1.12rem]`,
                        `sm:x-[py-[--p-content-xxs],text-basic]`,
                        `disabled:x-[bg-inherit,border-small,border-control-gray,text-secondary]`
                    )}
                    disabled={isBtnDisabled}
                >
                    {subscribeBtnText}
                </Button>
            </>
        );


        return (
            <Collapsible
                key={type + idx}
                isChevron
                expandedState={[!isSmScreen]}
                collapsedContent={CollapsedContentSm}
                classNameWrapper={cn(
                    `[&]:self-center [&]:max-w-[25rem] [&]:w-full border-small border-control-white-d0 text-left`,
                    `lg:[&&]:h-full`,
                    `sm:x-[p-[--p-content-xxs],border-none]`,
                    `sm:landscape:[&]:x-[self-start,max-w-[21rem]]`,
                )}
                classNameIcon={'[&]:w-[0.8125rem] top-[1.5rem]'}
                className={'flex flex-col h-full'}
            >
                {CollapsedContentSm}
                <ul className={cn(
                    `flex flex-col gap-y-[1.57rem] mt-[1.57rem] items-start`,
                    `text-basic`,
                    `sm:x-[gap-[--p-content-xxs],text-section-xs]`,
                )}
                >
                    {Benefits}
                </ul>
                <div className={cn(
                    `flex flex-col flex-grow mt-[2.1rem] font-oxygen text-secondary text-section-xxs`,
                    `sm:landscape:text-section-xxxs`
                )}
                >
                    <span className={'flex flex-col mt-auto'}>{Links}</span>
                </div>
            </Collapsible>
        )
    }

    const renderColumns = (): ReactElement[] => {
        const {userData} = userCtx;
        const userSubscription: SubscriptionBase | undefined =
            userData?.subscriptions.find(
                (subscription: SubscriptionBase) =>
                    subscription.subscription === subscriptionData?.subscription
            );
        const cutBasicColumn =
            subscriptionData?.isBasicKind === true &&
            userSubscription?.type !== "Basic";

        const columnsData = subscriptionData?.type
            ? Object.entries(subscriptionData.type)
                .slice(+cutBasicColumn)
            : generateFallbackEntries(cutBasicColumn ? 1 : 2);

        return (columnsData as [PlanType, SubscriptionPreviewData][]).map(
            ([type, data], idx) => renderColumn(userSubscription, type, data, idx, cutBasicColumn)
        );
    };

    const Switch: ReactElement[] = PLAN_TIME_RANGE.map((entry, idx) => (
            <div
                key={entry + idx}
                onClick={() => setSelectedRecurrency(entry)}
                className={cn(
                    `px-[1.3rem] py-[0.7rem] rounded-full cursor-pointer font-bold capitalize`,
                    selectedRecurrency === entry ? 'bg-control-gray-l0' : 'text-secondary'
                )}
            >
                {entry}
            </div>
        )
    );

    return (
        <div className={cn(
            `flex flex-col h-full`,
            `lg:x-[mt-[5.62rem]]`,
            `sm:pb-[--p-content-xxl]`,
            `sm:landscape:mt-[1.81rem]`,
        )}
        >
            <div className={'flex items-end justify-center sm:pb-[--p-content-xxs] sm:portrait:h-[6.75rem]'}>
                <div className={cn(
                    `flex p-[0.2rem] w-fit h-fit border-small rounded-full text-section-xs`,
                )}
                >
                    {Switch}
                </div>
            </div>
            <div className={cn(
                'flex gap-x-[--p-content-3xl] w-full',
                `lg:x-[mt-[--p-content-xxl],justify-center]`,
                `sm:x-[gap-y-[--p-content-xxs]]`,
                `sm:portrait:h-[calc(100%-6.75rem)] sm:portrait:x-[flex-col,px-[--p-content-xxs],overflow-y-scroll]`,
                `sm:landscape:x-[gap-x-[--p-content-4xs],px-[--p-content-3xl],justify-items-start]`,
            )}
            >
                {renderColumns()}
            </div>
            <ScrollEnd/>
        </div>
    )
}


export {PricingAndPlansScreen};
