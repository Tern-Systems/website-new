import React, {FC, ReactElement, useEffect, useState} from "react";
import cn from "classnames";

import {ArticleCard, ArticleTag} from "@/app/types/blog";

import {BlogService} from "@/app/services/blog.service";

import {useModal} from "@/app/context";

import {MessageModal} from "@/app/ui/modals";
import {ArticleCardLi} from "@/app/ui/templates";

import styles from "@/app/common.module.css";

import PNG_ELECTRONS from '/public/images/electrons.png';


const GRADIENT_CN = 'from-blue to-[8rem] to-transparent';


interface Props {
    tag: ArticleTag | null;
}

const TagArticle: FC<Props> = (props: Props) => {
    const {tag} = props;

    const modalCtx = useModal();

    const [articles, setArticles] = useState<ArticleCard[]>([]);


    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const {payload} = await BlogService.getArticles();
                setArticles(payload.articles);
            } catch (error: unknown) {
                if (typeof error === 'string')
                    modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        }
        fetchArticles();
        //eslint-disable-next-line
    }, [])


    let articlesFinal: ArticleCard[] = articles;
    if (tag)
        articlesFinal = articles.filter((article) => article.tag === tag);

    // Elements
    const CardsLi: ReactElement[] = articlesFinal.map((article, idx) =>
        <ArticleCardLi key={article.id + idx} article={article}/>
    );

    return (
        <>
            <div
                style={{backgroundImage: `url("${PNG_ELECTRONS.src}")`}}
                className={'absolute top-0 left-0 w-dvw max-w-dwv h-screen max-h-[100rem] bg-cover bg-center bg-no-repeat'}
            />
            <div className={'relative z-10  font-oxygen'}>
                <section className={cn(styles.section, styles.fullHeightSection, 'bg-gradient-to-t', GRADIENT_CN)}>
                    <div className={cn(styles.content, 'pt-[7rem]')}>
                        <h1 className={cn(styles.textGlow, `font-bold text-[6rem]`)}>
                            All Ways
                        </h1>
                    </div>
                </section>
                <section className={cn(styles.section, 'bg-blue')}>
                    <div className={styles.content}>
                        <h2 className={cn(styles.textGlow, `font-bold  text-[3rem]  md:text-[2.25rem]`)}>
                            Tech, news, education, events and more
                        </h2>
                    </div>
                </section>
                <section
                    className={cn(
                        styles.section, styles.fullHeightSection,
                        'pb-[20rem] !h-fit bg-black bg-gradient-to-b', GRADIENT_CN
                    )}
                >
                    <div className={cn(styles.content, 'pt-[7.87rem]')}>
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
                </section>
            </div>
        </>
    );
}


export {TagArticle};
