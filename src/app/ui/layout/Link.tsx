import {AnchorHTMLAttributes, FC, MouseEvent, ReactElement} from "react";
import {ReactSVG} from "react-svg";
import {usePathname} from "next/navigation";
import Link from "next/link";

import {MERGED_SUB_NAV_ROUTES, Route} from "@/app/static";

import {getRouteName} from "@/app/utils";
import {useNavigate} from "@/app/hooks";

import SVG_ARROW from "/public/images/icons/arrow.svg";
import SVG_INSIGNIA from "/public/images/insignia.svg";

import styles from '@/app/common.module.css'
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
    timeout?: number;
}

const PageLink: FC<Props> = (props: Props) => {
    const {icon, iconClassName, children, href, isExternal, prevent, preventModalClose, timeout, ...linkProps} = props;

    const route = usePathname();
    const [navigate] = useNavigate(preventModalClose, timeout === 0);

    const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
        linkProps.onClick?.(event);
        if (prevent || isExternal)
            return;

        const handleNavigation = () => navigate(href as Route ?? Route.Home);
        if (timeout)
            return setTimeout(() => handleNavigation(), timeout);
        handleNavigation();
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
        : <span>{getRouteName(props.href, MERGED_SUB_NAV_ROUTES.includes(props.href ?? ''))}</span>;

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