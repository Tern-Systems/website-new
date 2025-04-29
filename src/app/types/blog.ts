import { DeepPartial } from '@/app/types/utils';

// Content Base
type ContentCommon = {
    id: string;
    title: string;
    description: string;
    date?: number;
    time?: { start: number; end: number };
    category: string;
    subject?: string;
    content: string;
    type: 'text' | 'video';
};

type MediaContent = ContentCommon & {
    durationMs?: number;
    thumbnail: string | null;
};

// Cards
type MediaCardType = MediaContent & { label: string };
type ContentCardType = ContentCommon;
type LibraryCardType = MediaCardType & { tag: string };

// Website Content
type Article = DeepPartial<
    MediaCardType & {
        author: {
            name: string;
            image: string | null;
            position: string;
        };
        contentIDs: string[];
    }
>;

// TODO clarify
type Tip = DeepPartial<LibraryCardType>;
type Course = DeepPartial<LibraryCardType>;

// TODO clarify
type Event = DeepPartial<ContentCardType>;

export type {
    ContentCommon,
    MediaContent,
    Article,
    LibraryCardType,
    Tip,
    MediaCardType,
    ContentCardType,
    Course,
    Event,
};
