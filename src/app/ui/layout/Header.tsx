import {Dispatch, FC, ReactElement, SetStateAction, useEffect} from "react";
import Image from "next/image";
import {usePathname} from "next/navigation";
import cn from "classnames";

import {LAYOUT, MAPPED_SUB_NAV_ROUTES, Route} from "@/app/static";

import {AuthService} from "@/app/services";

import {checkSubRoute, getRouteName, getRouteRoot} from "@/app/utils";
import {useBreakpointCheck, useMenu} from "@/app/hooks";
import {useLayout, useModal, useUser} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {AuthModal, PreAuthModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";

import styles from '@/app/common.module.css'

import SVG_PROFILE from "@/assets/images/icons/profile.svg";


const AUTH_BTNS: string[] = ['Login', 'Sign Up'];


const ACTIVE_ROUTE_CN = `after:absolute after:-bottom-[0.22rem] after:w-[2.5rem] after:border-b-small after:border-control-blue`;


interface Props {
    profileMenuState: [boolean, Dispatch<SetStateAction<boolean>>];
}

const Header: FC<Props> = (props: Props): ReactElement => {
    const {profileMenuState} = props;

    const [isProfileMenuOpened, setProfileMenuOpenState] = profileMenuState;

    const route = usePathname();
    const userCtx = useUser();
    const modalCtx = useModal();
    const isSmScreen = useBreakpointCheck();
    const layoutCtx = useLayout();
    const toggleMenuState = useMenu();


    const toggleProfileMenu = () => {
        if (!userCtx.isLoggedIn)
            modalCtx.openModal(<PreAuthModal/>);
        else
            setProfileMenuOpenState(prevState => !prevState);
    }

    const toggleMenu = () => {
        toggleMenuState();
        setProfileMenuOpenState(false);
    }


    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (
                isProfileMenuOpened
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
    const NavLinks: ReactElement[] = layoutCtx.navLinks.map((link: Route, idx) => {
        const isActive = getRouteRoot(route) === link;
        return (
            <span key={link + idx} className={'contents'}>
                <PageLink
                    href={link}
                    icon={!isActive && isSmScreen ? 'forward' : undefined}
                    className={`relative justify-center ${isActive && !layoutCtx.isBreadCrumbsNav ? ACTIVE_ROUTE_CN : ''}`}
                />
                {layoutCtx.isBreadCrumbsNav && idx !== layoutCtx.navLinks.length - 1 ? <span>/</span> : null}
            </span>
        );
    });

    const SubNavItemsMdLg = isSmScreen
        ? null
        : (
            layoutCtx.subNavLinks?.map((link, idx) => {
                const isActive = checkSubRoute(route, link, true);
                return (
                    <PageLink
                        key={link + idx}
                        href={link}
                        icon={!isActive && isSmScreen ? 'forward' : undefined}
                        className={`relative justify-center ${idx === 0 ? '[&]:border-t-0' : ''} ${isActive ? ACTIVE_ROUTE_CN : ''}`}
                    >
                        {getRouteName(
                            checkSubRoute(route, link) ? MAPPED_SUB_NAV_ROUTES?.[link] : link,
                            link === Route.TernKey
                        )}
                    </PageLink>
                );
            })
        );


    let userBtns: ReactElement | ReactElement[];
    if (userCtx.isLoggedIn || isSmScreen) {
        const ProfileLinks: ReactElement[] = LAYOUT.profileLinks.map((link, idx) => (
            <li key={link + idx}
                className={`w-full pb-[1.25rem] 
                            sm:x-[border-b-small,pt-[1.25rem]]
                            sm:landscape:x-[py-[--1dr],text-content-small]`}>
                <PageLink
                    href={link}
                    className={`relative flex justify-center bg-control`}
                    onClick={() => setProfileMenuOpenState(false)}
                />
            </li>
        ));

        ProfileLinks.push(
            <li
                key={'logout' + LAYOUT.profileLinks.length}
                onClick={() => {
                    setProfileMenuOpenState(false);
                    userCtx.removeSession();
                }}
                className={`border-t-small pt-[1.25rem] cursor-pointer
                            sm:x-[border-t-0,border-control-gray-l0,py-[1.25rem]]
                            sm:landscape:x-[py-[--1dr],text-content-small]`}
            >
                Log Out
            </li>
        );

        userBtns = (
            <div className={'relative'}>
                <Image
                    id={'profile-icon'}
                    src={userCtx.userData?.photo ? AuthService.getAPI + userCtx.userData?.photo : SVG_PROFILE}
                    width={29}
                    height={29}
                    alt={'profile icon'}
                    className={'cursor-pointer rounded-full h-[1.8125rem]'}
                    onClick={() => toggleProfileMenu()}
                />
                <ul id={'profile-menu'}
                    className={cn(
                        `absolute z-10 right-0 flex flex-col items-start mt-[0.6rem] p-[1.25rem] min-w-[8.75rem]
                        border-small border-control-gray-l1 rounded-smallest bg-control-gray text-nowrap
                        sm:x-[bg-control-white-d0,text-gray,rounded-none,py-0]`,
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
                onClick={() => modalCtx.openModal(<AuthModal isLoginAction={!idx}/>, {darkenBg: true})}
                className={`px-[0.75rem] py-[0.2rem] rounded-full border-small border-section font-bold capitalize 
                            text-[1rem] ${idx ? 'bg-black text-primary' : 'bg-control-white text-black'}`}
            >
                {name}
            </Button>
        ))
    }

    return (
        <header className={'text-[1rem] leading-none'}>
            <div className={`relative z-[2] flex justify-between items-center px-[2.06rem] w-full h-[5.13rem] 
                            border-b-small border-section bg-black 
                            sm:x-[flex-row-reverse,justify-start,px-[1.25rem],h-[4.31rem]]    after:sm:border-control-gray-l0`}
            >
                <nav className={`relative flex items-center ml-[calc(var(--insignia-pl-moved)+var(--insignia-container-size)*var(--insignia-scale-moved)+2.06rem)] h-full
                                before:x-[absolute,h-[67%],-left-[2.06rem],border-r-small,border-section]
                                sm:ml-[1.94rem] sm:before:x-[-left-[0.94rem],h-[52%],border-control-gray-l0]`}
                >
                    <Button
                        onClick={() => toggleMenu()}
                        icon={'burger'}
                        className={`lg:hidden md:hidden`}
                        classNameIcon={'[&&_*]:size-[1.8rem] h-auto'}
                    />
                    <ul className={`flex cursor-pointer text-content-small sm:hidden ${layoutCtx.isBreadCrumbsNav ? 'gap-x-[1rem]' : 'gap-x-[--s-default]'}`}>
                        {NavLinks}
                    </ul>
                </nav>
                <div className={'flex gap-[0.75rem]'}>{userBtns}</div>
            </div>
            <ul className={`relative flex gap-[--s-default] px-[--s-default] w-full items-center border-b-small text-content-small
                            border-section cursor-pointer ${SubNavItemsMdLg ? 'h-[4.3rem] ' + styles.slideIn : styles.slideOut}
                            sm:hidden`}
            >
                {SubNavItemsMdLg}
            </ul>
        </header>
    );
}


export {Header};
