import React, {Dispatch, FC, ReactElement, SetStateAction, useEffect, useState} from "react";
import {ReactSVG} from "react-svg";
import {usePathname} from "next/navigation";
import Image from "next/image";
import cn from "classnames";

import {NavDropdown} from "@/app/types/layout";
import {Breakpoint} from "@/app/hooks/useBreakpointCheck";
import {DROPDOWN_NAV_ROUTES, LAYOUT, MAPPED_NAV_ROUTES, NavLink, Route, SPECIAL_NAV_ROUTES,} from "@/app/static";

import {getRouteName, getRouteRoot} from "@/app/utils";
import {useBreakpointCheck, useMenu} from "@/app/hooks";
import {useLayout, useModal, useUser} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {AuthModal, PreAuthModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";
import {Insignia} from "@/app/ui/misc";
import {SubNav} from "./SubNav";

import styles from '@/app/common.module.css'
import stylesLayout from './Layout.module.css'

import SVG_PROFILE from "/public/images/icons/profile.svg";
import SVG_CHEVRON from "/public/images/icons/chevron.svg";


const AUTH_BTNS: { title: string, action: string, description: string }[] = [
    {title: 'Tern Account', action: 'Login', description: 'Log in to access your Tern Account'},
    {title: 'Register for an account', action: 'Sign Up', description: 'Create a Tern account for richer experience'},
];


interface Props {
    profileMenuState: [boolean, Dispatch<SetStateAction<boolean>>];
}

const Header: FC<Props> = (props: Props): ReactElement => {
    const {profileMenuState} = props;

    const [isProfileMenuOpened, setProfileMenuOpened] = profileMenuState;

    const route = usePathname();
    const userCtx = useUser();
    const modalCtx = useModal();
    const breakpoint = useBreakpointCheck();
    const layoutCtx = useLayout();
    const [openMenu] = useMenu();

    const [expandedNavDropdown, setExpandedNavDropdown] = useState<NavDropdown | null>(null);

    const isSmScreen = breakpoint <= Breakpoint.xxs;


    const toggleMenu = () => {
        openMenu();
        setProfileMenuOpened(false);
    }


    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (
                isProfileMenuOpened
                && !document.querySelector('#profile-icon')?.contains(event.target as Node)
                && !document.querySelector('#profile-menu')?.contains(event.target as Node)
            ) {
                setProfileMenuOpened(false);
            }
        }
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
        // eslint-disable-next-line
    }, [isProfileMenuOpened]);


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
                    [cn(stylesLayout.activeNavLink, 'before:bg-gray')]: isActive && !layoutCtx.isBreadCrumbsNav,
                    ['border-s border-black']: navDropdown,
                    ['!static bg-black-l0 border-blue']: navDropdown && navDropdown?.name === expandedNavDropdown?.name,
                })}
            >
                {navDropdown
                    ? (
                        <>
                            <div
                                onClick={() => setExpandedNavDropdown(navDropdown)}
                                className={cn(styles.clickable, 'flex gap-x-5xs h-full items-center')}
                            >
                                <p>{navDropdown.name}</p>
                                <ReactSVG
                                    src={SVG_CHEVRON.src}
                                    className={cn('[&_*]:size-[0.5625rem]', {['rotate-180']: expandedNavDropdown})}
                                />
                            </div>
                        </>
                    )
                    : (
                        <>
                            <PageLink
                                href={link}
                                icon={!isActive && isSmScreen ? 'forward' : undefined}
                            >
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


    let ProfileMenu: ReactElement | null = null
    if (isProfileMenuOpened) {
        if (userCtx.isLoggedIn) {
            const ProfileMenuLi: ReactElement[] = LAYOUT.profileLinks.map((link, idx) => (
                <li
                    key={link + idx}
                    className={cn(
                        `w-full pb-xs`,
                        `sm:x-[border-b-s,pt-xs]`,
                        `sm:landscape:text-section-s`,
                    )}
                >
                    <PageLink
                        href={link}
                        className={`relative flex justify-center bg-control`}
                        onClick={() => setProfileMenuOpened(false)}
                    />
                </li>
            ));

            ProfileMenuLi.push(
                <li
                    key={'logout' + LAYOUT.profileLinks.length}
                    onClick={() => {
                        setProfileMenuOpened(false);
                        userCtx.removeSession();
                    }}
                    className={cn(
                        `border-t-s pt-xs cursor-pointer`,
                        `sm:x-[border-t-0,border-gray-l0,py-xs]`,
                        `sm:landscape:text-section-s`,
                    )}
                >
                    Log Out
                </li>
            );
            ProfileMenu = (
                <ul id={'profile-menu'}
                    className={cn(
                        `absolute z-10 right-0 flex flex-col items-start`,
                        `mt-[0.6rem] p-xs min-w-[5.18rem]`,
                        `border-s border-gray-l1 rounded-xs bg-gray text-nowrap`,
                        `sm:x-[min-w-[8.75rem],bg-white-d0,text-gray,rounded-none,py-0]`,
                    )}
                >
                    {ProfileMenuLi}
                </ul>
            )
        } else {
            const ProfileMenuLi: ReactElement[] = AUTH_BTNS.map((entry, idx) => (
                <li
                    key={entry.title + idx}
                    className={'flex flex-col gap-y-4xs'}
                >
                    <p className={'text-section-s'}>{entry.title}</p>
                    <p className={'text-gray'}>{entry.description}</p>
                    <Button
                        onClick={() =>
                            modalCtx.openModal(
                                <AuthModal registration={idx === 1}/>, {darkenBg: !isSmScreen})
                        }
                        className={cn(
                            `w-full py-5xs rounded-full border-s border-gray font-bold capitalize text-section`,
                            idx ? 'bg-black text-primary' : 'bg-white text-black'
                        )}
                    >
                        {entry.action}
                    </Button>
                </li>
            ));
            ProfileMenu = (
                <div
                    id={'profile-menu'}
                    className={cn(
                        'absolute z-10 mt-5xs right-0 p-n rounded-n border-s',
                        'border-gray-l0 bg-black text-nowrap'
                    )}
                >
                    <h2 className={'text-heading font-bold'}>Tern Account</h2>
                    <ul className={'flex flex-col mt-xs gap-y-xs'}>{ProfileMenuLi}</ul>
                </div>
            );
        }
    }

    const userBtns: ReactElement | ReactElement[] = (
        <div className={'relative'}>
            <Image
                id={'profile-icon'}
                src={userCtx.userData?.photo ? userCtx.userData?.photo : SVG_PROFILE}
                width={29}
                height={29}
                alt={'profile icon'}
                className={'cursor-pointer rounded-full h-heading-icon'}
                onClick={() => {
                    if (isSmScreen) {
                        if (userCtx.isLoggedIn)
                            openMenu();
                        else
                            modalCtx.openModal(<PreAuthModal/>);
                    } else
                        setProfileMenuOpened(prevState => !prevState);
                }}
            />
            {ProfileMenu}
        </div>
    );

    return (
        <header className={'relative z-10 text-section-xs leading-none bg-black'}>
            <div className={'border-b-s border-gray'}>
                <div className={cn(styles.content, `relative z-[2] flex !h-heading items-center`)}>
                    {breakpoint <= Breakpoint.xxs
                        ? (
                            <Button
                                onClick={() => toggleMenu()}
                                icon={'burger'}
                                className={`pr-xl`}
                                classNameIcon={'!size-heading-icon h-auto'}
                            />
                        )
                        : null
                    }
                    <Insignia/>
                    {breakpoint === Breakpoint.xxs
                        ? null
                        : (
                            <nav
                                className={cn(
                                    `relative flex items-center`,
                                    `ml-[calc(2*var(--p-n)-var(--p-xxs))] h-full`,
                                    `before:x-[absolute,h-[64%],-left-xxs,border-r-s,border-gray]`,
                                )}
                            >
                                <ul
                                    className={cn(
                                        `flex h-full cursor-pointer`,
                                        {['gap-x-l']: layoutCtx.isBreadCrumbsNav},
                                    )}
                                >
                                    {NavLinks}
                                </ul>
                            </nav>
                        )
                    }
                    <div className={'flex gap-[0.75rem] ml-auto  sm:ml-auto'}>{userBtns}</div>
                </div>
            </div>
            {
                breakpoint === Breakpoint.xxs
                    ? null
                    : (
                        <SubNav
                            headerLinkCount={navLinks?.length ?? null}
                            dropdownState={[expandedNavDropdown, setExpandedNavDropdown]}
                        />
                    )
            }
        </header>
    );
}


export {Header};
