import React, {Dispatch, FC, ReactElement, SetStateAction, useEffect} from "react";
import Image from "next/image";
import {usePathname} from "next/navigation";
import cn from "classnames";

import {NavLink} from "@/app/context/Layout.context";
import {
    ALWAYS_MAPPED_ROUTES,
    LAYOUT,
    MAPPED_NAV_ROUTES,
    MAPPED_SUB_NAV_ROUTES,
    SPECIAL_NAV_ROUTES,
    Route
} from "@/app/static";

import {checkSubRoute, getRouteName, getRouteRoot} from "@/app/utils";
import {useBreakpointCheck, useMenu} from "@/app/hooks";
import {useLayout, useModal, useUser} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {AuthModal, PreAuthModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";

import styles from '@/app/common.module.css'

import SVG_PROFILE from "/public/images/icons/profile.svg";
import {getRouteLeave} from "@/app/utils/router";
import {Insignia} from "@/app/ui/misc";


const AUTH_BTNS: string[] = ['Login', 'Sign Up'];


const ACTIVE_ROUTE_CN = `after:absolute after:-bottom-[0.3rem] after:w-[2.5rem] after:border-b-[2px] after:border-control-blue`;


interface Props {
    profileMenuState: [boolean, Dispatch<SetStateAction<boolean>>];
}

const Header: FC<Props> = (props: Props): ReactElement => {
    const {profileMenuState} = props;

    const [isProfileMenuOpened, setProfileMenuOpenState] = profileMenuState;

    const route = usePathname();
    const userCtx = useUser();
    const modalCtx = useModal();
    const breakpoint = useBreakpointCheck();
    const layoutCtx = useLayout();
    const [openMenu] = useMenu();

    const isSmScreen = breakpoint === 'sm';

    const toggleProfileMenu = () => {
        if (!userCtx.isLoggedIn)
            modalCtx.openModal(isSmScreen ? <PreAuthModal/> : <AuthModal/>, {darkenBg: !isSmScreen});
        else
            setProfileMenuOpenState(prevState => !prevState);
    }

    const toggleMenu = () => {
        openMenu();
        setProfileMenuOpenState(false);
    }


    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (
                isProfileMenuOpened
                && !document.querySelector('#profile-icon')?.contains(event.target as Node)
                && !document.querySelector('#profile-menu')?.contains(event.target as Node)
            ) {
                setProfileMenuOpenState(false);
            }
        }
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
        // eslint-disable-next-line
    }, [isProfileMenuOpened]);


    // Elements
    const NavLinks: ReactElement[] = layoutCtx.navLinks[NavLink.Nav]?.map((link: Route, idx) => {
        const isActive = route !== Route.Home && link.includes(getRouteRoot(route));
        const mappedLink = MAPPED_NAV_ROUTES?.[link];
        const linkFinal = SPECIAL_NAV_ROUTES?.[link] ?? link;

        return (
            <span key={link + idx} className={'contents'}>
                <PageLink
                    href={link}
                    icon={!isActive && isSmScreen ? 'forward' : undefined}
                    className={`relative justify-center ${isActive && !layoutCtx.isBreadCrumbsNav ? ACTIVE_ROUTE_CN : ''}`}
                >
                    <span>{mappedLink ? mappedLink : getRouteName(linkFinal)}</span>
                </PageLink>
                {layoutCtx.isBreadCrumbsNav && idx !== layoutCtx.navLinks[NavLink.Nav].length - 1
                    ? <span>/</span>
                    : null}
            </span>
        );
    });

    const SubNavItemsMdLg = isSmScreen
        ? null
        : (
            layoutCtx.navLinks[NavLink.Sub2Nav]?.map((link, idx) => {
                const linkFinal = SPECIAL_NAV_ROUTES?.[link] ?? link;
                const mappedLink = MAPPED_SUB_NAV_ROUTES?.[link];
                const mapRoute = mappedLink && (
                    checkSubRoute(route, link)
                    || ALWAYS_MAPPED_ROUTES.some(check => getRouteLeave(link).includes(check))
                );
                const isActiveCN = checkSubRoute(route, link, true);

                return (
                    <PageLink
                        key={link + idx}
                        href={link}
                        className={cn(`relative justify-center`,
                            {
                                ['[&]:border-t-0']: idx === 0,
                                [ACTIVE_ROUTE_CN]: isActiveCN
                            }
                        )}
                    >
                        {getRouteName(linkFinal ?? (mapRoute ? mappedLink : link))}
                    </PageLink>
                );
            })
        );


    let userBtns: ReactElement | ReactElement[];
    if (userCtx.isLoggedIn || breakpoint !== 'lg') {
        const ProfileLinks: ReactElement[] = LAYOUT.profileLinks.map((link, idx) => (
            <li key={link + idx}
                className={cn(
                    `w-full pb-[--p-content-xs]`,
                    `sm:x-[border-b-small,pt-[--p-content-xs]]`,
                    `sm:landscape:text-section-s`,
                )}
            >
                <PageLink
                    href={link}
                    className={`relative flex justify-center bg-control`}
                    onClick={() => setProfileMenuOpenState(false)}
                />
            </li>
        ));

        if (userCtx.isLoggedIn) {
            ProfileLinks.push(
                <li
                    key={'logout' + LAYOUT.profileLinks.length}
                    onClick={() => {
                        setProfileMenuOpenState(false);
                        userCtx.removeSession();
                    }}
                    className={cn(
                        `border-t-small pt-[--p-content-xs] cursor-pointer`,
                        `sm:x-[border-t-0,border-control-gray-l0,py-[--p-content-xs]]`,
                        `sm:landscape:text-section-s`,
                    )}
                >
                    Log Out
                </li>
            );
        }

        userBtns = (
            <div className={'relative'}>
                <Image
                    id={'profile-icon'}
                    src={userCtx.userData?.photo ? userCtx.userData?.photo : SVG_PROFILE}
                    width={29}
                    height={29}
                    alt={'profile icon'}
                    className={'cursor-pointer rounded-full h-[1.8125rem]'}
                    onClick={() => toggleProfileMenu()}
                />
                <ul id={'profile-menu'}
                    className={cn(
                        `absolute z-10 right-0 flex flex-col items-start`,
                        `mt-[0.6rem] p-[--p-content-xs] min-w-[5.18rem]`,
                        `border-small border-control-gray-l1 rounded-smallest bg-control-gray text-nowrap`,
                        `sm:x-[min-w-[8.75rem],bg-control-white-d0,text-gray,rounded-none,py-0]`,
                        {['hidden']: !isProfileMenuOpened}
                    )}
                >
                    {ProfileLinks}
                </ul>
            </div>
        )
    } else {
        userBtns = AUTH_BTNS.map((name, idx) => (
            <Button
                key={name + idx}
                onClick={() => modalCtx.openModal(<AuthModal registration={idx === 1}/>, {darkenBg: true})}
                className={`px-[0.75rem] py-[0.2rem] rounded-full border-small border-section font-bold capitalize 
                            text-basic ${idx ? 'bg-black text-primary' : 'bg-control-white text-black'}`}
            >
                {name}
            </Button>
        ))
    }

    return (
        <header className={'text-basic leading-none'}>
            <div
                className={cn(
                    `relative z-[2] flex items-center`,
                    `px-[--p-content-l] w-full h-[5.13rem]`,
                    `border-b-small border-section bg-black`,
                    `sm:x-[px-[--p-content-xs],h-[4.31rem]]    after:sm:border-control-gray-l0`
                )}
            >
                <Insignia/>
                <nav
                    className={cn(
                        `relative flex items-center`,
                        `ml-[calc(2*var(--p-content))] h-full`,
                        `before:x-[absolute,h-[67%],-left-[--p-content],border-r-small,border-section]`,
                        `sm:x-[order-last,ml-[--p-content]] sm:before:x-[-left-[--p-content-xxs],h-[52%],border-control-gray-l0]`,
                    )}
                >
                    <Button
                        onClick={() => toggleMenu()}
                        icon={'burger'}
                        className={`lg:hidden md:hidden`}
                        classNameIcon={'[&&_*]:size-[1.8rem] h-auto'}
                    />
                    <ul className={`flex cursor-pointer text-section-s sm:hidden ${layoutCtx.isBreadCrumbsNav ? 'gap-x-[1rem]' : 'gap-x-[--s-default]'}`}>
                        {NavLinks}
                    </ul>
                </nav>
                <div className={'flex gap-[0.75rem] ml-auto  sm:ml-auto'}>{userBtns}</div>
            </div>
            <ul
                className={cn(
                    `relative flex gap-[--s-default] px-[--s-default] w-full items-center border-b-small text-section-s`,
                    `border-section`,
                    SubNavItemsMdLg?.length ? 'h-[--h-modal-header] ' + styles.slideIn : styles.slideOut,
                    `sm:hidden`
                )}
            >
                {SubNavItemsMdLg}
            </ul>
        </header>
    );
}

export {Header};
