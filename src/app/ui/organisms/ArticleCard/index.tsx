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
    type?: 'default' | 'expand' | 'alt';
    article: Article | null;
    className?: string;
}

const ArticleCard: FC<Props> = (props: Props) => {
    const { type, article, className } = props;

    const [navigate] = useNavigate(true);

    const openArticle = (article: Article | null) => {
        if (!article) return;
        localStorage.setItem('article', JSON.stringify(article));
        navigate((Route.AllWaysArticle + '/' + article.id) as Route);
    };

    const expand = type === 'expand';
    const alt = type === 'alt';

    return (
        <div
            onClick={() => openArticle(article)}
            className={cn(
                styles.clickable,
                'box-border grid h-full w-full flex-1 overflow-hidden border-s',
                alt ? 'grid-cols-2' : 'grid-rows-[4fr,3fr]',
                { ['max-w-card lg:max-w-full']: !type || type === 'default' },
                { ['sm:x-[mx-auto,max-w-card]']: expand || alt },
                className,
            )}
        >
            <div className={cn('relative -z-10 size-full', { ['p-xs pr-0']: alt })}>
                <div className={'from-0 absolute h-full w-full bg-gradient-to-t from-black to-25%'} />
                <Image
                    src={article?.poster ?? PNG_NATURE}
                    width={100}
                    height={100}
                    alt={`article-img`}
                    className={'size-full object-cover'}
                />
            </div>
            <div
                className={cn('relative z-10 flex flex-grow flex-col items-start p-xs', {
                    ['px-xs lg:px-xl  sm:pt-xs pt-n  pb-s lg:pb-[2.88rem] ']: expand,
                    ['pt-[2.2rem]']: !alt,
                })}
            >
                {alt ? null : (
                    <span className={'mb-n block text-section-3xs text-secondary'}>
                        {article?.tag ?? 'There will be a tag...'}
                    </span>
                )}
                <span
                    className={cn('mb-[1.13rem] block leading-n', {
                        ['text-section md:text-documentation lg:text-heading-l']: expand,
                    })}
                >
                    {article?.title ?? 'There will be a title...'}
                </span>
                {alt ? null : (
                    <span className={'mb-n block leading-n  sm:text-section-3xs text-section-xxs'}>
                        {article?.description ?? 'There will be a description...'}
                    </span>
                )}
                <Button
                    icon={'book'}
                    className={'mt-auto text-blue'}
                    classNameIcon={'[&_*]:w-[0.67rem]'}
                >
                    Read
                </Button>
            </div>
        </div>
    );
};

export { ArticleCard };
