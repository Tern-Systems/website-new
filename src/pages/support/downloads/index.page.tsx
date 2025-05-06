'use client';

import React from 'react';
import { StaticImageData } from 'next/image';
import cn from 'classnames';

import { DocumentationLink, ResourceLink, ResourceSectionData } from '@/app/types/layout';
import { Breakpoint } from '@/app/static';
import { Route } from '@/app/static';

import { useBreakpointCheck } from '@/app/hooks';
import { useUser } from '@/app/hooks';

import { PageLink } from '@/app/ui/layout';
import { BreadcrumbRoute } from '@/app/ui/atoms';
import { ResourceCards, ResourcesSection } from '@/app/ui/templates';

import styles from '@/app/common.module.css';

import SVG_DOWNLOAD_ARROW from '@/assets/images/icons/arrow-down-underline.svg';
import SVG_ARROW from '@/assets/images/icons/arrow.svg';

const DOWNLOAD_LINKS: DocumentationLink[] = [
    {
        title: 'TIDE',
        description: 'Download the desktop version of TIDE for further customization options and offline use.',
        subscription: 'Tidal',
        href: '',
    },
    {
        title: 'Calculator',
        description: 'The Calculator application is an advanced low-level language converter for BTMC and T27I.',
        subscription: 'Tidal',
        href: '',
    },
    {
        title: 'Market Penetration White Paper',
        description: 'Tern drives adoption through engineers, TIDE, hardware validation, and industry partnerships.',
        subscription: 'Tidal',
        href: '',
    },
    {
        title: 'G White Paper',
        description: 'Understand the reasoning behind building a new high-level programming language.',
        subscription: 'Tidal',
        href: '',
    },
];

const RESOURCES: ResourceSectionData[] = [
    { Node: <PageLink href={Route.Tips} /> },
    { Node: <PageLink href={Route.Community} /> },
    { Node: <PageLink href={Route.Support} /> },
];

interface Props {
    filterBySubscription: boolean;
}

function DocumentationPage(props: Props) {
    const { filterBySubscription } = props;

    const { userData } = useUser();
    const breakpoint = useBreakpointCheck();

    let links: ResourceLink[] = DOWNLOAD_LINKS;
    if (filterBySubscription) {
        links = DOWNLOAD_LINKS.filter((link) =>
            userData?.subscriptions.some((plan) => plan.subscription?.includes(link.subscription)),
        );
    }

    const icon: StaticImageData | null =
        breakpoint === Breakpoint.lg ? SVG_DOWNLOAD_ARROW : breakpoint <= Breakpoint.sm ? SVG_ARROW : null;

    return (
        <div className={'pb-6xl'}>
            <section className={styles.content}>
                <BreadcrumbRoute />
                <h1 className={`mt-3xl font-montserrat text-32 font-bold  sm:text-30`}>Downloads</h1>
            </section>
            <section className={cn(styles.content, styles.contentHighlight)}>
                <ResourceCards
                    icon={icon}
                    links={links}
                />
            </section>
            <ResourcesSection
                data={RESOURCES}
                className={'mt-6xl-1'}
            />
        </div>
    );
}

export default DocumentationPage;
