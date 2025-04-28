'use client';

import { FC, HTMLAttributes, ReactElement } from 'react';
import cn from 'classnames';

import { CardLink } from '@/app/types/layout';

import { ResourceCard } from '@/app/ui/organisms';
import { Section } from '@/app/ui/atoms';

interface Props extends Pick<HTMLAttributes<HTMLDivElement>, 'className'> {
    cards: CardLink[];
}

const CardCheckersSection: FC<Props> = (props: Props) => {
    const { className, cards } = props;

    const CardsLi: ReactElement[] = cards.map((card, idx) => (
        <li
            key={card.title + idx}
            className={'contents'}
        >
            <ResourceCard
                type={card.alt ? 'highlighted' : 'default'}
                icon={card.icon}
                title={card.title}
                action={card.action}
                bullets={card.bullets}
                className={{
                    image: cn({ ['lg:col-start-2']: idx % 2 }),
                    content: cn({ ['lg:x-[row-start-1,col-start-1]']: idx % 2 }),
                }}
            >
                {card.description}
            </ResourceCard>
        </li>
    ));

    return (
        <Section className={{ content: className }}>
            <ul className={'flex flex-col  gap-y-7xl md:gap-y-5xl sm:gap-y-3xl'}>{CardsLi}</ul>
        </Section>
    );
};

CardCheckersSection.displayName = CardCheckersSection.name;

export { CardCheckersSection };
