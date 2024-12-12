import {ButtonHTMLAttributes, FC} from "react";
import Image from "next/image";

import SVG_BACK from '@/assets/images/icons/back.svg';
import SVG_CHECK_FLOWER from '@/assets/images/icons/checkmark-flower.svg';
import SVG_CHECK_SQUARE from '@/assets/images/icons/checkmark-square.svg';
import SVG_CHEVRON from "@/assets/images/icons/select-chewron.svg";
import SVG_CLOSE from '@/assets/images/icons/close.svg';
import SVG_DELETE from "@/assets/images/icons/delete.svg";
import SVG_DELETE_SQUARE from "@/assets/images/icons/delete-square.svg";
import SVG_DIAMOND from "@/assets/images/icons/diamond.svg";
import SVG_DOTS_V from "@/assets/images/icons/dots-v.svg";
import SVG_DOWNLOAD from "@/assets/images/icons/download.svg";
import SVG_EDIT from '@/assets/images/icons/edit-line.svg';
import SVG_GLASS from "@/assets/images/icons/glass.svg";
import SVG_INFO from '@/assets/images/icons/info.svg';
import SVG_LABEL from "@/assets/images/icons/label.svg";
import SVG_LOCK from "@/assets/images/icons/lock.svg";
import SVG_NOTEPAD from "@/assets/images/icons/notepad.svg";
import SVG_PENCIL from "@/assets/images/icons/pencil.svg";
import SVG_PLUS from '@/assets/images/icons/plus.svg';
import SVG_PLUS_FLOWER from '@/assets/images/icons/plus-flower.svg';
import SVG_PLUS_SQUARE from '@/assets/images/icons/plus-square.svg';
import SVG_SHARE from "@/assets/images/icons/share.svg";
import SVG_WARN from "@/assets/images/icons/warn.svg";

type ButtonIcon =
    | 'back'
    | 'chevron'
    | 'close'
    | 'delete'
    | 'delete-square'
    | 'diamond'
    | 'dots'
    | 'download'
    | 'edit'
    | 'glass'
    | 'info'
    | 'label'
    | 'lock'
    | 'mark-flower'
    | 'mark-square'
    | 'notepad'
    | 'pencil'
    | 'plus'
    | 'plus-flower'
    | 'plus-square'
    | 'share'
    | 'warn';

const ICON: Record<ButtonIcon, string> = {
    back: SVG_BACK,
    chevron: SVG_CHEVRON,
    close: SVG_CLOSE,
    diamond: SVG_DIAMOND,
    'mark-square': SVG_CHECK_SQUARE,
    'mark-flower': SVG_CHECK_FLOWER,
    delete: SVG_DELETE,
    'delete-square': SVG_DELETE_SQUARE,
    dots: SVG_DOTS_V,
    download: SVG_DOWNLOAD,
    edit: SVG_EDIT,
    glass: SVG_GLASS,
    info: SVG_INFO,
    label: SVG_LABEL,
    lock: SVG_LOCK,
    notepad: SVG_NOTEPAD,
    pencil: SVG_PENCIL,
    plus: SVG_PLUS,
    'plus-flower': SVG_PLUS_FLOWER,
    'plus-square': SVG_PLUS_SQUARE,
    share: SVG_SHARE,
    warn: SVG_WARN,
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
            className={`text-nowrap cursor-pointer disabled:cursor-default ${className}
                        ${icon ? 'flex items-center justify-center gap-[0.52rem]' : ''}`}
        >
            {Icon}
            <span hidden={!children}>{children}</span>
        </button>);
}

export {Button}
export type{ButtonIcon}