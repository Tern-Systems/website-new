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

        // Map poster to thumbnail for each blog
        const blogsWithThumbnails = payload.blogs.map(blog => ({
            ...blog,
            thumbnail: blog.poster || blog.thumbnail
        }));

        localStorage.setItem('article-cards', JSON.stringify(blogsWithThumbnails.slice(0, CACHED_ARTICLE_COUNT)));
        
        return { payload: { blogs: blogsWithThumbnails } };
    }
}

const BlogService = new BlogServiceImpl();

export { BlogService };
