'use client';

import { FC, ReactElement, useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { ResourceSectionData, TableSection } from '@/app/types/layout';
import { Subscription } from '@/app/types/subscription';
import { RowProps } from '@/app/ui/organisms/Table';
import { MD_SM_HIDDEN_CN, MISC_LINKS, Route, SM_HIDDEN_CN } from '@/app/static';

import { capitalize, copyObject } from '@/app/utils';
import { useLoginCheck, useModal, useNavigate, useUser } from '@/app/hooks';

import { H1, Section } from '@/app/ui/atoms';
import { PageLink } from '@/app/ui/layout';
import { Table } from '@/app/ui/organisms';
import { MessageModal } from '@/app/ui/modals';
import { Button } from '@/app/ui/form';
import { ResourcesSection } from '@/app/ui/templates';

import styles from '@/app/common.module.css';

import SVG_ARROW_LONG from '@/assets/images/icons/arrow-right-long.svg';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

type TableEntry = {
    name: string;
    type: string;
    data: number | string;
    href: string | Route;
};

const SUBSCRIPTION_LINK_DICT: Record<string, string> = {
    // dot: Route.Dot,
    Tidal: MISC_LINKS.Tidal,
    trial: '',
};

const NAV_BTNS_DEFAULT: { title: string; href: string; external?: true }[] = [
    { title: 'Try Tidal Pro', href: MISC_LINKS.Tidal, external: true },
    { title: 'Build Key', href: MISC_LINKS.Tidal, external: true },
    { title: 'View All Ways', href: Route.AllWays, external: true },
    { title: 'Explore Keys', href: MISC_LINKS.TidalExploreKeys, external: true },
    { title: 'Get Certified', href: MISC_LINKS.Careers, external: true },
    { title: 'Join Newsletter', href: MISC_LINKS.Events, external: true },
];

const EVENTS_TEMPLATE: TableEntry[] = [
    {
        name: 'Bleeding Edge on X',
        type: 'Online Event',
        data: Date.now(),
        href: 'https://youtube.com',
    },
    {
        name: 'Tidal Scrum',
        type: 'BTS Video',
        data: Date.now(),
        href: 'https://youtube.com',
    },
    {
        name: 'SWEs of New York',
        type: 'In-Person Event',
        data: Date.now(),
        href: 'https://youtube.com',
    },
    {
        name: 'Your tern Podcast',
        type: 'Show',
        data: Date.now(),
        href: 'https://youtube.com',
    },
    {
        name: 'Tidal version 1.0.0-beta',
        type: 'Version Release',
        data: Date.now(),
        href: 'https://youtube.com',
    },
];

const RESOURCES: ResourceSectionData[] = [
    { Node: <PageLink href={Route.MyDocumentation} /> },
    { Node: <PageLink href={Route.GeneralFAQs}>Help & FAQs</PageLink> },
    { Node: <PageLink href={Route.Support} /> },
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

    const handleRowNavigation = () => {
        if (row.href.startsWith('https://')) window.open(row.href, '_blank');
        else navigate(row.href as Route);
    };

    return (
        <tr
            onClick={handleRowNavigation}
            className={cn('cursor-pointer', className)}
        >
            <td className={'w-[40%] py-3xs sm:x-[w-full,py-4xs] md:w-[50%]'}>{row.name}</td>
            <td className={cn('w-[29%]', MD_SM_HIDDEN_CN)}>{renderTd(row.type ?? '-')}</td>
            <td className={cn('w-[29%] md:w-[49%]', SM_HIDDEN_CN)}>{renderTd(row.data ?? '-')}</td>
            <td className={'!max-w-full'}>
                {/*TODO link*/}
                <ReactSVG
                    src={SVG_ARROW_LONG.src}
                    className={cn(`mr-1 inline-block !size-5xs [&_path]:fill-blue w-3xs  sm:w-6xs`)}
                />
            </td>
        </tr>
    );
};

const EventRow: FC<RowProps<TableEntry>> = (props: RowProps<TableEntry>) => {
    const { row, className } = props;
    const [navigate] = useNavigate();

    const handlRowNavigation = () => {
        if (row.href.startsWith('https://')) window.open(row.href, '_blank');
        else navigate(row.href as Route);
    };

    return (
        <tr
            onClick={handlRowNavigation}
            className={cn('cursor-pointer', className)}
        >
            <td className={'w-[40%] py-3xs sm:x-[w-full,py-4xs] md:w-[50%]'}>{row.name}</td>
            <td className={cn('w-[29%]', MD_SM_HIDDEN_CN)}>{renderTd(row.type ?? '-')}</td>
            <td className={cn('w-[29%]  md:w-[49%]', SM_HIDDEN_CN)}>{renderTd(row.data ?? '-')}</td>
            <td className={'!max-w-full'}>
                {/*TODO link*/}
                <PageLink
                    href={''}
                    icon={'arrow-right-long'}
                    className={'mr-1'}
                    iconClassName={`[&_path]:fill-blue w-3xs  sm:w-6xs`}
                />
            </td>
        </tr>
    );
};

function MyTernPage() {
    const userCtx = useUser();
    const isLoggedIn = useLoginCheck();
    const modalCtx = useModal();

    const [communityEvents, setCommunityEvents] = useState<TableEntry[]>([]);

    const navBtns = copyObject(NAV_BTNS_DEFAULT);
    if (userCtx.userData?.subscriptions?.find((plan) => plan.subscription === 'trial'))
        navBtns.splice(1, 0, { title: 'Try Tidal Pro', href: Route.TidalPlans });

    const subscriptionTable: TableSection<TableEntry> = {
        title: 'My Product',
        data:
            userCtx.userData?.subscriptions
                ?.filter((plan: Subscription) => plan.subscription !== 'trial')
                ?.map(
                    (plan: Subscription): TableEntry => ({
                        name: plan.subscription ?? '-- missing name --',
                        type:
                            capitalize(plan.type ?? '-- missing type --') +
                            ' (' +
                            capitalize(plan.recurrency ?? '-- missing recurrency --') +
                            ')',
                        data: plan.renewDate ? new Date(plan.renewDate).toLocaleDateString() : '-- missing date --',
                        href: plan.subscription ? SUBSCRIPTION_LINK_DICT[plan.subscription] : '-- missing link --',
                    }),
                ) ?? [],
        fallback: (
            <span>
                You don&apos;t have any products purchased. You could explore the plans on&nbsp;
                <PageLink
                    href={Route.TidalPlans}
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
            external={btn.external}
            href={btn.href}
        >
            <Button
                icon={faChevronRight}
                className={cn(`flex-row-reverse gap-x-n bg-blue  xxs:p-4xs-1 p-4xs  xxs:text-14 text-16`)}
                classNameIcon={cn(`[&_path]:fill-primary  sm:w-8xs [&_*]:w-[0.6rem]`)}
            >
                {btn.title}
            </Button>
        </PageLink>
    ));

    return (
        <>
            <Section className={{ content: `pt-6xl-1` }}>
                <H1 className={`flex !text-32 font-bold`}>Dashboard</H1>
                <p className={'text-xxs mt-xxs'}>{renderSinceDate(userCtx.userData?.registrationDate)}</p>
                <div className={'mt-n flex flex-wrap gap-xs xxs:gap-x-xxs'}>{LinksLi}</div>
            </Section>
            <Section className={{ content: `mt-xxl` }}>
                <div className={cn(styles.contentHighlight, 'relative flex flex-col  gap-y-xl')}>
                    <Table
                        table={subscriptionTable}
                        Row={SubscriptionRow}
                        cnTable={'!max-h-full'}
                    >
                        <td>Item</td>
                        <td className={MD_SM_HIDDEN_CN}>Plan Type</td>
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
                        <td className={MD_SM_HIDDEN_CN}>Type</td>
                        <td className={SM_HIDDEN_CN}>Date</td>
                        <td />
                    </Table>
                </div>
            </Section>
            <ResourcesSection
                data={RESOURCES}
                className={'mb-7xl mt-6xl-1'}
            />
        </>
    );
}

export default MyTernPage;
