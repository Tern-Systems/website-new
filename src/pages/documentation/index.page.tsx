import React, { ReactElement } from 'react';
import { ReactSVG } from 'react-svg';
import { PlanName } from '@/app/types/subscription';
import { Route } from '@/app/static';
import { useUser } from '@/app/context';

import { PageLink } from '@/app/ui/layout';

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

interface Props {
    filterBySubscription: boolean;
}

function DocumentationPage(props: Props) {
    const { filterBySubscription = false } = props;

    const { userData } = useUser();

    let links: Link[] = LINKS;
    if (filterBySubscription)
        links = LINKS.filter((link) =>
            userData?.subscriptions.some((plan) => plan.subscription.includes(link.subscription)),
        );

    const Links: ReactElement[] = links.map((link, idx) => (
        <li key={link.text + idx}>
            <PageLink
                href={link.route}
                className={`h-[min(38dvw,16rem)] min-h-[9rem] w-full flex-col justify-between rounded-n bg-gray px-xs py-l sm:landscape:x-[p-n,h-[13dvw],text-section] [&]:items-start`}
            >
                <span className={'block text-heading font-bold sm:landscape:text-section'}>{link.title}</span>
                <span>{link.text}</span>
                <ReactSVG
                    src={SVG_ARROW.src}
                    className={`rotate-180 [&_*]:size-[min(3.7dvw,1.3rem)] sm:landscape:[&_*]:size-[1.75dvw] [&_path]:fill-[--bg-blue]`}
                />
            </PageLink>
        </li>
    ));

    return (
        <div className={'m-auto place-items-center text-left'}>
            <div className={'sm:x-[overflow-y-hidden,max-h-full]'}>
                <h1
                    className={`block pb-[min(4dvw,1.9rem)] text-heading-l font-bold sm:landscape:x-[pb-[2.4dvw],text-heading-s]`}
                >
                    Documentation
                </h1>
                <ul
                    className={`grid grid-cols-[repeat(3,minmax(0,30rem))] gap-[0.12rem] text-[min(3.7dvw,1rem)] sm:x-[overflow-y-scroll] sm:portrait:x-[grid-cols-1,max-h-[65dvh]] sm:landscape:x-[grid-cols-2,text-section]`}
                >
                    {Links}
                </ul>
            </div>
        </div>
    );
}

export default DocumentationPage;
