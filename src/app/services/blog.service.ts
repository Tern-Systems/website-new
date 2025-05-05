import { AxiosRequestConfig } from 'axios';

import { Res } from '@/app/types/service';
import { Article } from '@/app/types/blog';

import { BaseService } from './base.service';

type ArticlesDTO = { blogs: Article[] };

const CACHED_ARTICLE_COUNT = 5;

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
            url: this._API + `blogs/data`,
            withCredentials: true,
        };
        const { payload } = await this.req<ArticlesDTO, false>(this.getArticles.name, config, (data) => [
            !data.blogs?.length || typeof data.blogs[0].id === 'string',
        ]);

        localStorage.setItem('article-cards', JSON.stringify(payload.blogs.slice(0, CACHED_ARTICLE_COUNT)));

        return { payload };
    }
}

const BlogService = new BlogServiceImpl();

export { BlogService };
