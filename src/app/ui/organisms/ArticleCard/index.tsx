'use client';

import { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { ButtonIcon } from '@/app/ui/form/Button';
import { MediaCardType } from '@/app/types/blog';
import { Route } from '@/app/static';

import { useNavigate } from '@/app/hooks';

import { Button } from '@/app/ui/form';

import styles from '@/app/common.module.css';

import PNG_NATURE from '@/assets/images/nature.png';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faReadme } from '@fortawesome/free-brands-svg-icons';

type ArticleCardType = 'default' | 'expand' | 'alt' | 'alt-vertical';

interface Props {
    type?: ArticleCardType;
    article: MediaCardType | null;
    hideTag?: true;
    altLink?: string;
    altIcon?: ButtonIcon;
    className?: string;
    classNameContent?: string;
    rootHref: Route;
}

const ArticleCard: FC<Props> = (props: Props) => {
    const { type, article, hideTag, altLink, altIcon, className, rootHref, classNameContent } = props;

    const [navigate] = useNavigate(true);

    const openArticle = (article: MediaCardType | null) => {
        if (!article) return;
        localStorage.setItem('article', JSON.stringify(article));
        navigate((rootHref + '/' + article.id) as Route);
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
                'box-border grid size-full flex-1 overflow-hidden border-s  ',
                {
                    [alt ? 'grid-cols-2' : 'grid-rows-[4fr,3fr]']: !altVertical,
                    ['max-w-card lg:max-w-full']: !type || type === 'default',
                    ['sm:x-[mx-auto,max-w-card]']: expand || alt,
                },
                className,
            )}
        >
            <div
                className={cn('relative flex size-full overflow-hidden', altVertical ? 'pb-0' : 'pr-0', {
                    ['p-xs']: alt,
                })}
            >
                <div className={'absolute inset-0 from-0 bg-gradient-to-t from-black to-25%'} />
                <Image
                    src={article?.thumbnail || PNG_NATURE}
                    width={500}
                    height={500}
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
                        ['px-xs lg:px-xl  sm:pt-xs pt-n  pb-s lg:pb-xxl']: expand,
                        ['pt-xl']: !alt,
                    },
                    classNameContent,
                )}
            >
                {alt || hideTag || !isArticle ? null : (
                    <span className={'mb-n block text-10 text-secondary'}>
                        {article?.category ?? 'There will be a category...'}
                    </span>
                )}
                <span
                    className={cn(
                        'mb-xs block leading-n',
                        isArticle ? { ['text-20 md:text-24 lg:text-36']: expand } : 'text-16',
                    )}
                >
                    {article?.title ?? 'There will be a title...'}
                </span>
                {alt || !article ? null : (
                    <span className={'mb-n block leading-n  sm:text-10 text-12'}>
                        {article.description ?? 'There will be a description...'}
                    </span>
                )}
                <Button
                    icon={(altIcon ?? altLink) ? faArrowRight : faReadme}
                    className={cn('mt-auto capitalize text-blue', { ['flex-row-reverse']: altLink })}
                    classNameIcon={cn('w-[0.67rem] [&_path]:fill-blue mt-auto', { ['ml-5xs']: altLink })}
                >
                    {altLink ?? 'Read'}
                </Button>
            </div>
        </div>
    );
};

ArticleCard.displayName = ArticleCard.name;

export type { ArticleCardType };
export { ArticleCard };
