'use client';

import { AnchorHTMLAttributes, FC, MouseEvent, ReactElement } from 'react';
import { usePathname } from 'next/navigation';
import { ReactSVG } from 'react-svg';
import Link from 'next/link';
import cn from 'classnames';

import { Route, SPECIAL_NAV_ROUTES } from '@/app/static';

import { getIdName } from '@/app/utils';
import { useNavigate } from '@/app/hooks';

import SVG_ARROW from '@/assets/images/icons/arrow.svg';
import SVG_CALENDAR from '@/assets/images/icons/calendar.svg';
import SVG_ARROW_LONG from '@/assets/images/icons/arrow-right-long.svg';
import SVG_INSIGNIA from '@/assets/images/tidal-logo.svg';
import SVG_PLUS from '@/assets/images/icons/plus.svg';

import styles from '@/app/common.module.css';

type Icon = 'back' | 'forward' | 'arrow-right-long' | 'insignia' | 'plus' | 'calendar';
export type { Icon as LinkIcon };

const ICON: Record<Icon, { src: string }> = {
    back: SVG_ARROW,
    calendar: SVG_CALENDAR,
    forward: SVG_ARROW,
    'arrow-right-long': SVG_ARROW_LONG,
    insignia: SVG_INSIGNIA,
    plus: SVG_PLUS,
};

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
    icon?: Icon;
    iconClassName?: string;
    isExternal?: boolean;
    prevent?: boolean;
    preventModalClose?: boolean;
    timeout?: number;
}

const PageLink: FC<Props> = (props: Props) => {
    const { icon, iconClassName, children, href, isExternal, prevent, preventModalClose, timeout, ...linkProps } =
        props;

    const route = usePathname();
    const [navigate] = useNavigate(preventModalClose, timeout === 0);

    const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
        linkProps.onClick?.(event);
        if (prevent || isExternal) return;

        const handleNavigation = () => navigate((href as Route) ?? Route.Home);
        if (timeout) return setTimeout(() => handleNavigation(), timeout);
        handleNavigation();
    };

    const Icon: ReactElement | null = icon ? (
        <ReactSVG
            src={ICON[icon].src}
            className={cn(`inline-block size-[1rem]`, { ['rotate-180']: icon === 'forward' }, iconClassName)}
        />
    ) : null;

    const linkFinal: string = SPECIAL_NAV_ROUTES?.[href ?? ''] ?? href ?? '';
    const splitHref = children ? children : <span>{getIdName(linkFinal)}</span>;

    return (
        <Link
            {...linkProps}
            className={cn(`inline-flex items-center`, styles.clickable, linkProps.className)}
            href={(isExternal ? href : route) ?? '/'}
            onClick={handleLinkClick}
            {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
            {Icon} {splitHref}
        </Link>
    );
};

PageLink.displayName = 'PageLink';

export { PageLink };
