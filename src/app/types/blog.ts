type ArticleTag =
    | 'Artificial'
    | 'Intelligence'
    | 'Batteries'
    | 'Cloud'
    | 'Cybersecurity'
    | 'Data'
    | 'Centers'
    | 'Robotics'
    | 'Semiconductors';

type Article = {
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
};

export type { ArticleTag, Article };
