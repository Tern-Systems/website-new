'use client';

import { ReactElement } from 'react';
import cn from 'classnames';

import { CardLink } from '@/app/types/layout';
import { Tip } from '@/app/types/blog';
import { CardsLibDTO } from '@/app/services/blog.service';
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

const renderTips = (type: ArticleCardType, tips: Tip[] = []) =>
    tips.map((tip) => (
        <li
            key={tip.id}
            className={'contents'}
        >
            <ArticleCard
                type={type}
                article={tip}
                altLink={tip.type === 'video' ? 'watch' : undefined}
                className={'[&:not(:first-of-type)]:border-t-0'}
            />
        </li>
    ));

const renderCarousel = (section: SectionData, cards: ReactElement[]) => (
    <Section className={{ section: 'mt-xxl md:mt-3xl lg:mt-xl' }}>
        <Carousel
            altData={{ title: section.title, link: section.href, cards }}
            classNameUl={'min-h-[27.0625rem]  grid-cols-1 md:grid-cols-2 lg:grid-cols-3  w-full sm:w-fit'}
        />
    </Section>
);

interface Props {
    section: {
        preHref: Route;
        first: SectionData;
        second: SectionData;
    };
    cards: CardsLibDTO | null;
}

const CardsLibrary = (props: Props) => {
    const { section, cards } = props;

    const breakpoint = useBreakpointCheck();

    const CardsPopularLi: ReactElement[] = renderTips('alt-vertical', cards?.popular);
    const CardsFeaturedLi: ReactElement[] = renderTips('alt', cards?.featured);
    const CardsVideosLi: ReactElement[] = renderTips('default', cards?.videos);
    const CardsReadsLi: ReactElement[] = renderTips('default', cards?.reads);

    return (
        <>
            <Section
                className={{
                    content: cn(
                        'grid grid-rows-2',
                        'md:grid-cols-2 lg:grid-cols-[15fr,14fr,14fr]',
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
                    <ul className={'flex flex-col h-full sm:mr-xs'}>{CardsPopularLi}</ul>
                </div>
                <div className={'flex flex-col h-full lg:col-span-2'}>
                    <Carousel
                        altData={{
                            title: 'Featured',
                            link: section.preHref,
                            cards: CardsFeaturedLi,
                            altSpinner:
                                breakpoint > Breakpoint.sm
                                    ? breakpoint === Breakpoint.md
                                        ? 'alt'
                                        : 'default'
                                    : undefined,
                        }}
                        rowsCount={2}
                        classNameUl={'flex-grow grid grid-rows-2 !gap-0  grid-cols-1 lg:grid-cols-2'}
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
                            'lg:x-[!grid-cols-2,gap-x-0] lg:col-span-2',
                            'sm:x-[!mx-auto,max-w-card,mr-xxs]',
                            'mt-xxl md:mt-3xl lg:mt-xl',
                        ),
                        image: '!size-full object-cover',
                        content: 'lg:pl-n  sm:text-10 text-12',
                        link: 'text-primary',
                    }}
                >
                    {HIGHLIGHTED_CARD.description}
                </ResourceCard>
            </Section>
            {renderCarousel(section.first, CardsVideosLi)}
            <Section className={{ section: 'mt-xxl md:mt-3xl lg:mt-xl' }}>
                <AllWaysCard alt />
            </Section>
            {renderCarousel(section.second, CardsReadsLi)}
        </>
    );
};

CardsLibrary.displayName = CardsLibrary.name;

export { CardsLibrary };
