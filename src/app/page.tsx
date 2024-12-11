'use client'

import {useState, useEffect, ReactElement} from "react";
import {useRouter, useSearchParams} from "next/navigation";

import Spline from '@splinetool/react-spline';
import Image from "next/image";

import {SectionsEnum} from "@/app/utils/sections";

import {withSectionLink} from "@/app/hocs/withSectionLink";

import Credo from "./components/Credo";
import About from "./components/About";
import DocumentationView from "./components/DocumentationView";

import SVG_LINKEDIN from "@/assets/images/icons/linkedin.svg";
import SVG_GITHUB from "@/assets/images/icons/github.svg";
import SVG_DISCORD from "@/assets/images/icons/discord.svg";
import SVG_INSIGNIA from '@/assets/images/insignia.svg'

import styles from './page.module.css';

const FADE_DURATION = 300;
const INIT_INSIGNIA_SECTIONS: SectionsEnum[] = [SectionsEnum.Start, SectionsEnum.Home];
const FOOTER_LINKS: SectionsEnum[] = [SectionsEnum.About, SectionsEnum.TernKey, SectionsEnum.Contact];
const CONTACT_LINKS: { svg: string, href: string }[] = [
    {svg: SVG_LINKEDIN, href: 'https://www.linkedin.com/company/tern-sys/'},
    {svg: SVG_GITHUB, href: 'https://github.com/Tern-Systems'},
    {svg: SVG_DISCORD, href: 'https://discord.gg/ZkZZmm8k4f'},
]

export default function Home() {
    const router = useRouter();
    const params = useSearchParams();

    const [activeSection, setActiveSection] = useState<SectionsEnum>(SectionsEnum.Start);
    const [isViewChange, setViewChange] = useState<boolean>(false);
    const [isInsigniaMoved, setInsigniaMoved] = useState(false);
    const [minimalLanding, setMinimalLanding] = useState(true);

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
            setInsigniaMoved(!INIT_INSIGNIA_SECTIONS.includes(section));
        setTimeout(() => {
            setActiveSection(section);
            setMinimalLanding(section === 'Start')
            setViewChange(false);
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
                        <SectionLink section={SectionsEnum.TernKeyManual}
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

    // Footer
    const renderFooter = (): ReactElement => {
        let SectionContent: ReactElement | null;

        switch (activeSection) {
            case 'About':
                SectionContent =
                    <SectionLink section={SectionsEnum.Credo} className={'font-neo text-[1rem]'}>Our Credo</SectionLink>
                break;
            case 'Contact':
                const ContactLinks: ReactElement[] = CONTACT_LINKS.map((link, index) => (
                    <a key={link.svg + index} href={link.href} target={'_blank'}>
                        <Image
                            src={link.svg}
                            alt={link.href}
                            className={'mr-[0.75rem] w-[1.8125rem] h-[1.8125rem]'}
                        />
                    </a>
                ))
                SectionContent = <div className={'flex'}>{ContactLinks}</div>;
                break;
            case 'TernKey':
                SectionContent = <SectionLink section={SectionsEnum.Documentation} className={'text-[1rem]'}/>
                break;
            case 'Home':
                const FooterLinks: ReactElement[] = FOOTER_LINKS.map((link: SectionsEnum, index) => {
                    let Delim: ReactElement | null = null;
                    if (index !== FOOTER_LINKS.length - 1)
                        Delim = <span className={'cursor-default'}>&nbsp;&bull;&nbsp;</span>;

                    return (
                        <span key={link + index}>
                  <SectionLink section={link}/>
                            {Delim}
                </span>
                    );
                })
                SectionContent = (
                    <div className={'max-w-[34.79rem] text-[1rem]'}>
                        <div
                            className={`mb-[2.69rem] sm:landscape:place-self-Home sm:landscape:absolute sm:landscape:top-[--px] sm:landscape:left-[--px]`}>
                            {FooterLinks}
                        </div>
                        <p>
                            Tern Systems is a technology company that develops, manufactures, preserves, and enhances
                            fundamental computer software and hardware.
                        </p>
                    </div>
                );
                break;
            default:
                SectionContent = null;
        }

        // Misc
        const LocationTitle = (
            <p className={`absolute top-[--py] text-[1rem] sm:landscape:right-[--px] lg:right-[--px] lg:bottom-[--py] lg:place-self-end`}>
                New York, New York
            </p>
        );
        const HomeLink = (
            <SectionLink section={SectionsEnum.Home} className={`text-text-primary text-primary cursor-pointer`}>
                Tern Systems
            </SectionLink>
        );

        if (SectionContent)
            SectionContent = <div className={'mt-[--py]'}>{SectionContent}</div>;

        return (
            <>
                <footer
                    className={`flex w-full justify-center text-center font-neo text-primary mt-auto ${!minimalLanding ? 'lg:justify-start lg:text-left' : ''}`}
                >
                    {minimalLanding ? HomeLink : SectionContent}
                    {activeSection === 'Home' ? LocationTitle : null}
                </footer>
            </>
        );
    };

    // Insignia
    // 2 pre-rendered insignias for moving without flickering
    const Insignia: ReactElement[] = [isInsigniaMoved, !isInsigniaMoved].map((state, index) => (
        <div
            key={index}
            className={`
                absolute z-10 size-[11.5rem] bg-transparent
                ${state ? 'hidden' : ''}
                ${isInsigniaMoved ? 'after:absolute after:top-0 after:w-full after:h-full' : ''}
                ${isInsigniaMoved ? 'animate-[insignia_0.3s_ease-in-out_forwards]' : 'animate-[insignia_0.3s_ease-in-out_forwards_reverse]'}
            `}
            onClick={() => handleInsigniaClick()}
        >
            <Spline scene={"https://prod.spline.design/DVjbSoDcq5dzLgus/scene.splinecode"}/>
        </div>
    ));

    return (
        <div className={"h-dvh max-h-dvh px-[--px] py-[--py] relative"}>
            {Insignia}
            <div
                className={`flex flex-col flex-grow h-full ${isViewChange ? styles.fadeOut : styles.fadeIn}`}>
                {renderContent()}
                {renderFooter()}
            </div>
        </div>
    );
}
