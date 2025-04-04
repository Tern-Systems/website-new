'use client';

import { ReactElement, useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { Breakpoint } from '@/app/static';

import { useBreakpointCheck } from '@/app/hooks';
import { useModal } from '@/app/hooks';

import { BreadcrumbRoute, SearchBar } from '@/app/ui/atoms';
import { MessageModal } from '@/app/ui/modals';

import CLOCK_ICON from '@/assets/images/icons/clock.svg';
import DOUBLE_ARROW_ICON from '@/assets/images/icons/double-arrow.svg';

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
        tag: 'Tern New Website Design Demonstration',
        description:
            'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
        time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Tern New Website Design Demonstration',
        description:
            'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
        time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Tern New Website Design Demonstration',
        description:
            'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
        time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Tern New Website Design Demonstration',
        description:
            'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
        time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Tern New Website Design Demonstration',
        description:
            'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
        time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Tern New Website Design Demonstration',
        description:
            'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
        time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Tern New Website Design Demonstration',
        description:
            'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
        time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Tern New Website Design Demonstration',
        description:
            'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
        time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Tern New Website Design Demonstration',
        description:
            'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
        time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Tern New Website Design Demonstration',
        description:
            'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
        time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Tern New Website Design Demonstration',
        description:
            'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
        time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Tern New Website Design Demonstration',
        description:
            'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
        time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    },
    {
        date: 25,
        timeZone: 'EST',
        tag: 'Tern New Website Design Demonstration',
        description:
            'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
        time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    },
];

const CONTENT_TYPES: Record<string, string> = {
    talk: 'Talk',
    panel: 'Panel',
    webinar: 'Webinar',
    networking: 'Networking',
};

function CommunityEventsPage() {
    const modalCtx = useModal();
    const breakpoint = useBreakpointCheck();

    const sm = breakpoint <= Breakpoint.sm;

    const [events, setEvents] = useState<Event[]>([]);
    const [pageNos, setPageNos] = useState<number>(1);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // TODO API call
                setEvents(EVENTS_TEMPLATE);
            } catch (err: unknown) {
                if (typeof err === 'string') modalCtx.openModal(<MessageModal>{err}</MessageModal>);
            }
        };
        fetchEvents();
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
                        'grid',
                        'sm:gap-x-0 gap-x-xxs',
                        'sm:grid-cols-[1fr,min-content] grid-cols-[min-content,1fr]',
                        'text-12',
                    )}
                >
                    <span
                        className={cn(
                            'bg-gray-l2',
                            'flex  flex-col justify-center px-xs py-n',
                            'sm:x-[row-span-2,w-8xl,h-[3.9375rem],mr-4xs,mb-4xs] row-span-3',
                            'size-9xl',
                            'w-11xl h-[7.875rem]',
                        )}
                    >
                        <span className={'text-center text-64 sm:x-[text-40]'}>{day}</span>
                        <span className={'sm:x-[ml-5xs,text-10] text-12'}>{DAY_NAMES[day]}</span>
                    </span>
                    <span
                        className={
                            'col-start-2 flex items-center size-fit text-16 text-primary mt-xxs sm:x-[col-span-2,mt-4xs-1,!mr-auto]'
                        }
                    >
                        {event.tag}
                    </span>
                    <span className={'leading-n sm:x-[text-10,row-start-3,col-span-3] text-xs'}>
                        {event.description}
                    </span>
                    <span
                        className={
                            'flex sm:x-[row-start-2,col-start-2,col-span-4,place-self-start,mb-0] items-center mb-xxs'
                        }
                    >
                        <ReactSVG
                            src={CLOCK_ICON.src}
                            className={'size-8xs size-[0.5625rem] sm:size-[0.55rem]  [&_path]:fill-blue'}
                        />
                        <span className={'ml-5xs'}>
                            {new Date(event.time.start).toLocaleString('en-US', {
                                weekday: 'short',
                                month: sm ? undefined : 'short',
                                day: sm ? undefined : '2-digit',
                                year: sm ? undefined : 'numeric',
                            })}
                            | {`${String(new Date(event.time.start).getHours()).padStart(2, '0')}00`} -&nbsp;
                            {`${String(new Date(event.time.start).getHours() + 1).padStart(2, '0')}00`} hrs&nbsp; (
                            {event.timeZone})
                        </span>
                    </span>
                </div>
            </li>
        );
    });

    const totalPages = 4;

    // Ensures valid page navigation
    const handlePageChange = (page: number) => {
        setPageNos(Math.max(1, Math.min(totalPages, page)));

        if (page > pageNos) {
            setEvents(events.slice(1));
        } else {
            const missingItems = EVENTS_TEMPLATE.length - events.length;
            setEvents(EVENTS_TEMPLATE.slice(Math.max(0, missingItems - 1)));
        }
    };

    const Pages: ReactElement = (
        <div className={'flex justify-between h-full'}>
            <button
                className='size-7xl flex place-items-center'
                onClick={() => handlePageChange(pageNos - 1)}
                disabled={pageNos === 1}
            >
                <ReactSVG
                    src={DOUBLE_ARROW_ICON.src}
                    className={cn(
                        'my-auto mx-auto text-white transition-all duration-500 ease-in-out group-focus-within:text-white-d0 flex',
                        'size-7xs',
                        '[&_*]:scale-x-[-1] [&_*]:translate-x-full',
                    )}
                />
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    className={cn(
                        'w-5xl h-full border-l-s border-gray-l0 transition-colors duration-300',
                        pageNos === i + 1 ? 'bg-blue text-white' : 'text-blue hover:bg-blue hover:text-white',
                    )}
                    onClick={() => handlePageChange(i + 1)}
                >
                    {i + 1}
                </button>
            ))}

            <button
                className='border-l-s border-gray-l0 size-7xl flex place-items-center'
                onClick={() => handlePageChange(pageNos + 1)}
                disabled={pageNos === totalPages}
            >
                <ReactSVG
                    src={DOUBLE_ARROW_ICON.src}
                    className={cn(
                        'my-auto mx-auto text-white stransition-all duration-500 ease-in-out group-focus-within:text-white-d0 flex',
                        'size-7xs',
                    )}
                />
            </button>
        </div>
    );

    return (
        <div className={'bg-gradient-to-t from-blue to-20% w-full'}>
            <div
                className={cn(
                    'max-w-[71.125rem] w-full min-h-dvh place-self-center flex flex-col gap-y-xxl pt-xs md:p-n sm:x-[p-xs,gap-y-xs]',
                )}
            >
                <BreadcrumbRoute />
                <h1 className={cn('text-48 sm:x-[text-24,mb-4xs,mt-4xs]')}>All Tern Community Events</h1>
                <SearchBar contentTypes={CONTENT_TYPES} />
                <ul className={cn('grid grid-cols-1', 'gap-y-xxs gap-x-xs md:x-[gap-y-s,gap-x-n] lg:x-[gap-y-l]')}>
                    {EventsLi}
                </ul>
                <div className={cn('w-[18rem] h-7xl border-s border-gray-l2 mb-[21.75rem]')}>{Pages}</div>
            </div>
        </div>
    );
}

export default CommunityEventsPage;
