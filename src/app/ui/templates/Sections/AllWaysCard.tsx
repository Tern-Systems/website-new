'use client';

import { FC, HTMLAttributes } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { PageLink } from '@/app/ui/layout';

import PNG_CARD_CUBES from '@/assets/images/blue-cubes.png';

interface Props extends HTMLAttributes<HTMLDivElement> {
    alt?: true;
}

const AllWaysCard: FC<Props> = (props: Props) => {
    const { alt, className, ...divProps } = props;
    return (
        <div
            {...divProps}
            className={cn(
                'relative flex flex-col min-h-full max-h-full sm:x-[w-card,h-14xl]  sm:mx-auto',
                { ['!h-[22.375rem]']: alt },
                className,
            )}
        >
            <p
                className={cn(
                    'absolute z-10 left-0 top-n max-w-full bg-black/60 font-bold  text-ellipsis text-nowrap overflow-x-hidden',
                    alt ? 'sm:p-xs p-n lg:py-xl  text-96 sm:text-64' : 'px-n py-5xs lg:p-3xs  text-40 lg:text-48',
                )}
            >
                All Ways
            </p>
            <div className={'contents'}>
                <Image
                    src={PNG_CARD_CUBES}
                    alt={'cubes'}
                    className={cn('w-full min-h-full object-cover flex-grow', { ['object-center translate-y-0']: alt })}
                />
            </div>
            <PageLink
                href={''} // TODO
                icon={'arrow-right-long'}
                className={cn(
                    'absolute flex-row-reverse justify-between px-xxs py-3xs w-full bg-blue',
                    'text-14 lg:text-16',
                    alt ? 'right-n bottom-n h-fit !w-fit' : 'bottom-0',
                )}
                iconClassName={cn('sm:size-6xs sm:[&_*]size-6xs  size-3xs', { ['ml-xl']: alt })}
            >
                Register to attend All Ways 2026
            </PageLink>
        </div>
    );
};

AllWaysCard.displayName = AllWaysCard.name;

export { AllWaysCard };
