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
                    alt
                        ? 'sm:p-xs p-n lg:py-xl  text-heading-4xl sm:text-heading-3xl'
                        : 'px-n py-5xs lg:p-3xs  text-heading-xl lg:text-heading-xxl',
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
                    'text-section-xs lg:text-basic',
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

AllWaysCard.displayName = AllWaysCard.name;
export { AllWaysCard };
