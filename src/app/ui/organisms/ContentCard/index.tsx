'use client';

import { FC, ReactElement } from 'react';
import cn from 'classnames';

import { ContentCardType } from '@/app/types/blog';

interface Props extends ContentCardType {
    InfoLine: ReactElement;
    Thumbnail: ReactElement;
    className?: {
        wrapper?: string;
        thumbnail?: string;
        description?: string;
        infoLine?: string;
    };
}

const ContentCard: FC<Props> = (props: Props) => {
    const { title, description, Thumbnail, InfoLine, className } = props;

    return (
        <div
            className={cn(
                'grid',
                'sm:grid-cols-[1fr,min-content] grid-cols-[min-content,1fr]',
                'sm:gap-4xs gap-x-xxs',
                'text-12',
                className?.wrapper,
            )}
        >
            <span className={cn('flex  sm:row-span-2 row-span-3', className?.thumbnail)}>{Thumbnail}</span>
            <span
                className={
                    'col-start-2 flex items-center size-fit text-16 text-primary mt-xxs sm:x-[col-span-2,mt-4xs-1,!mr-auto]'
                }
            >
                {title}
            </span>
            <div className={cn('leading-n sm:x-[text-10,row-start-3,col-span-3] text-xs', className?.description)}>
                {description}
            </div>
            <div
                className={cn(
                    'flex sm:x-[row-start-2,col-start-2,col-span-4,place-self-start,mb-0] items-center mb-xxs',
                    className?.infoLine,
                )}
            >
                {InfoLine}
            </div>
        </div>
    );
};

ContentCard.displayName = ContentCard.name;

export { ContentCard };
