import {FC, ReactElement, useState} from "react";
import Image from "next/image";

import {
    PlanType,
    Subscription,
    SubscriptionPreview,
    SubscriptionPreviewData,
    SubscriptionRecurrency
} from "@/app/types/subscription";
import {UserSubscription} from "@/app/context/User.context";
import {Route} from "@/app/static";

import {generateFallbackEntries} from "@/app/utils";
import {useBreakpointCheck, useNavigate} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {AuthModal, HelpModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";
import {LimitsModal} from "./LimitsModal";
import {Collapsible} from "@/app/ui/misc";

import SVG_BULLET from '@/assets/images/icons/bullet.svg';
import SVG_STAR from '@/assets/images/icons/star.svg';


const PLAN_TIME_RANGE: SubscriptionRecurrency[] = ['monthly', 'annual'];


const LINKS_MB_CN = 'mb-[min(1.3dvw,0.45rem)]';


interface Props {
    subscriptionData: SubscriptionPreview | null;
}

const PricingAndPlansScreen: FC<Props> = (props: Props) => {
    const {subscriptionData} = props;

    const modalCtx = useModal();
    const userCtx = useUser();
    const [navigate] = useNavigate();
    const isSmScreen = useBreakpointCheck();

    const [selectedRecurrency, setSelectedRecurrency] = useState<SubscriptionRecurrency>('monthly');


    const handleSubscribeClick = (type: PlanType) => {
        if (!userCtx.isLoggedIn) {
            const info = `You must log into a Tern account to subscribe to ${subscriptionData?.subscription}. Please login or create an account to purchase a Plan.`;
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
        navigate(subscriptionData.route);
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
        type: PlanType,
        data: SubscriptionPreviewData | undefined,
        idx: number
    ): ReactElement => {
        const benefitsData = data?.benefits ?? generateFallbackEntries(5);
        const Benefits: ReactElement[] = benefitsData.map((benefit, subIndex) => (
            <li key={type + subIndex} className={'flex items-center gap-x-[--s-dl-smallest] whitespace-pre-wrap leading-[120%]'}>
                <Image src={type === 'Pro' ? SVG_STAR : SVG_BULLET} alt={'list-icon'} className={'inline'}/>
                <span>{benefit}</span>
            </li>
        ));

        if (idx) {
            const Additional = (
                <div key={'additional'}>
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
            type === 'Basic' && subscriptionData?.isBasicKind
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

        if (isCurrentRecurrency || type === 'Basic') {
            if (isCurrentPlan) {
                subscribeBtnText = isBtnDisabled ? 'Your current plan' : 'Subscribe';
                Links = (
                    <>
                        <span className={`${LINKS_MB_CN} underline`}>
                            <PageLink href={Route.ManageSubscriptions} className={'cursor-pointer'}>
                                Manage subscription
                            </PageLink>
                        </span>
                        <span className={'first-letter:capitalize'}>{BillingResolution}</span>
                    </>
                );
            } else {
                subscribeBtnText = <>{idx ? 'Up' : 'Down'}grade to <span className={'capitalize'}>{type}</span></>;
                Links = Limits;
            }
        } else {
            subscribeBtnText = (
                <>Switch to <span className={'capitalize'}>{PLAN_TIME_RANGE[+(isUserMonthlySubscriber)]}</span> Plan</>
            );
            Links = (
                <>
                    <span className={LINKS_MB_CN}>
                        *Price billed {isUserMonthlySubscriber ? 'annually' : 'monthly'}
                    </span>
                    {Limits}
                </>
            );
        }

        const pricing: string = data
            ? (data.priceUSD[selectedRecurrency] ? '$' + data.priceUSD[selectedRecurrency].toFixed(2) + '/month' : 'Free')
            : '--';

        const CollapsedContentSm = (
            <>
                <h2 className={`flex items-center mb-[--1dr] font-oxygen text-header font-bold capitalize
                                sm:landscape:x-[mb-[--s-d-small],text-content]`}>
                    {data?.icon
                        ? <Image src={data.icon} alt={type + ' icon'}
                                 className={'mr-[min(1.1dvw,0.32rem)] w-[--1hdr] h-auto'}/>
                        : '--'}
                    <span>{type}</span>
                </h2>
                <div className={'mb-[--2tdr] text-secondary sm:landscape:mb-[--1dr]'}>
                    <span>{pricing + (isAnnualSwitchOption ? '*' : '')}</span>
                </div>
                <Button
                    onClick={() => handleSubscribeClick(type)}
                    className={`py-[--1drl] w-full rounded-full bg-control-blue font-bold text-content-small 
                                disabled:x-[bg-inherit,border-small,border-control-gray,text-secondary]`}
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
                classNameWrapper={`[&]:w-[90dvw] [&]:max-w-[25rem] [&&]:h-full border-small border-control-white-d0 text-left self-start
                                    sm:border-none
                                    sm:landscape:[&]:max-w-[36dvw]`}
                className={'flex flex-col'}
            >
                {CollapsedContentSm}
                <ul className={`flex flex-col gap-[min(5.3dvw,1.5rem)] mt-[min(5.3dvw,1.5rem)] items-start
                                text-default
                                sm:landscape:text-small`}>
                    {Benefits}
                </ul>
                <div
                    className={`flex flex-col mt-[min(8dvw,2.1rem)] font-oxygen text-[min(2.6dvw,var(--fz-note-))] text-secondary`}>
                    {Links}
                </div>
            </Collapsible>
        )
    }

    const renderColumns = (): ReactElement[] => {
        const {userData} = userCtx;
        const userSubscription: UserSubscription | undefined = userData?.subscriptions.find(
            (subscription: UserSubscription) => subscription.subscription === subscriptionData?.subscription
        );
        const isCutBasicColumn = subscriptionData?.isBasicKind === true && userSubscription?.type !== 'Basic';

        const columnsData = subscriptionData?.type
            ? Object.entries(subscriptionData.type).slice(+isCutBasicColumn).filter(([type]) => {
                if (
                    userSubscription?.recurrency === 'monthly' &&
                    userSubscription?.type === 'Pro' &&
                    type === 'standard'
                ) {
                    return false;
                }
                return true;
            })
            : generateFallbackEntries(isCutBasicColumn ? 1 : 2);

        return (columnsData as [PlanType, SubscriptionPreviewData][]).map(([type, data], idx) => renderColumn(userSubscription, type, data, idx))
    }

    const Switch: ReactElement[] = PLAN_TIME_RANGE.map((entry, idx) => (
            <div
                key={entry + idx}
                className={`px-[1.3rem] py-[0.7rem] rounded-full cursor-pointer font-bold capitalize
                            ${selectedRecurrency === entry ? 'bg-control-gray-l0' : 'text-secondary'}`}
                onClick={() => setSelectedRecurrency(entry)}
            >
                {entry}
            </div>
        )
    );

    return (
        <div className={`flex flex-col gap-[min(5.3dvw,3.12rem)] my-auto
                        sm:my-0
                        sm:landscape:flex-row`}>
            <div className={`flex place-self-center p-[0.2rem] border-small rounded-full text-small
                            sm:landscape:x-[flex-col,place-self-start,sticky,top-0,rounded-[1.4rem]]`}>
                {Switch}
            </div>
            <div className={'flex place-self-center gap-[min(2.6dvw,4.13rem)] sm:portrait:flex-col'}>
                {renderColumns()}
            </div>
        </div>
    )
}


export {PricingAndPlansScreen};
