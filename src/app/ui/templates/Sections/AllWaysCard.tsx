'use client';

import { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { PageLink } from '@/app/ui/layout';

import PNG_CARD_CUBES from '@/assets/images/blue-cubes.png';

interface Props {
    alt?: true;
}

const AllWaysCard: FC<Props> = (props: Props) => {
    const { alt } = props;
    return (
        <div
            className={cn('relative flex flex-col min-h-full max-h-full  sm:x-[mx-auto,max-w-card]', {
                ['h-[22.375rem]']: alt,
            })}
        >
            <span
                className={cn(
                    'absolute z-10 left-0 top-n bg-black/60 font-bold',
                    alt ? 'sm:p-xs p-n lg:py-xl  text-96 sm:text-64' : 'px-n py-5xs lg:p-3xs  text-40 lg:text-48',
                )}
            >
                All Ways
            </span>
            <Image
                src={PNG_CARD_CUBES}
                alt={'cubes'}
                className={cn('w-full min-h-full object-cover flex-grow', { ['object-center translate-y-0']: alt })}
            />
            <PageLink
                href={''} // TODO
                icon={'arrow-right-long'}
                className={cn(
                    'absolute flex-row-reverse justify-between px-xxs py-3xs w-full bg-blue',
                    'text-14 lg:text-16',
                    alt ? 'right-n bottom-n h-fit !w-fit' : 'bottom-0',
                )}
                iconClassName={cn('sm:size-[0.884rem] sm:[&_*]size-[0.884rem]  size-[1.25rem] [&_*]:size-[1.25rem]', {
                    ['ml-xl']: alt,
                })}
            >
                Register to attend All Ways 2026
            </PageLink>
        </div>
    );
};
export { AllWaysCard };
