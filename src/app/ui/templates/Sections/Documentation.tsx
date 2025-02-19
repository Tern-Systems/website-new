import React, { FC, ReactElement } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { DocumentationLink } from '@/app/types/layout';

import { PageLink } from '@/app/ui/layout';

import SVG_ARROW from '/public/images/icons/arrow.svg';

interface Props {
    links: DocumentationLink[];
}

const DocumentationCards: FC<Props> = (props: Props) => {
    const { links } = props;

    const Links: ReactElement[] = links.map((link, idx) => (
        <li
            key={link.text + idx}
            className={'content'}
        >
            <PageLink
                href={link.route}
                className={`h-fit w-full flex-col !items-start bg-gray px-xs py-l  sm:py-n`}
            >
                <span className={'block text-heading  font-bold  sm:text-documentation'}>{link.title}</span>
                <span className={'mt-3xl leading-n  sm:text-section-xs'}>{link.text}</span>
                <ReactSVG
                    src={SVG_ARROW.src}
                    className={cn(
                        `rotate-180 [&_path]:fill-blue`,
                        `mt-5xl  [&_*]:size-[1.41rem]`,
                        `sm:mt-3xl sm:[&_*]:size-[1.23rem]`,
                    )}
                />
            </PageLink>
        </li>
    ));

    return <ul className={'mt-[2.88rem] grid grid-cols-2 gap-n  sm:grid-cols-1'}>{Links}</ul>;
};

export { DocumentationCards };
