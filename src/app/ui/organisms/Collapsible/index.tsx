'use client';

import { FC, PropsWithChildren, ReactElement, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import SVG_KEY from '@/assets/images/icons/key.svg';
import SVG_BOOK from '@/assets/images/icons/book.svg';
import SVG_BUILDING from '@/assets/images/icons/building.svg';
import SVG_GEO from '@/assets/images/icons/geo.svg';
import SVG_BLOCKS from '@/assets/images/icons/blocks.svg';

import SVG_PLUS from '@/assets/images/icons/plus.svg';
import SVG_MINUS from '@/assets/images/icons/minus.svg';
import SVG_CHEVRON from '@/assets/images/icons/chevron.svg';
import { getId } from '@/app/utils';

type Icon = 'key' | 'book' | 'building' | 'geo' | 'blocks';
export type { Icon };

const ICON: Record<Icon, string> = {
    key: SVG_KEY,
    book: SVG_BOOK,
    building: SVG_BUILDING,
    geo: SVG_GEO,
    blocks: SVG_BLOCKS,
};

const WRAPPER_CN = `p-l bg-gray w-full max-w-[62rem] text-nowrap place-self-center  sm:p-xxs md:p-s`;

interface Props extends PropsWithChildren {
    title?: string | ReactElement;
    icon?: Icon;
    wrapper?: string;
    classNameTitle?: string;
    classNameTitleIcon?: string;
    classNameIcon?: string;
    classNameHr?: string;
    className?: string;
    chevron?: boolean;
    collapsedContent?: ReactElement;
    expandedInit?: [boolean] | [boolean, () => void];
}

const Collapsible: FC<Props> = (props: Props) => {
    const {
        chevron,
        collapsedContent,
        title,
        icon,
        children,
        className,
        wrapper,
        classNameTitle,
        classNameTitleIcon,
        classNameIcon,
        classNameHr,
        expandedInit,
        ...propsDiv
    } = props;

    const [expanded, setExpand] = useState<boolean>(expandedInit?.[0] ?? true);

    const expandedFinal = expanded || expandedInit?.[0] === true;
    const titleFinal = typeof title === 'string' ? getId(title ?? '') : title;

    const handleToggle = () => {
        if (expandedInit?.[1]) expandedInit[1]();
        else setExpand((prevState) => !prevState);
        if (!expandedFinal) {
            setTimeout(
                () => document.querySelector('#' + titleFinal)?.scrollIntoView({ behavior: 'smooth', block: 'end' }),
                0,
            );
        }
    };

    const Icon = icon ? (
        <Image
            src={ICON[icon]}
            alt={icon}
            className={`inline h-auto w-[min(4.3dvw,1.8rem)] ${classNameTitleIcon}`}
        />
    ) : null;

    const CollapseIcon = chevron ? SVG_CHEVRON : expandedFinal ? SVG_MINUS : SVG_PLUS;

    const collapseCN = chevron ? (expandedFinal ? 'rotate-180' : '') : expandedFinal ? '' : 'brightness-[300%]';

    const id = { ...(typeof titleFinal === 'string' ? { id: titleFinal } : {}) };

    if (collapsedContent) {
        const Content = expandedFinal ? <div className={className}>{children}</div> : collapsedContent;

        return (
            <div
                {...propsDiv}
                {...id}
                className={cn(`relative`, { ['lg:h-full [&]:h-fit']: !expanded }, WRAPPER_CN, wrapper)}
            >
                <Image
                    src={CollapseIcon}
                    alt={'plus-minus'}
                    onClick={() => handleToggle()}
                    className={cn(
                        collapseCN,
                        `absolute right-l top-l h-auto w-n cursor-pointer`,
                        `lg:hidden`,
                        `sm:landscape:size-[2dvw]`,
                        classNameIcon,
                    )}
                />
                {Content}
            </div>
        );
    }

    return (
        <div
            {...propsDiv}
            {...id}
            className={cn(WRAPPER_CN, { ['pb-0']: !expandedFinal }, wrapper)}
        >
            <div
                onClick={() => handleToggle()}
                className={cn(
                    classNameTitle,
                    `flex cursor-pointer items-center justify-between gap-x-6xs text-27 sm:text-18`,
                    { ['mb-[min(16dvw,3.75rem)]']: chevron },
                )}
            >
                <h2 className={`flex items-center gap-4xs font-bold leading-none text-inherit`}>
                    {typeof title === 'string' ? (
                        <>
                            {Icon}
                            <span>{title}</span>
                        </>
                    ) : (
                        title
                    )}
                </h2>
                <Image
                    src={CollapseIcon}
                    alt={'plus-minus'}
                    className={cn(`inline-block size-6xs cursor-pointer`, collapseCN, classNameIcon)}
                />
            </div>
            <hr
                className={cn(`mb-[min(2.6dvw,1.54rem)] mt-[min(2.1dvw,1.25rem)] [&]:scale-[102%]`, classNameHr, {
                    ['hidden']: chevron,
                })}
            />
            <div
                className={cn(
                    `grid grid-cols-[minmax(0,4fr),minmax(0,5fr),minmax(0,1fr)] items-start gap-[min(4dvw,0.56rem)] whitespace-pre-wrap text-left text-16`,
                    className,
                    { ['!hidden']: !expandedFinal },
                )}
            >
                {children}
            </div>
        </div>
    );
};

Collapsible.displayName = Collapsible.name;

export { Collapsible };
