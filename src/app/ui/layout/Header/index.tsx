import {Dispatch, FC, ReactElement, SetStateAction} from "react";
import Image from "next/image";
import {usePathname} from "next/navigation";

import {Route} from "@/app/static";

import {AuthService} from "@/app/services";

import {checkSubRoute, getRouteName, getRouteRoot} from "@/app/utils";
import {useBreakpointCheck} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {AuthModal, BaseModal, PreAuthModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";
import {MenuModal} from "./MenuModal";

import styles from '@/app/common.module.css'

import SVG_PROFILE from "@/assets/images/icons/profile.svg";


const AUTH_BTNS: string[] = ['Login', 'Sign Up'];
const PROFILE_LINKS: Route[] = [Route.MyTern, Route.Profile, Route.Billing];

const NAV_LINKS: Route[] = [Route.About, Route.Product, Route.Service, Route.Contact];
const BREADCRUMBS_NAV_ROUTES: string[] = [Route.Documentation, Route.Credo, Route.ARCodeToolEdit];

const MAPPED_SUB_NAV_ROUTES: Record<string, string> = {
    [Route.Product]: '/TernKey',
    [Route.Service]: '/ARCH',
    [Route.ARCodeToolCreate]: '/CreationTool',
}


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


    const toggleProfileMenu = () => {
        if (!userCtx.isLoggedIn) {
            modalCtx.openModal(<PreAuthModal/>);
        } else
            setProfileMenuOpenState(prevState => !prevState);
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

    const toggleNav = () => {
        // setMenuOpenState(prevState => !prevState);
        if (isSmScreen) {
            modalCtx.openModal(<MenuModal navLinks={navLinks} subNavLinks={subNav}
                                          mappedRoutes={MAPPED_SUB_NAV_ROUTES}/>);
            setProfileMenuOpenState(false);
        }
    }

    const NavLinks: ReactElement[] = navLinks.map((link: Route, idx) => {
        const isActive = getRouteRoot(route) === link;
        return (
            <span key={link + idx} className={'contents'}>
                <PageLink
                    href={link}
                    icon={!isActive && isSmScreen ? 'forward' : undefined}
                    className={`justify-center ${isActive && !isBreadCrumbsNav ? ACTIVE_ROUTE_CN : ''}`}
                />
                {isBreadCrumbsNav && idx !== navLinks.length - 1 ? <span>/</span> : null}
            </span>
        );
    });

    const SubNavItemsMdLg = isSmScreen
        ? null
        : (
            subNav?.map((link, idx) => {
                const isActive = checkSubRoute(route, link, true);
                return (
                    <PageLink
                        key={link + idx}
                        href={link}
                        icon={!isActive && isSmScreen ? 'forward' : undefined}
                        className={`relative justify-center ${idx === 0 ? '[&]:border-t-0' : ''} ${isActive ? ACTIVE_ROUTE_CN : ''}`}
                    >
                        {getRouteName(MAPPED_SUB_NAV_ROUTES?.[link], idx === 0)}
                    </PageLink>
                );
            })
        );


    let userBtns: ReactElement | ReactElement[];
    if (userCtx.isLoggedIn || isSmScreen) {
        const ProfileLinks: ReactElement[] = PROFILE_LINKS.map((link, idx) => (
            <li key={link + idx} className={'w-full sm:py-[1.25rem] sm:border-b-small'}>
                <PageLink
                    href={link}
                    className={`relative flex justify-center bg-control `}
                />
            </li>
        ));

        ProfileLinks.push(
            <li
                key={'logout' + PROFILE_LINKS.length}
                onClick={() => {
                    setProfileMenuOpenState(false);
                    userCtx.removeSession();
                }}
                className={'border-t-small pt-[1.25rem] cursor-pointer sm:border-t-0 sm:border-control-gray-l0 sm:py-[1.25rem]'}
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
                <ul className={`absolute z-10 right-0 flex flex-col items-start mt-[0.6rem] p-[1.25rem] min-w-[8.75rem]
                                border-small border-control-grayL1 rounded-smallest bg-control-gray text-nowrap
                                sm:bg-control-white-d0 sm:text-gray sm:rounded-none sm:py-0
                                ${!isProfileMenuOpened ? 'hidden' : ''}`}
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
                            text-[1rem] ${idx ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
                {name}
            </Button>
        ))
    }

    return (
        <header className={'text-content'}>
            <div className={`relative z-[2] bg-black flex w-full h-[4.3rem] px-[--p-small] justify-between items-center
                            border-b-small border-section 
                            sm:flex-row-reverse sm:justify-start sm:px-[1.25rem]    after:sm:border-control-gray-l0`}
            >
                <nav className={`relative flex items-center ml-[calc(var(--insignia-pl-moved)+4.2rem)]
                                before:absolute before:h-[2rem] before:-left-[--p-small] before:border-r-small before:border-section
                                sm:ml-[--p-small]`}
                >
                    <Button
                        onClick={() => toggleNav()}
                        icon={'burger'}
                        className={`lg:hidden md:hidden [&&_*]:size-[1.8rem]`}
                    />
                    <ul className={`flex cursor-pointer sm:hidden ${isBreadCrumbsNav ? 'gap-x-[1rem]' : 'gap-x-[--p-small]'}`}>
                        {NavLinks}
                    </ul>
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
