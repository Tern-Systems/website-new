import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { StaticImageData } from 'next/dist/shared/lib/get-img-props';
import { IconName, IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './fontawesome';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';
import Image from 'next/image';
import styles from '@/app/common.module.css';
import useMounted from '@/app/hooks/useMounted';

type ButtonIcon = IconProp | StaticImageData; // FontAwesome icon or SVG

// Used for rendering both custom SVGs and FontAwesomeIcons
const renderIcon = (
    icon: ButtonIcon | null | undefined,
    className: string | undefined,
    hoverIcon: ButtonIcon | null | undefined,
    hover?: boolean,
): ReactNode | null => {
    const mounted = useMounted();
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
    //else if (typeof iconFinal === 'string')
    //    return <Image src={iconFinal} alt={'icon'} width={50} height={50} className={classNameFinal} />;
    else if (iconFinal && mounted)
        return (
            <FontAwesomeIcon
                icon={['fas', iconFinal as IconName]}
                className={classNameFinal}
            />
        );
};

// Custom Button with icons support (not styled)
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ButtonIcon | null;
    hovered?: { elem?: ReactNode | null; icon?: ButtonIcon | null }; // Hover state elements
    classNameIcon?: string; // Hover / static icon
}

const Button: FC<Props> = (props: Props) => {
    const { children, icon, hovered, className, classNameIcon, ...btnProps } = props;

    const Icon: ReactNode | null = renderIcon(icon, classNameIcon, hovered?.icon);
    const HoverIcon: ReactNode | null = renderIcon(icon, classNameIcon, hovered?.icon, true);

    return (
        <button
            {...btnProps}
            className={cn(
                `group cursor-pointer text-nowrap rounded-full font-sans disabled:cursor-default`,
                className,
                styles.clickable,
                {
                    ['flex items-center justify-center']: Icon ?? HoverIcon,
                    ['gap-x-5xs']: children && (Icon ?? HoverIcon),
                },
            )}
        >
            {Icon}
            {HoverIcon}
            {children ? (
                <>
                    <span className={cn({ ['group-hover:hidden']: hovered?.elem })}>{children}</span>
                    {hovered?.elem ? (
                        <span className={cn({ ['hidden group-hover:inline']: hovered.elem })}>{hovered.elem}</span>
                    ) : null}
                </>
            ) : null}
        </button>
    );
};

export type { ButtonIcon };
export { Button };
