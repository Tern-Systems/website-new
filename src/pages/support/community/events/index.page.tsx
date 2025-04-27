'use client';

import { ReactElement, useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { Filter } from '@/app/ui/organisms/SearchBar';
import { Breakpoint } from '@/app/static';

import { arrayToRecord } from '@/app/utils';
import { useBreakpointCheck, useForm, useModal, usePagination } from '@/app/hooks';

import { BreadcrumbRoute, Content, H1, Section } from '@/app/ui/atoms';
import { SearchBar } from '@/app/ui/organisms';
import { MessageModal } from '@/app/ui/modals';

import CLOCK_ICON from '@/assets/images/icons/clock.svg';

// TODO remove template
const EVENT_TEMPLATE: Event = {
    date: 25,
    timeZone: 'EST',
    tag: 'Tern New Website Design Demonstration',
    description:
        'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
    time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
};

const EVENTS_TEMPLATE: Event[] = Array(150)
    .fill(null)
    .map((_) => EVENT_TEMPLATE);

type Event = {
    date: number;
    timeZone: string; // TODO confirm
    tag: string;
    description: string;
    time: { start: number; end: number };
};

type EventFilter = {
    content: string;
};

const DAY_NAMES = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];

const CONTENT_TYPES: Record<string, string> = arrayToRecord(['Talk', 'Panel', 'Webinar', 'Networking']);

const COLUMN_COUNT = 4;
const ROW_COUNT = 5;

function CommunityEventsPage() {
    const modalCtx = useModal();
    const breakpoint = useBreakpointCheck();

    const sm = breakpoint <= Breakpoint.sm;

    const [events, setEvents] = useState<Event[]>([]);
    const [filter, setFilterField] = useForm<EventFilter>({ content: '' });

    const Pagination = usePagination();

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

    const filters: Filter[] = [
        {
            title: 'Content',
            options: CONTENT_TYPES,
            state: [filter.content, (value: string) => setFilterField('content', value)],
        },
    ];

    return (
        <Content type={'bottom'}>
            <Section>
                <BreadcrumbRoute />
                <H1 type={'small'}>All Tern Community Events</H1>
                <SearchBar
                    type={'ContentTypes'}
                    filters={filters}
                    placeholder={'Search for events...'}
                />
                <Pagination
                    Items={EventsLi}
                    columns={COLUMN_COUNT}
                    rows={ROW_COUNT}
                />
            </Section>
        </Content>
    );
}

export default CommunityEventsPage;
