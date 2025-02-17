import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { TableSection } from '@/app/types/layout';
import { PlanName, Subscription } from '@/app/types/subscription';
import { RowProps, SM_HIDDEN_CN } from '@/app/ui/organisms/Table';
import { IModalContext } from '@/app/context/Modal.context';
import { Breakpoint } from '@/app/hooks/useBreakpointCheck';
import { MISC_LINKS, Route } from '@/app/static';

import { capitalize, copyObject } from '@/app/utils';
import { useModal, useUser } from '@/app/context';
import { useBreakpointCheck, useLoginCheck, useNavigate } from '@/app/hooks';

import { PageLink } from '@/app/ui/layout';
import { Table } from '@/app/ui/organisms';
import { HelpModal, MessageModal } from '@/app/ui/modals';
import { Button } from '@/app/ui/form';
import { FAQsModal } from './faqs/index.page';

import styles from '@/app/common.module.css';

type TableEntry = {
    name: string;
    type: string;
    data: number | string;
    href: string | Route;
};

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

const renderTd = (data: string | number) => (typeof data === 'string' ? data : new Date(data).toLocaleDateString());

const SubscriptionRow: FC<RowProps<TableEntry>> = (props: RowProps<TableEntry>) => {
    const { row, className } = props;
    const [navigate] = useNavigate();
    return (
        <tr
            onClick={() => {
                if (row.href.startsWith('https://')) window.open(row.href, '_blank');
                else navigate(row.href as Route);
            }}
            className={cn('cursor-pointer', className)}
        >
            <td className={'w-[40%] sm:w-full md:w-[50%]'}>{row.name}</td>
            <td className={cn('w-[29%] md:w-[49%]', SM_HIDDEN_CN)}>{renderTd(row.type ?? '-')}</td>
            <td className={cn('w-[29%]', SM_HIDDEN_CN)}>{renderTd(row.data ?? '-')}</td>
            <td className={'!max-w-full'}>
                <PageLink
                    icon={'arrow-right-long'}
                    className={'mr-1'}
                    iconClassName={`[&_path]:fill-blue [&_*]:w-[1.3rem]  sm:[&_*]:w-[0.875rem]`}
                />
            </td>
        </tr>
    );
};

const EventRow: FC<RowProps<TableEntry>> = (props: RowProps<TableEntry>) => {
    const { row, className } = props;
    const [navigate] = useNavigate();
    return (
        <tr
            onClick={() => {
                if (row.href.startsWith('https://')) window.open(row.href, '_blank');
                else navigate(row.href as Route);
            }}
            className={cn('cursor-pointer', className)}
        >
            <td className={'w-[40%] sm:w-full md:w-[50%]'}>{row.name}</td>
            <td className={cn('w-[29%] md:w-[49%]', SM_HIDDEN_CN)}>{renderTd(row.type ?? '-')}</td>
            <td className={cn('w-[29%]', SM_HIDDEN_CN)}>{renderTd(row.data ?? '-')}</td>
            <td className={'!max-w-full'}>
                <PageLink
                    icon={'arrow-right-long'}
                    className={'mr-1'}
                    iconClassName={`[&_path]:fill-blue [&_*]:w-[1.3rem]  sm:[&_*]:w-[0.875rem]`}
                />
            </td>
        </tr>
    );
};

function MyTernPage() {
    const userCtx = useUser();
    const modalCtx = useModal();
    const isLoggedIn = useLoginCheck();
    const [navigate] = useNavigate();
    const isSm = useBreakpointCheck() <= Breakpoint.sm;

    const [communityEvents, setCommunityEvents] = useState<TableEntry[]>([]);

    const navBtns = copyObject(NAV_BTNS_DEFAULT);
    if (userCtx.userData?.subscriptions?.find((plan) => plan.subscription === 'trial'))
        navBtns.splice(1, 0, { title: 'Try TernKey Pro', href: Route.TernKeyPricing });

    const subscriptionTable: TableSection<TableEntry> = {
        title: 'My Product',
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
                className={cn(`flex-row-reverse bg-blue`, `p-4xs text-basic`, `xxs:x-[p-[0.56rem],text-section-xs]`)}
                classNameIcon={cn(`[&_path]:fill-primary -rotate-90 ml-n [&_*]:w-[0.6rem]`, `sm:[&_*]:w-[0.525rem]`)}
            >
                {btn.title}
            </Button>
        </PageLink>
    ));

    const ResourcesLi: ReactElement[] = RESOURCES.map((entry, idx) => (
        <li
            key={'node-' + idx}
            onClick={() => {
                if (typeof entry.action === 'function') entry.action({ isSm, navigate, modalCtx });
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
        <div className={cn(styles.section, `min-h-dvh bg-black pt-[6.25rem]`)}>
            <section className={styles.content}>
                <h1 className={`flex text-section-xl font-bold`}>Dashboard</h1>
                <p className={'text-xxs mt-xxs'}>{renderSinceDate(userCtx.userData?.registrationDate)}</p>
            </section>
            <section className={cn(styles.content, 'mt-n flex flex-wrap gap-xs xxs:gap-x-xxs')}>{LinksLi}</section>
            <section
                className={cn(
                    styles.content,
                    styles.contentHighlight,
                    'relative mt-xxl flex max-h-[20rem] flex-col  gap-y-xl',
                )}
            >
                <Table
                    table={subscriptionTable}
                    Row={SubscriptionRow}
                    cnTable={'!max-h-full'}
                >
                    <td>Item</td>
                    <td className={SM_HIDDEN_CN}>Plan Type</td>
                    <td className={SM_HIDDEN_CN}>Upcoming payment</td>
                    <td />
                </Table>
                <Table
                    table={{
                        title: 'Community Events',
                        data: communityEvents,
                        fallback: 'No upcoming news or events.',
                    }}
                    Row={EventRow}
                    cnTable={'!max-h-full'}
                >
                    <td>Event</td>
                    <td className={SM_HIDDEN_CN}>Type</td>
                    <td className={SM_HIDDEN_CN}>Date</td>
                    <td />
                </Table>
            </section>
            <section className={cn(styles.content, 'mb-[9.41rem] mt-[6.25rem] text-section-xs')}>
                <p className={'pl-n font-bold'}>Additional resources</p>
                <ul className={'mt-xxs border-t-s border-white-d0 [&>li]:x-[px-n,py-xs,text-blue]'}>{ResourcesLi}</ul>
            </section>
        </div>
    );
}

export default MyTernPage;
