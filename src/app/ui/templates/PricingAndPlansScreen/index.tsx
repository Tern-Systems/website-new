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
import { Breakpoint, Route } from '@/app/static';

import { generateFallbackEntries } from '@/app/utils';
import { useBreakpointCheck, useModal, useNavigate, useUser } from '@/app/hooks';

import { PageLink } from '@/app/ui/layout';
import { AuthModal, HelpModal, MessageModal } from '@/app/ui/modals';
import { Button } from '@/app/ui/form';
import { LimitsModal } from './LimitsModal';
import { Collapsible } from '@/app/ui/organisms';

import styles from '@/app/common.module.css';

import SVG_BULLET_DASHED from '@/assets/images/icons/bullet-dashed.svg';
import SVG_BULLET from '@/assets/images/icons/bullet.svg';
import SVG_STAR from '@/assets/images/icons/star.svg';
import SVG_DIAMOND from '@/assets/images/icons/diamond.svg';
import SVG_DIAMOND_ACE from '@/assets/images/icons/diamond-ace.svg';
import { DataTestID } from '@/tests/static';

const TestID = DataTestID.page.tidal.plans;

const PLAN_TIME_RANGE: { testID: string; recurrency: SubscriptionRecurrency }[] = [
    { testID: TestID.recurrencySwitch.monthly, recurrency: 'monthly' },
    { testID: TestID.recurrencySwitch.annual, recurrency: 'annual' },
];

interface Props {
    subscriptionData: SubscriptionPreview | null;
}

const PricingAndPlansScreen: FC<Props> = (props: Props) => {
    const { subscriptionData } = props;

    const modalCtx = useModal();
    const userCtx = useUser();
    const [navigate] = useNavigate();
    const breakpoint = useBreakpointCheck();

    const [recurrency, setRecurrency] = useState<SubscriptionRecurrency>('monthly');

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
            priceUSD: subscriptionData.type?.[type]?.priceUSD?.[recurrency] ?? NaN,
            recurrency: recurrency,
        };
        sessionStorage.setItem('subscription', JSON.stringify(subscription));
        navigate(subscriptionData.route);
    };

    // Elements
    const BillingResolution = (
        <span
            data-testid={TestID.card.links.brc.simple}
            onClick={() => modalCtx.openModal(<HelpModal type={'brc'} />, { darkenBg: true })}
            className={cn(styles.clickable, `underline`)}
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
        proUser: boolean,
        currentSubscription: boolean,
        cutBasicColumn: boolean,
    ): ReactElement => {
        const annualRecurrency =
            recurrency.toLocaleLowerCase() === ('annual' as SubscriptionRecurrency).toLocaleLowerCase();
        const currentRecurrency = userSubscription?.recurrency?.toLocaleLowerCase() === recurrency.toLocaleLowerCase();
        const currentType = userSubscription?.type?.toLocaleLowerCase() === type.toLocaleLowerCase();
        const { basicKind } = subscriptionData ?? {};
        const basicPlan = type.toLocaleLowerCase() === ('Basic' as PlanType).toLocaleLowerCase();

        const buttonDisabled = (currentSubscription && currentRecurrency && currentType) || basicPlan;

        const benefitsData = data?.benefits ?? generateFallbackEntries(5);
        const benefitsIcon = !buttonDisabled ? SVG_BULLET_DASHED : type === 'Pro' ? SVG_STAR : SVG_BULLET;
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
                <span data-testid={TestID.card.benefit}>{benefit}</span>
            </li>
        ));

        if (idx) {
            const Additional = (
                <div key={'additional'}>
                    <span data-testid={TestID.card.extension}>Everything in {firstPlanType}, and:</span>
                </div>
            );
            Benefits.unshift(Additional);
        }

        const Limits: ReactElement = (
            <>
                <span
                    data-testid={TestID.card.links.limits}
                    className={'cursor-pointer underline'}
                    onClick={() => modalCtx.openModal(<LimitsModal />, { darkenBg: true })}
                >
                    Limits apply
                </span>
                {userSubscription ? null : (
                    <span
                        data-testid={TestID.card.links.brc.related}
                        className={'whitespace-pre-wrap'}
                    >
                        Have an existing plan? See the&nbsp;
                        {BillingResolution}
                    </span>
                )}
            </>
        );

        let subscribeBtnText: string | ReactElement =
            userSubscription && basicKind && !proUser ? 'Upgrade to Pro' : 'Subscribe';
        let Links: ReactElement = Limits;

        if (buttonDisabled || basicPlan) {
            subscribeBtnText = 'Your current plan';
            Links = (
                <>
                    <span className={`underline`}>
                        <PageLink
                            data-testid={TestID.card.links.manage}
                            href={Route.ManageSubscriptions}
                            className={'cursor-pointer'}
                        >
                            Manage subscription
                        </PageLink>
                    </span>
                    {BillingResolution}
                </>
            );
        } else if (!currentType && userSubscription) {
            subscribeBtnText = (
                <>
                    {idx + +cutBasicColumn ? 'Up' : 'Down'}grade to&nbsp;
                    <span className={'capitalize'}>{type}</span>
                </>
            );
        } else if (!currentRecurrency) {
            subscribeBtnText =
                (basicKind && !proUser) || !currentSubscription ? (
                    subscribeBtnText
                ) : (
                    <>
                        Switch to&nbsp;
                        <span className={'capitalize'}>{PLAN_TIME_RANGE[+annualRecurrency].recurrency}</span>
                        &nbsp;Plan
                    </>
                );
        }

        const annualPlan = annualRecurrency && !basicPlan && !buttonDisabled;
        if (annualPlan) {
            Links = (
                <>
                    <span data-testid={TestID.card.yearlyLabel}>*Price billed annually</span>
                    {Links}
                </>
            );
        }

        const pricing: string = data
            ? data?.priceUSD?.[recurrency]
                ? '$' + data.priceUSD[recurrency] + '/month'
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
                    <span data-testid={TestID.card.name}>{type}</span>
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
                    <span data-testid={TestID.card.price}>{pricing + (annualPlan ? '*' : '')}</span>
                </div>
                <Button
                    data-testid={TestID.card.subscribeButton}
                    onClick={() => handleSubscribeClick(type)}
                    className={cn(
                        `w-full rounded-full bg-blue text-18 font-bold`,
                        `py-xs`,
                        `sm:x-[py-xxs,text-16]`,
                        `disabled:x-[bg-inherit,border-s,border-gray-l0,text-secondary]`,
                    )}
                    disabled={buttonDisabled}
                >
                    {subscribeBtnText}
                </Button>
            </>
        );

        return (
            <Collapsible
                data-testid={TestID.card.container}
                key={type + idx}
                title={type + idx}
                chevron
                expandedInit={[breakpoint === Breakpoint.lg]}
                collapsedContent={CollapsedContentSm}
                wrapper={cn(
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
            data-testid={entry.testID}
            key={entry.recurrency + idx}
            onClick={() => setRecurrency(entry.recurrency)}
            className={cn(
                `cursor-pointer rounded-full px-xs py-3xs font-bold capitalize`,
                recurrency === entry.recurrency ? 'bg-gray-l0' : 'text-secondary',
            )}
        >
            {entry.recurrency}
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
        </div>
    );
};

PricingAndPlansScreen.displayName = PricingAndPlansScreen.name;

export { PricingAndPlansScreen };
