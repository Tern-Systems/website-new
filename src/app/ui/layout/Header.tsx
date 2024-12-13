import {Dispatch, FC, ReactElement, SetStateAction} from "react";
import Image from "next/image";
import {usePathname} from "next/navigation";

import {Route} from "@/app/static";

import {useModal, useUser} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {AuthModal} from "@/app/ui/modals";

import SVG_PROFILE from "@/assets/images/icons/profile.svg";


type SubNav = Route.Profile | Route.Documentation | Route.Services | Route.Product;

const NAV_LINKS: Route[] = [Route.About, Route.Product, Route.Services, Route.Contact];
const AUTH_BTNS: string[] = ['Login', 'Sign Up'];
const SUB_NAVS: Record<SubNav, Route[]> = {
    [Route.Profile]: [Route.MyTern, Route.Profile, Route.Billing],
    [Route.Services]: [
        Route.ARCH,
        Route.ARCodeTool,
        Route.Pricing,
        Route.SavedCodes,
        Route.UserManual
    ],
    [Route.Documentation]: [
        Route.TernKeyManual,
        Route.ARHostingManual,
        Route.TernKitManual,
        Route.GHandbook,
        Route.TernHandbook,
        Route.BTMC,
        Route.Standards
    ],
    [Route.Product]: [
        Route.TernKey,
        Route.Pricing,
        Route.UserManual,
    ]
}

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
    const NavLinks: ReactElement[] = NAV_LINKS.map((link: Route, idx) => {
        return (
            <PageLink
                key={link + idx}
                href={link}
                className={`relative flex justify-center
                            ${route === link && !modalCtx.isFade ? 'after:absolute after:bottom-[-0.22rem] after:w-[3.125rem] after:border-b-small' : ''}`}
            >
                {link.slice(1)}
            </PageLink>
        );
    });

    const rootRoute: string | undefined = route?.split('/').shift();
    const subNavItems: Route[] = rootRoute ? SUB_NAVS[rootRoute as SubNav] : [];

    let SubNav: ReactElement | null = null;
    if (subNavItems.length) {
        const SubNavItems = subNavItems.map((link) => (
            <PageLink
                key={link}
                href={link}
                className={`relative flex justify-center
                                ${route === link ? 'after:absolute after:bottom-[-0.5rem] after:w-[3.125rem] after:border-b-small' : ''}`}
            />
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
        const ProfileLinks: ReactElement[] = SUB_NAVS[Route.Profile].map((link) => (
            <li key={link}>
                <PageLink
                    href={link}
                    className={`relative flex justify-center bg-control`}
                />
            </li>
        ));

        ProfileLinks.push(
            <li
                className={'border-t-small pt-[1.2rem]'}
                onClick={() => userCtx.logOut()}
            >
                <a href="#">Log Out</a>
            </li>
        );

        userBtns = (
            <div className={'relative'}>
                <Image
                    src={SVG_PROFILE}
                    alt={'profile icon'}
                    className={'h-full cursor-pointer'}
                    onClick={() => setProfileMenuVisibility(prevState => !prevState)}
                />
                <ul
                    hidden={!isProfileMenuVisible}
                    className={`absolute z-10 right-0 flex flex-col items-start gap-[1.2rem] mt-[0.62rem] p-[0.75rem]
                                border-small border-control rounded-[0.375rem] bg-control text-nowrap`}>
                    {ProfileLinks}
                </ul>
            </div>
        )
    } else {
        userBtns = AUTH_BTNS.map((name, idx) => (
            <div key={name}>
                <div
                    className={`flex items-center px-[1.06rem] py-[0.37rem] rounded-full border-small border-section
                                text-small font-bold capitalize cursor-pointer 
                                ${idx ? 'bg-black text-white' : 'bg-white text-black'}`}
                    onClick={() => modalCtx.openModal(<AuthModal isLoginAction={!idx}/>)}
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
                    <ul className={'flex gap-[calc(2*var(--px))] cursor-pointer'}>{NavLinks}</ul>
                </nav>
                <div className={'flex gap-[0.75rem]'}>{userBtns}</div>
            </div>
            {SubNav}
        </header>
    );
}

export {Header};
