import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { ReactSVG } from 'react-svg';
import { usePathname } from 'next/navigation';
import cn from 'classnames';

import { NavDropdown } from '@/app/types/layout';
import { Breakpoint } from '@/app/hooks/useBreakpointCheck';
import { DROPDOWN_NAV_ROUTES, MAPPED_NAV_ROUTES, NavLink, Route, SPECIAL_NAV_ROUTES } from '@/app/static';

import { getRouteName, getRouteRoot } from '@/app/utils';
import { useBreakpointCheck } from '@/app/hooks';
import { useLayout } from '@/app/context';

import { PageLink } from '@/app/ui/layout';
import { Button } from '@/app/ui/form';
import { Insignia } from '@/app/ui/misc';
import { SubNav } from './SubNav';

import styles from '@/app/common.module.css';
import stylesLayout from './Layout.module.css';

import SVG_CHEVRON from '/public/images/icons/chevron.svg';
import { ProfileMenu } from '@/app/ui/layout/ProfileMenu';


const Header: FC = (): ReactElement => {
    const route = usePathname();
    const breakpoint = useBreakpointCheck();
    const layoutCtx = useLayout();

    const [navExpanded, setNavExpanded] = useState(false);
    const [navDropdownExpanded, setNavDropdownExpanded] = useState<NavDropdown | null>(null);

    const navRef = useRef<HTMLDivElement | null>(null);
    const subNavRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const close = navExpanded && !navRef.current?.contains(event.target as Node) && !subNavRef.current?.contains(event.target as Node);
            if (close)
                setNavExpanded(false);
        };
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, [navExpanded]);

    const navLinks = layoutCtx.navLinks[NavLink.Nav];

    // Elements
    const NavLinks: ReactElement[] = navLinks?.map((link: Route, idx) => {
        const isActive = route !== Route.Home && link.includes(getRouteRoot(route));
        const mappedLink = MAPPED_NAV_ROUTES[link];
        const navDropdown = DROPDOWN_NAV_ROUTES[link];
        const linkFinal = SPECIAL_NAV_ROUTES[link] ?? link;

        return (
            <li
                key={link + idx}
                tabIndex={idx}
                className={cn('group', stylesLayout.navLink, {
                    [cn(stylesLayout.activeNavLink, 'before:bg-gray')]: isActive && !layoutCtx.isBreadCrumbsNav && breakpoint > Breakpoint.xxs,
                    ['border-s border-black']: navDropdown && breakpoint > Breakpoint.xxs,
                    ['!static bg-black-l0 border-blue']: navDropdown && navDropdown?.name === navDropdownExpanded?.name,
                    ['!h-fit border-b-s [&>*]:x-[pl-s,py-xxs]']: breakpoint <= Breakpoint.xxs,
                })}
            >
                {navDropdown
                    ? (
                        <>
                            <div
                                onClick={() => setNavDropdownExpanded(navDropdown)}
                                className={cn(
                                    styles.clickable, 'flex gap-x-5xs h-full items-center',
                                    { ['justify-between']: breakpoint <= Breakpoint.xxs },
                                )}
                            >
                                <p>{navDropdown.name}</p>
                                <ReactSVG
                                    src={SVG_CHEVRON.src}
                                    className={cn(
                                        '[&_*]:size-[0.5625rem]',
                                        {
                                            ['rotate-180']: navDropdownExpanded && breakpoint > Breakpoint.xxs,
                                            ['-rotate-90']: breakpoint <= Breakpoint.xxs,
                                        },
                                    )}
                                />
                            </div>
                        </>
                    )
                    : (
                        <>
                            <PageLink href={link}>
                                <span>{mappedLink ? mappedLink : getRouteName(linkFinal)}</span>
                            </PageLink>
                            {layoutCtx.isBreadCrumbsNav && idx !== layoutCtx.navLinks[NavLink.Nav].length - 1
                                ? <span>/</span>
                                : null
                            }
                        </>
                    )
                }
            </li>
        );
    });


    return (
        <header className={cn('z-10 text-section-xs leading-none bg-black', navExpanded ? 'sticky top-0' : 'relative')}>
            <div className={'flex border-b-s border-gray'}>
                {breakpoint <= Breakpoint.xxs
                    ? (
                        <Button
                            onClick={() => setNavExpanded(prevState => !prevState)}
                            icon={navExpanded ? 'close' : 'burger'}
                            className={cn(`px-s`, { ['bg-gray-d0']: navExpanded })}
                            classNameIcon={'!size-heading-icon h-auto'}
                        />
                    )
                    : null
                }
                <div
                    className={cn(
                        styles.content,
                        `z-[2] flex pr-0 !h-heading items-center`,
                        breakpoint <= Breakpoint.xxs ? 'pl-xxs' : 'relative',
                    )}
                >
                    <Insignia />
                    {breakpoint <= Breakpoint.xxs && !navExpanded
                        ? null
                        : (
                            <nav
                                ref={navRef}
                                className={cn(
                                    `flex items-center`,
                                    `before:x-[absolute,h-[64%],-left-xxs,border-r-s,border-gray]`,
                                    breakpoint <= Breakpoint.xxs ?
                                        cn(
                                            `absolute z-[1000] left-0 top-[calc(1px+var(--h-heading))] gap-x-l`,
                                            `h-[calc(100dvh-var(--h-heading))] w-full max-w-[14.5625rem] bg-gray-d0`,
                                            `before:hidden`,
                                        )
                                        : cn(
                                            `ml-[calc(2*var(--p-n)-var(--p-xxs))] h-full`,
                                            `relative`,
                                        ),
                                )}
                            >
                                <ul
                                    className={cn(
                                        `flex h-full cursor-pointer`,
                                        {
                                            ['gap-x-l']: layoutCtx.isBreadCrumbsNav,
                                            [`flex flex-col w-full`]: breakpoint <= Breakpoint.xxs,
                                        },
                                    )}
                                >
                                    {NavLinks}
                                </ul>
                            </nav>
                        )
                    }
                    <ProfileMenu />
                </div>
            </div>
            <SubNav
                ref={subNavRef}
                headerLinkCount={navLinks?.length ?? null}
                setNavExpanded={setNavExpanded}
                dropdownState={[navDropdownExpanded, setNavDropdownExpanded]}
            />
        </header>
    );
};


export { Header };
