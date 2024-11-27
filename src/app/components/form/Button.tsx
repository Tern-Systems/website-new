import {ButtonHTMLAttributes, FC} from "react";
import Image from "next/image";

import SVG_BACK from '@/assets/images/icons/back.svg';
import SVG_CLOSE from '@/assets/images/icons/close.svg';
import SVG_INFO from '@/assets/images/icons/info.svg';

type Icon = 'close' | 'back' | 'info';
const ICON: Record<Icon, string> = {
    back: SVG_BACK,
    close: SVG_CLOSE,
    info: SVG_INFO
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: Icon;
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