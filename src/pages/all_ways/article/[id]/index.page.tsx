'use client';

import { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { EmailShareButton, FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import cn from 'classnames';

import { Article } from '@/app/types/blog';
import { SelectOptions } from '@/app/ui/form/Select';
import { Breakpoint, Route } from '@/app/static';

import { formatDate } from '@/app/utils';
import { useBreakpointCheck } from '@/app/hooks';

import { Button } from '@/app/ui/form';
import { ArticleCard, SideNav, SubscribeCard } from '@/app/ui/organisms';

import styles from '@/app/common.module.css';

import PNG_NATURE from '@/assets/images/nature-section.png';
import SVG_PROFILE from '@/assets/images/icons/profile.svg';
import SVG_LINK from '@/assets/images/icons/link.svg';
import SVG_EMAIL from '@/assets/images/icons/email.svg';
import SVG_X from '@/assets/images/icons/x-twitter.svg';
import SVG_LINKEDIN from '@/assets/images/icons/linkedin.svg';
import SVG_FACEBOOK from '@/assets/images/icons/facebook.svg';
import { H1, H3, Section } from '@/app/ui/atoms';

const SHARE_BTNS = [
    {
        icon: SVG_LINK,
        Element: (props: PropsWithChildren & { url: string }) => {
            const handleCopyUrlToClipboard = () => navigator?.clipboard?.writeText?.(props.url);
            return <Button onClick={handleCopyUrlToClipboard}>{props.children}</Button>;
        },
    },
    { icon: SVG_EMAIL, Element: EmailShareButton },
    { icon: SVG_X, Element: TwitterShareButton },
    { icon: SVG_LINKEDIN, Element: LinkedinShareButton },
    { icon: SVG_FACEBOOK, Element: FacebookShareButton },
];

const RELATED_CARDS_COUNT = 4;
// TODO image injection
const H2_REGEX = /<h2/g;

const SECTION_GRID_CN = 'lg:grid  grid-cols-[1fr,3fr,1fr] gap-x-xs';
const INFO_CN = 'border-t-s border-gray-l0 py-s px-xs';
const CONTENT_CN = '[&_*]:!text-primary [&_h2]:!text-40 [&_*]:[all:revert] !leading-l';

function ArticlePage() {
    const { id } = useParams() ?? ({} as { id: string });
    const lg = useBreakpointCheck() === Breakpoint.lg;

    const [url, setURL] = useState<string | null>(null);
    const [nav, setNav] = useState<SelectOptions>({});
    const [content, setContent] = useState<Article | null>(null);
    const [contentParts, setContentParts] = useState<string[]>([]);
    const [cards, setCards] = useState<Article[]>([]);

    useEffect(() => {
        const articleStr: string | null = localStorage.getItem('article');
        if (articleStr) {
            const article: Article = JSON.parse(articleStr);
            setContent(article);

            if (!article.content) return setContentParts([]);

            const h2Matches: RegExpExecArray[] = Array.from(article.content.matchAll(H2_REGEX) ?? []);
            const contentCenterIdx: number | undefined = h2Matches[Math.trunc(0.5 * h2Matches.length)]?.index;
            setContentParts(
                contentCenterIdx
                    ? [article.content.substring(0, contentCenterIdx), article.content.substring(contentCenterIdx)]
                    : [article.content, ''],
            );

            const ids: Record<string, string> = Object.fromEntries(
                article.contentIDs?.map((id, idx) => {
                    const map: string = 'heading_' + idx;
                    return [map as string | undefined, id];
                }) ?? [],
            );

            setNav(ids);
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
                    className={'size-3xl'}
                />
            </btn.Element>
        </li>
    ));

    const CardsLi: ReactElement[] = cards
        .filter((article) => article.id !== content?.id)
        .slice(0, RELATED_CARDS_COUNT - +lg)
        .map((article, idx) => (
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

    return (
        <>
            <Section className={{ content: cn(SECTION_GRID_CN, 'pt-xl md:pt-3xl lg:pt-5xl') }}>
                <div className={'col-span-2 flex flex-col w-full h-fit'}>
                    <H1>{content?.title}</H1>
                    <div className={'contents'}>
                        <Image
                            src={content?.thumbnail || PNG_NATURE}
                            alt={'article-image'}
                            width={500}
                            height={500}
                            className={'flex-grow size-full  mt-xl md:mt-3xl lg:mt-[4.44rem]'}
                        />
                    </div>
                </div>
                <div className={'contents lg:block'}>
                    <div className={cn(INFO_CN, 'mt-xl lg:mt-0')}>
                        <span
                            className={cn('bg-gray-l0 py-5xs px-3xs rounded-full', {
                                ['text-12']: !content?.category,
                            })}
                        >
                            {content?.category ?? 'All Ways'}
                        </span>
                    </div>
                    <div className={INFO_CN}>
                        <span className={cn({ ['text-12']: !content?.date })}>
                            {content?.date ? formatDate(content?.date) : '-- date is not provided --'}
                        </span>
                    </div>
                    <div className={cn(INFO_CN, 'border-b-s')}>
                        <p>Share</p>
                        <ul className={'mt-xxs flex gap-x-3xs'}>{ShareBtnsLi}</ul>
                    </div>
                </div>
            </Section>
            <Section className={{ content: 'mt-xxl md:mt-3xl lg:mt-5xl' }}>
                <span className={'mb-xxs block font-bold'}>Author</span>
                <span className={'grid grid-cols-[min-content,1fr] grid-rows-2 items-center gap-x-l'}>
                    <span className={'row-span-2 size-6xl'}>
                        <Image
                            src={content?.author?.image ?? SVG_PROFILE}
                            alt={'author-image'}
                            width={150}
                            height={150}
                            className={'size-full'}
                        />
                    </span>
                    <span className={'font-bold'}>{content?.author?.name ?? '-- missing author name --'}</span>
                    {content?.author?.position ? <span>{content.author.position}</span> : null}
                </span>
            </Section>
            <Section className={{ content: cn(SECTION_GRID_CN, 'relative  mt-l lg:mt-xl') }}>
                {content?.contentIDs?.length ? (
                    <SideNav
                        sideOnly
                        section={nav}
                        className={'sticky top-xxl'}
                    />
                ) : null}
                <div className={content?.contentIDs?.length ? 'col-start-2' : 'col-span-2'}>
                    <div
                        className={CONTENT_CN}
                        dangerouslySetInnerHTML={{ __html: contentParts[0] ?? '' }}
                    />
                    <SubscribeCard className={'mt-l'} />
                    <div
                        className={CONTENT_CN}
                        dangerouslySetInnerHTML={{ __html: contentParts[1] ?? '' }}
                    />
                </div>
            </Section>
            <Section className={{ content: 'mt-[10.3rem] pb-7xl' }}>
                <H3
                    type={'huge'}
                    className={'text-center'}
                >
                    More related articles
                </H3>
                <ul
                    className={cn(
                        `grid auto-rows-max justify-items-center`,
                        `md:x-[mx-auto,w-fit,grid-cols-2] lg:grid-cols-[repeat(3,minmax(var(--w-card),1fr))]`,
                        `gap-y-l md:gap-n lg:gap-x-xl`,
                        `mt-xl md:mt-xxl lg:mt-xl`,
                    )}
                >
                    {CardsLi}
                </ul>
            </Section>
        </>
    );
}

export default ArticlePage;
