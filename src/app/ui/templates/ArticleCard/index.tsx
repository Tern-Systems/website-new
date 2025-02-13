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
        navigate((Route.AllWaysArticle + '/' + article.id) as Route);
    };

    return (
        <li
            onClick={() => openArticle(article)}
            key={article.title}
            className={cn(
                styles.clickable,
                'flex h-full min-h-fit w-full max-w-[22.0625rem] flex-1 flex-col overflow-hidden border-s',
            )}
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
            <div className={'relative z-10 flex flex-grow flex-col items-start p-xs pt-[2.2rem]'}>
                <span className={'mb-n block text-section-3xs text-secondary'}>{article.tag}</span>
                <span className={'mb-[1.13rem] block leading-n'}>{article.title}</span>
                <span className={'mb-n block text-section-xxs leading-n'}>{article.description}</span>
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
