import { FC } from 'react';
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
        title={'Anticipate Tomorrow'}
        action={{ title: 'Subscribe Today', href: '' }} //TODO link
        className={{
            wrapper: cn('h-full md:!gap-y-xxs lg:grid-cols-[1fr,1fr]', props.className),
            title: cn('lg:w-full text-24'),
            children: cn('lg:w-full text-12'),
            content: cn('text-black lg:max-h-[364px] py-4 lg:min-w-[300px]'),
            image: cn(
                'object-cover lg:rounded-none lg:h-full lg:w-full lg:max-w-[364px] lg:max-h-[364px] lg:aspect-square md:max-h-[225px]',
            ),
            link: cn(''),
        }}
    >
        Subscribe to the All Ways Newsletter for expert insights on the future of cutting-edge technology.
    </ResourceCard>
);

export { SubscribeCard };
