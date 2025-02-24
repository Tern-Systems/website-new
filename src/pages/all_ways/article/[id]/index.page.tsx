import React, { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { EmailShareButton, FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import cn from 'classnames';

import { Article } from '@/app/types/blog';
import { Breakpoint } from '@/app/hooks/useBreakpointCheck';

import { formatDate } from '@/app/utils';
import { useBreakpointCheck } from '@/app/hooks';

import { Button } from '@/app/ui/form';
import { ArticleCard } from '@/app/ui/organisms';
import { SubscribeCard } from '../../SubscribeCard';

import styles from '@/app/common.module.css';

import PNG_NATURE from '/public/images/nature-section.png';
import SVG_PROFILE from '/public/images/icons/profile.svg';
import SVG_LINK from '/public/images/icons/link.svg';
import SVG_EMAIL from '/public/images/icons/email.svg';
import SVG_X from '/public/images/icons/x-twitter.svg';
import SVG_LINKEDIN from '/public/images/icons/linkedin.svg';
import SVG_FACEBOOK from '/public/images/icons/facebook.svg';

const SHARE_BTNS = [
    {
        icon: SVG_LINK,
        Element: (props: PropsWithChildren & { url: string }) => (
            <Button onClick={() => navigator?.clipboard?.writeText?.(props.url)}>{props.children}</Button>
        ),
    },
    { icon: SVG_EMAIL, Element: EmailShareButton },
    { icon: SVG_X, Element: TwitterShareButton },
    { icon: SVG_LINKEDIN, Element: LinkedinShareButton },
    { icon: SVG_FACEBOOK, Element: FacebookShareButton },
];

const RELATED_CARDS_COUNT = 4;
// TODO highlighted card, image injection
const H2_REGEX = /<h2>/g;

const INFO_CN = 'border-t-s border-gray-l0 py-s px-4xs';
const CONTENT_CN = '[&_*]:!text-primary [&_*]:[all:revert]';

function ArticlePage() {
    const { id } = useParams() ?? ({} as { id: string });
    const isLg = useBreakpointCheck() === Breakpoint.lg;

    const [url, setURL] = useState<string | null>(null);
    const [content, setContent] = useState<Article | null>(null);
    const [contentParts, setContentParts] = useState<string[]>([]);
    const [cards, setCards] = useState<Article[]>([]);

    useEffect(() => {
        const articleStr: string | null = localStorage.getItem('article');
        if (articleStr) {
            const article: Article = JSON.parse(articleStr);
            setContent(article);

            const h2Matches: RegExpExecArray[] = Array.from(article.content.matchAll(H2_REGEX));
            const contentCenterIdx: number | undefined = h2Matches[Math.trunc(0.5 * h2Matches.length)]?.index;
            setContentParts(
                contentCenterIdx
                    ? [article.content.substring(0, contentCenterIdx), article.content.substring(contentCenterIdx)]
                    : [article.content, ''],
            );
        }

        setURL(window.location.href);

        const cards: string | null = localStorage.getItem('article-cards');
        if (cards) setCards(JSON.parse(cards));
    }, [id]);

    // Elements
    const ShareBtnsLi: ReactElement[] = SHARE_BTNS.map((btn, idx) => (
        <li
            key={btn.icon.src + idx}
            className={styles.clickable}
        >
            <btn.Element url={url ?? ''}>
                <Image
                    src={btn.icon}
                    alt={'social-link'}
                    className={'size-[2.5rem]'}
                />
            </btn.Element>
        </li>
    ));

    const CardsLi: ReactElement[] = cards
        .filter((article) => article.id !== content?.id)
        .slice(0, RELATED_CARDS_COUNT - +isLg)
        .map((article, idx) => (
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

    return (
        <div className={cn(styles.section, styles.fullHeightSection, 'pb-[10rem]')}>
            <div className={cn(styles.content, 'pt-3xl md:pt-xxl lg:pt-[4.43rem]')}>
                <div className={'grid-cols-[3fr,1fr] gap-x-xs mt-xl md:mt-3xl lg:mt-[4.4rem]  block lg:grid'}>
                    <div className={'flex flex-col w-full'}>
                        <h1 className={'leading-n  text-section-xl md:text-heading-xxl lg:text-heading-3xl'}>
                            {content?.title}
                        </h1>
                        <div className={'contents'}>
                            <Image
                                src={content?.poster ?? PNG_NATURE}
                                alt={'article-image'}
                                width={200}
                                height={200}
                                className={'flex-grow size-full  mt-xl md:mt-[3.5rem] lg:mt-[4.44rem]'}
                            />
                        </div>
                    </div>
                    <div className={'contents lg:block'}>
                        <div className={cn(INFO_CN, 'mt-xl lg:mt-0')}>
                            <span
                                className={cn('bg-gray-l0 py-5xs px-3xs rounded-full', {
                                    ['text-section-xxs']: !content?.tag,
                                })}
                            >
                                {content?.tag ?? 'All Ways'}
                            </span>
                        </div>
                        <div className={INFO_CN}>
                            <span className={cn({ ['text-section-xxs']: !content?.date })}>
                                {content?.date ? formatDate(new Date(content?.date)) : '-- date is not provided --'}
                            </span>
                        </div>
                        <div className={cn(INFO_CN, 'border-b-s')}>
                            <p>Share</p>
                            <ul className={'mt-xxs flex gap-x-3xs'}>{ShareBtnsLi}</ul>
                        </div>
                    </div>
                </div>
                <div className={'mt-4xl md:mt-[5.78rem] lg:mt-xxl'}>
                    <span className={'mb-xxs block font-bold'}>Author</span>
                    <span className={'grid grid-cols-[min-content,1fr] grid-rows-2 items-center gap-x-l'}>
                        <span className={'row-span-2 size-[3.125rem]'}>
                            <Image
                                src={content?.author?.image ?? SVG_PROFILE}
                                alt={'author-image'}
                                width={50}
                                height={50}
                                className={'size-full'}
                            />
                        </span>
                        <span className={'font-bold'}>{content?.author.name}</span>
                        <span>{content?.author.position}</span>
                    </span>
                </div>

                <div className={'leading-l  mt-xl md:mt-4xl lg:mt-[3.56rem]'}>
                    <div
                        className={CONTENT_CN}
                        dangerouslySetInnerHTML={{ __html: contentParts[0] ?? '' }}
                    />
                    <SubscribeCard />
                    <div
                        className={CONTENT_CN}
                        dangerouslySetInnerHTML={{ __html: contentParts[1] ?? '' }}
                    />
                </div>

                <div className={'mt-[10.3rem]'}>
                    <h3 className={'text-center  text-section-xl md:text-heading-xl lg:text-heading-xxl'}>
                        More related articles
                    </h3>
                    <ul
                        className={cn(
                            `grid auto-rows-max justify-items-center`,
                            `md:x-[mx-auto,w-fit,grid-cols-2] lg:grid-cols-[repeat(3,minmax(var(--w-card),1fr))]`,
                            `gap-y-l md:gap-n lg:gap-x-xl`,
                            `mt-[2.31rem] md:mt-xxl lg:mt-xl`,
                        )}
                    >
                        {CardsLi}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ArticlePage;
