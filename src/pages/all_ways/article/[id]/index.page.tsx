import React, {PropsWithChildren, ReactElement, useEffect, useState} from "react";
import {EmailShareButton, FacebookShareButton, LinkedinShareButton, TwitterShareButton} from "react-share";
import Image from "next/image";
import cn from "classnames";

import {ArticleCard, ArticlePage} from "@/app/types/blog";
import {Breakpoint} from "@/app/hooks/useBreakpointCheck";

import {BlogService} from "@/app/services/blog.service";

import {formatDate} from "@/app/utils";
import {useBreakpointCheck} from "@/app/hooks";
import {useModal} from "@/app/context";

import {Button} from "@/app/ui/form";
import {MessageModal} from "@/app/ui/modals";
import {ArticleCardLi} from "@/app/ui/templates";

import styles from "@/app/common.module.css";

import PNG_NATURE from '/public/images/nature-section.png';
import SVG_PROFILE from "/public/images/icons/profile.svg";
import SVG_LINK from "/public/images/icons/link.svg";
import SVG_EMAIL from "/public/images/icons/email.svg";
import SVG_X from "/public/images/icons/x-twitter.svg";
import SVG_LINKEDIN from "/public/images/icons/linkedin.svg";
import SVG_FACEBOOK from "/public/images/icons/facebook.svg";


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
    {icon: SVG_EMAIL, Element: EmailShareButton},
    {icon: SVG_X, Element: TwitterShareButton},
    {icon: SVG_LINKEDIN, Element: LinkedinShareButton},
    {icon: SVG_FACEBOOK, Element: FacebookShareButton},
]

const RELATED_CARDS_COUNT = 4;


function Article() {
    const modalCtx = useModal();
    const isLg = useBreakpointCheck() === Breakpoint.lg;

    const [article, setArticle] = useState<ArticlePage | null>(null);
    const [cards, setCards] = useState<ArticleCard[]>([]);


    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const articleId = sessionStorage.getItem('article-id');
                if (!articleId)
                    throw 'Wrong article id';
                const {payload} = await BlogService.getArticle(articleId);
                setArticle(payload.article);
            } catch (error: unknown) {
                if (typeof error === 'string')
                    modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        }
        const fetchArticles = async () => {
            try {
                const {payload} = await BlogService.getArticles(RELATED_CARDS_COUNT);
                setCards(payload.articles);
            } catch (error: unknown) {
                if (typeof error === 'string')
                    modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        }
        fetchArticle();
        fetchArticles();
        //eslint-disable-next-line
    }, [])


    // Elements
    const ShareBtnsLi: ReactElement[] = SHARE_BTNS.map((btn, idx) => (
        <li key={btn.icon.src + idx} className={styles.clickable}>
            <btn.Element url={window.location.href} window={window}>
                <Image src={btn.icon} alt={'social-link'} className={'size-[2.5rem]'}/>
            </btn.Element>
        </li>
    ))

    const CardsLi: ReactElement[] = cards
        .slice(0, RELATED_CARDS_COUNT - +isLg)
        .map((article, idx) => <ArticleCardLi key={article.id + idx} article={article}/>);

    return (
        <div className={cn(styles.section, 'pb-[10rem] min-h-dvh bg-black font-oxygen')}>
            <div className={cn(styles.content, 'pt-[3.75rem]')}>
                <h1 className={'text-[4rem]'}>{article?.title}</h1>
                <div className={'mt-[4.4rem] w-full'}>
                    <Image src={article?.image ?? PNG_NATURE} alt={'article-image'} className={'size-full'}/>
                </div>
                <div className={'mt-xl py-s border-y-s border-gray-l0'}>
                    <span className={cn({['text-section-xxs']: !article?.date})}>
                        {article?.date ? formatDate(new Date(article?.date)) : '-- date is not provided --'}
                    </span>
                </div>
                <div className={'py-s border-b-s border-gray-l0'}>
                    <p>Share</p>
                    <ul className={'flex gap-x-3xs mt-xxs'}>{ShareBtnsLi}</ul>
                </div>
                <div className={'mt-[6.91rem]'}>
                    <span className={'block mb-xxs font-bold'}>Author</span>
                    <span className={'grid grid-rows-2 grid-cols-[min-content,1fr] gap-x-l'}>
                        <span className={'row-span-2 size-[3.125rem]'}>
                            <Image src={article?.author?.image ?? SVG_PROFILE} alt={'author-image'}
                                   className={'size-full'}/>
                        </span>
                        <span className={'font-bold'}>{article?.author.name}</span>
                        <span>{article?.author.position}, {article?.author.company}</span>
                    </span>
                </div>

                <div className={'mt-[3.5rem]'} dangerouslySetInnerHTML={{__html: article?.html ?? ''}}/>

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


export default Article;
