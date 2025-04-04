import axios, { AxiosRequestConfig } from 'axios';

import { Res } from '@/app/types/service';
import { Article, Tip } from '@/app/types/blog';

import { BaseService } from './base.service';

type ArticlesDTO = { blogs: Article[] };
type TipsDTO = {
    popular: Tip[];
    featured: Tip[];
    videos: Tip[];
    reads: Tip[];
};

const CACHED_ARTICLE_COUNT = 5;

const TIPS_TEMPLATE: Tip[] = [
    {
        type: 'video',
        id: '98fg45r3s0j3----',
        poster: '',
        title: 'Step-by-Step: How to Setup your Tern Account for 2FA',
        content: 'some useful content',
    },
    {
        type: 'video',
        id: '98254gf0j3----',
        poster: '',
        title: 'The 5 biggest AI adoption challenges for 2025',
        content: 'some useful content',
    },
    {
        type: 'video',
        id: '98f02f3fj3----',
        poster: '',
        title: 'Here we discuss what benefits are enabled by switching from conventional computers to ours.',
        content: 'some useful content',
    },
    {
        type: 'video',
        id: '98f0j53g34f324----',
        poster: '',
        title: 'The World’s Most Efficient Computer',
        content: 'some useful content',
    },
    {
        type: 'video',
        id: '98f0aasdasdergj3----',
        poster: '',
        description: 'Soe useful thing6',
        title: 'The World’s Most Efficient Computer',
        content: 'some useful content',
    },
    {
        type: 'video',
        id: '98f0agasdasfdsj3----',
        poster: '',
        description: 'Soe useful thing5',
        title: 'The World’s Most Efficient Computer',
        content: 'some useful content',
    },
    {
        type: 'video',
        id: '98asdaf0j3----',
        poster: '',
        description: 'Soe useful thing4',
        title: 'The World’s Most Efficient Computer',
        content: 'some useful content',
    },
    {
        type: 'video',
        id: '98f0hgjs3----',
        poster: '',
        description: 'Soe useful thing3',
        title: 'The World’s Most Efficient Computer',
        content: 'some useful content',
    },
    {
        type: 'video',
        id: '98f0js3f----',
        poster: '',
        description: 'Soe useful thing2',
        title: 'The World’s Most Efficient Computer',
        content: 'some useful content',
    },
    {
        type: 'video',
        id: '98f0ja3---s-',
        poster: '',
        description: 'Soe useful thing1',
        title: 'The World’s Most Efficient Computer',
        content: 'some useful content',
    },
];

const TIPS_DTO_TEMPLATE: TipsDTO = {
    popular: TIPS_TEMPLATE.slice(0, 3),
    featured: TIPS_TEMPLATE.slice(0, 4),
    videos: TIPS_TEMPLATE.slice(-6),
    reads: TIPS_TEMPLATE.slice(-6),
};

interface IBlogService {
    getArticles(): Promise<Res<ArticlesDTO, false>>;
}

class BlogServiceImpl extends BaseService implements IBlogService {
    constructor() {
        super(BlogServiceImpl.name);
    }

    // TODO count param
    async getArticles(): Promise<Res<ArticlesDTO, false>> {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + `get-blog`,
            withCredentials: true,
        };
        const { payload } = await this.req<ArticlesDTO, false>(this.getArticles.name, config, (data) => [
            !data.blogs?.length || typeof data.blogs[0].id === 'string',
        ]);

        localStorage.setItem('article-cards', JSON.stringify(payload.blogs.slice(0, CACHED_ARTICLE_COUNT)));

        return { payload };
    }

    // TODO API call
    async getTips(): Promise<Res<TipsDTO, false>> {
        const [debug, error] = this.getLoggers(this.getArticles.name);

        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + `get-tips`,
            withCredentials: true,
        };

        try {
            debug(config);
            // const response = await axios(config);
            // debug(response);
            //
            // localStorage.setItem('article-cards', JSON.stringify(response.data.blogs.slice(0, CACHED_ARTICLE_COUNT)));

            return { payload: TIPS_DTO_TEMPLATE };
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? (err.response?.data?.error ?? err.message) : 'Unexpected error!';
        }
    }
}

const BlogService = new BlogServiceImpl();

export type { TipsDTO };
export { BlogService };
