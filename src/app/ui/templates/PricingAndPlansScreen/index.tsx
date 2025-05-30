'use client';

import { FC, ReactElement, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import {
    PlanType,
    SubscriptionBase,
    SubscriptionPreview,
    SubscriptionPreviewData,
    SubscriptionRecurrency,
} from '@/app/types/subscription';
import { Breakpoint } from '@/app/static';
import { Route } from '@/app/static';

import { generateFallbackEntries } from '@/app/utils';
import { useBreakpointCheck, useNavigate } from '@/app/hooks';
import { useModal, useUser } from '@/app/hooks';

import { PageLink } from '@/app/ui/layout';
import { AuthModal, HelpModal, MessageModal } from '@/app/ui/modals';
import { Button } from '@/app/ui/form';
import { LimitsModal } from './LimitsModal';
import { Collapsible, ScrollEnd } from '@/app/ui/organisms';

import styles from '@/app/common.module.css';

import SVG_BULLET_DASHED from '@/assets/images/icons/bullet-dashed.svg';
import SVG_BULLET from '@/assets/images/icons/bullet.svg';
import SVG_STAR from '@/assets/images/icons/star.svg';
import SVG_DIAMOND from '@/assets/images/icons/diamond.svg';
import SVG_DIAMOND_ACE from '@/assets/images/icons/diamond-ace.svg';

const PLAN_TIME_RANGE: SubscriptionRecurrency[] = ['monthly', 'annual'];

interface Props {
    subscriptionData: SubscriptionPreview | null;
}

const PricingAndPlansScreen: FC<Props> = (props: Props) => {
    const { subscriptionData } = props;

    const modalCtx = useModal();
    const userCtx = useUser();
    const [navigate] = useNavigate();
    const breakpoint = useBreakpointCheck();

    const [selectedRecurrency, setSelectedRecurrency] = useState<SubscriptionRecurrency>('monthly');

    const handleSubscribeClick = (type: PlanType) => {
        if (!userCtx.isLoggedIn) {
            const info = `You must log into a Tern account to subscribe${subscriptionData?.subscription ? ' to ' + subscriptionData.subscription : ''}. Please login or create an account to purchase a Plan.`;
            return modalCtx.openModal(<AuthModal info={info} />, { hideContent: true });
        }

        if (!subscriptionData || !subscriptionData.route) {
            return modalCtx.openModal(
                <MessageModal>Can&apos;t proceed with subscription - no required data</MessageModal>,
                { darkenBg: true },
            );
        }
        const subscription: SubscriptionBase = {
            subscription: subscriptionData.subscription,
            type,
            basicKind: subscriptionData.basicKind,
            priceUSD: subscriptionData.type?.[type]?.priceUSD?.[selectedRecurrency],
            recurrency: selectedRecurrency,
        };
        sessionStorage.setItem('subscription', JSON.stringify(subscription));
        navigate(subscriptionData.route);
    };

    // Elements
    const BillingResolution = (
        <span
            className={'cursor-pointer underline'}
            onClick={() => modalCtx.openModal(<HelpModal type={'brc'} />, { darkenBg: true })}
        >
            Billing Resolution Center
        </span>
    );

    const renderColumn = (
        firstPlanType: PlanType,
        userSubscription: SubscriptionBase | undefined,
        type: PlanType,
        data: SubscriptionPreviewData | undefined,
        idx: number,
        isProUser: boolean,
        isCurrentSubscription: boolean,
        cutBasicColumn: boolean,
    ): ReactElement => {
        const isAnnualRecurrency = selectedRecurrency.toLocaleLowerCase() === 'annual'.toLocaleLowerCase();
        const isCurrentRecurrency =
            userSubscription?.recurrency?.toLocaleLowerCase() === selectedRecurrency.toLocaleLowerCase();
        const isCurrentType = userSubscription?.type?.toLocaleLowerCase() === type.toLocaleLowerCase();
        const { basicKind } = subscriptionData ?? {};
        const isBasicPlan = type.toLocaleLowerCase() === 'Basic'.toLocaleLowerCase();

        const isBtnDisabled = (isCurrentSubscription && isCurrentRecurrency && isCurrentType) || isBasicPlan;

        const benefitsData = data?.benefits ?? generateFallbackEntries(5);
        const benefitsIcon = !isBtnDisabled ? SVG_BULLET_DASHED : type === 'Pro' ? SVG_STAR : SVG_BULLET;
        const Benefits: ReactElement[] = benefitsData.map((benefit, subIndex) => (
            <li
                key={type + subIndex}
                className={'flex items-center gap-x-4xs whitespace-pre-wrap'}
            >
                <Image
                    src={benefitsIcon}
                    alt={'list-icon'}
                    className={'inline [&]:size-5xs'}
                />
                <span>{benefit}</span>
            </li>
        ));

        if (idx) {
            const Additional = (
                <div key={'additional'}>
                    <span>Everything in {firstPlanType}, and:</span>
                </div>
            );
            Benefits.unshift(Additional);
        }

        const Limits: ReactElement = (
            <>
                <span
                    className={'cursor-pointer underline'}
                    onClick={() => modalCtx.openModal(<LimitsModal />, { darkenBg: true })}
                >
                    Limits apply
                </span>
                <span className={cn(userSubscription ? 'hidden' : 'whitespace-pre-wrap')}>
                    Have an existing plan? See the&nbsp;
                    <span
                        onClick={() => modalCtx.openModal(<HelpModal type={'brc'} />, { darkenBg: true })}
                        className={`${styles.clickable} underline`}
                    >
                        Billing Resolution Center
                    </span>
                </span>
            </>
        );

        let subscribeBtnText: string | ReactElement =
            userSubscription && basicKind && !isProUser ? 'Upgrade to Pro' : 'Subscribe';
        let Links: ReactElement = Limits;

        if (isBtnDisabled || isBasicPlan) {
            subscribeBtnText = 'Your current plan';
            Links = (
                <>
                    <span className={`underline`}>
                        <PageLink
                            href={Route.ManageSubscriptions}
                            className={'cursor-pointer'}
                        >
                            Manage subscription
                        </PageLink>
                    </span>
                    <span className={'first-letter:capitalize'}>{BillingResolution}</span>
                </>
            );
        } else if (!isCurrentType && userSubscription) {
            subscribeBtnText = (
                <>
                    {idx + +cutBasicColumn ? 'Up' : 'Down'}grade to&nbsp;
                    <span className={'capitalize'}>{type}</span>
                </>
            );
        } else if (!isCurrentRecurrency) {
            subscribeBtnText =
                (basicKind && !isProUser) || !isCurrentSubscription ? (
                    subscribeBtnText
                ) : (
                    <>
                        Switch to&nbsp;
                        <span className={'capitalize'}>{PLAN_TIME_RANGE[+isAnnualRecurrency]}</span>
                        &nbsp;Plan
                    </>
                );
        }

        const showAsterisk = isAnnualRecurrency && !isBasicPlan && !isBtnDisabled;

        if (showAsterisk) {
            Links = (
                <>
                    <span>*Price billed annually</span>
                    {Links}
                </>
            );
        }

        const pricing: string = data
            ? data?.priceUSD?.[selectedRecurrency]
                ? '$' + data.priceUSD[selectedRecurrency] + '/month'
                : 'Free'
            : '--';

        const CollapsedContentSm = (
            <>
                <h2
                    className={cn(
                        `flex items-center font-bold capitalize`,
                        `mb-4xs text-21`,
                        `lg:x-[mb-xxs,text-27]`,
                        `md:text-27`,
                    )}
                >
                    <Image
                        src={idx ? SVG_DIAMOND : SVG_DIAMOND_ACE}
                        alt={type + ' icon'}
                        className={`mr-5xs h-auto w-xxs sm:w-5xs`}
                    />
                    <span>{type}</span>
                </h2>
                <div
                    className={cn(
                        'text-secondary',
                        'text-20',
                        'lg:mb-xl',
                        'md:mb-n',
                        'sm:mb-4xs',
                        'sm:landscape:text-18',
                    )}
                >
                    <span>{pricing + (showAsterisk ? '*' : '')}</span>
                </div>
                <Button
                    onClick={() => handleSubscribeClick(type)}
                    className={cn(
                        `w-full rounded-full bg-blue text-18 font-bold`,
                        `py-xs`,
                        `sm:x-[py-xxs,text-16]`,
                        `disabled:x-[bg-inherit,border-s,border-gray-l0,text-secondary]`,
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
                title={type + idx}
                isChevron
                expandedState={[breakpoint === Breakpoint.lg]}
                collapsedContent={CollapsedContentSm}
                classNameWrapper={cn(
                    `[&]:self-start [&]:max-w-[25rem] w-full h-full border-s border-white-d0 text-left`,
                    'lg:h-[35.5rem]',
                    `md:x-[p-s,h-[35.5rem]]`,
                    `md:landscape:h-[35.5rem]`,
                    `sm:x-[p-xxs,border-none]`,
                )}
                classNameIcon={'[&]:w-6xs  md:right-s md:top-[calc(var(--p-s)+0.5*var(--fz-heading))]'}
                className={'flex h-full flex-col'}
            >
                {CollapsedContentSm}
                <ul className={cn(`mt-s flex flex-col items-start gap-y-s`, `text-16`, `sm:x-[gap-xxs,text-14]`)}>
                    {Benefits}
                </ul>
                <div className={cn(`mt-auto flex flex-grow flex-col text-12 text-secondary`, `sm:landscape:text-10`)}>
                    <span className={'mt-auto flex flex-col gap-y-5xs'}>{Links}</span>
                </div>
            </Collapsible>
        );
    };

    const renderColumns = (): ReactElement[] => {
        const { userData } = userCtx;
        const userSubscription: SubscriptionBase | undefined = userData?.subscriptions?.find(
            (subscription: SubscriptionBase) => subscription.subscription === subscriptionData?.subscription,
        );

        const isProUser = userSubscription?.type?.toLocaleLowerCase() === 'Pro'.toLocaleLowerCase();
        const isCurrentSubscription =
            userSubscription?.subscription?.toLocaleLowerCase() === subscriptionData?.subscription?.toLocaleLowerCase();

        const cutBasicColumn = subscriptionData?.basicKind === true && isCurrentSubscription && isProUser;

        const columnsData = subscriptionData?.type
            ? Object.entries(subscriptionData.type).slice(+cutBasicColumn)
            : generateFallbackEntries(cutBasicColumn ? 1 : 2);

        return (columnsData as [PlanType, SubscriptionPreviewData][]).map(([type, data], idx, columns) =>
            renderColumn(
                columns[0][0],
                userSubscription,
                type,
                data,
                idx,
                isProUser,
                isCurrentSubscription,
                cutBasicColumn,
            ),
        );
    };

    const Switch: ReactElement[] = PLAN_TIME_RANGE.map((entry, idx) => (
        <div
            key={entry + idx}
            onClick={() => setSelectedRecurrency(entry)}
            className={cn(
                `cursor-pointer rounded-full px-xs py-3xs font-bold capitalize`,
                selectedRecurrency === entry ? 'bg-gray-l0' : 'text-secondary',
            )}
        >
            {entry}
        </div>
    ));

    return (
        <div className={cn(`flex h-full flex-col`, `md:pb-l`, `sm:px-xs`, `sm:portrait:pb-xxl`, `sm:landscape:mt-n`)}>
            <div
                className={cn(
                    'flex items-end justify-center',
                    `lg:x-[mb-n,h-[11rem]]`,
                    `md:pb-xxs`,
                    `md:min-h-10xl`,
                    `sm:pb-xxs`,
                    `sm:portrait:h-10xl`,
                )}
            >
                <div className={cn(`flex h-fit w-fit rounded-full border-s p-6xs text-14`)}>{Switch}</div>
            </div>
            <div
                className={cn(
                    'grid w-full auto-rows-min justify-center self-center overflow-scroll',
                    'lg:gap-x-3xl',
                    'lg:h-[calc(100%-2.5rem)] lg:flex',
                    'md:portrait:h-[calc(100%-6.75rem)] md:portrait:grid-cols-[minmax(0,24rem)] md:landscape:grid-cols-[repeat(2,minmax(0,24rem))]',
                    'md:gap-xxs',
                    'sm:portrait:h-[calc(100%-6.75rem)] sm:portrait:grid-cols-[minmax(0,20rem)] sm:portrait:gap-y-4xs',
                    'sm:landscape:grid-cols-[repeat(2,minmax(0,20rem))] sm:landscape:x-[gap-x-3xs,overflow-visible]',
                )}
            >
                {renderColumns()}
            </div>
            <ScrollEnd />
        </div>
    );
};

PricingAndPlansScreen.displayName = PricingAndPlansScreen.name;

export { PricingAndPlansScreen };
