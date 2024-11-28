import {ButtonHTMLAttributes, FC} from "react";
import Image from "next/image";

import SVG_BACK from '@/assets/images/icons/back.svg';
import SVG_CLOSE from '@/assets/images/icons/close.svg';
import SVG_INFO from '@/assets/images/icons/info.svg';
import SVG_PENCIL from "@/assets/images/icons/pencil.svg";
import SVG_DOWNLOAD from "@/assets/images/icons/download.svg";
import SVG_SHARE from "@/assets/images/icons/share.svg";
import SVG_DELETE from "@/assets/images/icons/delete.svg";
import SVG_DOTS_V from "@/assets/images/icons/dots-v.svg";

type ButtonIcon = 'close' | 'back' | 'info' | 'pencil' | 'download' | 'share' | 'delete' | 'dots';
const ICON: Record<ButtonIcon, string> = {
    back: SVG_BACK,
    close: SVG_CLOSE,
    info: SVG_INFO,
    pencil: SVG_PENCIL,
    download: SVG_DOWNLOAD,
    share: SVG_SHARE,
    delete: SVG_DELETE,
    dots: SVG_DOTS_V
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ButtonIcon;
}

const Button: FC<ButtonProps> = (props: ButtonProps) => {
    const {children, icon, className} = props;

    const Children = children
        ? <span>{props.children}</span>
        : null;

    const Icon = icon
        ? <Image src={ICON[icon]} alt={icon} className={'inline size-[1rem]'}/>
        : null;

    return (
        <button
            {...props}
            className={`${icon ? 'flex items-center gap-[0.52rem]' : ''} text-nowrap ${className}`}
        >
            {Icon}
            {Children}
        </button>);
}

export {Button}
export type{ButtonIcon}