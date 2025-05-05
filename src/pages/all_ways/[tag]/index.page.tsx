'use client';

import { ReactElement, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'next/navigation';
import cn from 'classnames';

import { Article } from '@/app/types/blog';
import { Breakpoint, CategoryFallback, Route } from '@/app/static';

import { BlogService } from '@/app/services/blog.service';

import { getIdName } from '@/app/utils';
import { useBreakpointCheck, useModal } from '@/app/hooks';

import { Content, H1, H2, Section } from '@/app/ui/atoms';
import { ArticleCard, Carousel, SubscribeCard } from '@/app/ui/organisms';
import { AllWaysCard, InsideTernSection } from '@/app/ui/templates';
import { MessageModal } from '@/app/ui/modals';

import PNG_ELECTRONS from '@/assets/images/electrons.png';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const ARTICLE_COUNT = { ourPicks: 6, latest: 3 };

const P_CN = 'mb-s lg:mb-xl sm:text-center  text-24 md:text-30 lg:text-40';

function ArticlesByTag() {
    const { tag = null } = useParams<{ tag: string }>() ?? {};

    const modalCtx = useModal();
    const lg = useBreakpointCheck() === Breakpoint.lg;

    // TODO sort articles by type
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                // TODO adjust using start-end indexes
                const { payload } = await BlogService.getArticles();
                setArticles(payload.blogs);
            } catch (error: unknown) {
                if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    let articlesFinal: Article[] = articles;
    const tagFinal = tag?.split('_').join(' ').toLowerCase();
    if (tagFinal && tagFinal !== CategoryFallback)
        articlesFinal = articles.filter((article) => article?.category?.toLowerCase() === tagFinal);

    // Elements
    const CardsLi: ReactElement[] = articlesFinal.slice(0, ARTICLE_COUNT.ourPicks).map((article, idx) => (
        <li
            key={article?.id ?? 'card-' + idx}
            className={'contents'}
        >
            <ArticleCard
                article={article}
                rootHref={Route.AllWaysArticle}
            />
        </li>
    ));
    const CardsLatestLi: ReactElement[] = articlesFinal.slice(1, ARTICLE_COUNT.latest + +lg).map((article, idx) => (
        <li
            key={article?.id ?? 'card-' + idx}
            className={'contents'}
        >
            <ArticleCard
                type={'alt'}
                article={article}
                className={'[&:not(:first-of-type)]:border-t-0'}
                rootHref={Route.AllWaysArticle}
            />
        </li>
    ));

    return (
        <>
            <Section
                type={'short'}
                background={{ image: PNG_ELECTRONS, gradient: 'left' }}
                className={{ content: 'py-5xl  sm:py-xxl' }}
            >
                <H1
                    type={'large'}
                    className={`md:text-96`}
                >
                    All Ways
                </H1>
                <H2 className={`md:text-36`}>Tech, news, education, events and more</H2>
            </Section>
            <Content>
                <Section
                    className={{
                        content: cn('grid  grid-cols-[2fr,1fr] sm:grid-cols-1  gap-y-xxl md:gap-x-n lg:gap-x-xl'),
                    }}
                >
                    <div className={'flex flex-col'}>
                        <p className={P_CN}>Featured</p>
                        <ArticleCard
                            type={'expand'}
                            article={articlesFinal[0]}
                            rootHref={Route.AllWaysArticle}
                        />
                    </div>
                    <div className={'flex flex-col'}>
                        <p className={P_CN}>Latest</p>
                        <ul className={'flex-grow grid md:grid-rows-3 lg:grid-rows-4'}>
                            {CardsLatestLi}
                            <li className={'contents'}>
                                <AllWaysCard />
                            </li>
                        </ul>
                    </div>
                </Section>
                <Section className={{ content: 'py-3xl md:py-3xl lg:py-5xl' }}>
                    <SubscribeCard />
                </Section>
                <Section>
                    {CardsLi.length ? (
                        <Carousel altData={{ cards: CardsLi, link: Route.AllWaysArticle, title: 'Our Picks' }} />
                    ) : (
                        <span className={'mt-5xl block text-12'}>
                            {loading ? (
                                <FontAwesomeIcon icon={faSpinner} />
                            ) : (
                                `No articles found ${"with tag '" + getIdName(tag ?? '--') + "'"}`
                            )}
                        </span>
                    )}
                </Section>
                <InsideTernSection data={'alt0'} />
            </Content>
        </>
    );
}

export default ArticlesByTag;
