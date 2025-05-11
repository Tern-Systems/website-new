'use client';

import React, { FC, PropsWithChildren, ReactElement } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { ResourceSectionData } from '@/app/types/layout';
import { Breakpoint } from '@/app/static';

import { useNavigate } from '@/app/hooks';
import { useBreakpointCheck } from '@/app/hooks';
import { useModal } from '@/app/hooks';

import styles from '@/app/common.module.css';

import SVG_ARROW_LONG from '@/assets/images/icons/arrow-right-long.svg';
import { Section } from '@/app/ui/atoms';
import { PageLink } from '../../layout';

interface Props extends PropsWithChildren {
    className?: string;
    data: ResourceSectionData[];
}

const ResourcesSection: FC<Props> = (props: Props) => {
    const { data, children, className } = props;

    const breakpoint = useBreakpointCheck();
    const modalCtx = useModal();
    const [navigate] = useNavigate();

    // Elements
    const ResourcesLi: ReactElement[] = data.map((entry, idx) => {
        const handleClick = (e: React.MouseEvent) => {
            e.stopPropagation();

            if (entry.action) {
                entry.action({ sm: breakpoint <= Breakpoint.sm, navigate, modalCtx });
                return;
            }

            if (React.isValidElement(entry.Node) && entry.Node.type === PageLink && entry.Node.props.href) {
                navigate(entry.Node.props.href);
            }
        };

        return (
            <li
                key={'node-' + idx}
                onClick={handleClick}
                className={cn(
                    styles.clickable,
                    'flex w-full cursor-pointer items-center justify-between border-b-s border-white-d0 px-n py-xs',
                )}
            >
                <div className='pointer-events-none'>{entry.Node}</div>
                <ReactSVG
                    src={SVG_ARROW_LONG.src}
                    className='w-xxs [&_path]:fill-blue pointer-events-none'
                />
            </li>
        );
    });

    return (
        <Section className={{ content: cn('text-14', className) }}>
            <p className={'pl-n font-bold'}>{children ?? 'Additional resources'}</p>
            <ul className={'mt-xxs border-t-s border-white-d0  [&>li]:x-[px-n,py-xs,text-blue]'}>{ResourcesLi}</ul>
        </Section>
    );
};

ResourcesSection.displayName = ResourcesSection.name;

export { ResourcesSection };
