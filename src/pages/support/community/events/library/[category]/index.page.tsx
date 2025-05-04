'use client';

import { useEffect, useState } from 'react';
import { Event } from '@/app/types/blog';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { SelectOptions } from '@/app/ui/form/Select';
import { Breakpoint, Fallback } from '@/app/static';

import { arrayToRecord, formatDate } from '@/app/utils';
import { useBreakpointCheck, useModal } from '@/app/hooks';

import { LibraryTemplate } from '@/app/ui/templates';
import { MessageModal } from '@/app/ui/modals';
import { ContentCard } from '@/app/ui/organisms';

import CLOCK_ICON from '@/assets/images/icons/clock.svg';

// TODO remove template
const EVENT_TEMPLATE: Event = {
    id: 'af24gftre2',
    date: 25,
    title: 'Tern New Website Design Demonstration',
    description:
        'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
    time: { start: new Date().getTime(), end: new Date().getTime() + 3_000_000 },
    category: 'networking',
    content: '',
    type: 'text',
};

const EVENTS_TEMPLATE: Event[] = Array(47)
    .fill(null)
    .map((_, idx) => ({ ...EVENT_TEMPLATE, title: EVENT_TEMPLATE.title + idx }));

type EventFilter = { category: string };

const DEFAULT_FILTER: EventFilter = { category: '' };
const CONTENT: SelectOptions = arrayToRecord(['Talk', 'Panel', 'Webinar', 'Networking']);

const renderThumbnail = (item: Event) => {
    const [day, month] = item.date ? formatDate(item.date, 'daymonth').split(' ').reverse() : ['-', 'Unknown'];
    return (
        <span
            className={cn(
                'flex flex-col justify-center  py-n  bg-gray-l2 flex-grow  sm:px-xxs px-xs',
                'sm:size-8xl size-9xl',
                'w-11xl h-[7.875rem]',
            )}
        >
            <span className={'text-center text-64 sm:x-[text-40]'}>{day}</span>
            <span className={'sm:x-[ml-5xs,text-10] text-12'}>{month}</span>
        </span>
    );
};

const renderInfoLine = (item: Event, sm: boolean) => (
    <>
        <ReactSVG
            src={CLOCK_ICON.src}
            className={'size-8xs sm:size-[0.55rem]  [&_path]:fill-blue'}
        />
        <span className={'ml-5xs'}>
            {item.date ? formatDate(item.date, 'day') : 'Date is ' + Fallback} |&nbsp;
            {item.time
                ? formatDate(item.time.start, 'timerange', { sm, dateEnd: item.time.end })
                : 'Time is ' + Fallback}
        </span>
    </>
);

function CommunityEventsPage() {
    const modalCtx = useModal();

    const sm = useBreakpointCheck() <= Breakpoint.sm;

    const [events, setEvents] = useState<Event[]>([]);

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

    return (
        <LibraryTemplate
            type={'Content'}
            heading={'All Tern Community Events'}
            items={events}
            filterSetup={{
                default: DEFAULT_FILTER,
                option: { category: { options: CONTENT } },
            }}
            urlParamName={'category'}
            renderItem={(item) => (
                <ContentCard
                    {...item}
                    Thumbnail={renderThumbnail(item)}
                    InfoLine={renderInfoLine(item, sm)}
                />
            )}
        />
    );
}

export default CommunityEventsPage;
