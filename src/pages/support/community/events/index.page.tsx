'use client';

import { ReactElement, useEffect, useState } from 'react';
import { ContentCardType } from '@/app/types/blog';
import { Filter } from '@/app/ui/organisms/SearchBar';
import { LibraryTag } from '@/app/ui/templates/LibraryPage';

import { arrayToRecord } from '@/app/utils';
import { useForm, useModal } from '@/app/hooks';

import { LibraryTemplate } from '@/app/ui/templates';
import { MessageModal } from '@/app/ui/modals';
import { ContentCard } from '@/app/ui/organisms';

// TODO remove template
const EVENT_TEMPLATE: ContentCardType = {
    date: 25,
    title: 'Tern New Website Design Demonstration',
    tag: 'networking',
    description:
        'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
    time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
};

const EVENTS_TEMPLATE: ContentCardType[] = Array(47)
    .fill(null)
    .map((_) => EVENT_TEMPLATE);

type EventFilter = { content: string };

const CONTENT: Record<string, string> = arrayToRecord(['Talk', 'Panel', 'Webinar', 'Networking']);

const COLUMN_COUNT = 1;
const ROW_COUNT = 13;

function CommunityEventsPage() {
    const modalCtx = useModal();

    const [events, setEvents] = useState<ContentCardType[]>([]);
    const [filter, setFilterField] = useForm<EventFilter>({ content: '' });

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

    let eventsFiltered = events;
    if (filter.content)
        eventsFiltered = eventsFiltered.filter((event) => event.tag.toLowerCase() === filter.content.toLowerCase());

    // Elements
    const EventsLi: ReactElement[] = eventsFiltered.map((event: ContentCardType, idx) => {
        return (
            <li
                key={event.description.slice(5) + idx}
                className={'contents'}
            >
                <ContentCard {...event} />
            </li>
        );
    });

    const filters: Filter[] = [
        {
            title: 'Content',
            options: CONTENT,
            state: [filter.content, (value: string) => setFilterField('content', value)],
        },
    ];

    const tags: LibraryTag[] = [{ value: filter.content || 'All', reset: () => setFilterField('content', '') }];

    return (
        <LibraryTemplate
            heading={'All Tern Community Events'}
            Items={EventsLi}
            columns={COLUMN_COUNT}
            rows={ROW_COUNT}
            filters={filters}
            tags={tags}
        />
    );
}

export default CommunityEventsPage;
