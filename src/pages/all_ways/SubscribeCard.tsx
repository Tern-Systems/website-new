import React, { FC } from 'react';

import { ResourceCard } from '@/app/ui/organisms';

import PNG_MICROPROCESSOR from '/public/images/microprocessor.png';

const SubscribeCard: FC = () => (
    <ResourceCard
        type={'highlighted'}
        icon={PNG_MICROPROCESSOR}
        title={'The Latest News and Insights in Deep Tech'}
        action={{ title: 'Subscribe today', href: '' }} //TODO link
        className={{ wrapper: 'sm:x-[mx-auto,max-w-card]' }}
    >
        Discover expertly curated insights and news on AI, cloud and more in the weekly All Ways Newsletter.
    </ResourceCard>
);

export { SubscribeCard };
