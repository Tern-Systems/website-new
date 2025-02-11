import React, { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { EmailShareButton, FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';
import Image from 'next/image';
import cn from 'classnames';

import { Article } from '@/app/types/blog';
import { Breakpoint } from '@/app/hooks/useBreakpointCheck';

import { formatDate } from '@/app/utils';
import { useBreakpointCheck } from '@/app/hooks';
import { useModal } from '@/app/context';

import { Button } from '@/app/ui/form';
import { MessageModal } from '@/app/ui/modals';
import { ArticleCardLi } from '@/app/ui/templates';

import styles from '@/app/common.module.css';

import PNG_NATURE from '/public/images/nature-section.png';
import SVG_PROFILE from '/public/images/icons/profile.svg';
import SVG_LINK from '/public/images/icons/link.svg';
import SVG_EMAIL from '/public/images/icons/email.svg';
import SVG_X from '/public/images/icons/x-twitter.svg';
import SVG_LINKEDIN from '/public/images/icons/linkedin.svg';
import SVG_FACEBOOK from '/public/images/icons/facebook.svg';
import { BlogService } from '@/app/services/blog.service';
import { useParams } from 'next/navigation';


// eslint-disable-next-line
const SHARE_BTNS = [
    {
        icon: SVG_LINK,
        Element: (props: PropsWithChildren & { window: Window }) => (
            <Button onClick={() => props.window.navigator?.clipboard?.writeText?.(props.window.location.href)}>
                {props.children}
            </Button>
        ),
    },
    { icon: SVG_EMAIL, Element: EmailShareButton },
    { icon: SVG_X, Element: TwitterShareButton },
    { icon: SVG_LINKEDIN, Element: LinkedinShareButton },
    { icon: SVG_FACEBOOK, Element: FacebookShareButton },
];

const RELATED_CARDS_COUNT = 4;


function ArticlePage() {
    const { id } = useParams() ?? {} as { id: string };
    const modalCtx = useModal();
    const isLg = useBreakpointCheck() === Breakpoint.lg;

    const [content, setContent] = useState<Article | null>(null);
    const [cards, setCards] = useState<Article[]>([]);


    useEffect(() => {
        const fetchContent = async () => {
            const articleStr: string | null = localStorage.getItem('article');
            if (articleStr) {
                const article: Article = JSON.parse(articleStr);

                const url = article.html;
                article.html = '';
                setContent(article);

                try {
                    const response = await BlogService.getArticleContent(url);
                    article.html = response.payload;
                } catch (error: unknown) {
                    const msg = `Error fetching article's content`;
                    article.html = msg;
                    if (typeof error === 'string')
                        modalCtx.openModal(<MessageModal>{msg}</MessageModal>);
                }

                setContent(article);
            } else
                modalCtx.openModal(<MessageModal>Encountered an error while preparing the article</MessageModal>);
        };

        fetchContent();

        const cards: string | null = localStorage.getItem('article-cards');
        if (cards)
            setCards(JSON.parse(cards));
        //eslint-disable-next-line
    }, [id]);


    // Elements
    const ShareBtnsLi: ReactElement[] = SHARE_BTNS.map((btn, idx) => (
        <li key={btn.icon.src + idx} className={styles.clickable}>
            <btn.Element url={window.location.href} window={window}>
                <Image src={btn.icon} alt={'social-link'} className={'size-[2.5rem]'} />
            </btn.Element>
        </li>
    ));

    const CardsLi: ReactElement[] = cards
        .filter((article) => article.id !== content?.id)
        .slice(0, RELATED_CARDS_COUNT - +isLg)
        .map((article, idx) => <ArticleCardLi key={article.id + idx} article={article} />);

    return (
        <div className={cn(styles.section, 'pb-[10rem] min-h-dvh bg-black font-oxygen')}>
            <div className={cn(styles.content, 'pt-[3.75rem]')}>
                <h1 className={'text-heading-3xl leading-n'}>{content?.title}</h1>
                <div className={'mt-[4.4rem] w-full'}>
                    <Image
                        src={content?.poster ?? PNG_NATURE}
                        alt={'article-image'}
                        width={200}
                        height={200}
                        className={'size-full'}
                    />
                </div>
                <div className={'mt-xl py-s border-y-s border-gray-l0'}>
                    <span className={cn({ ['text-section-xxs']: !content?.date })}>
                        {content?.date ? formatDate(new Date(content?.date)) : '-- date is not provided --'}
                    </span>
                </div>
                <div className={'py-s border-b-s border-gray-l0'}>
                    <p>Share</p>
                    <ul className={'flex gap-x-3xs mt-xxs'}>{ShareBtnsLi}</ul>
                </div>
                <div className={'mt-[6.91rem]'}>
                    <span className={'block mb-xxs font-bold'}>Author</span>
                    <span className={'grid grid-rows-2 grid-cols-[min-content,1fr] gap-x-l items-center'}>
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
                        <span>{content?.author.position}, {content?.author.company}</span>
                    </span>
                </div>

                <div className={'mt-[3.5rem]'} dangerouslySetInnerHTML={{ __html: content?.html ?? '' }} />

                <div className={'mt-[10.3rem]'}>
                    <ul
                        className={cn(
                            `grid auto-rows-max justify-items-center`,
                            `lg:gap-x-[min(2.7dvw,2.44rem)] lg:gap-y-[min(5.7dvw,5.19rem)]`,
                            `lg:grid-cols-[repeat(3,minmax(22.0625rem,1fr))]`,
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
