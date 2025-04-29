import { DeepPartial } from '@/app/types/utils';
import { CategoryFallback } from '@/app/static';

// Content Base
type ContentCommon<T extends string> = {
    id: string;
    title: string;
    description: string;
    date: number;
    category: T;
    content: string;
    type: 'text' | 'video';
};

type MediaContent<T extends string> = ContentCommon<T> & {
    durationMs?: number;
    thumbnail: string | null;
};

// Cards
type MediaCardType<T extends string> = MediaContent<T> & { label: string };

type ContentCardType<T extends string> = ContentCommon<T> & {
    time: { start: number; end: number };
};

type CardLibraryEntry<T extends string, C extends string> = MediaCardType<C> & { tag: T };

// Website Content
type ArticleCategory = typeof CategoryFallback | 'Artificial Intelligence' | 'Cloud' | 'Data' | 'Security';
type Article = DeepPartial<
    MediaCardType<ArticleCategory> & {
        author: {
            name: string;
            image: string | null;
            position: string;
        };
        contentIDs: string[];
    }
>;

// TODO clarify
type TipTag = 'Popular' | 'Featured' | 'Videos' | 'Reads';
type TipCategory = typeof CategoryFallback | 'Networking';
type Tip = DeepPartial<CardLibraryEntry<TipTag, TipCategory>>;

type CourseTag = 'Popular' | 'Featured' | 'Free' | 'Premium';
type CourseCategory = typeof CategoryFallback | 'Individual' | 'Free' | 'Premium' | 'Series' | 'New';
type CourseSubject = 'G25' | 'T27I' | 'BTMC' | 'Tidal';
type Course = DeepPartial<CardLibraryEntry<CourseTag, CourseCategory> & { subject: CourseSubject }>;

// TODO clarify
type EventCategory = typeof CategoryFallback | 'networking';
type Event = DeepPartial<ContentCardType<EventCategory>>;

export type {
    ContentCommon,
    MediaContent,
    ArticleCategory,
    Article,
    CardLibraryEntry,
    Tip,
    TipTag,
    TipCategory,
    MediaCardType,
    ContentCardType,
    Course,
    CourseTag,
    CourseSubject,
    CourseCategory,
    Event,
    EventCategory,
};
