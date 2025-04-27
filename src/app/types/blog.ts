import { DeepPartial } from '@/app/types/utils';

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

// TODO clarify
type TipType = 'video';
type Tip = DeepPartial<
    Pick<Article, 'id' | 'title' | 'poster' | 'content'> & Partial<Pick<Article, 'description'>> & { type: TipType }
>;

type Video = {
    title: string;
    thumbnail: string | null;
    label: string;
    durationMs: number;
    date: number;
};

type Course = DeepPartial<{
    video: string;
    description: string;
}>;

export type { ArticleTag, Article, Tip, Video, Course };
