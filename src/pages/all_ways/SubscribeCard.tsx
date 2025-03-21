import React, { FC } from 'react';
import cn from 'classnames';

import { ResourceCard } from '@/app/ui/organisms';

import PNG_MICROPROCESSOR from '@/assets/images/microprocessor.png';

interface Props {
    className?: string;
}

const SubscribeCard: FC<Props> = (props: Props) => (
    <ResourceCard
        type={'highlighted'}
        icon={PNG_MICROPROCESSOR}
        title={'The Latest News and Insights in Deep Tech'}
        action={{ title: 'Subscribe today', href: '' }} //TODO link
        className={{ wrapper: cn('sm:x-[mx-auto,max-w-card]', props.className) }}
    >
        Discover expertly curated insights and news on AI, cloud and more in the weekly All Ways Newsletter.
    </ResourceCard>
);

export { SubscribeCard };
