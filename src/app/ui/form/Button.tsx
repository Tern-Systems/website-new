import {ButtonHTMLAttributes, FC, ReactElement, useState} from "react";
import {ReactSVG} from "react-svg";

import styles from '@/app/common.module.css'

import SVG_ARROW from '@/assets/images/icons/arrow.svg';
import SVG_CHECK_FLOWER from '@/assets/images/icons/checkmark-flower.svg';
import SVG_CHECK_SQUARE from '@/assets/images/icons/checkmark-square.svg';
import SVG_CHEVRON from "@/assets/images/icons/chewron.svg";
import SVG_CLOSE from '@/assets/images/icons/close.svg';
import SVG_CLOSE_SQUARE from '@/assets/images/icons/close-square.svg';
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
import SVG_BURGER_MENU from "@/assets/images/icons/burger-menu.svg";


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

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ButtonIcon | null;
    hovered?: { icon?: ButtonIcon | null; text?: string; }
    isIconFlippedY?: boolean;
    classNameIcon?: string;
}

const Button: FC<Props> = (props: Props) => {
    const {children, icon, isIconFlippedY, className, classNameIcon, hovered, ...btnProps} = props;

    const [isHovered, setHoverState] = useState(false);

    const stateIcon: ButtonIcon | null | undefined = hovered?.icon && isHovered ? hovered?.icon : icon;
    const Icon: ReactElement | null = stateIcon
        ? <ReactSVG src={ICON[stateIcon].src}
                    className={`inline [&_*]:w-[1rem] [&_svg]:h-auto ${isIconFlippedY ? 'rotate-180' : ''} ${classNameIcon}`}/>
        : null;

    return (
        <button
            {...btnProps}
            onMouseEnter={(event) => {
                setHoverState(true);
                props.onMouseEnter?.(event);
            }}
            onMouseLeave={(event) => {
                setHoverState(false);
                props.onMouseLeave?.(event);
            }}
            className={`text-nowrap cursor-pointer disabled:cursor-default ${className} ${styles.clickable}
                        ${icon ? 'flex items-center justify-center gap-[0.5rem]' : ''}`}
        >
            {Icon}
            <span hidden={!children}>{isHovered && hovered?.text ? hovered.text : children}</span>
        </button>
    );
}

export {Button}
export type{ButtonIcon}