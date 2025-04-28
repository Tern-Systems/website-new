'use client';

import { FC } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { ContentCardType } from '@/app/types/blog';
import { Breakpoint } from '@/app/static';

import { formatDate } from '@/app/utils';
import { useBreakpointCheck } from '@/app/hooks';

import CLOCK_ICON from '@/assets/images/icons/clock.svg';

interface Props extends ContentCardType {}

const ContentCard: FC<Props> = (props: Props) => {
    const { date, time, title, description } = props;

    const sm = useBreakpointCheck() <= Breakpoint.sm;

    const [day, month] = formatDate(date, 'daymonth').split(' ').reverse();

    return (
        <div
            className={cn(
                'grid',
                'sm:gap-x-0 gap-x-xxs',
                'sm:grid-cols-[1fr,min-content] grid-cols-[min-content,1fr]',
                'text-12',
            )}
        >
            <span
                className={cn(
                    'bg-gray-l2',
                    'flex  flex-col justify-center px-xs py-n',
                    'sm:x-[row-span-2,w-8xl,h-[3.9375rem],mr-4xs,mb-4xs] row-span-3',
                    'size-9xl',
                    'w-11xl h-[7.875rem]',
                )}
            >
                <span className={'text-center text-64 sm:x-[text-40]'}>{day}</span>
                <span className={'sm:x-[ml-5xs,text-10] text-12'}>{month}</span>
            </span>
            <span
                className={
                    'col-start-2 flex items-center size-fit text-16 text-primary mt-xxs sm:x-[col-span-2,mt-4xs-1,!mr-auto]'
                }
            >
                {title}
            </span>
            <span className={'leading-n sm:x-[text-10,row-start-3,col-span-3] text-xs'}>{description}</span>
            <span
                className={'flex sm:x-[row-start-2,col-start-2,col-span-4,place-self-start,mb-0] items-center mb-xxs'}
            >
                <ReactSVG
                    src={CLOCK_ICON.src}
                    className={'size-8xs sm:size-[0.55rem]  [&_path]:fill-blue'}
                />
                <span className={'ml-5xs'}>
                    {formatDate(date, 'day')} | {formatDate(time.start, 'timerange', { sm, dateEnd: time.end })}
                </span>
            </span>
        </div>
    );
};

ContentCard.displayName = ContentCard.name;

export { ContentCard };
