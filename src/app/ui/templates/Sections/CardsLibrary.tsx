'use client';

import { ReactElement } from 'react';
import cn from 'classnames';

import { ArrayOfLength } from '@/app/types/utils';
import { CardLink } from '@/app/types/layout';
import { LibraryCardType } from '@/app/types/blog';
import { ArticleCardType } from '@/app/ui/organisms/ArticleCard';
import { Breakpoint, Route } from '@/app/static';

import { useBreakpointCheck } from '@/app/hooks';

import { H3, Section } from '@/app/ui/atoms';
import { ArticleCard, Carousel, ResourceCard } from '@/app/ui/organisms';
import { AllWaysCard } from '@/app/ui/templates';

import MICROPROCESSOR from '@/assets/images/microprocessor.png';

type SectionData = { title: string; href: Route };

// TODO href
const HIGHLIGHTED_CARD: CardLink = {
    icon: MICROPROCESSOR,
    title: 'Anticipate Tomorrow',
    description: 'Subscribe to the All Ways Newsletter for expert insights on the future of cutting-edge technology.',
    action: { title: 'Subscribe today', href: '' },
};

const renderCards = (type: ArticleCardType, tips: LibraryCardType[] = []) =>
    tips.map((tip, idx) => {
        let borderCN = '';
        switch (type) {
            case 'alt':
                borderCN = 'lg:[&:nth-last-child(-n+2)>*]:!border-l-0';
                break;
            case 'alt-vertical':
                borderCN = '[&:not(:first-of-type)>*]:border-t-0';
                break;
        }
        return (
            <li
                key={tip.id + idx}
                className={cn('contents', borderCN)}
            >
                <ArticleCard
                    key={tip.id + idx}
                    type={type}
                    article={tip}
                    altLink={tip.type === 'video' ? 'watch' : undefined}
                />
            </li>
        );
    });

const renderCarousel = (section: SectionData, cards: ReactElement[]) => (
    <Section className={{ section: 'mt-xxl md:mt-3xl lg:mt-xl' }}>
        <Carousel
            altData={{ title: section.title, link: section.href, cards }}
            classNameUl={'min-h-[27.0625rem]  grid-cols-1 md:grid-cols-2 lg:grid-cols-3  w-full'}
        />
    </Section>
);

interface Props {
    section: {
        preHref: Route;
        first: SectionData;
        second: SectionData;
    };
    cards: LibraryCardType[] | null;
    tags: ArrayOfLength<string, 4>;
}

const CardsLibrary = (props: Props) => {
    const { section, cards, tags } = props;

    const breakpoint = useBreakpointCheck();

    const CardsTag0Li: ReactElement[] = renderCards(
        'alt-vertical',
        cards?.filter((entry) => entry.tag === tags[0]).slice(0, 3),
    );
    const CardsTag1Li: ReactElement[] = renderCards('alt', cards?.filter((entry) => entry.tag === tags[1]).slice(0, 4));
    const CardsTag2Li: ReactElement[] = renderCards(
        'default',
        cards?.filter((entry) => entry.tag === tags[2]),
    );
    const CardsTag3Li: ReactElement[] = renderCards(
        'default',
        cards?.filter((entry) => entry.tag === tags[3]),
    );

    return (
        <>
            <Section
                className={{
                    content: cn(
                        'grid grid-rows-2',
                        'grid-cols-1 md:grid-cols-2 lg:grid-cols-[15fr,14fr,14fr]',
                        'sm:gap-y-xxl gap-n',
                    ),
                }}
            >
                <div className={'row-span-2 flex flex-col'}>
                    <H3
                        type={'large'}
                        className={'mb-xs md:mb-n lg:mb-xxl  sm:x-[mx-auto,w-card]'}
                    >
                        Most Popular
                    </H3>
                    <ul className={'flex flex-col h-full'}>{CardsTag0Li}</ul>
                </div>
                <div className={'flex flex-col h-full lg:col-span-2'}>
                    <Carousel
                        altData={{
                            title: 'Featured',
                            link: section.preHref,
                            cards: CardsTag1Li,
                            altSpinner:
                                breakpoint > Breakpoint.sm
                                    ? breakpoint === Breakpoint.md
                                        ? 'alt'
                                        : 'default'
                                    : undefined,
                        }}
                        rowsCount={2}
                        classNameUl={'flex-grow grid grid-rows-2 !gap-0 !w-full  sm:h-fit  grid-cols-1 lg:grid-cols-2'}
                    />
                </div>
                <ResourceCard
                    type={'highlighted'}
                    icon={HIGHLIGHTED_CARD.icon}
                    title={HIGHLIGHTED_CARD.title}
                    action={HIGHLIGHTED_CARD.action}
                    className={{
                        wrapper: cn(
                            'text-black',
                            'md:!grid-cols-1 lg:x-[!grid-cols-2,gap-x-0] lg:col-span-2',
                            'sm:x-[!mx-auto,max-w-card,mr-xxs] md:!p-xs',
                        ),
                        image: '!size-full object-cover',
                        content: 'lg:pl-n  sm:text-10 text-12',
                        link: 'text-primary',
                        children: 'md:!mt-xxs',
                    }}
                >
                    {HIGHLIGHTED_CARD.description}
                </ResourceCard>
            </Section>
            {renderCarousel(section.first, CardsTag2Li)}
            <Section className={{ section: 'mt-xxl md:mt-3xl lg:mt-xl' }}>
                <AllWaysCard alt />
            </Section>
            {renderCarousel(section.second, CardsTag3Li)}
        </>
    );
};

CardsLibrary.displayName = CardsLibrary.name;

export { CardsLibrary };
