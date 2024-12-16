import {Dispatch, FC, ReactElement, SetStateAction} from "react";
import Image from "next/image";
import {usePathname} from "next/navigation";

import {Route} from "@/app/static";

import {checkSubRoute, getRouteName, getRouteRoot} from "@/app/utils";
import {useModal, useUser} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {AuthModal} from "@/app/ui/modals";

import SVG_PROFILE from "@/assets/images/icons/profile.svg";
import {AuthService} from "@/app/services";


const AUTH_BTNS: string[] = ['Login', 'Sign Up'];
const PROFILE_ROUTES: Route[] = [Route.MyTern, Route.Profile, Route.Billing];

const NAV_LINKS: Route[] = [Route.About, Route.Product, Route.Service, Route.Contact];
const BREADCRUMBS_NAV_ROUTES: string[] = [Route.Documentation, Route.Credo, Route.ARCodeToolEdit];

const MAPPED_SUB_NAV_ROUTES: Record<string, string> = {
    [Route.Product]: '/TernKey',
    [Route.Service]: '/ARCH',
    [Route.ARCodeToolCreate]: '/CreationTool',
}

const UNDERLINE_CN = 'after:absolute after:bottom-[-0.22rem] after:w-[3.125rem] after:border-b-small after:border-control6';


interface Props {
    profileMenuState: [boolean, Dispatch<SetStateAction<boolean>>];
}

const Header: FC<Props> = (props: Props): ReactElement => {
    const {profileMenuState} = props;

    const [isProfileMenuVisible, setProfileMenuVisibility] = profileMenuState;

    const route = usePathname();
    const userCtx = useUser();
    const modalCtx = useModal();

    // Elements
    let navLinks: Route[];
    const isBreadCrumbsNav: boolean = BREADCRUMBS_NAV_ROUTES.some((subRoute) => checkSubRoute(route, subRoute));
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
            navLinks = NAV_LINKS;
            break;
    }

    const NavLinks: ReactElement[] = navLinks.map((link: Route, idx) => {
        return (
            <span key={link + idx} className={'contents'}>
                <PageLink
                    href={link}
                    className={`relative flex justify-center ${getRouteRoot(route) === link && !isBreadCrumbsNav ? UNDERLINE_CN : ''}`}
                />
                {isBreadCrumbsNav && idx !== navLinks.length - 1 ? <span>/</span> : null}
            </span>
        );
    });

    let subNav: Route[] | null = null;
    switch (route) {
        case Route.MyTern:
        case Route.Profile:
        case Route.Billing:
            subNav = PROFILE_ROUTES;
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

    // Find section with sub nav
    let SubNav: ReactElement | null = null;
    if (subNav) {
        const SubNavItems = subNav.map((link, idx) => (
            <PageLink
                key={link + idx}
                href={link}
                className={`relative flex justify-center ${checkSubRoute(route, link, true) ? UNDERLINE_CN : ''}`}
            >
                {getRouteName(MAPPED_SUB_NAV_ROUTES?.[link], idx === 0)}
            </PageLink>
        ));

        SubNav = (
            <ul className={`flex gap-[calc(2*var(--px))] px-[--px] w-full h-[3.88rem]
                            items-center bg-black border-b-small border-section cursor-pointer`}>
                {SubNavItems}
            </ul>
        );
    }

    let userBtns: ReactElement | ReactElement[];
    if (userCtx.isLoggedIn) {
        const ProfileLinks: ReactElement[] = PROFILE_ROUTES.map((link, idx) => (
            <li key={link + idx}>
                <PageLink
                    href={link}
                    className={`relative flex justify-center bg-control`}
                />
            </li>
        ));

        ProfileLinks.push(
            <li
                key={'logout' + PROFILE_ROUTES.length}
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
                    className={'cursor-pointer rounded-full'}
                    onClick={() => setProfileMenuVisibility(prevState => !prevState)}
                />
                <ul
                    className={`absolute z-10 right-0 flex flex-col items-start gap-[1.2rem] mt-[0.62rem] p-[0.75rem]
                                border-small border-control rounded-[0.375rem] bg-control text-nowrap
                                ${isProfileMenuVisible ? '' : 'hidden'}`}>
                    {ProfileLinks}
                </ul>
            </div>
        )
    } else {
        userBtns = AUTH_BTNS.map((name, idx) => (
            <div key={name + idx}>
                <div
                    className={`flex items-center px-[1.06rem] py-[0.37rem] rounded-full border-small border-section
                                text-small font-bold capitalize cursor-pointer 
                                ${idx ? 'bg-black text-white' : 'bg-white text-black'}`}
                    onClick={() => modalCtx.openModal(<AuthModal isLoginAction={!idx}/>, {darkenBg: true})}
                >
                    {name}
                </div>
            </div>
        ))
    }

    return (
        <header className={'font-neo text-primary'}>
            <div
                className={`relative flex w-full h-[5.13rem] px-[--px] justify-between items-center border-b-small border-section`}>
                <nav
                    className={`relative flex items-center ml-[6.22rem] before:absolute before:h-[3.44rem] before:-left-[--py]
                                before:border-small before:border-section`}>
                    <ul className={`flex ${isBreadCrumbsNav ? 'gap-x-[1rem]' : 'gap-x-[calc(2*var(--px))]'} cursor-pointer`}>{NavLinks}</ul>
                </nav>
                <div className={'flex gap-[0.75rem]'}>{userBtns}</div>
            </div>
            {SubNav}
        </header>
    );
}

export {Header};
