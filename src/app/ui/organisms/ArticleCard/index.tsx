'use client';

import { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { ButtonIcon } from '@/app/ui/form/Button';
import { Article, Tip, Course } from '@/app/types/blog';
import { Route } from '@/app/static';

import { useNavigate } from '@/app/hooks';
import { Button } from '@/app/ui/form';

import styles from '@/app/common.module.css';
import PNG_NATURE from '@/assets/images/nature.png';

import { faVideo, faArrowRight, faPlayCircle } from '@fortawesome/free-solid-svg-icons';

type ArticleCardType = 'default' | 'expand' | 'alt' | 'alt-vertical' | 'compact';
export type { ArticleCardType };

interface Props {
    type?: ArticleCardType;
    article: Article | Tip | Course | null;
    hideTag?: true;
    hideTitle?: true;
    altLink?: string;
    altIcon?: ButtonIcon;
    className?: string;
    classNameContent?: string;
}

const ArticleCard: FC<Props> = ({
    type,
    article,
    hideTag,
    hideTitle,
    altLink,
    altIcon,
    className,
    classNameContent,
}) => {
    const [navigate] = useNavigate(true);

    const openItem = (item: Article | Tip | Course | null) => {
        if (!item) return;
        const key = 'id' in item && 'series' in item ? 'course' : 'article';
        localStorage.setItem(key, JSON.stringify(item));
        const route = key === 'course' ? Route.CourseVideo + '/' + item.id : Route.AllWaysArticle + '/' + item.id;
        navigate(route as Route);
    };

    const expand = type === 'expand';
    const altVertical = type === 'alt-vertical';
    const alt = type === 'alt' || altVertical;
    const compact = type === 'compact';

    const isCourse = article && 'series' in article;
    const isArticle = article && 'tag' in article;
    // tip will fall through as non-article, non-course
    const defaultIcon = faVideo;
    const defaultLabel = isCourse ? 'Watch' : 'Read';

    // thumpnail cards for course listed in a series
    if (compact && isCourse) {
        const course = article as Course;
        return (
            <div
                onClick={() => openItem(course)}
                className={cn(
                    styles.clickable,
                    'w-full h-full flex flex-col overflow-hidden cursor-pointer group',
                    className,
                )}
            >
                <div className={cn('relative w-full aspect-[16/9] border-s overflow-hidden')}>
                    <Image
                        src={course.thumbnail || PNG_NATURE}
                        alt='thumbnail'
                        className='w-full h-full object-cover inset-0'
                    />
                    <Button
                        icon={faPlayCircle}
                        className='absolute inset-0 flex items-center justify-center'
                        classNameIcon='w-[10%] h-auto [&_path]:fill-slate-100 group-hover:w-[12%] transition-all duration-100'
                    />
                    {!hideTag && (
                        <div className='absolute top-0 left-0 px-2 py-1 min-w-[60px] bg-[#D9D9D9] text-black text-12 text-center'>
                            {course.series}
                        </div>
                    )}
                    <div className='absolute bottom-0 right-0 px-2 h-[18px] flex items-center min-w-[48px] bg-[#979797] text-white text-14 text-center'>
                        {course.duration || '00:00'}
                    </div>
                </div>
                {hideTitle ? null : (
                    <div className={cn('flex flex-col items-start pt-xs gap-y-2', classNameContent)}>
                        <span className={cn('', 'text-12 line-clamp-1')}>
                            {course?.title ?? 'There will be a title...'}
                        </span>
                        <span className='text-10'>
                            {course?.date
                                ? new Date(course.date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                  })
                                : 'Date TBD'}
                        </span>
                    </div>
                )}
            </div>
        );
    }

    const imgSrc = isCourse ? (article as Course).thumbnail : (article as Article | Tip)?.poster;
    const hideTagFinal = alt || hideTag || !isArticle;

    const icon = altIcon || altLink ? faArrowRight : defaultIcon;
    const label = altLink ?? defaultLabel;

    // non-thumbnail
    return (
        <div
            onClick={() => openItem(article)}
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
                <div className='absolute from-0 bg-gradient-to-t from-black to-25%' />
                <Image
                    src={imgSrc || PNG_NATURE}
                    width={100}
                    height={100}
                    alt='card-img'
                    className={cn('size-full min-h-full object-cover', {
                        [altVertical ? 'sm:max-h-[10.75rem] max-h-[12.8125rem]' : '!min-w-[11.625rem]']: alt,
                    })}
                />
            </div>

            <div
                className={cn(
                    'relative z-10 flex flex-grow flex-col items-start p-xs',
                    {
                        ['px-xs lg:px-xl sm:pt-xs pt-n pb-s lg:pb-xxl']: expand,
                        ['pt-xl']: !alt,
                    },
                    classNameContent,
                )}
            >
                {!hideTagFinal && (
                    <span className='mb-n block text-10 text-secondary'>
                        {(article as Article).tag ?? 'There will be a tag...'}
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
                {!alt && article && (
                    <span className='mb-n leading-n sm:text-10 text-12 line-clamp-2'>
                        {article.description ?? 'There will be a description...'}
                    </span>
                )}

                <Button
                    icon={icon}
                    className={cn('mt-auto capitalize text-blue', {
                        ['flex-row-reverse']: altLink,
                    })}
                    classNameIcon={cn('w-[0.67rem] [&_path]:fill-blue mt-auto', {
                        ['ml-5xs']: altLink,
                    })}
                >
                    {label}
                </Button>
            </div>
        </div>
    );
};

ArticleCard.displayName = ArticleCard.name;

export { ArticleCard };
