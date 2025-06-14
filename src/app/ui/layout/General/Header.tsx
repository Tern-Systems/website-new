'use client';

import { FC, ReactElement, useRef, useState } from 'react';
import { ReactSVG } from 'react-svg';
import { usePathname } from 'next/navigation';
import cn from 'classnames';

import { NavDropdown } from '@/app/types/layout';
import {
    Breakpoint,
    DROPDOWN_NAV_ROUTES,
    MAPPED_NAV_ROUTES,
    NavLink,
    Route,
    ROUTES_WITH_INDEX,
    SPECIAL_NAV_ROUTES,
} from '@/app/static';

import { checkSubRoute, getIdName, getRouteRoot } from '@/app/utils';
import { useBreakpointCheck, useLayout, useOuterClickClose } from '@/app/hooks';

import { PageLink } from '@/app/ui/layout';
import { Button } from '@/app/ui/form';
import { Insignia } from '@/app/ui/organisms';
import { ProfileMenu } from '../ProfileMenu';
import { SubNav } from './SubNav';

import styles from '@/app/common.module.css';
import stylesLayout from './Layout.module.css';

import SVG_CHEVRON from '@/assets/images/icons/chevron.svg';
import { faBars, faX } from '@fortawesome/free-solid-svg-icons';

const Header: FC = (): ReactElement => {
    const route = usePathname();
    const layoutCtx = useLayout();

    const breakpoint = useBreakpointCheck();

    const [nav, setNav] = useState<boolean>(false);
    const [navDropdown, setNavDropdown] = useState<NavDropdown | null>(null);

    const navRef = useRef<HTMLDivElement | null>(null);
    const subNavRef = useRef<HTMLDivElement | null>(null);
    const MenuToggleRef = useRef<HTMLButtonElement | null>(null);

    useOuterClickClose(
        navRef,
        (event) =>
            nav &&
            !subNavRef.current?.contains(event.target as Node) &&
            !MenuToggleRef.current?.contains(event.target as Node),
        setNav,
    );

    const navLinks = layoutCtx.navLinks[NavLink.Nav];
    const subNavLinks = layoutCtx.navLinks[NavLink.SubNav];

    // Elements
    const NavLinks: ReactElement[] = navLinks?.map((link: Route, idx) => {
        const active =
            route !== Route.Home &&
            checkSubRoute(route, link, !subNavLinks?.length || ROUTES_WITH_INDEX[getRouteRoot(link) as Route]);
        const mappedLink = MAPPED_NAV_ROUTES[link];

        const linkFinal = mappedLink ? mappedLink : getIdName(SPECIAL_NAV_ROUTES[link] ?? link);

        const dropdown: NavDropdown | null =
            DROPDOWN_NAV_ROUTES[link] ??
            (breakpoint > Breakpoint.xxs || !subNavLinks?.length || !active
                ? null
                : ({
                      name: linkFinal,
                      columns: [
                          {
                              ...Object.fromEntries(
                                  subNavLinks.map((route) => {
                                      const mappedLink = MAPPED_NAV_ROUTES[route];
                                      const linkFinal = mappedLink
                                          ? mappedLink
                                          : getIdName(SPECIAL_NAV_ROUTES[route] ?? route);
                                      return [linkFinal, route];
                                  }),
                              ),
                          },
                      ],
                  } as NavDropdown));

        const dropdownExpanded = navDropdown?.name === dropdown?.name;

        return (
            <li
                key={link + idx}
                tabIndex={idx}
                onClick={() => {
                    if (breakpoint <= Breakpoint.xxs) setNav(false);
                }}
                className={cn(
                    'group',
                    stylesLayout.navLink,
                    'xxs:!h-fit xxs:[&>*]:[&:not(:first-of-type)]:border-t-s xxs:[&>*]:x-[pl-s,py-xxs,w-full]',
                    {
                        [cn(stylesLayout.activeNavLink, 'xxs:before:hidden')]: active,
                        ['before:bg-gray']: subNavLinks?.length,
                        ['!static !border-s  border-blue bg-black-l0']: navDropdown && dropdownExpanded,
                        ['!border-b-0 border-black xxs:border-none']: navDropdown,
                    },
                )}
            >
                {dropdown ? (
                    <>
                        <div
                            onClick={() => setNavDropdown(dropdown)}
                            className={cn(styles.clickable, 'flex h-full items-center gap-x-5xs xxs:justify-between')}
                        >
                            <p>{dropdown.name}</p>
                            <ReactSVG
                                src={SVG_CHEVRON.src}
                                className={cn('xxs:-rotate-90 [&_*]:size-8xs', {
                                    ['rotate-180']: dropdownExpanded,
                                })}
                            />
                        </div>
                    </>
                ) : (
                    <PageLink href={link}>
                        <span>{linkFinal}</span>
                    </PageLink>
                )}
            </li>
        );
    });

    return (
        <header
            id={'header'}
            className={cn('z-10 bg-black text-14 leading-none', nav || navDropdown ? 'sticky top-0' : 'relative')}
        >
            <div className={'flex border-b-s border-gray'}>
                <Button
                    ref={MenuToggleRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        setNav((prev) => !prev);
                    }}
                    icon={nav ? faX : faBars}
                    className={cn(`hidden border-s border-transparent rounded-none p-xs xxs:inline h-full mr-4xs`, {
                        ['!border-blue ']: nav,
                    })}
                    classNameIcon={'size-xxs scale-y-[90%]'}
                />
                <div
                    className={cn(
                        styles.content,
                        `z-[2] flex !h-heading items-center pr-xs`,
                        `relative`,
                        `sm:pr-0`,
                        `xxs:x-[static,pl-0]`,
                    )}
                >
                    <Insignia />
                    <nav
                        ref={navRef}
                        className={cn(
                            `flex items-center`,
                            `relative ml-[calc(2*var(--p-n)-var(--p-xxs))] h-full`,
                            `before:x-[absolute,h-[64%],-left-xxs,border-r-s,border-gray]`,
                            `xxs:x-[absolute,z-[1000],left-0,gap-x-l,ml-0,w-full,max-w-[18rem],bg-gray-d1]`,
                            `xxs:top-[calc(1px+var(--h-heading))] xxs:h-[calc(100dvh-var(--h-heading))]`,
                            `xxs:before:hidden`,
                            { ['xxs:hidden']: !nav },
                        )}
                    >
                        <ul className={`flex h-full cursor-pointer  xxs:x-[flex,flex-col,w-full]`}>{NavLinks}</ul>
                    </nav>
                    <ProfileMenu />
                </div>
            </div>
            <SubNav
                ref={subNavRef}
                headerLinkCount={navLinks?.length ?? null}
                setNav={setNav}
                nav={[navDropdown, setNavDropdown]}
            />
        </header>
    );
};

Header.displayName = Header.name;

export { Header };
