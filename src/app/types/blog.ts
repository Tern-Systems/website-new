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
type CourseType = 'video';
type Course = DeepPartial<
    Pick<Article, 'id' | 'title' | 'poster' | 'content'> & Partial<Pick<Article, 'description'>> & { type: CourseType }
>;

// TODO clarify
type TipType = 'video';
type Tip = DeepPartial<
    Pick<Article, 'id' | 'title' | 'poster' | 'content'> & Partial<Pick<Article, 'description'>> & { type: TipType }
>;

export type { ArticleTag, Article, Tip, Course };
