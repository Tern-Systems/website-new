'use client';

import { FC, ReactElement, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';

import { Article, ArticleTag } from '@/app/types/blog';
import { Breakpoint, Route } from '@/app/static';

import { BlogService } from '@/app/services/blog.service';

import { getIdName } from '@/app/utils';
import { useBreakpointCheck, useModal } from '@/app/hooks';

import { MainBackground } from '@/app/ui/atoms';
import { MessageModal } from '@/app/ui/modals';
import { ArticleCard, Carousel } from '@/app/ui/organisms';
import { AllWaysCard, InsideTernSection } from '@/app/ui/templates';
import { SubscribeCard } from '../SubscribeCard';

import styles from '@/app/common.module.css';

import PNG_ELECTRONS from '@/assets/images/electrons.png';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const ARTICLE_COUNT = { ourPicks: 6, latest: 3 };

const P_CN = 'mb-s lg:mb-xl sm:text-center  text-24 md:text-30 lg:text-40';

interface Props {
    tag: ArticleTag | null;
}

const TagArticle: FC<Props> = (props: Props) => {
    const { tag } = props;

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
    if (tagFinal) articlesFinal = articles.filter((article) => article?.tag?.toLowerCase() === tagFinal);

    // Elements
    const CardsLi: ReactElement[] = articlesFinal.slice(0, ARTICLE_COUNT.ourPicks).map((article, idx) => (
        <li
            key={article?.id ?? 'card-' + idx}
            className={'contents'}
        >
            <ArticleCard article={article} />
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
            />
        </li>
    ));

    return (
        <>
            <section className={styles.section}>
                <MainBackground url={PNG_ELECTRONS} />
                <div className={cn(styles.content, 'relative z-10 py-5xl  sm:py-xxl')}>
                    <h1 className={cn(`sm:text-40 text-96`)}>All Ways</h1>
                    <h2 className={cn(`sm:mt-6xl mt-5xl  sm:text-20 text-36`)}>
                        Tech, news, education, events and more
                    </h2>
                </div>
            </section>

            <section className={cn(styles.section)}>
                <div
                    className={cn(
                        'absolute h-full w-full left-0 top-0 z-0',
                        'bg-gradient-to-b from-blue to-transparent to-[5%] md:to-[15%] lg:to-[15%]',
                    )}
                />
                <div
                    className={cn(
                        styles.content,
                        'grid  grid-cols-[2fr,1fr] sm:grid-cols-1',
                        'pt-4xl md:pt-6xl-1 lg:pt-6xl',
                        'gap-y-xxl md:gap-x-n lg:gap-x-xl',
                    )}
                >
                    <div className={'flex flex-col'}>
                        <p className={P_CN}>Featured</p>
                        <ArticleCard
                            type={'expand'}
                            article={articlesFinal[0]}
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
                </div>
            </section>
            <section className={styles.section}>
                <div className={cn(styles.content, 'py-3xl md:py-3xl lg:py-5xl')}>
                    <SubscribeCard />
                </div>
            </section>
            <section className={styles.section}>
                <div className={styles.content}>
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
                </div>
            </section>
            <InsideTernSection
                data={'alt0'}
                className='bg-transparent pb-7xl'
            />
            <div
                className={cn(
                    'absolute h-full w-full left-0 top-0 z-0',
                    'bg-black bg-gradient-to-t from-blue from-[-1%] to-transparent to-[4%]  lg:to-10%',
                )}
            />
        </>
    );
};

export { TagArticle };
