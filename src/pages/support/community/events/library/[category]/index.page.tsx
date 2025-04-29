'use client';

import { useEffect, useState } from 'react';
import { Event } from '@/app/types/blog';

import { arrayToRecord } from '@/app/utils';
import { useModal } from '@/app/hooks';

import { LibraryTemplate } from '@/app/ui/templates';
import { MessageModal } from '@/app/ui/modals';
import { ContentCard } from '@/app/ui/organisms';

// TODO remove template
const EVENT_TEMPLATE: Event = {
    id: 'af24gftre2',
    date: 25,
    title: 'Tern New Website Design Demonstration',
    description:
        'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
    time: { start: new Date().getTime(), end: new Date().getTime() + 3_600_000 },
    category: 'networking',
    content: '',
    type: 'text',
};

const EVENTS_TEMPLATE: Event[] = Array(47)
    .fill(null)
    .map((_) => EVENT_TEMPLATE);

type EventFilter = { category: string };

const DEFAULT_FILTER: EventFilter = { category: '' };
const CONTENT: Record<string, string> = arrayToRecord(['Talk', 'Panel', 'Webinar', 'Networking']);

function CommunityEventsPage() {
    const modalCtx = useModal();

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
                option: { category: CONTENT },
            }}
            urlParamName={'category'}
            renderItem={(item) => <ContentCard {...item} />}
        />
    );
}

export default CommunityEventsPage;
