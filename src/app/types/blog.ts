import { DeepPartial } from '@/app/types/utils';
import { CategoryFallback } from '@/app/static';

type ArticleTag = 'Artificial Intelligence' | 'Cloud' | 'Data' | 'Security';

type Article = DeepPartial<{
    id: string;
    tag: ArticleTag;
    title: string;
    description: string;
    poster: string | null;
    date: number;
    author: {
        name: string;
        image: string | null;
        position: string;
    };
    content: string;
    contentIDs: string[];
}>;

type VideoContent<T extends string> = {
    category: T;
    video: string;
};

type MediaCardType = {
    title: string;
    thumbnail: string | null;
    label: string;
    durationMs?: number;
    date: number;
};

type ContentCardType = {
    date: number;
    time: { start: number; end: number };
    title: string;
    tag: string;
    description: string;
};

// TODO clarify
type TipCategory = typeof CategoryFallback | 'Popular' | 'Featured' | 'Videos' | 'Reads';
type Tip = DeepPartial<
    Pick<Article, 'id' | 'title' | 'poster' | 'content'> &
        Partial<Pick<Article, 'description'>> &
        MediaCardType &
        VideoContent<TipCategory>
>;

type CourseCategory = typeof CategoryFallback | 'Individual' | 'Free' | 'Premium' | 'Series' | 'New';
type Course = DeepPartial<
    MediaCardType &
        VideoContent<CourseCategory> & {
            description: string;
            subject: string;
        }
>;

export type { ArticleTag, Article, Tip, TipCategory, MediaCardType, ContentCardType, Course, CourseCategory };
