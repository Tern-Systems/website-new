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
    Route,
} from "@/app/static";

import {checkSubRoute, getRouteName, getRouteRoot} from "@/app/utils";
import {useBreakpointCheck, useMenu} from "@/app/hooks";
import {useLayout, useModal, useUser} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {AuthModal, PreAuthModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";

import styles from '@/app/common.module.css'

import {getRouteLeave} from "@/app/utils/router";
import {Insignia} from "@/app/ui/misc";

import SVG_PROFILE from "/public/images/icons/profile.svg";


const AUTH_BTNS: { title: string, action: string, description: string }[] = [
    {title: 'Tern Account', action: 'Login', description: 'Log in to access your Tern Account'},
    {title: 'Register for an account', action: 'Sign Up', description: 'Create a Tern account for richer experience'},
];

const ACTIVE_ROUTE_CN = `after:absolute after:-bottom-[0.3rem] after:w-[2.5rem] after:border-b-[2px] after:border-control-blue`;


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

    const isSmScreen = breakpoint === 'sm';


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


    let ProfileMenu: ReactElement | null = null
    if (isProfileMenuOpened) {
        if (userCtx.isLoggedIn) {
            const ProfileMenuLi: ReactElement[] = LAYOUT.profileLinks.map((link, idx) => (
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
                        `border-t-small pt-[--p-content-xs] cursor-pointer`,
                        `sm:x-[border-t-0,border-control-gray-l0,py-[--p-content-xs]]`,
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
                        `mt-[0.6rem] p-[--p-content-xs] min-w-[5.18rem]`,
                        `border-small border-control-gray-l1 rounded-smallest bg-control-gray text-nowrap`,
                        `sm:x-[min-w-[8.75rem],bg-control-white-d0,text-gray,rounded-none,py-0]`,
                    )}
                >
                    {ProfileMenuLi}
                </ul>
            )
        } else {
            const ProfileMenuLi: ReactElement[] = AUTH_BTNS.map((entry, idx) => (
                <li
                    key={entry.title + idx}
                    className={'flex flex-col gap-y-[--p-content-4xs]'}
                >
                    <p className={'text-section-s'}>{entry.title}</p>
                    <p className={'text-gray'}>{entry.description}</p>
                    <Button
                        onClick={() => {
                            modalCtx.openModal(
                                isSmScreen ? <PreAuthModal/> : <AuthModal/>,
                                {darkenBg: !isSmScreen},
                            );
                            setProfileMenuOpened(false);
                        }}
                        className={cn(
                            `w-full py-[--p-content-5xs] rounded-full border-small border-section font-bold capitalize text-section`,
                            idx ? 'bg-black text-primary' : 'bg-control-white text-black'
                        )}
                    >
                        {entry.action}
                    </Button>
                </li>
            ));
            ProfileMenu = (
                <div
                    id={'profile-menu'}
                    onClick={() => setProfileMenuOpened(false)}
                    className={cn(
                        'absolute z-10 mt-[--p-content-5xs] right-0 p-[--p-content] rounded-normal border-small',
                        'border-control-gray-l0 bg-black text-nowrap'
                    )}
                >
                    <h2 className={'text-heading font-bold'}>Tern Account</h2>
                    <ul className={'flex flex-col mt-[--p-content-xs] gap-y-[--p-content-xs]'}>{ProfileMenuLi}</ul>
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
                className={'cursor-pointer rounded-full h-[1.8125rem]'}
                onClick={() => setProfileMenuOpened(prevState => !prevState)}
            />
            {ProfileMenu}
        </div>
    );


    return (
        <header className={'text-section-xs leading-none bg-black'}>
            <div className={'border-b-small border-section'}>
                <div
                    className={cn(styles.content,
                        `relative z-[2] flex !h-[--h-heading-lg] items-center`,
                    )}
                >
                    <Insignia/>
                    <nav
                        className={cn(
                            `relative flex items-center`,
                            `ml-[calc(2*var(--p-content-xs))] h-full`,
                            `before:x-[absolute,h-[67%],-left-[--p-content-xs],border-r-small,border-section]`,
                            `sm:x-[order-last,ml-[--p-content]] sm:before:x-[-left-[--p-content-xxs],h-[52%],border-control-gray-l0]`,
                        )}
                    >
                        <Button
                            onClick={() => toggleMenu()}
                            icon={'burger'}
                            className={`lg:hidden md:hidden`}
                            classNameIcon={'[&&_*]:size-[1.8rem] h-auto'}
                        />
                        <ul className={`flex cursor-pointer sm:hidden ${layoutCtx.isBreadCrumbsNav ? 'gap-x-[1rem]' : 'gap-x-[--s-default]'}`}>
                            {NavLinks}
                        </ul>
                    </nav>
                    <div className={'flex gap-[0.75rem] ml-auto  sm:ml-auto'}>{userBtns}</div>
                </div>
            </div>
            {SubNavItemsMdLg?.length
                ? (
                    <div className={'border-b-small border-section'}>
                        <ul
                            className={cn(styles.content,
                                `relative flex gap-[--s-default] items-center`,
                                SubNavItemsMdLg?.length ? 'h-heading-lg ' + styles.slideIn : styles.slideOut,
                                `sm:hidden`
                            )}
                        >
                            {SubNavItemsMdLg}
                        </ul>
                    </div>
                )
                : null
            }
        </header>
    );
}

export {Header};
