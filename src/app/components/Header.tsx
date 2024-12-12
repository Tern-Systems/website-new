import {Dispatch, FC, ReactElement, SetStateAction} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";

import {SectionsEnum} from "@/app/utils/sections";

import {useModal, useUser} from "@/app/context";

import {withSectionLink} from "@/app/hocs";

import {AuthModal} from "@/app/components/modals";

import SVG_PROFILE from "@/assets/images/icons/profile.svg";


type SubNav = SectionsEnum.Profile | SectionsEnum.Documentation | SectionsEnum.Service | SectionsEnum.Product;

const NAV_LINKS: SectionsEnum[] = [SectionsEnum.About, SectionsEnum.Product, SectionsEnum.Service, SectionsEnum.Contact];
const AUTH_BTNS: string[] = ['Login', 'Sign Up'];
const SUBNAVS: Record<SubNav, SectionsEnum[]> = {
    Profile: [SectionsEnum.MyTern, SectionsEnum.Profile, SectionsEnum.Billing],
    Service: [
        SectionsEnum.ARCH,
        SectionsEnum.ARCodeTool,
        SectionsEnum.Pricing,
        SectionsEnum.SavedCodes,
        SectionsEnum.UserManual
    ],
    Documentation: [
        SectionsEnum.TernKeyManual,
        SectionsEnum.ARHostingManual,
        SectionsEnum.TernKitManual,
        SectionsEnum.GHandbook,
        SectionsEnum.TernHandbook,
        SectionsEnum.BTMC,
        SectionsEnum.Standards
    ],
    Product: [
        SectionsEnum.TernKey,
        SectionsEnum.Pricing,
        SectionsEnum.UserManual,
    ]
}

interface IHeaderProps {
    hidden: boolean;
    profileMenuState: [boolean, Dispatch<SetStateAction<boolean>>];
    activeSection: SectionsEnum;
}

const Header: FC<IHeaderProps> = (props: IHeaderProps): ReactElement => {
    const {profileMenuState, activeSection, hidden} = props;

    const [isProfileMenuVisible, setProfileMenuVisibility] = profileMenuState;

    const router = useRouter();
    const userCtx = useUser();
    const modalCtx = useModal();

    // HOC
    const SectionLink = withSectionLink();

    // Elements
    const NavLinks: ReactElement[] = NAV_LINKS.map((link: SectionsEnum, index) => {
        return (
            <SectionLink
                key={link + index}
                section={link}
                className={`relative flex justify-center
                            ${activeSection === link ? 'after:absolute after:bottom-[-0.22rem] after:w-[3.125rem] after:border-b-small' : ''}`}
            />
        );
    });

    let subNavItems: SectionsEnum[];
    switch (activeSection) {
        case 'Product':
        case 'Pricing and Plans':
        case 'User Manual':
            subNavItems = SUBNAVS.Product;
            break
        case 'My Tern':
        case 'Profile':
        case 'Billing':
            subNavItems = SUBNAVS.Profile;
            break
        case 'Service':
        case 'ARCH':
        case 'Creation Tool':
        case 'Pricing and Plans':
        case 'Saved Codes':
        case 'User Manual':
            subNavItems = SUBNAVS.Service;
            break
        default:
            subNavItems = [];
    }

    let SubNav: ReactElement | null = null;
    if (subNavItems.length) {
        const SubNavItems = subNavItems.map((link) => (
            <SectionLink
                key={link}
                section={link}
                className={`relative flex justify-center
                                ${activeSection === link ? 'after:absolute after:bottom-[-0.5rem] after:w-[3.125rem] after:border-b-small' : ''}`}
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
        const ProfileLinks: ReactElement[] = SUBNAVS.Profile.map((link) => (
            <li key={link}>
                <SectionLink
                    section={link}
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
        userBtns = AUTH_BTNS.map((name, index) => (
            <div key={name}>
                <div
                    className={`flex items-center px-[1.06rem] py-[0.37rem] rounded-full border-small border-section
                                text-small font-bold capitalize cursor-pointer 
                                ${index ? 'bg-black text-white' : 'bg-white text-black'}`}
                    onClick={() => modalCtx.openModal(<AuthModal isLoginAction={!index}/>)}
                >
                    {name}
                </div>
            </div>
        ))
    }

    return (
        <header hidden={hidden} className={'font-neo text-primary'}>
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

export default Header;
