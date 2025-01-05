import {AnchorHTMLAttributes, FC, MouseEvent, ReactElement} from "react";
import {ReactSVG} from "react-svg";
import {usePathname} from "next/navigation";
import Link from "next/link";

import {Route} from "@/app/static";

import {getRouteName} from "@/app/utils";
import {useNavigate} from "@/app/hooks";

import SVG_ARROW from "@/assets/images/icons/arrow.svg";
import SVG_INSIGNIA from "@/assets/images/insignia.svg";

import styles from '@/app/common.module.css'
import {getRouteLeave} from "@/app/utils/router";
import cn from "classnames";


type Icon = 'back' | 'forward' | 'insignia';

const ICON: Record<Icon, { src: string }> = {
    back: SVG_ARROW,
    forward: SVG_ARROW,
    insignia: SVG_INSIGNIA,
}


interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
    icon?: Icon;
    iconClassName?: string;
    isExternal?: boolean;
    prevent?: boolean;
    preventModalClose?: boolean;
}

const PageLink: FC<Props> = (props: Props) => {
    const {icon, iconClassName, children, href, isExternal, prevent, preventModalClose, ...linkProps} = props;

    const route = usePathname();
    const [navigate] = useNavigate(preventModalClose);

    const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
        linkProps.onClick?.(event);
        if (prevent || isExternal)
            return;
        navigate(href as Route ?? Route.Home);
    }

    const Icon: ReactElement | null = icon
        ? (
            <ReactSVG src={ICON[icon].src}
                      className={cn(
                          `inline size-[1rem]`,
                          {['rotate-180']: icon === 'forward'},
                          iconClassName
                      )}
            />
        )
        : null;

    const splitHref = children
        ? children
        : <span>{props.href === Route.TernKey ? getRouteLeave(props.href).slice(1) : getRouteName(props.href)}</span>;

    return (
        <Link
            {...linkProps}
            className={`items-center inline-flex ${styles.clickable} ${linkProps.className}`}
            href={(isExternal ? href : route) ?? '/'}
            onClick={handleLinkClick}
            {...(isExternal ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
        >
            {Icon} {splitHref}
        </Link>
    );
}
export {PageLink};