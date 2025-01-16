import {ButtonHTMLAttributes, FC, ReactElement} from "react";
import {ReactSVG} from "react-svg";
import cn from "classnames";

import styles from '@/app/common.module.css'


import SVG_ARROW from '/public/images/icons/arrow.svg';
import SVG_BURGER_MENU from "/public/images/icons/burger-menu.svg";
import SVG_CHECK_FLOWER from '/public/images/icons/checkmark-flower.svg';
import SVG_CHECK_SQUARE from '/public/images/icons/checkmark-square.svg';
import SVG_CHEVRON from "/public/images/icons/chewron.svg";
import SVG_CLOSE from '/public/images/icons/close.svg';
import SVG_CLOSE_SQUARE from '/public/images/icons/close-square.svg';
import SVG_DELETE from "/public/images/icons/delete.svg";
import SVG_DELETE_SQUARE from "/public/images/icons/delete-square.svg";
import SVG_DIAMOND from "/public/images/icons/diamond.svg";
import SVG_DOTS_V from "/public/images/icons/dots-v.svg";
import SVG_DOWNLOAD from "/public/images/icons/download.svg";
import SVG_EDIT from '/public/images/icons/edit-line.svg';
import SVG_FILE from "/public/images/icons/file.svg";
import SVG_GLASS from "/public/images/icons/glass.svg";
import SVG_LABEL from "/public/images/icons/label.svg";
import SVG_LOCK from "/public/images/icons/lock.svg";
import SVG_NOTEPAD from "/public/images/icons/notepad.svg";
import SVG_PENCIL from "/public/images/icons/pencil.svg";
import SVG_PLUS from '/public/images/icons/plus.svg';
import SVG_PLUS_FLOWER from '/public/images/icons/plus-flower.svg';
import SVG_PLUS_SQUARE from '/public/images/icons/plus-square.svg';
import SVG_SHARE from "/public/images/icons/share.svg";
import SVG_UPLOAD from "/public/images/icons/upload.svg";
import SVG_WARN from "/public/images/icons/warn.svg";


type ButtonIcon =
    | 'arrow'
    | 'burger'
    | 'chevron'
    | 'close'
    | 'close-square'
    | 'delete'
    | 'delete-square'
    | 'diamond'
    | 'dots'
    | 'download'
    | 'edit'
    | 'file'
    | 'glass'
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
    | 'upload'
    | 'warn';

const ICON: Record<ButtonIcon, { src: string }> = {
    arrow: SVG_ARROW,
    burger: SVG_BURGER_MENU,
    chevron: SVG_CHEVRON,
    close: SVG_CLOSE,
    'close-square': SVG_CLOSE_SQUARE,
    diamond: SVG_DIAMOND,
    'mark-square': SVG_CHECK_SQUARE,
    'mark-flower': SVG_CHECK_FLOWER,
    delete: SVG_DELETE,
    'delete-square': SVG_DELETE_SQUARE,
    dots: SVG_DOTS_V,
    download: SVG_DOWNLOAD,
    edit: SVG_EDIT,
    file: SVG_FILE,
    glass: SVG_GLASS,
    label: SVG_LABEL,
    lock: SVG_LOCK,
    notepad: SVG_NOTEPAD,
    pencil: SVG_PENCIL,
    plus: SVG_PLUS,
    'plus-flower': SVG_PLUS_FLOWER,
    'plus-square': SVG_PLUS_SQUARE,
    share: SVG_SHARE,
    upload: SVG_UPLOAD,
    warn: SVG_WARN,
}


interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ButtonIcon | null;
    hovered?: { icon?: ButtonIcon | null, text?: string, className?: string };
    isIconFlippedY?: boolean;
    classNameIcon?: string;
}

const Button: FC<Props> = (props: Props) => {
    const {children, icon, isIconFlippedY, className, classNameIcon, hovered, ...btnProps} = props;

    const iconClassName = cn(`inline [&_*]:size-[1rem] mr-[--p-content-5xs]`, {['rotate-180']: isIconFlippedY}, classNameIcon);
    const Icon: ReactElement | null = (
        <>
            {icon
                ? (
                    <ReactSVG
                        src={ICON[icon].src}
                        className={cn(iconClassName, {['group-hover:hidden']: hovered?.icon})}
                    />
                )
                : null
            }
            {hovered?.icon
                ? (
                    <ReactSVG
                        src={ICON[hovered.icon].src}
                        className={cn(iconClassName, 'hidden group-hover:inline', hovered.className)}
                    />
                )
                : null
            }
        </>
    );

    return (
        <button
            {...btnProps}
            className={cn(
                `text-nowrap cursor-pointer  disabled:cursor-default group`,
                className, styles.clickable,
                {['flex items-center justify-center']: icon ?? hovered?.icon}
            )}
        >
            {Icon}
            <span hidden={!children} className={cn({['hover:hidden']: hovered?.text})}>{children}</span>
            <span hidden={!children} className={cn({['hidden hover:inline']: hovered?.text})}>{hovered?.text}</span>
        </button>
    );
}

export {Button}
export type{ButtonIcon}