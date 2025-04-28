import axios, { AxiosRequestConfig } from 'axios';

import { Res } from '@/app/types/service';
import { Article, Tip } from '@/app/types/blog';

import { BaseService } from './base.service';

type ArticlesDTO = { blogs: Article[] };
type TipsDTO = { tips: Tip[] };

const CACHED_ARTICLE_COUNT = 5;

// TODO remove templates
const TIP_TEMPLATE: Tip = {
    title: 'Some title',
    description: 'Some useful description',
    category: 'Popular',
    content: 'Some tip content',
    poster: '',
    id: '9uqhe45gf032j0',
    date: 264,
    thumbnail: '',
    label: 'Website',
    video: '',
};

const TIPS_TEMPLATE = Array(83)
    .fill(null)
    .map((_, idx) => (idx % 7 ? TIP_TEMPLATE : { ...TIP_TEMPLATE, durationMs: 49236 }));

const TIPS_DTO_TEMPLATE: TipsDTO = { tips: TIPS_TEMPLATE };

interface IBlogService {
    getArticles(): Promise<Res<ArticlesDTO, false>>;

    getTips(): Promise<Res<TipsDTO, false>>;
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
        const [debug, error] = this.getLoggers();

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
