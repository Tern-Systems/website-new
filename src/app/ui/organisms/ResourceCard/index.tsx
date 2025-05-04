'use client';

import { FC, PropsWithChildren, ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image, { StaticImageData } from 'next/image';
import cn from 'classnames';

import { PageLink } from '@/app/ui/layout';

import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { H3 } from '@/app/ui/atoms';

interface Props extends PropsWithChildren {
    type?: 'default' | 'highlighted' | 'alt';
    icon: StaticImageData;
    title: string;
    action?: { title: string; href: string };
    bullets?: string[];
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
    const { type, icon, title, action, bullets, children, className } = props;

    const Points: ReactElement[] | undefined = bullets?.map((string, idx) => (
        <li
            key={string + idx}
            className='flex flex-row items-center mb-4'
        >
            <FontAwesomeIcon
                icon={faCheckCircle}
                className='w-3xs [&_path]:fill-blue mr-4'
            />
            {string}
        </li>
    ));

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
                    <div className={'contents'}>
                        <Image
                            src={icon}
                            alt={title}
                            className={cn('w-full h-auto', className?.image)}
                        />
                    </div>
                    <div className={cn('contents lg:flex  flex-col gap-y-n', className?.content)}>
                        <H3 className={'row-start-1  text-24 md:text-27 lg:text-32'}>{title}</H3>
                        <p className={cn('!leading-l', className?.children)}>{children}</p>
                        {Points ? <ul>{Points}</ul> : null}
                        {action ? (
                            <PageLink
                                icon={'arrow-right-long'}
                                href={action.href}
                                className={cn('flex-row-reverse p-xxs w-fit bg-blue', className?.link)}
                                iconClassName={'ml-xs size-5xs'}
                            >
                                {action.title}
                            </PageLink>
                        ) : null}
                    </div>
                </div>
            );
        case 'highlighted':
            return (
                <div
                    className={cn(
                        'grid items-center  from-gray to-[--bg-white-d2] bg-gradient-to-r sm:bg-gradient-to-b',
                        'grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr,3fr]',
                        'gap-y-xs md:gap-x-n lg:gap-x-xl',
                        'p-xxs md:x-[px-xxl,p-xl] lg:p-xxl',
                        className?.wrapper,
                    )}
                >
                    <Image
                        src={icon}
                        alt={'microprocessor'}
                        className={cn('w-full h-auto', className?.image)}
                    />
                    <span className={cn('sm:contents flex flex-col justify-between h-full', className?.content)}>
                        <span>
                            <span className={cn('block text-black  text-20 md:text-27 lg:text-32', className?.title)}>
                                {title}
                            </span>
                            <span
                                className={cn(
                                    'block text-black leading-l',
                                    'mt-xs md:mt-xxl lg:mt-xxl',
                                    className?.children,
                                )}
                            >
                                {children}
                            </span>
                        </span>
                        {action ? (
                            <PageLink
                                icon={'arrow-right-long'}
                                href={action.href}
                                className={cn('flex-row-reverse p-xxs w-fit bg-blue lg:mt-auto', className?.link)}
                                iconClassName={'ml-xs size-5xs'}
                            >
                                {action.title}
                            </PageLink>
                        ) : null}
                    </span>
                </div>
            );
        case 'alt':
            return <></>;
    }
};

ResourceCard.displayName = ResourceCard.name;

export type { Props as ResourceCardProps };
export { ResourceCard };
