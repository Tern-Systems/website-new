'use client';

import { FC, ReactElement } from 'react';
import { StaticImageData } from 'next/image';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { ResourceLink } from '@/app/types/layout';

import { PageLink } from '@/app/ui/layout';

import styles from '@/app/common.module.css';

interface Props {
    highlighted?: true;
    links: ResourceLink[];
    icon?: StaticImageData | null;
}

const ResourceCards: FC<Props> = (props: Props) => {
    const { links, icon, highlighted } = props;

    const Links: ReactElement[] = links.map((link, idx) => (
        <li
            key={link.title + idx}
            className={'contents'}
        >
            <PageLink
                href={link?.href ?? ''}
                prevent={!link?.href}
                className={`size-full flex flex-col !items-start bg-gray px-xs  sm:py-n py-l`}
            >
                <span className={cn('block text-27  sm:text-24', { ['font-bold']: link.href })}>{link.title}</span>
                <span className={'mt-3xl sm:mt-l  leading-n  sm:text-14'}>{link.description}</span>
                {icon || link?.icon ? (
                    <ReactSVG
                        src={link?.icon?.src ?? icon?.src ?? ''}
                        className={cn(
                            `[&_path]:fill-blue z-10  sm:size-3xs size-xxs`,
                            link.icon ? 'sm:mb-xxl mb-l' : 'sm:mt-l mt-5xl',
                            { ['-order-1']: link.icon },
                        )}
                    />
                ) : null}
            </PageLink>
        </li>
    ));

    return (
        <ul className={cn('mt-xxl grid grid-cols-2 gap-n  sm:grid-cols-1', { [styles.contentHighlight]: highlighted })}>
            {Links}
        </ul>
    );
};

ResourceCards.displayName = ResourceCards.name;

export { ResourceCards };
