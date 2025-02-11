type ArticleTag =
    | 'Artificial'
    | 'Intelligence'
    | 'Batteries'
    | 'Cloud'
    | 'Cybersecurity'
    | 'Data'
    | 'Centers'
    | 'Robotics'
    | 'Semiconductors'


type Article = {
    id: string;
    tag: ArticleTag;
    title: string;
    description: string;
    image: string | null;
    date: number;
    author: {
        name: string;
        image: string | null;
        position: string;
        company: string;
    };
    html: string;
}

type ArticleCard = Pick<Article, 'id' | 'tag' | 'title' | 'description' | 'image'>;
type ArticlePage = Pick<Article, 'id' | 'title' | 'image' | 'date' | 'author' | 'html'>;


export type {ArticleCard, ArticleTag, ArticlePage};
