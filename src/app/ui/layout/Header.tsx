import {Dispatch, FC, ReactElement, SetStateAction, useState} from "react";
import Image from "next/image";
import {usePathname} from "next/navigation";

import {LANGUAGE, Route} from "@/app/static";

import {AuthService} from "@/app/services";

import {checkSubRoute, getRouteName, getRouteRoot} from "@/app/utils";
import {useBreakpointCheck} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {AuthModal, PreAuthModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";

import styles from '@/app/common.module.css'

import SVG_PROFILE from "@/assets/images/icons/profile.svg";
import SVG_GLOBE from "@/assets/images/icons/globe.svg";


const AUTH_BTNS: string[] = ['Login', 'Sign Up'];
const PROFILE_LINKS: Route[] = [Route.MyTern, Route.Profile, Route.Billing];

const NAV_LINKS: Route[] = [Route.About, Route.Product, Route.Service, Route.Contact];
const BREADCRUMBS_NAV_ROUTES: string[] = [Route.Documentation, Route.Credo, Route.ARCodeToolEdit];

const MAPPED_SUB_NAV_ROUTES: Record<string, string> = {
    [Route.Product]: '/TernKey',
    [Route.Service]: '/ARCH',
    [Route.ARCodeToolCreate]: '/CreationTool',
}


const SM_NAV_CN = 'sm:justify-between sm:flex-row-reverse sm:[&_span]:mr-auto sm:py-[1.25rem] sm:[&_path]:fill-[--bg-control-blue]';
const ACTIVE_ROUTE_CN = `after:absolute after:-bottom-[0.22rem] after:w-[2.5rem] after:border-b-small after:border-control-blue after:sm:hidden
                         sm:border-small sm:border-control-blue sm:mx-0 sm:px-[1.125rem] sm:border-l-[0.2rem]`;


interface Props {
    profileMenuState: [boolean, Dispatch<SetStateAction<boolean>>];
}

const Header: FC<Props> = (props: Props): ReactElement => {
    const {profileMenuState} = props;

    const [isProfileMenuOpened, setProfileMenuOpenState] = profileMenuState;

    // For sm breakpoint only
    const [isMenuOpened, setMenuOpenState] = useState(false);


    const route = usePathname();
    const userCtx = useUser();
    const modalCtx = useModal();
    const isSmScreen = useBreakpointCheck();


    const toggleProfileMenu = () => {
        if (userCtx.isLoggedIn) {
            modalCtx.openModal(<PreAuthModal/>);
        } else {
            setProfileMenuOpenState(prevState => {
                setMenuOpenState(!prevState);
                return !prevState;
            });
        }
    }

    const toggleNav = () => {
        setMenuOpenState(prevState => !prevState);
        if (isSmScreen)
            setProfileMenuOpenState(false);
    }

    // Elements
    let navLinks: Route[] = NAV_LINKS;
    const isBreadCrumbsNav: boolean = !isSmScreen && BREADCRUMBS_NAV_ROUTES.some((subRoute) => checkSubRoute(route, subRoute));
    if (isBreadCrumbsNav) {
        switch (true) {
            case checkSubRoute(route, Route.Documentation):
                navLinks = [Route.Profile, Route.Documentation];
                break;
            case checkSubRoute(route, Route.Credo):
                navLinks = [Route.About, Route.Credo];
                break;
            case checkSubRoute(route, Route.ARCodeToolEdit):
                navLinks = [Route.About, Route.ARCodeToolEdit];
                break;
            default:
                break;
        }
    } else if (isProfileMenuOpened && isSmScreen)
        navLinks = PROFILE_LINKS;

    let subNav: Route[] | null = null;
    switch (route) {
        case Route.Credo:
            subNav = isSmScreen ? [Route.Credo] : null;
            break;
        case Route.MyTern:
        case Route.Profile:
        case Route.Billing:
            subNav = isSmScreen ? null : PROFILE_LINKS;
            break;
        case Route.Product:
        case Route.ProductPricing:
        case Route.ProductUserManual:
            subNav = [Route.Product, Route.ProductPricing, Route.ProductUserManual];
            break;
        case Route.TernKeyManual:
        case Route.ARHostingManual:
        case Route.TernKitManual:
        case Route.GHandbook:
        case Route.TernHandbook:
        case Route.BTMCHandbook:
            subNav = [
                Route.TernKeyManual,
                Route.ARHostingManual,
                Route.TernKitManual,
                Route.GHandbook,
                Route.TernHandbook,
                Route.BTMCHandbook,
            ];
            break;
        case Route.Service:
        case Route.ARCodeToolCreate:
        case Route.ServicePricing:
        case Route.SavedCodes:
        case Route.ServiceUserManual:
            subNav = [
                Route.Service,
                Route.ARCodeToolCreate,
                Route.ServicePricing,
                Route.SavedCodes,
                Route.ServiceUserManual,
            ];
            break
    }

    const renderSubNav = (): ReactElement[] | undefined => subNav?.map((link, idx, array) => {
        const isActive = checkSubRoute(route, link, true);
        const isNextActive = isProfileMenuOpened ? checkSubRoute(route, array[idx + 1], true) : getRouteRoot(route) === array[idx + 1]; // last+1 always undefined

        return (
            <PageLink
                key={link + idx}
                href={link}
                icon={!isActive && isSmScreen ? 'forward' : undefined}
                onClick={() => setMenuOpenState(false)}
                style={{marginLeft: (isActive ? 0.6 : 2) + 'rem'}}
                className={`relative justify-center ${idx === 0 ? '[&]:border-t-0' : ''} ${isActive ? ACTIVE_ROUTE_CN : ''}
                                 sm:place-content-start sm:pr-[1.125rem] ${SM_NAV_CN} ${isNextActive ? '' : 'sm:border-b-small'}`}
            >
                {getRouteName(MAPPED_SUB_NAV_ROUTES?.[link], idx === 0)}
            </PageLink>
        );
    });

    const NavLinks: ReactElement[] = navLinks.map((link: Route, idx, array) => {
        const isActive = isProfileMenuOpened ? checkSubRoute(route, link, true) : getRouteRoot(route) === link;
        const isNextActive = isProfileMenuOpened ? checkSubRoute(route, array[idx + 1], true) : getRouteRoot(route) === array[idx + 1]; // last+1 always undefined

        return (
            <span key={link + idx} className={'contents'}>
                <PageLink
                    href={link}
                    icon={!isActive && isSmScreen ? 'forward' : undefined}
                    onClick={() => setMenuOpenState(false)}
                    className={`justify-center ${isActive && !isBreadCrumbsNav ? ACTIVE_ROUTE_CN : 'sm:mx-[1.25rem]'}
                                ${SM_NAV_CN} ${isNextActive ? '' : 'sm:border-b-small'}`}
                />
                {isActive && isSmScreen ? renderSubNav() : null}
                {!isSmScreen && isBreadCrumbsNav && idx !== navLinks.length - 1 ? <span>/</span> : null}
            </span>
        );
    });

    const SubNavItemsMdLg = isSmScreen ? null : renderSubNav();


    let userBtns: ReactElement | ReactElement[];
    if (userCtx.isLoggedIn) {
        const ProfileLinks: ReactElement[] = PROFILE_LINKS.map((link, idx) => (
            <li key={link + idx}>
                <PageLink
                    href={link}
                    className={`relative flex justify-center bg-control`}
                />
            </li>
        ));

        ProfileLinks.push(
            <li
                key={'logout' + PROFILE_LINKS.length}
                onClick={() => userCtx.removeSession()}
                className={'border-t-small pt-[1.2rem] cursor-pointer'}
            >
                Log Out
            </li>
        );

        userBtns = (
            <div className={'relative'}>
                <Image
                    src={userCtx.userData?.photo ? AuthService.getAPI + userCtx.userData?.photo : SVG_PROFILE}
                    width={29}
                    height={29}
                    alt={'profile icon'}
                    className={'cursor-pointer rounded-full max-h-[1.8rem]'}
                    onClick={() => toggleProfileMenu()}
                />
                <ul
                    className={`absolute z-10 right-0 flex flex-col items-start gap-[1.2rem] mt-[0.6rem] p-[0.75rem]
                                border-small border-control-grayL1 rounded-smallest bg-control-gray text-nowrap
                                ${!isProfileMenuOpened ? 'hidden' : 'sm:hidden'}`}>
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
                            text-[1rem] ${idx ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
                {name}
            </Button>
        ))
    }

    return (
        <header className={'text-content'}>
            <div className={`relative z-[2] bg-black flex w-full h-[4.3rem] px-[--p-small] justify-between items-center border-b-small border-section 
                            sm:flex-row-reverse sm:justify-start sm:px-[1.25rem]    after:sm:border-control-gray-l0`}
            >
                <nav className={`relative flex items-center ml-[calc(var(--insignia-pl-moved)+4.2rem)]
                                before:absolute before:h-[2rem] before:-left-[--p-small] before:border-r-small before:border-section
                    ${isMenuOpened
                    ? 'sm:absolute sm:flex-col sm:z-20 sm:bg-control-white-d0 sm:w-full sm:h-dvh sm:top-0 sm:right-0 sm:text-gray sm:text-[1.125rem]'
                    : 'sm:ml-[2rem]'}`}
                >
                    <div className={`lg:hidden md:hidden ${isMenuOpened
                        ? 'relative z-30 p-[1.25rem] h-[4.3rem] content-center place-items-end w-full '
                        + (getRouteRoot(route) === navLinks[0] ? '' : 'border-b-small border-control-gray-l0')
                        : ''}`}>
                        <Button
                            onClick={() => toggleNav()}
                            icon={isMenuOpened ? 'close' : 'burger'}
                            className={isMenuOpened ? '[&_path]:fill-[--bg-control-blue] [&&_*]:size-[1.125rem]' : '[&&_*]:size-[1.8rem]'}
                        />
                    </div>
                    <ul className={`flex cursor-pointer ${isBreadCrumbsNav ? 'gap-x-[1rem]' : 'gap-x-[--p-small]'}
                                    sm:flex-col sm:w-full ${isMenuOpened ? '' : 'sm:hidden'}`}
                    >
                        {NavLinks}
                    </ul>
                    {/*TODO add language support*/}
                    <div
                        className={`lg:hidden md:hidden ${isMenuOpened ? 'flex gap-x-[0.63rem] items-center self-start p-[1.25rem]' : 'hidden'}`}
                    >
                        <Image src={SVG_GLOBE} alt={'globe'} className={'size-[1.125rem]'}/>
                        <span>{userCtx.userData ? LANGUAGE[userCtx.userData.preferredLanguage] : '--'}</span>
                    </div>
                </nav>
                <div className={'flex gap-[0.75rem] sm:mr-[1.25rem]'}>{userBtns}</div>
            </div>
            <ul className={`relative flex gap-[--p-small] px-[--p-small] w-full items-center border-b-small
                            border-section cursor-pointer ${SubNavItemsMdLg ? 'h-[4.3rem] ' + styles.slideIn : styles.slideOut}
                            sm:hidden`}
            >
                {SubNavItemsMdLg}
            </ul>
        </header>
    );
}

export {Header};
