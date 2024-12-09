import {ButtonHTMLAttributes, FC} from "react";
import Image from "next/image";

import SVG_BACK from '@/assets/images/icons/back.svg';
import SVG_CHEVRON from "@/assets/images/icons/select-chewron.svg";
import SVG_CLOSE from '@/assets/images/icons/close.svg';
import SVG_DELETE from "@/assets/images/icons/delete.svg";
import SVG_DOTS_V from "@/assets/images/icons/dots-v.svg";
import SVG_DOWNLOAD from "@/assets/images/icons/download.svg";
import SVG_EDIT from '@/assets/images/icons/edit-line.svg';
import SVG_INFO from '@/assets/images/icons/info.svg';
import SVG_PENCIL from "@/assets/images/icons/pencil.svg";
import SVG_PLUS from '@/assets/images/icons/plus.svg';
import SVG_SHARE from "@/assets/images/icons/share.svg";

type ButtonIcon =
    | 'close'
    | 'back'
    | 'info'
    | 'pencil'
    | 'download'
    | 'share'
    | 'delete'
    | 'dots'
    | 'chevron'
    | 'plus'
    | 'edit';

const ICON: Record<ButtonIcon, string> = {
    edit: SVG_EDIT,
    back: SVG_BACK,
    chevron: SVG_CHEVRON,
    close: SVG_CLOSE,
    delete: SVG_DELETE,
    dots: SVG_DOTS_V,
    download: SVG_DOWNLOAD,
    info: SVG_INFO,
    pencil: SVG_PENCIL,
    plus: SVG_PLUS,
    share: SVG_SHARE,
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ButtonIcon;
    isIconFlippedY?: boolean;
}

const Button: FC<ButtonProps> = (props: ButtonProps) => {
    const {children, icon, isIconFlippedY, className} = props;

    const Icon = icon
        ? <Image
            src={ICON[icon]}
            alt={icon}
            className={`inline size-[1rem] ${isIconFlippedY ? 'rotate-180' : ''}`}/>
        : null;

    return (
        <button
            {...props}
            className={`${icon ? 'flex items-center justify-center gap-[0.52rem]' : ''} text-nowrap ${className}`}
        >
            {Icon}
            <span hidden={!children}>{children}</span>
        </button>);
}

export {Button}
export type{ButtonIcon}