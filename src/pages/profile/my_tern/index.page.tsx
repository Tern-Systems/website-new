import React, { ReactElement, useEffect, useState } from 'react';
import cn from 'classnames';

import { PlanName, Subscription } from '@/app/types/subscription';
import { ResourceSection } from '@/app/types/layout';
import { Breakpoint } from '@/app/hooks/useBreakpointCheck';
import { MISC_LINKS, Route } from '@/app/static';

import { capitalize, copyObject } from '@/app/utils';
import { useUser } from '@/app/context';
import { useBreakpointCheck, useLoginCheck } from '@/app/hooks';

import { PageLink } from '@/app/ui/layout';
import { Button } from '@/app/ui/form';
import { HelpModal } from '@/app/ui/modals';
import { FAQsModal } from '@/pages/support/faqs/index.page';
import { ResourcesSection } from '@/app/ui/templates/Resources';
import { Table, TableEntry, TableSection } from './Table';

import styles from '@/app/common.module.css';


const SUBSCRIPTION_LINK_DICT: Record<PlanName, string> = {
    // dot: Route.Dot,
    TernKey: MISC_LINKS.TernKey,
    trial: '',
};

const NAV_BTNS_DEFAULT: { title: string; href: string, external?: true }[] = [
    { title: 'Try TernKey Pro', href: MISC_LINKS.TernKey, external: true },
    { title: 'Build Key', href: MISC_LINKS.TernKey, external: true },
    { title: 'View All Ways', href: Route.AllWays, external: true },
    { title: 'Explore Keys', href: MISC_LINKS.TernKeyExploreKeys, external: true },
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

const RESOURCES: ResourceSection[] = [
    { Node: <PageLink href={Route.MyDocumentation} /> },
    {
        Node: 'Help & FAQs',
        action: ({ isSm, navigate, modalCtx }) => isSm
            ? navigate(Route.Help)
            : modalCtx.openModal(<FAQsModal />, { darkenBg: true }),
    },
    { // TODO change to link to Support Hub page
        Node: 'Support Hub',
        action: ({ modalCtx }) => modalCtx.openModal(<HelpModal type={'support'} />, { darkenBg: true }),
    },
];


const renderSinceDate = (dateNumber: number | undefined) => {
    if (!dateNumber)
        return `Date of registration is unknown`;
    const date = new Date(dateNumber ?? 0);
    return `Member since ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
};


function MyTernPage() {
    const userCtx = useUser();
    const isLoggedIn = useLoginCheck();
    const breakpoint = useBreakpointCheck();

    const [communityEvents, setCommunityEvents] = useState<TableEntry[]>([]);

    const navBtns = copyObject(NAV_BTNS_DEFAULT);
    if (userCtx.userData?.subscriptions?.find((plan) => plan.subscription === 'trial'))
        navBtns.splice(1, 0, { title: 'Try TernKey Pro', href: Route.TernKeyPricing });

    const subscriptionTable: TableSection = {
        title: 'My Product',
        columnNames: ['Item', 'Plan Type', 'Upcoming payment'],
        data: userCtx.userData?.subscriptions
            ?.filter((plan: Subscription) => plan.subscription !== 'trial')
            ?.map((plan: Subscription): TableEntry => ({
                name: plan.subscription,
                type: capitalize(plan.type) + ' (' + capitalize(plan.recurrency ?? '') + ')',
                data: new Date(plan.renewDate).toLocaleDateString(),
                href: SUBSCRIPTION_LINK_DICT[plan.subscription],
            })) ?? [],
        fallback: (
            <span>
                You don&apos;t have any products purchased. You could explore the plans on&nbsp;
                <PageLink href={Route.TernKeyPricing} className={'underline'}>Pricing page</PageLink>.
            </span>
        ),
    };

    useEffect(() => {
        try {
            // TODO fetch events
            setCommunityEvents(EVENTS_TEMPLATE);
        } catch (error: unknown) {
        }
    }, []);

    if (!isLoggedIn)
        return null;

    // Elements
    const LinksLi: ReactElement[] = navBtns.map((btn, idx) => (
        <PageLink key={btn.title + idx} isExternal={btn.external} href={btn.href}>
            <Button
                icon={'chevron'}
                className={cn(
                    `flex-row-reverse bg-blue`,
                    `p-4xs text-basic`,
                    { [`p-[0.56rem] text-section-xs`]: breakpoint <= Breakpoint.sm },
                )}
                classNameIcon={cn(
                    `[&_path]:fill-primary -rotate-90 ml-n [&_*]:w-[0.6rem]`,
                    { [`[&_*]:w-[0.525rem]`]: breakpoint <= Breakpoint.sm },
                )}
            >
                {btn.title}
            </Button>
        </PageLink>
    ));


    return (
        <div className={cn(styles.section, `pt-[6.25rem] min-h-dvh bg-black`)}>
            <section className={cn(styles.content)}>
                <h1 className={`flex font-bold font-oxygen text-[2rem]`}
                >
                    Dashboard
                </h1>
                <p className={'mt-xxs text-xxs'}>
                    {renderSinceDate(userCtx.userData?.registrationDate)}
                </p>
            </section>
            <section
                className={cn(styles.content, 'mt-n flex flex-wrap  gap-xs', { [`gap-x-xxs`]: breakpoint <= Breakpoint.sm })}>
                {LinksLi}
            </section>
            <section className={cn(styles.content, styles.contentHighlight, 'relative flex flex-col gap-y-xl mt-xxl')}>
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
            <ResourcesSection data={RESOURCES} className={'mt-[6.25rem] mb-[9.41rem]'} />
        </div>
    );
}


export default MyTernPage;
