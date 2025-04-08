'use client';

import { ButtonHTMLAttributes, ForwardedRef, forwardRef, ReactNode } from 'react';
import { StaticImageData } from 'next/dist/shared/lib/get-img-props';
import { IconDefinition, IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactSVG } from 'react-svg';
import Image from 'next/image';
import cn from 'classnames';

import styles from '@/app/common.module.css';

export type ButtonIcon = IconProp | StaticImageData | IconDefinition; // FontAwesome icon or SVG

// Used for rendering both custom SVGs and FontAwesomeIcons
const renderIcon = (
    icon: ButtonIcon | null | undefined,
    className: string | undefined,
    hoverIcon: ButtonIcon | null | undefined,
    hover?: boolean,
): ReactNode | null => {
    const iconFinal = hover ? hoverIcon : icon;
    if (!iconFinal) return null;

    const classNameFinal = cn('inline max-w-full max-h-full duration-0', className, {
        [hover ? 'hidden group-hover:inline' : 'group-hover:hidden']: hoverIcon,
    });

    if (typeof iconFinal !== 'string' && 'src' in iconFinal)
        return (
            <ReactSVG
                src={iconFinal.src}
                className={classNameFinal}
            />
        );
    else if (typeof iconFinal === 'string')
        return (
            <Image
                src={iconFinal}
                alt={'icon'}
                width={50}
                height={50}
                className={classNameFinal}
            />
        );
    else if (iconFinal)
        return (
            <FontAwesomeIcon
                icon={iconFinal}
                className={classNameFinal}
            />
        );
};

// Custom Button with icons support (not styled)
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ButtonIcon | null;
    hover?: {
        elem?: ReactNode | null;
        icon?: ButtonIcon | null;
        text?: string;
        className?: string;
    }; // Hover state elements
    classNameIcon?: string; // Hover / static icon
    className?: string;
}

const ButtonComponent = (props: Props, ref: ForwardedRef<HTMLButtonElement>) => {
    const { children, icon, hover, className, classNameIcon, ...btnProps } = props;

    const Icon: ReactNode | null = renderIcon(icon, classNameIcon, hover?.icon, false);
    const HoverIcon: ReactNode | null = renderIcon(icon, classNameIcon, hover?.icon, true);

    return (
        <button
            ref={ref}
            {...btnProps}
            className={cn(`group cursor-pointer text-nowrap  disabled:cursor-default`, className, styles.clickable, {
                ['flex items-center justify-center']: Icon ?? HoverIcon,
                ['gap-x-5xs']: children && (Icon ?? HoverIcon),
            })}
        >
            {Icon && <span className={cn(classNameIcon)}>{Icon}</span>}
            {HoverIcon && <span className={cn(classNameIcon)}>{HoverIcon}</span>}
            {children ? (
                <>
                    <span className={cn({ ['group-hover:hidden']: hover?.elem })}>{children}</span>
                    {hover?.elem ? (
                        <span className={cn({ ['hidden group-hover:inline']: hover.elem })}>{hover.elem}</span>
                    ) : null}
                </>
            ) : null}
        </button>
    );
};

ButtonComponent.displayName = 'Button';

export const Button = forwardRef(ButtonComponent);
