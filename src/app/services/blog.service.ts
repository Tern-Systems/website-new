import axios, {AxiosRequestConfig} from "axios";

import {Res} from "@/app/types/service";
import {ArticleCard, ArticlePage} from "@/app/types/blog";

import {BaseService} from "./base.service";


type ArticlesDTO = { articles: ArticleCard[] };
type ArticleDTO = { article: ArticlePage };


const ARTICLES_TEMPLATE: ArticleCard[] = [
    {id: 'vhiasda', tag: 'Centers', description: 'Some descriptive message', image: null, title: 'Very cool article'},
    {id: 'vhiasda', tag: 'Centers', description: 'Some descriptive message', image: null, title: 'Very cool article'},
    {id: 'vhiasda', tag: 'Centers', description: 'Some descriptive message', image: null, title: 'Very cool article'},
    {id: 'vhiasda', tag: 'Centers', description: 'Some descriptive message', image: null, title: 'Very cool article'},
    {id: 'vhiasda', tag: 'Centers', description: 'Some descriptive message', image: null, title: 'Very cool article'},
    {id: 'vhiasda', tag: 'Centers', description: 'Some descriptive message', image: null, title: 'Very cool article'},
    {id: 'vhiasda', tag: 'Centers', description: 'Some descriptive message', image: null, title: 'Very cool article'},
    {id: 'vhiasda', tag: 'Centers', description: 'Some descriptive message', image: null, title: 'Very cool article'},
    {id: 'vhiasda', tag: 'Centers', description: 'Some descriptive message', image: null, title: 'Very cool article'},
    {id: 'vhiasda', tag: 'Centers', description: 'Some descriptive message', image: null, title: 'Very cool article'},
    {id: 'vhiasda', tag: 'Centers', description: 'Some descriptive message', image: null, title: 'Very cool article'},
    {id: 'vhiasda', tag: 'Centers', description: 'Some descriptive message', image: null, title: 'Very cool article'},
    {id: 'vhiasda', tag: 'Centers', description: 'Some descriptive message', image: null, title: 'Very cool article'},
    {id: 'vhiasda', tag: 'Centers', description: 'Some descriptive message', image: null, title: 'Very cool article'},
    {id: 'vhiasda', tag: 'Centers', description: 'Some descriptive message', image: null, title: 'Very cool article'},
    {id: 'vhiasda', tag: 'Centers', description: 'Some descriptive message', image: null, title: 'Very cool article'},
    {id: 'vhiasda', tag: 'Centers', description: 'Some descriptive message', image: null, title: 'Very cool article'},
]

const ARTICLE_TEMPLATE: ArticlePage = {
    id: 'vhiasda',
    title: 'Very cool article',
    image: null,
    author: {
        name: 'Author Name',
        image: null,
        company: 'Tern',
        position: 'Tech Reporter',
    },
    date: 0,
    html: `
    <article>
      <h1>Article title</h1>
      <p>Article paragraph 1</p>
    </article>
   `,
};


// TODO configure requests, remove template
interface IBlogService {
    getArticles(count?: number): Promise<Res<ArticlesDTO, false>>;

    getArticle(id: string): Promise<Res<ArticleDTO, false>>;
}

class BlogServiceImpl extends BaseService implements IBlogService {
    constructor() {
        super(BlogServiceImpl.name)
    }

    async getArticles(count?: number): Promise<Res<ArticlesDTO, false>> {
        const [debug, error] = this.getLoggers(this.getArticles.name);

        const config: AxiosRequestConfig = {
            method: 'GET',
            // url: this._API + `get-saved-cards`,
            withCredentials: true,
        };

        try {
            debug(config);
            const response = {
                data: {
                    articles: ARTICLES_TEMPLATE.slice(0, count ?? ARTICLES_TEMPLATE.length),
                    msg: 'Success'
                }
            } // await axios(config);
            debug(response);
            return {payload: response.data};
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.response?.data?.error ?? err.message : 'Unexpected error!';
        }
    }

    async getArticle(id: string): Promise<Res<ArticleDTO, false>> {
        const [debug, error] = this.getLoggers(this.getArticles.name);

        const config: AxiosRequestConfig = {
            method: 'GET',
            // url: this._API + `get-saved-cards`,
            params: {id},
            withCredentials: true,
        };

        try {
            debug(config);
            const response = {data: {article: ARTICLE_TEMPLATE, msg: 'Success'}}// await axios(config);
            debug(response);
            return {payload: response.data};
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.response?.data?.error ?? err.message : 'Unexpected error!';
        }
    }
}


const BlogService = new BlogServiceImpl();
export {BlogService}
