'use client';

import { FC, ReactElement } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { StaticImageData } from 'next/image';
import { ResourceLink } from '@/app/types/layout';

import { PageLink } from '@/app/ui/layout';

interface Props {
    links: ResourceLink[];
    icon: StaticImageData | null;
}

const ResourceCards: FC<Props> = (props: Props) => {
    const { links, icon } = props;

    const Links: ReactElement[] = links.map((link, idx) => (
        <li
            key={link.description + idx}
            className={'content'}
        >
            <PageLink
                href={link.href}
                className={`h-full w-full flex-col !items-start bg-gray px-xs py-l  sm:py-n`}
            >
                <span className={'block text-27  font-bold  sm:text-24'}>{link.title}</span>
                <span className={'mt-3xl sm:mt-l  leading-n  sm:text-14'}>{link.description}</span>
                {icon ? (
                    <ReactSVG
                        src={icon.src}
                        className={cn(`rotate-180 [&_path]:fill-blue`, `mt-5xl  size-xxs`, `sm:mt-l sm:size-3xs`)}
                    />
                ) : null}
            </PageLink>
        </li>
    ));

    return <ul className={'mt-xxl grid grid-cols-2 gap-n  sm:grid-cols-1'}>{Links}</ul>;
};

ResourceCards.displayName = ResourceCards.name;

export { ResourceCards };
