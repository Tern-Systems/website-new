import { DeepPartial } from '@/app/types/utils';

type ArticleTag =
    | 'Artificial Intelligence'
    | 'Batteries'
    | 'Cloud'
    | 'Cybersecurity'
    | 'Data'
    | 'Centers'
    | 'Robotics'
    | 'Semiconductors';

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

// TODO clarify
type TipType = 'video';
type Tip = DeepPartial<
    Pick<Article, 'id' | 'title' | 'poster' | 'content'> & Partial<Pick<Article, 'description'>> & { type: TipType }
>;

type CourseSeries = 'BTMC' | 'Tidal' | 'G';
type Course = DeepPartial<{
    id: string;
    series: CourseSeries;
    title: string;
    description: string;
    thumbnail: string | null;
    date: number;
    author: {
        name: string;
        image: string | null;
        position: string;
    };
    video: string;
    duration: string;
}>;

export type { ArticleTag, Article, Tip, CourseSeries, Course };
