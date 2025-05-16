'use client';

import { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { PageLink } from '@/app/ui/layout';

import PNG_CARD_CUBES from '@/assets/images/blue-cubes.png';

interface Props {
    alt?: true;
    className?: {
        wrapper?: string;
        image?: string;
        title?: string;
        link?: string;
        icon?: string;
    };
}

const AllWaysCard: FC<Props> = (props: Props) => {
    const { alt, className } = props;
    return (
        <div
            className={cn(
                'relative flex flex-col min-h-full max-h-full  sm:x-[mx-auto,max-w-card]',
                {
                    ['h-[22.375rem]']: alt,
                },
                className?.wrapper,
            )}
        >
            <span
                className={cn(
                    'absolute z-10 left-0 top-n bg-black/60 font-bold',
                    alt ? 'sm:p-xs p-n lg:py-xl  text-96 sm:text-64' : 'px-n py-5xs lg:p-3xs  text-40 lg:text-48',
                    className?.title,
                )}
            >
                All Ways
            </span>
            <Image
                src={PNG_CARD_CUBES}
                alt={'cubes'}
                className={cn(
                    'w-full min-h-full object-cover flex-grow',
                    {
                        ['object-center translate-y-0']: alt,
                    },
                    className?.image,
                )}
            />
            <PageLink
                href={''} // TODO
                icon={'arrow-right-long'}
                className={cn(
                    'absolute flex-row-reverse justify-between px-xxs py-3xs w-full bg-blue',
                    'text-14 lg:text-16',
                    alt ? 'right-n bottom-n h-fit !w-fit' : 'bottom-0',
                    className?.link,
                )}
                iconClassName={cn(
                    'sm:size-6xs sm:[&_*]size-6xs  size-3xs',
                    {
                        ['ml-xl']: alt,
                    },
                    className?.icon,
                )}
            >
                Register to attend All Ways 2026
            </PageLink>
        </div>
    );
};

AllWaysCard.displayName = AllWaysCard.name;
export { AllWaysCard };
