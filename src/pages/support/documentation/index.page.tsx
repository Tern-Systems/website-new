'use client';

import React from 'react';

import { ResourceLink, ResourceSectionData } from '@/app/types/layout';
import { Route } from '@/app/static';
import { DOCUMENTATION_LINKS } from '@/app/static/documentation';

import { useUser } from '@/app/hooks';

import { PageLink } from '@/app/ui/layout';
import { ResourceCards, ResourcesSection } from '@/app/ui/templates';
import { BreadcrumbRoute, H1, Section } from '@/app/ui/atoms';

import SVG_ARROW from '@/assets/images/icons/arrow.svg';

const RESOURCES: ResourceSectionData[] = [
    { Node: <PageLink href={Route.Downloads} /> },
    { Node: <PageLink href={Route.Cases}>View your cases</PageLink> },
    { Node: <PageLink href={Route.Support} /> },
];

interface Props {
    filterBySubscription: boolean;
}

function DocumentationPage(props: Props) {
    const { filterBySubscription } = props;

    const { userData } = useUser();

    let links: ResourceLink[] = DOCUMENTATION_LINKS;
    if (filterBySubscription) {
        links = DOCUMENTATION_LINKS.filter((link) =>
            userData?.subscriptions.some((plan) => plan.subscription?.includes(link.subscription)),
        );
    }

    return (
        <div className={'pb-6xl'}>
            <Section>
                <BreadcrumbRoute />
                <H1 className={`mt-3xl font-montserrat !text-32 font-bold  sm:!text-30`}>Documentation</H1>
            </Section>
            <Section>
                <ResourceCards
                    highlighted
                    icon={SVG_ARROW}
                    links={links}
                />
            </Section>
            <ResourcesSection
                data={RESOURCES}
                className={'mt-6xl-1'}
            />
        </div>
    );
}

export default DocumentationPage;
