'use client';

import { ReactElement, useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import Image from 'next/image';
import cn from 'classnames';

import { CardLink } from '@/app/types/layout';
import { Breakpoint } from '@/app/static';
import { Article } from '@/app/types/blog';
import { CONTACT_LINKS, Route } from '@/app/static';

import { useBreakpointCheck } from '@/app/hooks';
import { useModal } from '@/app/hooks';

import { MainBackground } from '@/app/ui/atoms';
import { ArticleCard, ResourceCard, Tabs } from '@/app/ui/organisms';
import { MessageModal } from '@/app/ui/modals';
import { PageLink } from '@/app/ui/layout';

import styles from '@/app/common.module.css';

import PNG_BG_MAIN from '@/assets/images/community-bg-main.png';
import PNG_ABOUT from '@/assets/images/community-about.png';
import PNG_HIGHLIGHTED_0 from '@/assets/images/community-card-highlighted-0.png';
import PNG_HIGHLIGHTED_1 from '@/assets/images/community-card-highlighted-2.png';

import SVG_CLOCK from '@/assets/images/icons/clock.svg';
import PNG_CARD_1 from '@/assets/images/community-card-0.png';
import PNG_CARD_2 from '@/assets/images/community-card-1.png';
import PNG_CARD_HIGHLIGHTED_1 from '@/assets/images/community-card-highlighted-1.png';
import PNG_CARD_4 from '@/assets/images/community-card-2.png';
import PNG_CARD_5 from '@/assets/images/community-card-3.png';
import { BlogService } from '@/app/services/blog.service';

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
        time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Webinar',
        description: 'Tern New Website Design Demonstration',
        time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Webinar',
        description: 'Tern New Website Design Demonstration',
        time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Webinar',
        description: 'Tern New Website Design Demonstration',
        time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    },
];

const CARDS: CardLink[] = [
    {
        title: 'Facebook',
        description: 'Be part of the conversation - connect, share and grow with our community.',
        icon: PNG_CARD_1,
        action: {
            title: 'Follow Us',
            href: CONTACT_LINKS.Facebook.href,
        },
    },
    {
        title: 'Reddit',
        description: 'Explore ideas, ask questions, and engage with like-minded innovators.',
        icon: PNG_CARD_2,
        action: {
            title: 'Join the Discussion',
            href: CONTACT_LINKS.Reddit.href,
        },
    },
    {
        title: 'Stay Ahead with the Latest Tech News',
        description:
            'Weekly insights, research and expert views on AI, security, cloud and more in the All Ways Newsletter.',
        icon: PNG_CARD_HIGHLIGHTED_1,
        action: {
            title: 'Subscribe today',
            href: CONTACT_LINKS.Facebook.href,
        },
        alt: true,
    },
    {
        title: 'Discord',
        description: 'Chat, collaborate, and build lasting connections with fellow enthusiasts.',
        icon: PNG_CARD_4,
        action: {
            title: 'Join Now',
            href: CONTACT_LINKS.Discord.href,
        },
    },
    {
        title: 'GitHub',
        description:
            'Collaborate with developers, contribute to groundbreaking projects, and help drive innovation forward.',
        icon: PNG_CARD_5,
        action: {
            title: 'Collaborate',
            href: CONTACT_LINKS.GitHub.href,
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
                            'size-[7.1875rem] sm:size-fit',
                        )}
                    >
                        <span className={'text-center sm:text-24 text-64'}>{day}</span>
                        <span className={'sm:ml-5xs  sm:text-10 text-12'}>{DAY_NAMES[day]}</span>
                    </span>
                    <span className={'col-start-2 flex items-center p-[0.19rem] size-fit bg-gray-l1 text-black'}>
                        {event.tag}
                    </span>
                    <span className={'leading-n  sm:col-span-2  sm:text-10 text-16'}>{event.description}</span>
                    <span className={'flex items-center  sm:col-span-2'}>
                        <ReactSVG
                            src={SVG_CLOCK.src}
                            className={'[&_*]:size-[0.75rem] [&_*]:sm:size-[0.55rem]'}
                        />
                        <span className={'ml-5xs sm:ml-[0.2rem]'}>
                            {new Date(event.time.start).getHours()} - {new Date(event.time.start).getHours()} hrs&nbsp;
                            {event.timeZone}
                        </span>
                    </span>
                </div>
            </li>
        );
    });

    const ResourceCardsLi: ReactElement[] = CARDS.map((card: CardLink, idx, array) => {
        const swap = (idx < 0.5 * array.length ? idx + 1 : idx) % 2;
        return (
            <li key={card.title + idx}>
                <ResourceCard
                    type={card.alt ? 'highlighted' : 'default'}
                    icon={card.icon}
                    title={card.title}
                    action={card.action}
                    className={{
                        wrapper: 'mt-[9.38rem] md:mt-5xl sm:mt-3xl',
                        image: cn({ ['lg:col-start-2']: swap }),
                        content: cn({ ['lg:x-[row-start-1,col-start-1]']: swap }),
                    }}
                >
                    {card.description}
                </ResourceCard>
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
                classNameContent={'bg-white-d2 text-black'}
            />
        </li>
    ));

    const RC_Wrapper = '!p-0 !bg-white-d2 from-transparent !gap-0  sm:!grid-cols-1 !grid-cols-2';
    const RC_Title = '[&]:text-24 leading-l  md:[&]:text-36  lg:[&]:text-40';
    const RC_IMG = '!object-cover object-right h-[25.5rem]  md:h-[31.25rem]  lg:h-[39.1875rem]';
    const RC_Content =
        '[&]:flex row-start-1 text-black p-xxs gap-y-xxs  sm:row-start-2  md:x-[p-n,gap-y-3xl]  lg:x-[p-xxl,gap-y-[5rem]]';
    const RC_Children = '!w-full tracking-wide text-12  md:text-14  lg:text-16';
    const RC_Link = 'sm:mt-xs !mt-auto text-12  md:text-14  lg:text-16';

    const tabs = [
        {
            name: 'Associates',
            content: (
                <ResourceCard
                    type={'highlighted'}
                    icon={PNG_HIGHLIGHTED_0}
                    title={'We love interacting with our associates'}
                    action={{ title: 'Read Whitepaper', href: '' }}
                    className={{
                        wrapper: RC_Wrapper,
                        title: RC_Title,
                        image: RC_IMG,
                        content: RC_Content,
                        children: RC_Children,
                        link: cn(RC_Link, 'bg-transparent text-blue text-12 [&_path]:fill-blue p-0 '),
                    }}
                >
                    Find out more about our unique strategic approach to cultivating lasting professional relationships.
                </ResourceCard>
            ),
        },
        {
            name: 'Customers',
            content: (
                <ResourceCard
                    type={'highlighted'}
                    icon={PNG_HIGHLIGHTED_1}
                    title={'Customers deserve undivided attention'}
                    action={{ title: 'Find resources', href: '' }}
                    className={{
                        wrapper: RC_Wrapper,
                        title: RC_Title,
                        image: RC_IMG,
                        content: RC_Content,
                        children: RC_Children,
                        link: cn(RC_Link, 'bg-blue text-white [&_path]:fill-white p-0'),
                    }}
                >
                    At Tern we hold our customers on the highest pedestal to ensure they receive the high-class
                    professionalism they deserve. We do this through our Support Hub and Billing Resolution Centers
                    resources.
                </ResourceCard>
            ),
        },
    ];

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
                <div className={cn(styles.content, 'pt-[7.3rem] md:pt-[6.7rem] lg:pt-[7.5rem]')}>
                    <h3 className={'text-27 lg:text-40'}>Get plugged in with like minded individuals</h3>
                    <p className={'mt-xxl leading-l  text-20 md:text-21 lg:text-27'}>
                        Tern is dedicated to fostering a strong community around it’s products and services to cultivate
                        a sustainable business mode built on trust.
                    </p>
                    <div className={'grid grid-cols-2  mt-xxl md:mt-[6.25rem] lg:mt-[9.37rem]'}>
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
                                'px-n lg:px-[3.5rem]',
                                'text-48 md:text-64 lg:text-96',
                            )}
                        >
                            Culture. Drives. Markets.
                        </p>
                    </div>
                </div>
            </section>
            <section className={styles.section}>
                <div className={cn(styles.content, 'pt-5xl md:pt-[6.25rem] lg:pt-[9.3rem]')}>
                    <h3 className={'text-32 md:text-48 lg:text-64'}>What Drives You?</h3>
                    <p className={'leading-l  mt-n lg:mt-xl  text-20 md:text-21 lg:text-27'}>Join the conversation</p>
                    {/*TODO href*/}
                    <ResourceCard
                        type={'highlighted'}
                        icon={PNG_HIGHLIGHTED_0}
                        title={'We love interacting with our associates'}
                        action={{ title: 'Read Whitepaper', href: '' }}
                        className={{
                            wrapper: cn(
                                '!p-0 !bg-white-d2 from-transparent !gap-0  sm:!grid-cols-1 !grid-cols-2',
                                'mt-n md:mt-3xl lg:mt-5xl',
                            ),
                            image: cn('!object-cover object-right', 'h-[25.5rem] md:h-[31.25rem] lg:h-[39.1875rem]'),
                            content: cn('row-start-1 text-black  sm:row-start-2 !flex  !p-xxs md:p-n lg:p-xxl'),
                            children: '!w-full  mt-xxs md:mt-3xl lg:mt-[6.25rem]',
                            link: 'bg-transparent text-blue [&_path]:fill-blue p-0  sm:mt-xs !mt-auto',
                        }}
                    >
                        Find out more about our unique strategic approach to cultivating lasting professional
                        relationships.
                    </ResourceCard>
                </div>
            </section>
            <section className={styles.section}>
                <div className={cn(styles.content, 'pt-5xl md:pt-[6.25rem] lg:pt-[9.3rem]')}>
                    <h3 className={'text-27 lg:text-40'}>Events</h3>
                    <ul
                        className={cn(
                            'grid grid-cols-2',
                            'gap-y-xxs gap-x-xs md:x-[gap-y-s,gap-x-n] lg:x-[gap-y-xl,gap-x-xxl]',
                        )}
                    >
                        {EventsLi}
                    </ul>
                    <PageLink
                        href={Route.CommunityEvents}
                        icon={'arrow-right-long'}
                        className={'flex-row-reverse text-blue  mt-xs md:mt-xl lg:mt-l'}
                        iconClassName={'[&_path]:fill-blue [&_*]:size-[0.79rem]  ml-4xs lg:ml-xxs'}
                    >
                        See all
                    </PageLink>
                    <hr className={'border-white  mt-xs md:mt-xxl lg:mt-5xl'} />
                </div>
            </section>
            <section className={styles.section}>
                <div className={styles.content}>
                    <ul className={'flex flex-col'}>{ResourceCardsLi}</ul>
                </div>
            </section>
            {/* TODO create ArticleCards*/}
            <section className={cn(styles.section, 'bg-gradient-to-t from-blue to-transparent to-60%')}>
                <div className={cn(styles.content, 'pb-[33rem] md:pb-[27rem] lg:pb-[29.5rem]')}>
                    <h3>Community News</h3>
                    <ul
                        className={cn(
                            `grid auto-rows-max justify-items-center`,
                            `md:x-[mx-auto,w-fit,grid-cols-2] lg:grid-cols-[repeat(3,minmax(var(--w-card),1fr))]`,
                            `gap-y-l md:gap-n lg:gap-x-xl`,
                            `mt-[2.31rem] md:mt-xxl lg:mt-xl`,
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
