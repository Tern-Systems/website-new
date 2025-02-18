import React from 'react';

import { DocumentationLink, ResourceSectionData } from '@/app/types/layout';
import { Route } from '@/app/static';
import { DOCUMENTATION_LINKS } from '@/app/static/documentation';

import { useUser } from '@/app/context';

import { PageLink } from '@/app/ui/layout';
import { HelpModal } from '@/app/ui/modals';
import { DocumentationCards, ResourcesSection } from '@/app/ui/templates';

import styles from '@/app/common.module.css';

const RESOURCES: ResourceSectionData[] = [
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

    let links: DocumentationLink[] = DOCUMENTATION_LINKS;
    if (filterBySubscription)
        links = DOCUMENTATION_LINKS.filter((link) =>
            userData?.subscriptions.some((plan) => plan.subscription.includes(link.subscription)),
        );

    return (
        <div className={'pb-[8.16rem]'}>
            <section className={styles.content}>
                <p className={'mt-n text-section-xxs'}>Support / Documentation</p>
                <h1 className={`mt-3xl font-oxygen text-section-xl font-bold  sm:text-section-l`}>Documentation</h1>
            </section>
            <section className={styles.content}>
                <DocumentationCards links={links} />
            </section>
            <ResourcesSection
                data={RESOURCES}
                className={'mt-[6.25rem]'}
            />
        </div>
    );
}

export default DocumentationPage;
