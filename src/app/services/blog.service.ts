import axios, { AxiosRequestConfig } from 'axios';

import { Res } from '@/app/types/service';
import { Article } from '@/app/types/blog';

import { BaseService } from './base.service';

type ArticlesDTO = { blogs: Article[] };

const CACHED_ARTICLE_COUNT = 5;

interface IBlogService {
    getArticles(): Promise<Res<ArticlesDTO, false>>;

    getArticleContent(url: string): Promise<Res<string, false>>;
}

class BlogServiceImpl extends BaseService implements IBlogService {
    constructor() {
        super(BlogServiceImpl.name);
    }

    async getArticleContent(url: string): Promise<Res<string, false>> {
        const [debug, error] = this.getLoggers(this.getArticleContent.name);

        const config: AxiosRequestConfig = {
            method: 'GET',
            url,
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
            return { payload: response.data };
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? (err.response?.data?.error ?? err.message) : 'Unexpected error!';
        }
    }

    async getArticles(): Promise<Res<ArticlesDTO, false>> {
        const [debug, error] = this.getLoggers(this.getArticles.name);

        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + `get-blog`,
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);

            localStorage.setItem('article-cards', JSON.stringify(response.data.blogs.slice(0, CACHED_ARTICLE_COUNT)));

            return { payload: response.data };
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? (err.response?.data?.error ?? err.message) : 'Unexpected error!';
        }
    }
}

const BlogService = new BlogServiceImpl();
export { BlogService };
