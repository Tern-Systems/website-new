import React, {Dispatch, FC, ReactElement, SetStateAction, useEffect} from "react";
import Image from "next/image";
import {usePathname} from "next/navigation";
import cn from "classnames";

import {Breakpoint} from "@/app/hooks/useBreakpointCheck";
import {
    ALWAYS_MAPPED_ROUTES,
    DROPDOWN_ROUTES,
    LAYOUT,
    MAPPED_NAV_ROUTES,
    MAPPED_SUB_NAV_ROUTES,
    NavLink,
    Route,
    SPECIAL_NAV_ROUTES,
} from "@/app/static";

import {getRouteLeave} from "@/app/utils/router";
import {checkSubRoute, getRouteName, getRouteRoot} from "@/app/utils";
import {useBreakpointCheck, useMenu} from "@/app/hooks";
import {useLayout, useModal, useUser} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {AuthModal, PreAuthModal} from "@/app/ui/modals";
import {Button, Select} from "@/app/ui/form";
import {Insignia} from "@/app/ui/misc";

import styles from '@/app/common.module.css'

import SVG_PROFILE from "/public/images/icons/profile.svg";


const AUTH_BTNS: { title: string, action: string, description: string }[] = [
    {title: 'Tern Account', action: 'Login', description: 'Log in to access your Tern Account'},
    {title: 'Register for an account', action: 'Sign Up', description: 'Create a Tern account for richer experience'},
];


const NAV_LI = `group relative h-full cursor-pointer  hover:!bg-black-l0 focus:!bg-black-l0  [&>*]:x-[block,px-xxs,h-full,content-center]`;
const ACTIVE_NAV_LI = `before:x-[absolute,w-full,h-[1px],-bottom-[0.5px]]`;


const renderDropdown = (name: string, links: Record<string, string>) => (
    <Select
        value={name}
        options={links}
        onChangeCustom={(value) => {
            // TODO handle links
        }}
        classNameWrapper={'!static left-0 size-full'}
        className={'!bg-transparent !border-0 !w-full'}
        classNameUl={'top-[calc(100%+2px)] py-4xs !rounded-none bg-black-l0'}
        classNameOption={cn(styles.clickable, '!bg-black-l0 !border-0 text-section-xxs !py-5xs')}
        classNameChevron={'[&_*]:w-[0.5625rem]'}
    />
)


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


    const headerLinks = layoutCtx.navLinks[NavLink.Nav];

    // Elements
    const NavLinks: ReactElement[] = headerLinks?.map((link: Route, idx) => {
        const isActive = route !== Route.Home && link.includes(getRouteRoot(route));
        const mappedLink = MAPPED_NAV_ROUTES[link];
        const dropdownLinks = DROPDOWN_ROUTES[link];
        const linkFinal = SPECIAL_NAV_ROUTES[link] ?? link;

        return (
            <li
                key={link + idx}
                tabIndex={idx}
                className={cn(NAV_LI, {
                    [cn(ACTIVE_NAV_LI, 'before:bg-gray')]: isActive && !layoutCtx.isBreadCrumbsNav,
                    ['border-s border-black focus:border-blue']: dropdownLinks,
                })}
            >
                {dropdownLinks
                    ? renderDropdown(link, dropdownLinks)
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

    const SubNavItems = breakpoint === Breakpoint.xxs
        ? null
        : (
            layoutCtx.navLinks[NavLink.Sub2Nav]?.map((link, idx) => {
                const mappedLink = MAPPED_SUB_NAV_ROUTES[link];
                const mapRoute = mappedLink && (
                    checkSubRoute(route, link)
                    || ALWAYS_MAPPED_ROUTES.some(check => getRouteLeave(link).includes(check))
                );
                const isActiveCN = checkSubRoute(route, link, true);
                const dropdownLinks = DROPDOWN_ROUTES[link];

                return (
                    <li
                        key={link + idx}
                        tabIndex={(headerLinks?.length ?? 0) + idx}
                        className={cn(NAV_LI, {[cn(ACTIVE_NAV_LI, 'before:bg-blue')]: isActiveCN})}
                    >
                        {dropdownLinks
                            ? renderDropdown(link, dropdownLinks)
                            : (
                                <PageLink href={link}>
                                    {getRouteName(mapRoute ? mappedLink : link)}
                                </PageLink>
                            )
                        }
                    </li>
                );
            })
        );

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
                <div
                    className={cn(styles.content, `relative z-[2] flex !h-heading items-center`)}
                >
                    {breakpoint === Breakpoint.xxs
                        ? (
                            <Button
                                onClick={() => toggleMenu()}
                                icon={'burger'}
                                className={`hidden pr-xl  xxs:inline`}
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
                                    `sm:x-[order-last,ml-n] sm:before:x-[-left-xxs,h-[52%],border-gray-l0]`,
                                )}
                            >
                                <ul
                                    className={cn(
                                        `flex h-full cursor-pointer  sm:hidden`,
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
                SubNavItems?.length
                    ? (
                        <div className={'border-b-s border-gray'}>
                            <ul
                                className={cn(styles.content,
                                    `flex !pl-s text-section-xxs text-nowrap`,
                                    SubNavItems?.length ? 'h-sub-heading ' + styles.slideIn : styles.slideOut,
                                )}
                            >
                                {SubNavItems}
                            </ul>
                        </div>
                    )
                    : null
            }
        </header>
    )
        ;
}


export {Header};
