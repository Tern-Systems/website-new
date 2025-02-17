import React, { ReactElement } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { PlanName } from '@/app/types/subscription';
import { ResourceSection } from '@/app/types/layout';
import { Route } from '@/app/static';
import { useUser } from '@/app/context';

import { PageLink } from '@/app/ui/layout';
import { HelpModal } from '@/app/ui/modals';
import { ResourcesSection } from '@/app/ui/templates/Resources';

import styles from '@/app/common.module.css';

import SVG_ARROW from '/public/images/icons/arrow.svg';

type Link = { title: string; text: string; route: Route; subscription: PlanName };

const LINKS: Link[] = [
    {
        title: 'TernKey Manual',
        text: 'Discover the sandbox application that unlocks the potential of ternary programming.',
        route: Route.TernKeyDoc,
        subscription: 'TernKey',
    },
    {
        title: 'TernKit Manual',
        text: 'Research and test ternary code on a machine equipped for ternary logic execution.',
        route: Route.TernKitDoc,
        subscription: 'TernKey',
    },
    {
        title: 'G Handbook',
        text: 'Master the G high-level programming language, optimized for ternary-based computing.',
        route: Route.GDoc,
        subscription: 'TernKey',
    },
    {
        title: 'TERN Handbook',
        text: 'Discover the TERN assembly programming language and redefine coding beyond binary limits.',
        route: Route.TernDoc,
        subscription: 'TernKey',
    },
    {
        title: 'BTMC Textbook',
        text: 'This textbook outlines BTMC fundamentals and the implementation of balanced ternary logic in systems.',
        route: Route.BTMCDoc,
        subscription: 'TernKey',
    },
];

const RESOURCES: ResourceSection[] = [
    { Node: <PageLink href={Route.Downloads} /> },
    { Node: <PageLink href={Route.Cases}>View your cases</PageLink> },
    {
        // TODO change to link to Support Hub page
        Node: 'Support Hub',
        action: ({ modalCtx }) => modalCtx.openModal(<HelpModal type={'support'} />, { darkenBg: true }),
    },
];

interface Props {
    filterBySubscription: boolean;
}

function DocumentationPage(props: Props) {
    const { filterBySubscription } = props;

    const { userData } = useUser();

    let links: Link[] = LINKS;
    if (filterBySubscription)
        links = LINKS.filter((link) =>
            userData?.subscriptions.some((plan) => plan.subscription.includes(link.subscription)),
        );

    // Elements
    const Links: ReactElement[] = links.map((link, idx) => (
        <li
            key={link.text + idx}
            className={'content'}
        >
            <PageLink
                href={link.route}
                className={`h-fit w-full flex-col !items-start bg-gray px-xs py-l  sm:py-n`}
            >
                <span className={'block text-heading  font-bold  sm:text-documentation'}>{link.title}</span>
                <span className={'mt-3xl leading-n  sm:text-section-xs'}>{link.text}</span>
                <ReactSVG
                    src={SVG_ARROW.src}
                    className={cn(
                        `rotate-180 [&_path]:fill-blue`,
                        `mt-5xl  [&_*]:size-[1.41rem]`,
                        `sm:mt-3xl sm:[&_*]:size-[1.23rem]`,
                    )}
                />
            </PageLink>
        </li>
    ));

    return (
        <div className={'pb-[8.16rem]'}>
            <section className={styles.content}>
                <p className={'mt-n text-section-xxs'}>Support / Documentation</p>
                <h1 className={`mt-3xl font-oxygen text-section-xl font-bold  sm:text-section-l`}>Documentation</h1>
            </section>
            <section className={styles.content}>
                <ul className={'mt-[2.88rem] grid grid-cols-2 gap-n  sm:grid-cols-1'}>{Links}</ul>
            </section>
            <ResourcesSection
                data={RESOURCES}
                className={'mt-[6.25rem]'}
            />
        </div>
    );
}

export default DocumentationPage;
