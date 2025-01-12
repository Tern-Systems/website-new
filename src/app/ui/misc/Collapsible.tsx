import {FC, PropsWithChildren, ReactElement, useState} from "react";
import Image from "next/image";
import cn from "classnames";

import SVG_KEY from "/public/images/icons/key.svg";
import SVG_BOOK from "/public/images/icons/book.svg";
import SVG_BUILDING from "/public/images/icons/building.svg";
import SVG_GEO from "/public/images/icons/geo.svg";
import SVG_BLOCKS from "/public/images/icons/blocks.svg";

import SVG_PLUS from "/public/images/icons/plus.svg";
import SVG_MINUS from "/public/images/icons/minus.svg";
import SVG_CHEVRON from "/public/images/icons/chewron.svg";


type Icon = 'key' | 'book' | 'building' | 'geo' | 'blocks';

const ICON: Record<Icon, string> = {
    key: SVG_KEY,
    book: SVG_BOOK,
    building: SVG_BUILDING,
    geo: SVG_GEO,
    blocks: SVG_BLOCKS,
}


const WRAPPER_CN = `p-[--p-content-l] rounded-small bg-control-gray w-full max-w-[62rem] text-nowrap place-self-center`;


interface Props extends PropsWithChildren {
    title?: string;
    icon?: Icon;
    classNameWrapper?: string;
    classNameTitle?: string;
    classNameIcon?: string;
    className?: string;
    isChevron?: boolean;
    collapsedContent?: ReactElement;
    expandedState?: [boolean] | [boolean, () => void];
}

const Collapsible: FC<Props> = (props: Props) => {
    const {
        isChevron,
        collapsedContent,
        title,
        icon,
        children,
        className,
        classNameWrapper,
        classNameTitle,
        classNameIcon,
        expandedState
    } = props;

    const [isExpanded, setExpandState] = useState<boolean>(expandedState?.[0] ?? true);

    const isExpandedFinal = isExpanded || expandedState?.[0] === true;

    const handleToggle = () => {
        if (expandedState?.[1])
            expandedState[1]();
        else setExpandState(prevState => !prevState);
    }

    const Icon = icon
        ? <Image
            src={ICON[icon]}
            alt={icon}
            className={`inline w-[min(4.3dvw,1.8rem)] h-auto`}/>
        : null;

    const CollapseIcon = isChevron
        ? SVG_CHEVRON
        : isExpandedFinal ? SVG_MINUS : SVG_PLUS

    const collapseCN = isChevron
        ? isExpandedFinal ? 'rotate-180' : ''
        : isExpandedFinal ? '' : 'brightness-[300%]';

    if (collapsedContent) {
        const Content = isExpandedFinal
            ? (
                <div className={className}>
                    {children}
                </div>
            )
            : collapsedContent

        return (
            <div className={`relative ${WRAPPER_CN} ${classNameWrapper}`}>
                <Image
                    src={CollapseIcon}
                    alt={'plus-minus'}
                    onClick={() => handleToggle()}
                    className={cn(collapseCN,
                        `absolute w-[min(3.5dvw,1.8rem)] h-auto top-[--2dr] right-[--2dr]`,
                        `md:hidden lg:hidden`,
                        `sm:landscape:size-[2dvw]`,
                        classNameIcon
                    )}
                />
                {Content}
            </div>
        );
    }

    return (
        <div
            id={title?.toLowerCase().split(' ').join('')}
            className={`${WRAPPER_CN} ${isExpandedFinal ? '' : 'pb-0'} ${classNameWrapper}`}>
            <div
                onClick={() => handleToggle()}
                className={cn(classNameTitle, `flex items-center justify-between cursor-pointer gap-x-[0.2rem]`, {['mb-[min(16dvw,3.75rem)]']: isChevron})}
            >
                <h2 className={`text-inherit font-bold flex gap-[0.65rem] items-center`}>
                    {Icon}
                    <span>{title}</span>
                </h2>
                <Image
                    src={CollapseIcon}
                    alt={'plus-minus'}
                    className={`inline w-[0.9rem] h-auto ${collapseCN} ${classNameIcon}`}
                />
            </div>
            <hr className={cn({['hidden']: isChevron}, `scale-[105%] mt-[min(2.1dvw,1.25rem)] mb-[min(2.6dvw,1.54rem)]
                                sm:landscape:scale-[102%]`)}/>
            <div className={cn(`
                grid grid-cols-[minmax(0,4fr),minmax(0,5fr),minmax(0,1fr)] gap-[min(4dvw,0.56rem)] text-left
                items-start text-[--1drl] whitespace-pre-wrap ${className}`,
                {['hidden']: !isExpandedFinal}
            )}
            >
                {children}
            </div>
        </div>
    )
}

export {Collapsible};
