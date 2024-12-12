import {FC, PropsWithChildren, useState} from "react";
import Image from "next/image";

import SVG_KEY from "@/assets/images/icons/key.svg";
import SVG_BOOK from "@/assets/images/icons/book.svg";
import SVG_BUILDING from "@/assets/images/icons/building.svg";
import SVG_GEO from "@/assets/images/icons/geo.svg";
import SVG_BLOCKS from "@/assets/images/icons/blocks.svg";

import SVG_PLUS from "@/assets/images/icons/plus.svg";
import SVG_MINUS from "@/assets/images/icons/minus.svg";
import SVG_CHEVRON from "@/assets/images/icons/chewron.svg";


type Icon = 'key' | 'book' | 'building' | 'geo' | 'blocks';

const ICON: Record<Icon, string> = {
    key: SVG_KEY,
    book: SVG_BOOK,
    building: SVG_BUILDING,
    geo: SVG_GEO,
    blocks: SVG_BLOCKS,
}

interface Props extends PropsWithChildren {
    title: string;
    icon?: Icon;
    className?: string;
    isChevron?: boolean;
    expandedState?: [boolean, () => void];
}

const Collapsible: FC<Props> = (props: Props) => {
    const {isChevron, title, icon, children, className, expandedState} = props;

    const [isExpanded, setExpandState] = useState<boolean>(true);

    const isExpandedFinal = isExpanded && expandedState?.[0];

    const handleToggle = () => {
        if (expandedState)
            expandedState[1]();
        else
            setExpandState(prevState => !prevState);
    }

    const Icon = icon
        ? <Image
            src={ICON[icon]}
            alt={icon}
            className={`inline size-[1.8125rem]`}/>
        : null;

    const CollapseIcon = isChevron
        ? SVG_CHEVRON
        : isExpandedFinal ? SVG_MINUS : SVG_PLUS

    const collapseCN = isChevron
        ? isExpandedFinal ? 'rotate-180' : ''
        : isExpandedFinal ? '' : 'brightness-[300%]';

    return (
        <div
            id={title.toLowerCase().split(' ').join('')}
            className={`p-[--py] rounded-[0.5625rem] bg-control text-primary w-full max-w-[62.5rem] min-w-[62.5rem]
                        place-self-center ${isExpandedFinal ? '' : 'pb-0'}`}>
            <div
                onClick={() => handleToggle()}
                className={`flex items-center justify-between cursor-pointer ${isChevron ? 'mb-[3.75rem]' : ''}`}
            >
                <h2 className={'text-inherit font-neo text-[1.6875rem] font-bold flex gap-[0.66rem] items-center'}>
                    {Icon}
                    <span>{title}</span>
                </h2>
                <Image
                    src={CollapseIcon}
                    alt={'plus-minus'}
                    className={`inline size-[1.8125rem] ${collapseCN}`} // brightness for the dark Plus svg
                />
            </div>
            <hr className={`scale-[105%] mt-[1.25rem] mb-[1.54rem] ${isChevron ? 'hidden' : ''}`}/>
            <div className={`grid grid-cols-[1fr,1fr,max-content] gap-y-[0.56rem] text-left items-start ${className}
                            ${isExpandedFinal ? '' : 'hidden'}`}>
                {children}
            </div>
        </div>
    )
}

export {Collapsible}