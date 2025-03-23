'use client';

import { ReactElement, useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { Breakpoint } from '@/app/static';

import { useBreakpointCheck } from '@/app/hooks';
import { useModal } from '@/app/hooks';

import SVG_DOUBLE_ARROW from '@/assets/images/icons/double-arrow.svg';

import { BreadcrumbRoute, SearchBar } from '@/app/ui/atoms';
import { MessageModal } from '@/app/ui/modals';

import SVG_CLOCK from '@/assets/images/icons/clock.svg';

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
                            'sm:x-[row-span-2,w-[4.1875rem],h-[3.9375rem],mr-[0.625rem],mb-[0.625rem]] row-span-3',
                            'size-[4.6875rem]',
                            'w-[7.1875rem] h-[7.875rem]',
                        )}
                    >
                        <span className={'text-center text-64 sm:x-[text-40]'}>{day}</span>
                        <span className={'sm:x-[ml-[0.3125rem],text-10] text-12'}>{DAY_NAMES[day]}</span>
                    </span>
                    <span
                        className={
                            'col-start-2 flex items-center size-fit text-16 text-primary mt-[0.875rem] sm:x-[col-span-2,mt-[0.4375rem],!mr-auto]'
                        }
                    >
                        {event.tag}
                    </span>
                    <span className={'leading-n sm:x-[text-10,row-start-3,col-span-3] text-xs'}>
                        {event.description}
                    </span>
                    <span
                        className={
                            'flex sm:x-[row-start-2,col-start-2,col-span-4,place-self-start,mb-0] items-center mb-[0.875rem]'
                        }
                    >
                        <ReactSVG
                            src={SVG_CLOCK.src}
                            className='sm:x-[[&_*]:size-[0.4375rem]] [&_path]:fill-blue'
                        />
                        <span className={'ml-[0.3125rem]'}>
                            {new Date(event.time.start).toLocaleString('en-US', {
                                weekday: 'short',
                                month: sm ? undefined : 'short',
                                day: sm ? undefined : '2-digit',
                                year: sm ? undefined : 'numeric',
                            })}{' '}
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
                className='size-[3.4375rem] flex place-items-center'
                onClick={() => handlePageChange(pageNos - 1)}
                disabled={pageNos === 1}
            >
                <ReactSVG
                    src={SVG_DOUBLE_ARROW.src}
                    className={cn(
                        'my-auto mx-auto text-white transition-all duration-500 ease-in-out group-focus-within:text-white-d0 flex',
                        '[&_*]:size-[0.75rem]',
                        '[&_*]:scale-x-[-1] [&_*]:translate-x-full',
                    )}
                />
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    className={cn(
                        'w-[2.8125rem] h-full border-l-s border-gray-l0 transition-colors duration-300',
                        pageNos === i + 1 ? 'bg-blue text-white' : 'text-blue hover:bg-blue hover:text-white',
                    )}
                    onClick={() => handlePageChange(i + 1)}
                >
                    {i + 1}
                </button>
            ))}

            <button
                className='border-l-s border-gray-l0 size-[3.4375rem] flex place-items-center'
                onClick={() => handlePageChange(pageNos + 1)}
                disabled={pageNos === totalPages}
            >
                <ReactSVG
                    src={SVG_DOUBLE_ARROW.src}
                    className={cn(
                        'my-auto mx-auto text-white transition-all duration-500 ease-in-out group-focus-within:text-white-d0 flex',
                        '[&_*]:size-[0.75rem]',
                    )}
                />
            </button>
        </div>
    );

    return (
        <div className={'bg-gradient-to-t from-blue to-20% w-full'}>
            <div
                className={cn(
                    'max-w-[71.125rem] w-full min-h-dvh place-self-center flex flex-col gap-y-[3.125rem] pt-[1.25rem] md:p-[1.875rem] sm:x-[p-[1.25rem],gap-y-[1.25rem]]',
                )}
            >
                <BreadcrumbRoute />
                <h1 className={cn('text-48 sm:x-[text-24,mb-[0.625rem],mt-[0.625rem]]')}>All Tern Community Events</h1>
                <SearchBar contentTypes={CONTENT_TYPES} />
                <ul className={cn('grid grid-cols-1', 'gap-y-xxs gap-x-xs md:x-[gap-y-s,gap-x-n] lg:x-[gap-y-l]')}>
                    {EventsLi}
                </ul>
                <div className={cn('w-[18rem] h-[3.4375rem] border-s border-gray-l2 mb-[21.75rem]')}>{Pages}</div>
            </div>
        </div>
    );
}

export default CommunityEventsPage;
