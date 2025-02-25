import React, { FC, ReactElement, useEffect, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { SectionCard } from '@/app/types/layout';
import { Article, ArticleTag } from '@/app/types/blog';
import { Breakpoint } from '@/app/hooks/useBreakpointCheck';
import { MEDIA_LINKS, MISC_LINKS } from '@/app/static';

import { BlogService } from '@/app/services/blog.service';

import { getIdName } from '@/app/utils';
import { useBreakpointCheck } from '@/app/hooks';
import { useModal } from '@/app/context';

import { PageLink } from '@/app/ui/layout';
import { MainBackground } from '@/app/ui/atoms';
import { MessageModal } from '@/app/ui/modals';
import { ArticleCard } from '@/app/ui/organisms';
import { InsideTernSection } from '@/app/ui/templates';
import { SubscribeCard } from '../SubscribeCard';

import styles from '@/app/common.module.css';

import PNG_ELECTRONS from '/public/images/electrons.png';
import PNG_INSIDE_TERN_GIRL from '/public/images/allways-inside-tern-girl.png';
import PNG_ACCOLADES from '/public/images/resources-card-5.png';
import PNG_CARD_CUBES from '/public/images/allways-card-cubes.png';

// TODO links
const COMPANY: SectionCard[] = [
    {
        title: 'Tern Community',
        description: 'Foster Meaningful Connections',
        action: 'Find Community',
        href: MEDIA_LINKS.YouTube.href,
        icon: PNG_ACCOLADES,
        btnIcon: 'arrow',
        btnIconCN: 'rotate-180',
    },
    {
        title: 'Tern Credentials',
        description: 'Earn Impressive Accolades',
        action: 'Start Earning',
        href: MISC_LINKS.Events,
        icon: PNG_INSIDE_TERN_GIRL,
        btnIcon: 'arrow-square',
    },
];

const ARTICLE_COUNT = { ourPicks: 6, latest: 3 };

const P_CN = 'mb-s lg:mb-[2.88rem] sm:text-center  text-documentation md:text-section-l lg:text-heading-xl';

interface Props {
    tag: ArticleTag | null;
}

const TagArticle: FC<Props> = (props: Props) => {
    const { tag } = props;

    const modalCtx = useModal();
    const lg = useBreakpointCheck() === Breakpoint.lg;

    // TODO sort articles by type
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { payload } = await BlogService.getArticles();
                setArticles(payload.blogs);
            } catch (error: unknown) {
                if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        };
        fetchArticles();
    }, []);

    let articlesFinal: Article[] = articles;
    if (tag) articlesFinal = articles.filter((article) => article.tag === tag);

    // Elements
    const CardsLi: ReactElement[] = articlesFinal.slice(0, ARTICLE_COUNT.ourPicks).map((article, idx) => (
        <li
            key={article?.title ?? 'card-' + idx}
            className={'contents'}
        >
            <ArticleCard
                key={article.id + idx}
                article={article}
            />
        </li>
    ));
    const CardsLatestLi: ReactElement[] = articlesFinal.slice(1, ARTICLE_COUNT.latest + +lg).map((article, idx) => (
        <li
            key={article?.title ?? 'card-' + idx}
            className={'contents'}
        >
            <ArticleCard
                type={'alt'}
                key={article.id + idx}
                article={article}
                className={'[&:not(:first-of-type)]:border-t-0'}
            />
        </li>
    ));

    return (
        <>
            <section className={styles.section}>
                <MainBackground url={PNG_ELECTRONS} />
                <div className={cn(styles.content, 'relative z-10 py-5xl')}>
                    <h1 className={cn(`text-heading-4xl sm:heading-xl`)}>All Ways</h1>
                    <h2 className={cn(`mt-[4.75rem]  text-heading-l sm:text-section`)}>
                        Tech, news, education, events and more
                    </h2>
                </div>
            </section>
            <section className={styles.section}>
                <div
                    className={cn(
                        styles.content,
                        'grid  grid-cols-[2fr,1fr] sm:grid-cols-1',
                        'pt-4xl md:pt-[6.7rem] lg:pt-6xl',
                        'gap-y-[2.88rem] md:gap-x-n lg:gap-x-xl',
                    )}
                >
                    <div className={'flex flex-col'}>
                        <p className={P_CN}>Featured</p>
                        <ArticleCard
                            type={'expand'}
                            article={articlesFinal[0]}
                        />
                    </div>
                    <div>
                        <p className={P_CN}>Latest</p>
                        <ul className={'grid md:grid-rows-3 lg:grid-rows-4'}>
                            {CardsLatestLi}
                            <li className={'flex flex-col sm:x-[mx-auto,max-w-card]'}>
                                <Image
                                    src={PNG_CARD_CUBES}
                                    alt={'cubes'}
                                    className={'w-full bg-cover flex-grow'}
                                />
                                <PageLink
                                    icon={'arrow-right-long'}
                                    iconClassName={'size-[1.59rem]'}
                                    className={cn(
                                        'flex-row-reverse justify-between px-xxs py-3xs w-full bg-blue',
                                        'text-section-xs lg:text-basic',
                                    )}
                                    href={''} // TODO
                                >
                                    Register to attend All Ways 2026
                                </PageLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section className={styles.section}>
                <div className={cn(styles.content, 'py-[3.44rem] md:py-3xl lg:py-5xl')}>
                    <SubscribeCard />
                </div>
            </section>
            <section className={styles.section}>
                <div className={styles.content}>
                    <h3 className={P_CN}>Our Picks</h3>
                    {CardsLi.length ? (
                        <ul
                            className={cn(
                                `grid auto-rows-max justify-items-center`,
                                `mt-s lg:mt-[2.81rem]`,
                                `gap-y-[3.44rem] md:x-[gap-x-n,gap-y-3xl] lg:x-[gap-x-xl,gap-y-5xl]`,
                                `grid-cols-[repeat(3,minmax(var(--w-card),1fr))] sm:grid-cols-1`,
                            )}
                        >
                            {CardsLi}
                        </ul>
                    ) : (
                        <span className={'mt-[5rem] block text-section-xxs'}>
                            No articles found with tag &apos;{getIdName(tag ?? '--')}&apos;
                        </span>
                    )}
                </div>
            </section>
            <InsideTernSection data={COMPANY} />
        </>
    );
};

export { TagArticle };
