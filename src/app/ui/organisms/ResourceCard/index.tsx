import React, { FC, PropsWithChildren } from 'react';
import Image, { StaticImageData } from 'next/image';
import cn from 'classnames';

import { PageLink } from '@/app/ui/layout';

interface Props extends PropsWithChildren {
    type?: 'default' | 'highlighted' | 'alt';
    icon: StaticImageData;
    title: string;
    action: { title: string; href: string };
    className?: {
        wrapper?: string;
        image?: string;
        content?: string;
        title?: string;
        children?: string;
        link?: string;
    };
}

const ResourceCard: FC<Props> = (props: Props) => {
    const { type, icon, title, action, children, className } = props;

    switch (type) {
        default:
        case 'default':
            return (
                <div
                    className={cn(
                        'grid items-center lg:grid-cols-2',
                        'gap-y-xs md:gap-y-n lg:gap-x-xl',
                        className?.wrapper,
                    )}
                >
                    <Image
                        src={icon}
                        alt={title}
                        className={cn('w-full h-auto', className?.image)}
                    />
                    <span className={cn('contents lg:flex  flex-col gap-y-n', className?.content)}>
                        <span className={'row-start-1  text-section-xl md:text-heading sm:text-section'}>{title}</span>
                        <span className={cn('leading-l', className?.children)}>{children}</span>
                        <PageLink
                            icon={'arrow-right-long'}
                            href={action.href}
                            className={cn('flex-row-reverse p-xxs w-fit bg-blue', className?.link)}
                            iconClassName={'ml-xs [&_*]:size-[1.06rem]'}
                        >
                            {action.title}
                        </PageLink>
                    </span>
                </div>
            );
        case 'highlighted':
            return (
                <div
                    className={cn(
                        'grid items-center from-gray to-[--bg-white-d2]  bg-gradient-to-r sm:bg-gradient-to-b',
                        'lg:justify-items-center lg:grid-cols-[2fr,3fr]',
                        'gap-y-xs md:gap-y-n lg:gap-x-xl',
                        'p-xxs md:x-[px-xxl,p-[2.31rem]] lg:p-[3.25rem]',
                        className?.wrapper,
                    )}
                >
                    <Image
                        src={icon}
                        alt={'microprocessor'}
                        className={cn('w-full h-auto', className?.image)}
                    />
                    <span className={cn('contents lg:flex flex-col gap-y-n h-full', className?.content)}>
                        <span
                            className={cn('block text-section  md:text-heading  lg:text-section-xl', className?.title)}
                        >
                            {title}
                        </span>
                        <span className={cn('block leading-l  lg:w-1/2', className?.children)}>{children}</span>
                        <PageLink
                            icon={'arrow-right-long'}
                            href={action.href}
                            className={cn('flex-row-reverse p-xxs w-fit bg-blue lg:mt-auto', className?.link)}
                            iconClassName={'ml-xs [&_*]:size-[1.06rem]'}
                        >
                            {action.title}
                        </PageLink>
                    </span>
                </div>
            );
        case 'alt':
            return <></>;
    }
};

ResourceCard.displayName = ResourceCard.name;

export { ResourceCard };
