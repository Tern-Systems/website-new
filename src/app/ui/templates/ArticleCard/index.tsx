import React, { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { Article } from '@/app/types/blog';
import { Route } from '@/app/static';

import { useNavigate } from '@/app/hooks';

import { Button } from '@/app/ui/form';

import styles from '@/app/common.module.css';

import PNG_NATURE from '/public/images/nature.png';


interface Props {
    article: Article;
}

const ArticleCardLi: FC<Props> = (props: Props) => {
    const { article } = props;

    const [navigate] = useNavigate(true);

    const openArticle = (article: Article) => {
        localStorage.setItem('article', JSON.stringify(article));
        navigate(Route.AllWaysArticle + '/' + article.id as Route);
    };

    return (
        <li
            onClick={() => openArticle(article)}
            key={article.title}
            className={cn(styles.clickable, 'flex flex-1 flex-col min-h-fit h-full max-w-[22.0625rem] w-full overflow-hidden border-s')}
        >
            <div className={'relative h-[45%]'}>
                <div className={'absolute h-full w-full bg-gradient-to-t from-black to-25%'} />
                <Image
                    src={article.poster ?? PNG_NATURE}
                    width={100}
                    height={100}
                    alt={`article-img`}
                    className={'size-full'}
                />
            </div>
            <div className={'relative z-10 flex-grow flex flex-col p-xs pt-[2.2rem] items-start'}>
                <span className={'block mb-n text-section-3xs text-secondary'}>{article.tag}</span>
                <span className={'block mb-[1.13rem] leading-n'}>{article.title}</span>
                <span className={'block mb-n text-section-xxs leading-n'}>{article.description}</span>
                <Button
                    icon={'book'}
                    className={'mt-auto text-blue'}
                    classNameIcon={'[&_*]:w-[0.67rem]'}
                >
                    Read
                </Button>
            </div>
        </li>
    );
};


export { ArticleCardLi };
