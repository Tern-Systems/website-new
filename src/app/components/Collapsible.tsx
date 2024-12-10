import {FC, PropsWithChildren, useState} from "react";
import Image from "next/image";

import SVG_KEY from "@/assets/images/icons/key.svg";
import SVG_BOOK from "@/assets/images/icons/book.svg";
import SVG_BUILDING from "@/assets/images/icons/building.svg";
import SVG_GEO from "@/assets/images/icons/geo.svg";
import SVG_BLOCKS from "@/assets/images/icons/blocks.svg";

import SVG_PLUS from "@/assets/images/icons/plus.svg";
import SVG_MINUS from "@/assets/images/icons/minus.svg";


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
}

const Collapsible: FC<Props> = (props: Props) => {
    const {title, icon, children} = props;

    const [isCollapsed, setCollapsedState] = useState(false);

    const Icon = icon
        ? <Image
            src={ICON[icon]}
            alt={icon}
            className={`inline size-[1.8125rem]`}/>
        : null;

    return (
        <div
            className={`p-[--py] rounded-[0.5625rem] bg-control text-primary w-full max-w-[62.5rem] min-w-[62.5rem]
                        place-self-center ${isCollapsed ? 'pb-0' : ''}`}>
            <div className={`flex items-center justify-between`}>
                <h2 className={'text-inherit font-neo text-[1.6875rem] font-bold flex gap-[0.66rem] items-center'}>
                    {Icon}
                    <span>{title}</span>
                </h2>
                <Image
                    src={isCollapsed ? SVG_PLUS : SVG_MINUS}
                    alt={'plus-minus'}
                    className={`inline size-[1.8125rem] cursor-pointer ${isCollapsed ? 'brightness-[300%]' : ''}`}
                    onClick={() => setCollapsedState(prevState => !prevState)}
                />
            </div>
            <hr className={'scale-[105%] mt-[1.25rem] mb-[1.54rem]'}/>
            <div className={`grid grid-cols-[1fr,1fr,max-content] text-left items-center ${isCollapsed ? 'hidden' : ''}`}>
                {children}
            </div>
        </div>
    )
}

export {Collapsible}