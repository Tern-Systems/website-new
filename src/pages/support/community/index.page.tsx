'use client';

import { ReactElement, useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import Image from 'next/image';
import cn from 'classnames';
import { Breakpoint, Route } from '@/app/static';
import { Article } from '@/app/types/blog';
import { Tab } from '@/app/ui/organisms/Tabs';

import { BlogService } from '@/app/services/blog.service';

import { useBreakpointCheck, useModal } from '@/app/hooks';

import { MainBackground } from '@/app/ui/atoms';
import { ArticleCard, Tabs } from '@/app/ui/organisms';
import { MessageModal } from '@/app/ui/modals';
import { PageLink } from '@/app/ui/layout';

import styles from '@/app/common.module.css';

import PNG_BG_MAIN from '@/assets/images/community-bg-main.png';
import PNG_ABOUT from '@/assets/images/community-about.png';
import PNG_HIGHLIGHTED_0 from '@/assets/images/community-card-highlighted-0.png';
import PNG_HIGHLIGHTED_1 from '@/assets/images/community-card-highlighted-2.png';

import SVG_CLOCK from '@/assets/images/icons/clock.svg';
import { CardCheckersSection } from '@/app/ui/templates';

type Event = {
    date: number;
    timeZone: string; // TODO confirm
    tag: string;
    description: string;
    time: { start: number; end: number };
};

const DAY_NAMES = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];

const EVENTS_TEMPLATE: Event[] = [
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Webinar',
        description: 'Tern New Website Design Demonstration',
        time: {
            start: new Date().getTime(),
            end: new Date().getTime() + 3_600_000,
        },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Webinar',
        description: 'Tern New Website Design Demonstration',
        time: {
            start: new Date().getTime(),
            end: new Date().getTime() + 3_600_000,
        },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Webinar',
        description: 'Tern New Website Design Demonstration',
        time: {
            start: new Date().getTime(),
            end: new Date().getTime() + 3_600_000,
        },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Webinar',
        description: 'Tern New Website Design Demonstration',
        time: {
            start: new Date().getTime(),
            end: new Date().getTime() + 3_600_000,
        },
    },
];

// TODO links
const TABS: Tab[] = [
    {
        name: 'Associates',
        content: {
            icon: PNG_HIGHLIGHTED_0,
            title: 'We love interacting with our associates',
            action: { title: 'Read Whitepaper', href: '' },
            text: 'Find out more about our unique strategic approach to cultivating lasting professional relationships.',
        },
    },
    {
        name: 'Customers',
        content: {
            icon: PNG_HIGHLIGHTED_1,
            title: 'Customers deserve undivided attention',
            action: { title: 'Find resources', href: '' },
            text:
                '   At Tern we hold our customers on the highest pedestal to ensure they receive the high-class\n' +
                '                professionalism they deserve. We do this through our Support Hub and Billing Resolution Centers\n' +
                '                resources.',
        },
    },
];

const ARTICLE_CARD_COUNT_LG = 3;
const MAX_ARTICLE_CARD_COUNT = 4;

function CommunityPage() {
    const modalCtx = useModal();
    const breakpoint = useBreakpointCheck();

    const [events, setEvents] = useState<Event[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // TODO API call
                setEvents(EVENTS_TEMPLATE);
            } catch (err: unknown) {
                if (typeof err === 'string') modalCtx.openModal(<MessageModal>{err}</MessageModal>);
            }
        };
        const fetchArticles = async () => {
            try {
                const { payload } = await BlogService.getArticles();
                setArticles(payload.blogs?.slice(0, MAX_ARTICLE_CARD_COUNT));
            } catch (err: unknown) {
                if (typeof err === 'string') modalCtx.openModal(<MessageModal>{err}</MessageModal>);
            }
        };
        fetchEvents();
        fetchArticles();
    }, []);

    // Elements
    const EventsLi: ReactElement[] = events.map((event: Event, idx) => {
        const day = new Date(event.date).getDay();
        return (
            <li
                key={event.description.slice(5) + idx}
                className={'contents'}
            >
                <div
                    className={cn(
                        'grid gap-y-xxs  sm:bg-blue',
                        'sm:gap-x-0 gap-x-xxs',
                        'sm:grid-cols-[1fr,min-content] grid-cols-[min-content,1fr]',
                        'sm:p-5xs p-xxs',
                        'sm:text-10 text-12',
                    )}
                >
                    <span
                        className={cn(
                            'bg-blue',
                            'sm:x-[inline,p-0] flex  flex-col justify-center px-xs py-n',
                            'sm:row-span-1 row-span-3',
                            'size-11xl sm:size-fit',
                        )}
                    >
                        <span className={'text-center sm:text-24 text-64'}>{day}</span>
                        <span className={'sm:ml-5xs  sm:text-10 text-12'}>{DAY_NAMES[day]}</span>
                    </span>
                    <span className={'col-start-2 flex items-center p-6xs size-fit bg-gray-l1 text-black'}>
                        {event.tag}
                    </span>
                    <span className={'leading-n  sm:col-span-2  sm:text-10 text-16'}>{event.description}</span>
                    <span className={'flex items-center  sm:col-span-2'}>
                        <ReactSVG
                            src={SVG_CLOCK.src}
                            className={'size-7xs sm:size-8xs'}
                        />
                        <span className={'ml-5xs sm:ml-6xs'}>
                            {new Date(event.time.start).getHours()} - {new Date(event.time.start).getHours()} hrs&nbsp;
                            {event.timeZone}
                        </span>
                    </span>
                </div>
            </li>
        );
    });

    let articleCount = ARTICLE_CARD_COUNT_LG;
    if (breakpoint <= Breakpoint.sm) articleCount = ARTICLE_CARD_COUNT_LG - 1;
    if (breakpoint === Breakpoint.md) articleCount = ARTICLE_CARD_COUNT_LG + 1;

    const ArticleCardsLi: ReactElement[] = articles.slice(0, articleCount).map((article: Article, idx) => (
        <li
            key={article?.id ?? 'card-' + idx}
            className={'contents'}
        >
            <ArticleCard
                article={article}
                hideTag
                altLink={'Enter support hub'}
                className={'max-w-full'}
                classNameContent={'bg-white-d2 text-black'}
                rootHref={Route.Events}
            />
        </li>
    ));

    return (
        <>
            <section className={cn(styles.section, 'h-screen max-h-[21.625rem]')}>
                <MainBackground
                    url={PNG_BG_MAIN}
                    className={'translate-y-0 max-h-full'}
                />
                <div className={cn(styles.content, 'relative z-10 pt-xxl')}>
                    <h1 className={'md:w-[83%] lg:w-1/2  leading-l text-64'}>Welcome to the Tern Community</h1>
                </div>
            </section>
            <section className={cn(styles.section, 'bg-gradient-to-b from-blue to-transparent to-10%')}>
                <div className={cn(styles.content, 'pt-6xl md:pt-6xl-1 lg:pt-6xl')}>
                    <h3 className={'text-27 lg:text-40'}>Get plugged in with like minded individuals</h3>
                    <p className={'mt-xxl leading-l  text-20 md:text-21 lg:text-27'}>
                        Tern is dedicated to fostering a strong community around it’s products and services to cultivate
                        a sustainable business mode built on trust.
                    </p>
                    <div className={'grid grid-cols-2  mt-xxl md:mt-6xl-1 lg:mt-7xl'}>
                        <div className={'contents'}>
                            <Image
                                src={PNG_ABOUT}
                                alt={'about'}
                                className={'size-full max-h-[59.26rem]'}
                            />
                        </div>
                        <p
                            className={cn(
                                'w-min break-words content-center font-bold leading-[2]',
                                'px-xxs md:px-n lg:px-3xl',
                                'text-40 md:text-64 lg:text-96',
                            )}
                        >
                            Culture. Drives. Markets.
                        </p>
                    </div>
                </div>
            </section>
            <section className={styles.section}>
                <div className={cn(styles.content, 'pt-5xl md:pt-6xl-1 lg:pt-7xl')}>
                    <Tabs
                        title='What Drives You?'
                        description='Join the conversation'
                        tabs={TABS}
                    />
                </div>
            </section>
            <section className={styles.section}>
                <div className={cn(styles.content, 'pt-5xl md:pt-6xl-1 lg:pt-7xl')}>
                    <h3 className={cn('text-27 lg:text-40', `mb-xs md:mb-xl lg:mb-xl`)}>Events</h3>
                    <ul
                        className={cn(
                            'grid grid-cols-2',
                            'gap-y-xxs gap-x-xs md:x-[gap-y-s,gap-x-n] lg:x-[gap-y-xl,gap-x-xxl]',
                        )}
                    >
                        {EventsLi}
                    </ul>
                    <PageLink
                        href={Route.EventsLibrary}
                        icon={'arrow-right-long'}
                        className={'flex-row-reverse text-blue  mt-xs md:mt-xl lg:mt-l'}
                        iconClassName={'[&_path]:fill-blue size-6xs  ml-4xs lg:ml-xxs'}
                    >
                        See all
                    </PageLink>
                    <hr className={'border-white  mt-xs md:mt-xxl lg:mt-5xl'} />
                </div>
            </section>
            <section className={styles.section}>
                <div className={styles.content}>
                    <CardCheckersSection type={'default'} />
                </div>
            </section>
            {/* TODO create ArticleCards*/}
            <section className={cn(styles.section, 'bg-gradient-to-t from-blue to-transparent to-60%')}>
                <div
                    className={cn(
                        styles.content,
                        'pt-5xl md:pt-6xl-1 lg:pt-7xl',
                        'pb-[33rem] sm:landscape:pb-[12.5rem] md:pb-[27rem] lg:pb-[29.5rem]',
                    )}
                >
                    <h3 className={'text-32 sm:text-27'}>Community News</h3>
                    <ul
                        className={cn(
                            `grid auto-rows-max justify-items-center`,
                            `md:x-[mx-auto,w-fit,grid-cols-2] lg:grid-cols-[repeat(3,minmax(var(--w-card),1fr))]`,
                            `gap-y-l md:gap-n lg:gap-x-xl`,
                            `mt-xs md:mt-xl lg:mt-xl`,
                        )}
                    >
                        {ArticleCardsLi}
                    </ul>
                </div>
            </section>
        </>
    );
}

export default CommunityPage;
