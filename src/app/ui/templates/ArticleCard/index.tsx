import React, {FC} from "react";
import Image from "next/image";
import cn from "classnames";

import {ArticleCard} from "@/app/types/blog";
import {Route} from "@/app/static";

import {useNavigate} from "@/app/hooks";

import {Button} from "@/app/ui/form";

import styles from "@/app/common.module.css";

import PNG_NATURE from '/public/images/nature.png';


interface Props {
    article: ArticleCard;
}

const ArticleCardLi: FC<Props> = (props: Props) => {
    const {article} = props;

    const [navigate] = useNavigate();

    const openArticle = (articleId: string) => {
        sessionStorage.setItem('article-id', JSON.stringify(articleId));
        navigate(Route.AllWaysArticle + '/' + articleId as Route);
    }

    return (
        <li
            onClick={() => openArticle(article.id)}
            key={article.title}
            className={cn(styles.clickable, 'flex flex-col h-full max-w-[22.0625rem] w-full overflow-hidden border-s')}
        >
            <div className={'relative z-10 flex-grow'}>
                <Image
                    src={article.image ?? PNG_NATURE}
                    alt={`article-img`}
                    className={'size-full'}
                />
            </div>
            <div className={'relative z-10 items-start p-xs pt-[2.2rem] shadow-[0_-1rem_1rem_#000]'}>
                <span className={'block mb-n text-section-3xs text-secondary'}>{article.tag}</span>
                <span className={'block mb-[1.13rem] leading-[1.2]'}>{article.title}</span>
                <span className={'block mb-n text-section-xxs leading-[1.2]'}>{article.description}</span>
                <Button
                    icon={'book'}
                    className={'text-blue'}
                    classNameIcon={'[&_*]:w-[0.67rem]'}
                >
                    Read
                </Button>
            </div>
        </li>
    );
}


export {ArticleCardLi};
