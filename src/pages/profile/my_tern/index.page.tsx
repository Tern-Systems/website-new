import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { IModalContext } from '@/app/context/Modal.context';
import { PlanName, Subscription } from '@/app/types/subscription';
import { Breakpoint } from '@/app/hooks/useBreakpointCheck';
import { MISC_LINKS, Route } from '@/app/static';

import { capitalize, copyObject } from '@/app/utils';
import { useModal, useUser } from '@/app/context';
import { useBreakpointCheck, useLoginCheck, useNavigate } from '@/app/hooks';

import { PageLink } from '@/app/ui/layout';
import { HelpModal, MessageModal } from '@/app/ui/modals';
import { Button } from '@/app/ui/form';
import { FAQsModal } from './faqs/index.page';
import { Table, TableEntry, TableSection } from './Table';

import styles from '@/app/common.module.css';
import myTernStyles from './MyTern.module.css';

import SVG_ARROW_LONG from '/public/images/icons/arrow-right-long.svg';

type Resource = {
    Node: ReactNode;
    action?: string | ((props: { isSm: boolean; navigate: (link: Route) => void; modalCtx: IModalContext }) => void);
};

const SUBSCRIPTION_LINK_DICT: Record<PlanName, string> = {
    // dot: Route.Dot,
    TernKey: MISC_LINKS.TernKey,
    trial: '',
};

const NAV_BTNS_DEFAULT: { title: string; href: string; external?: true }[] = [
    { title: 'Try TernKey Pro', href: MISC_LINKS.TernKey, external: true },
    { title: 'Build Key', href: MISC_LINKS.TernKey, external: true },
    { title: 'View All Ways', href: Route.AllWays, external: true },
    { title: 'Explore Keys', href: MISC_LINKS.TernKey + '/explore', external: true },
    { title: 'Get Certified', href: MISC_LINKS.Careers, external: true },
    { title: 'Join Newsletter', href: MISC_LINKS.Events, external: true },
];

const EVENTS_TEMPLATE: TableEntry[] = [
    { name: 'Bleeding Edge on X', type: 'Online Event', data: Date.now(), href: 'https://youtube.com' },
    { name: 'TernKey Scrum', type: 'BTS Video', data: Date.now(), href: 'https://youtube.com' },
    { name: 'SWEs of New York', type: 'In-Person Event', data: Date.now(), href: 'https://youtube.com' },
    { name: 'Your tern Podcast', type: 'Show', data: Date.now(), href: 'https://youtube.com' },
    { name: 'TernKey version 1.0.0-beta', type: 'Version Release', data: Date.now(), href: 'https://youtube.com' },
];

const RESOURCES: Resource[] = [
    { Node: <PageLink href={Route.MyDocumentation} /> },
    {
        Node: 'Help & FAQs',
        action: ({ isSm, navigate, modalCtx }) =>
            isSm ? navigate(Route.Help) : modalCtx.openModal(<FAQsModal />, { darkenBg: true }),
    },
    {
        Node: 'Support Hub',
        action: ({ modalCtx }) => modalCtx.openModal(<HelpModal type={'support'} />, { darkenBg: true }),
    },
];

const renderSinceDate = (dateNumber: number | undefined) => {
    if (!dateNumber) return `Date of registration is unknown`;
    const date = new Date(dateNumber ?? 0);
    return `Member since ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
};

function MyTernPage() {
    const userCtx = useUser();
    const modalCtx = useModal();
    const isLoggedIn = useLoginCheck();
    const [navigate] = useNavigate();
    const breakpoint = useBreakpointCheck();

    const [communityEvents, setCommunityEvents] = useState<TableEntry[]>([]);

    const navBtns = copyObject(NAV_BTNS_DEFAULT);
    if (userCtx.userData?.subscriptions?.find((plan) => plan.subscription === 'trial'))
        navBtns.splice(1, 0, { title: 'Try TernKey Pro', href: Route.TernKeyPricing });

    const subscriptionTable: TableSection = {
        title: 'My Product',
        columnNames: ['Item', 'Plan Type', 'Upcoming payment'],
        data:
            userCtx.userData?.subscriptions
                ?.filter((plan: Subscription) => plan.subscription !== 'trial')
                ?.map(
                    (plan: Subscription): TableEntry => ({
                        name: plan.subscription,
                        type: capitalize(plan.type) + ' (' + capitalize(plan.recurrency ?? '') + ')',
                        data: new Date(plan.renewDate).toLocaleDateString(),
                        href: SUBSCRIPTION_LINK_DICT[plan.subscription],
                    }),
                ) ?? [],
        fallback: (
            <span>
                You don&apos;t have any products purchased. You could explore the plans on&nbsp;
                <PageLink
                    href={Route.TernKeyPricing}
                    className={'underline'}
                >
                    Pricing page
                </PageLink>
                .
            </span>
        ),
    };

    useEffect(() => {
        try {
            // TODO fetch events
            setCommunityEvents(EVENTS_TEMPLATE);
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    }, []);

    if (!isLoggedIn) return null;

    // Elements
    const LinksLi: ReactElement[] = navBtns.map((btn, idx) => (
        <PageLink
            key={btn.title + idx}
            isExternal={btn.external}
            href={btn.href}
        >
            <Button
                icon={'chevron'}
                className={cn(`flex-row-reverse bg-blue`, `p-4xs text-basic`, {
                    [`p-[0.56rem] text-section-xs`]: breakpoint <= Breakpoint.sm,
                })}
                classNameIcon={cn(`[&_path]:fill-primary -rotate-90 ml-n [&_*]:w-[0.6rem]`, {
                    [`[&_*]:w-[0.525rem]`]: breakpoint <= Breakpoint.sm,
                })}
            >
                {btn.title}
            </Button>
        </PageLink>
    ));

    const ResourcesLi: ReactElement[] = RESOURCES.map((entry, idx) => (
        <li
            key={'node-' + idx}
            onClick={() => {
                if (typeof entry.action === 'function')
                    entry.action({ isSm: breakpoint <= Breakpoint.sm, navigate, modalCtx });
            }}
            className={cn(
                styles.clickable,
                `flex cursor-pointer items-center justify-between border-b-s border-white-d0`,
            )}
        >
            {entry.Node}
            <ReactSVG
                src={SVG_ARROW_LONG.src}
                className={'[&_*]:w-[1.41rem] [&_path]:fill-blue'}
            />
        </li>
    ));

    return (
        <div className={cn(styles.section, myTernStyles.background, `min-h-dvh bg-black pt-[6.25rem]`)}>
            <section className={cn(styles.content)}>
                <h1 className={`flex font-oxygen text-[2rem] font-bold`}>Dashboard</h1>
                <p className={'text-xxs mt-xxs'}>{renderSinceDate(userCtx.userData?.registrationDate)}</p>
            </section>
            <section
                className={cn(styles.content, 'mt-n flex flex-wrap gap-xs', {
                    [`gap-x-xxs`]: breakpoint <= Breakpoint.sm,
                })}
            >
                {LinksLi}
            </section>
            <section className={cn(styles.content, 'mt-xxl flex flex-col gap-y-xl')}>
                <Table table={subscriptionTable} />
                <Table
                    external={true}
                    table={{
                        title: 'Community Events',
                        columnNames: ['Event', 'Type', 'Date'],
                        data: communityEvents,
                        fallback: 'No upcoming news or events.',
                    }}
                />
            </section>
            <section className={cn(styles.content, 'mb-[9.41rem] mt-[6.25rem] text-section-xs')}>
                <p className={'pl-n font-bold'}>Additional resources</p>
                <ul className={'mt-xxs border-t-s border-white-d0 [&>li]:x-[px-n,py-xs,text-blue]'}>{ResourcesLi}</ul>
            </section>
        </div>
    );
}

export default MyTernPage;
