import React, { FC, ReactElement } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { ResourceSection } from '@/app/types/layout';
import { Breakpoint } from '@/app/hooks/useBreakpointCheck';

import { useNavigate } from '@/app/hooks';
import { useBreakpointCheck } from '@/app/hooks';
import { useModal } from '@/app/context';

import styles from '@/app/common.module.css';

import SVG_ARROW_LONG from '/public/images/icons/arrow-right-long.svg';

interface Props {
    className?: string;
    data: ResourceSection[];
}

const ResourcesSection: FC<Props> = (props: Props) => {
    const { data, className } = props;

    const breakpoint = useBreakpointCheck();
    const modalCtx = useModal();
    const [navigate] = useNavigate();

    // Elements
    const ResourcesLi: ReactElement[] = data.map((entry, idx) => (
        <li
            key={'node-' + idx}
            onClick={() => entry.action?.({ isSm: breakpoint <= Breakpoint.sm, navigate, modalCtx })}
            className={cn(
                styles.clickable,
                `flex cursor-pointer items-center justify-between border-b-s border-white-d0`,
            )}
        >
            {entry.Node}
            <ReactSVG
                src={SVG_ARROW_LONG.src}
                className={'[&_*]:w-[1.41rem] [&_path]:fill-blue'}
            />
        </li>
    ));

    return (
        <section className={cn(styles.content, className, 'text-section-xs')}>
            <p className={'pl-n font-bold'}>Additional resources</p>
            <ul className={'mt-xxs border-t-s border-white-d0  [&>li]:x-[px-n,py-xs,text-blue]'}>{ResourcesLi}</ul>
        </section>
    );
};

export { ResourcesSection };
