'use client'

import {ReactElement, useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

import Spline from '@splinetool/react-spline';
import Image from "next/image";

import {SectionsEnum} from "@/app/utils/sections";

import {withSectionLink} from "@/app/hocs/withSectionLink";

import Credo from "./components/Credo";
import About from "./components/About";
import DocumentationView from "./components/DocumentationView";

import SVG_PROFILE from "@/assets/images/icons/profile.svg";
import SVG_LINKEDIN from "@/assets/images/icons/linkedin.svg";
import SVG_GITHUB from "@/assets/images/icons/github.svg";
import SVG_DISCORD from "@/assets/images/icons/discord.svg";

import SVG_INSIGNIA from '@/assets/images/insignia.svg'

import styles from './page.module.css';

const FADE_DURATION = 300;
const NAV_LINKS: SectionsEnum[] = [SectionsEnum.About, SectionsEnum.Product, SectionsEnum.Service, SectionsEnum.Contact];
const AUTH_BTNS: string[] = ['login', 'sign up'];

type SubNav = 'profile' | 'documentation';
const SUBNAVS: Record<SubNav, SectionsEnum[]> = {
    profile: [SectionsEnum.MyTern, SectionsEnum.Profile, SectionsEnum.Billing],
    documentation: [
        SectionsEnum.TernKeyManual,
        SectionsEnum.ARHosting,
        SectionsEnum.TernKit,
        SectionsEnum.GHandbook,
        SectionsEnum.TernHandbook,
        SectionsEnum.BTMC,
        SectionsEnum.Standards
    ]
}

const CONTACT_LINKS: { svg: string, href: string }[] = [
    {svg: SVG_LINKEDIN, href: 'https://www.linkedin.com/company/tern-sys/'},
    {svg: SVG_GITHUB, href: 'https://github.com/Tern-Systems'},
    {svg: SVG_DISCORD, href: 'https://discord.gg/ZkZZmm8k4f'},
]

export default function Home() {
    const router = useRouter();
    const params = useSearchParams();

    const [activeSection, setActiveSection] = useState<SectionsEnum>(SectionsEnum.Start);
    const [isViewChange, setViewChange] = useState<boolean>(true);
    const [isInsigniaMoved, setInsigniaMoved] = useState(false);
    const [minimalLanding, setMinimalLanding] = useState(true);
    const [isProfileLinksVisible, setProfileLinksVisibility] = useState(false);

    const [isLoggedIn_, setLoggedState] = useState(false);

    const handleLinkClick = (section: SectionsEnum) => {
        history.pushState({}, '', window.location.href);
        router.replace(`/?section=${section}`);
    };
    const handleInsigniaClick = () => {
        history.pushState({}, '', window.location.href);
        router.replace(`/?section=${SectionsEnum.Home}`);
    };

    const section = params.get('section') as SectionsEnum;
    useEffect(() => {
        if (!Object.values(SectionsEnum).includes(section))
            return;

        setViewChange(true);
        if (section !== null)
            setInsigniaMoved(section !== SectionsEnum.Start);
        setTimeout(() => {
            setActiveSection(section);
            setMinimalLanding(section === 'Start')
            setViewChange(false);
            setProfileLinksVisibility(false);
        }, FADE_DURATION);
    }, [section]);

    // HOC
    const SectionLink = withSectionLink(handleLinkClick);

    // Content
    const renderContent = () => {
        let Title: ReactElement | null;
        let Content: ReactElement | null;

        // Title
        switch (activeSection) {
            case 'About':
            case 'Our Credo':
            case 'TernKey':
            case 'Documentation':
            case 'Contact':
                Title = <div
                    className={'pb-[--py] text-title font-oxygen text-[2.25rem] leading-none capitalize'}>{activeSection}</div>;
                break;
            default:
                Title = null;
        }

        // Content
        switch (activeSection) {
            case 'About':
                Content = <About/>;
                break;
            case 'Our Credo':
                Content = <Credo/>;
                break;
            case 'Documentation':
                Content = (
                    <>
                        <SectionLink section={SectionsEnum.TernKey}
                                     className={'block mb-[8.88rem] sm:landscape:mb-[4.44em] font-oxygen text-primary'}/>
                        <SectionLink section={SectionsEnum.GHandbook} className={'block font-oxygen text-primary'}/>
                    </>
                );
                break;
            case 'TernKey Manual':
            case 'G Handbook':
                Content = <DocumentationView view={activeSection}/>;
                break;
            case 'Contact':
                Content = (
                    <>
                        <p>Tern Systems</p>
                        <p>New York, New York</p>
                        <p className={'mt-[1rem]'}>info@tern.ac</p>
                    </>
                );
                break;
            case 'TernKey':
                Content = (
                    <a href={"https://www.tern.ac/ternkey/"} target={'_blank'}>
                        <Image src={SVG_INSIGNIA} alt={'insignia'} className={'h-[33.6dvh] max-h-[10.42rem]'}/>
                    </a>
                );
                break;
            default:
                Content = null;
        }

        if (Title) {
            Content = (
                <div
                    className={`overflow-y-scroll m-auto content-center text-primary text-center font-neo text-[1rem]`}>
                    {Content}
                </div>
            );
        }

        return (
            <>
                {Title}
                {Content}
            </>
        );
    };

    const renderHeader = (): ReactElement => {
        const NavLinks: ReactElement[] = NAV_LINKS.map((link: SectionsEnum, index) => {
            return (
                <SectionLink
                    key={link + index}
                    section={link}
                    className={`relative flex justify-center ${activeSection === link ? 'after:absolute after:bottom-0 after:w-[3.125rem] after:border-b-[0.0625rem]' : ''}`}
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
                        className={`relative flex justify-center ${activeSection === link ? 'after:absolute after:bottom-[-0.5rem] after:w-[3.125rem] after:border-b-[0.0625rem]' : ''}`}
                    />
                ));
                break
            default:
                SubNavItems = [];
        }
        const SubNav = (
            <ul className={'absolute left-0 top-[5.13rem] flex gap-[calc(2*var(--px))] px-[--px] py-[--py] w-full border-b-[0.06rem] border-brSection cursor-pointer'}>
                {SubNavItems}
            </ul>
        );

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
                        onClick={() => setProfileLinksVisibility(prevState => !prevState)}
                    />
                    <ul className={`absolute right-0 flex flex-col items-start gap-[1.2rem] mt-[0.62rem] p-[0.75rem] border-[0.06rem] border-brControl rounded-[0.375rem] bg-bgControl text-nowrap ${isProfileLinksVisible ? '' : 'hidden'}`}>
                        {ProfileLinks}
                    </ul>
                </div>
            )
        } else {
            userBtns = AUTH_BTNS.map((name, index) => (
                <div key={name}>
                    <div
                        className={`flex items-center px-[1.06rem] py-[0.37rem] rounded-full border-[0.06rem] border-brSection text-[0.875rem] font-bold capitalize cursor-pointer ${index ? 'bg-black text-white' : 'bg-white text-black'}`}
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
                    className={`relative flex w-full h-[5.13rem] px-[--px] justify-between items-center font-neo text-primary leading-none border-b-[0.06rem] border-brSection`}>
                    <nav
                        className={`relative flex items-center ml-[6.22rem] before:absolute before:h-[3.44rem] before:-left-[--py] before:border-[0.06rem] before:border-brSection`}>
                        <ul className={'flex gap-[calc(2*var(--px))] cursor-pointer'}>{NavLinks}</ul>
                    </nav>
                    {SubNav}
                    <div className={'flex gap-[0.75rem]'}>{userBtns}</div>
                </header>
            </>
        );
    }

    // Insignia
    // 2 pre-rendered insignias for moving without flickering
    const Insignia: ReactElement[] = [isInsigniaMoved, !isInsigniaMoved].map((state, index) => (
        <div
            key={index}
            className={`
                    absolute z-10 size-[11.5rem] bg-transparent mt-[-0.25rem]
                    ${state ? 'hidden' : ''}
                    ${isInsigniaMoved ? 'after:absolute after:top-0 after:w-full after:h-full cursor-pointer' : ''}
                    ${isInsigniaMoved ? 'animate-[insignia_0.3s_ease-in-out_forwards]' : 'animate-[insignia_0.3s_ease-in-out_forwards_reverse]'}
                    `}
            onClick={() => handleInsigniaClick()}
        >
            <Spline scene={"https://prod.spline.design/DVjbSoDcq5dzLgus/scene.splinecode"}/>
        </div>
    ));

    const Layout = minimalLanding
        ? (
            <SectionLink
                section={SectionsEnum.Home}
                className={`text-text-primary text-primary cursor-pointer text-center mt-auto mb-[--py]`}
            >
                Tern
            </SectionLink>
        )
        : (
            <>
                {renderHeader()}
                {renderContent()}
                <footer
                    className={`flex w-full justify-between font-neo text-primary border-t-[0.06rem] border-brSection px-[--px] py-[--py] place-self-end`}>
                    <span>© Copyright 2025 Tern Systems LLC</span>
                    <span>New York, New York</span>
                </footer>
            </>
        )


    return (
        <div className={"h-dvh max-h-dvh relative"}>
            {Insignia}
            <div
                className={`flex flex-col flex-grow justify-between h-full ${isViewChange ? styles.fadeOut : styles.fadeIn}`}>
                {Layout}
            </div>
        </div>
    );
}
