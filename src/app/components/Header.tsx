import {Dispatch, FC, ReactElement, SetStateAction, useState} from "react";
import Image from "next/image";

import {SectionsEnum} from "@/app/utils/sections";

import {withSectionLink} from "@/app/hocs/withSectionLink";

import SVG_PROFILE from "@/assets/images/icons/profile.svg";


type SubNav = 'profile' | 'documentation';

const NAV_LINKS: SectionsEnum[] = [SectionsEnum.About, SectionsEnum.Product, SectionsEnum.Service, SectionsEnum.Contact];
const AUTH_BTNS: string[] = ['login', 'sign up'];
const SUBNAVS: Record<SubNav, SectionsEnum[]> = {
    profile: [SectionsEnum.MyTern, SectionsEnum.Profile, SectionsEnum.Billing],
    documentation: [
        SectionsEnum.TernKeyManual,
        SectionsEnum.ARHostingManual,
        SectionsEnum.TernKitManual,
        SectionsEnum.GHandbook,
        SectionsEnum.TernHandbook,
        SectionsEnum.BTMC,
        SectionsEnum.Standards
    ]
}

interface IHeaderProps {
    profileLinksState: { value: boolean, handle: Dispatch<SetStateAction<boolean>> }
    activeSection: SectionsEnum;
    handleLinkClick: (section: SectionsEnum) => void;
}

const Header: FC<IHeaderProps> = (props: IHeaderProps): ReactElement => {
    const {profileLinksState, activeSection, handleLinkClick} = props;

    const [isLoggedIn_, setLoggedState] = useState(false);

    // HOC
    const SectionLink = withSectionLink(handleLinkClick);

    // Elements
    const NavLinks: ReactElement[] = NAV_LINKS.map((link: SectionsEnum, index) => {
        return (
            <SectionLink
                key={link + index}
                section={link}
                className={`relative flex justify-center
                            ${activeSection === link ? 'after:absolute after:bottom-[-0.22rem] after:w-[3.125rem] after:border-b-[0.0625rem]' : ''}`}
            />
        );
    });

    let SubNavItems: ReactElement[];
    switch (activeSection) {
        case 'My Tern':
        case 'Profile':
        case 'Billing':
            SubNavItems = SUBNAVS.profile.map((link) => (
                <SectionLink
                    key={link}
                    section={link}
                    className={`relative flex justify-center
                                ${activeSection === link ? 'after:absolute after:bottom-[-0.5rem] after:w-[3.125rem] after:border-b-[0.0625rem]' : ''}`}
                />
            ));
            break
        default:
            SubNavItems = [];
    }


    let SubNav: ReactElement | null = null;
    if (SubNavItems.length) {
        SubNav = (
            <ul className={`absolute left-0 top-[5.13rem] flex gap-[calc(2*var(--px))] px-[--px] py-[--py] w-full
                        border-b-[0.06rem] border-brSection cursor-pointer`}>
                {SubNavItems}
            </ul>
        );
    }

    let userBtns: ReactElement | ReactElement[];
    if (isLoggedIn_) {
        const ProfileLinks: ReactElement[] = SUBNAVS.profile.map((link) => (
            <li key={link}>
                <SectionLink
                    section={link}
                    className={`relative flex justify-center bg-bgControl`}
                />
            </li>
        ));

        ProfileLinks.push(
            <li className={'border-t-[0.06rem] pt-[1.2rem]'}>
                <a href="#">Log Out</a>
            </li>
        );

        userBtns = (
            <div className={'relative'}>
                <Image
                    src={SVG_PROFILE}
                    alt={'profile icon'}
                    className={'h-full cursor-pointer'}
                    onClick={() => profileLinksState.handle(prevState => !prevState)}
                />
                <ul className={`absolute right-0 flex flex-col items-start gap-[1.2rem] mt-[0.62rem] p-[0.75rem]
                                border-[0.06rem] border-brControl rounded-[0.375rem] bg-bgControl text-nowrap
                                ${profileLinksState.value ? '' : 'hidden'}`}>
                    {ProfileLinks}
                </ul>
            </div>
        )
    } else {
        userBtns = AUTH_BTNS.map((name, index) => (
            <div key={name}>
                <div
                    className={`flex items-center px-[1.06rem] py-[0.37rem] rounded-full border-[0.06rem] border-brSection
                                text-[0.875rem] font-bold capitalize cursor-pointer 
                                ${index ? 'bg-black text-white' : 'bg-white text-black'}`}
                    onClick={() => setLoggedState(prevState => !prevState)}
                >
                    {name}
                </div>
            </div>
        ))
    }

    return (
        <>
            <header
                className={`relative flex w-full h-[5.13rem] px-[--px] justify-between items-center font-neo text-primary
                            leading-none border-b-[0.06rem] border-brSection`}>
                <nav
                    className={`relative flex items-center ml-[6.22rem] before:absolute before:h-[3.44rem] before:-left-[--py]
                                before:border-[0.06rem] before:border-brSection`}>
                    <ul className={'flex gap-[calc(2*var(--px))] cursor-pointer'}>{NavLinks}</ul>
                </nav>
                {SubNav}
                <div className={'flex gap-[0.75rem]'}>{userBtns}</div>
            </header>
        </>
    );
}

export default Header;
