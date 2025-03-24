'use client';

import { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { ButtonIcon } from '@/app/ui/form/Button';
import { Article, Tip } from '@/app/types/blog';
import { Route } from '@/app/static';

import { useNavigate } from '@/app/hooks';

import { Button } from '@/app/ui/form';

import styles from '@/app/common.module.css';

import PNG_NATURE from '@/assets/images/nature.png';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faReadme } from '@fortawesome/free-brands-svg-icons';

type ArticleCardType = 'default' | 'expand' | 'alt' | 'alt-vertical';
export type { ArticleCardType };

interface Props {
    type?: ArticleCardType;
    article: Article | Tip | null;
    hideTag?: true;
    altLink?: string;
    altIcon?: ButtonIcon;
    className?: string;
    classNameContent?: string;
}

const ArticleCard: FC<Props> = (props: Props) => {
    const { type, article, hideTag, altLink, altIcon, className, classNameContent } = props;

    const [navigate] = useNavigate(true);

    const openArticle = (article: Article | Tip | null) => {
        if (!article) return;
        localStorage.setItem('article', JSON.stringify(article));
        navigate((Route.AllWaysArticle + '/' + article.id) as Route);
    };

    const expand = type === 'expand';
    const altVertical = type === 'alt-vertical';
    const alt = type === 'alt' || altVertical;
    const isArticle = article && 'tag' in article;

    return (
        <div
            onClick={() => openArticle(article)}
            className={cn(
                styles.clickable,
                'box-border grid h-full w-full flex-1 overflow-hidden border-s',
                {
                    [alt ? 'grid-cols-2' : 'grid-rows-[4fr,3fr]']: !altVertical,
                    ['max-w-card lg:max-w-full']: !type || type === 'default',
                    ['sm:x-[mx-auto,max-w-card]']: expand || alt,
                },
                className,
            )}
        >
            <div
                className={cn('relative -z-10 flex size-full overflow-hidden', altVertical ? 'pb-0' : 'pr-0', {
                    ['p-xs']: alt,
                })}
            >
                <div className={'absolute from-0 bg-gradient-to-t from-black to-25%'} />
                <Image
                    src={article?.poster || PNG_NATURE}
                    width={100}
                    height={100}
                    alt={`article-img`}
                    className={cn('size-full min-h-full object-cover', {
                        [altVertical ? 'sm:max-h-[10.75rem] max-h-[12.8125rem]' : '!min-w-[11.625rem]']: alt,
                    })}
                />
            </div>
            <div
                className={cn(
                    'relative z-10 flex flex-grow flex-col items-start p-xs',
                    {
                        ['px-xs lg:px-xl  sm:pt-xs pt-n  pb-s lg:pb-[2.88rem]']: expand,
                        ['pt-[2.2rem]']: !alt,
                    },
                    classNameContent,
                )}
            >
                {alt || hideTag || !isArticle ? null : (
                    <span className={'mb-n block text-section-3xs text-secondary'}>
                        {article.tag ?? 'There will be a tag...'}
                    </span>
                )}
                <span
                    className={cn(
                        'mb-[1.13rem] block leading-n',
                        isArticle ? { ['text-section md:text-documentation lg:text-heading-l']: expand } : 'text-basic',
                    )}
                >
                    {article?.title ?? 'There will be a title...'}
                </span>
                {alt || !article ? null : (
                    <span className={'mb-n block leading-n  sm:text-section-3xs text-section-xxs'}>
                        {article.description ?? 'There will be a description...'}
                    </span>
                )}
                <Button
                    icon={(altIcon ?? altLink) ? faArrowRight : faReadme}
                    className={cn('mt-auto capitalize text-blue', { ['flex-row-reverse']: altLink })}
                    classNameIcon={cn('[&_*]:w-[0.67rem] [&_path]:fill-blue mt-auto', { ['ml-5xs']: altLink })}
                >
                    {altLink ?? 'Read'}
                </Button>
            </div>
        </div>
    );
};

ArticleCard.displayName = ArticleCard.name;

export { ArticleCard };
