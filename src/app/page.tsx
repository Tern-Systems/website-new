'use client'

import {ReactElement, useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import Spline from '@splinetool/react-spline';

import {SectionsEnum} from "@/app/utils/sections";

import {withSectionLink} from "@/app/hocs/withSectionLink";
import {useModal} from "@/app/context/Modal.context";

import Header from "@/app/components/Header";
import Content from "@/app/components/Content";

import styles from './page.module.css';

const FADE_DURATION = 300;

export default function Home() {
    const router = useRouter();
    const modalCtx = useModal();
    const params = useSearchParams();

    const [activeSection, setActiveSection] = useState<SectionsEnum>(SectionsEnum.Start);
    const [isViewChange, setViewChange] = useState<boolean>(true);
    const [isInsigniaMoved, setInsigniaMoved] = useState(false);
    const [isProfileLinksVisible, setProfileLinksVisibility] = useState(false);
    const [isHeadingsHidden, setHeadingsHidden] = useState(false);

    const handleInsigniaClick = () => {
        history.pushState({}, '', window.location.href);
        router.replace(`/?section=${SectionsEnum.Home}`);
    };

    const section = params.get('section') as SectionsEnum;
    useEffect(() => {
        if (!Object.values(SectionsEnum).includes(section) || section === activeSection)
            return;


        setViewChange(true);
        if (section !== null)
            setInsigniaMoved(section !== SectionsEnum.Start);
        setTimeout(() => {
            setActiveSection(section);
            setViewChange(false);
            setProfileLinksVisibility(false);
            setHeadingsHidden(false);
            modalCtx.closeModal();
        }, FADE_DURATION);
    }, [section, activeSection, modalCtx]);

    const SectionLink = withSectionLink(router);

    // Elements

    // 2 pre-rendered insignias for moving without flickering
    const Insignia: ReactElement[] = [isInsigniaMoved, !isInsigniaMoved].map((state, index) => (
        <div
            key={index}
            className={`
                    absolute z-10 size-[11.5rem] bg-transparent
                    ${state ? 'hidden' : ''}
                    ${isInsigniaMoved ? 'after:absolute after:top-0 after:w-full after:h-full cursor-pointer' : ''}
                    ${isInsigniaMoved ? 'animate-[insignia_0.3s_ease-in-out_forwards]' : 'animate-[insignia_0.3s_ease-in-out_forwards_reverse]'}
                    `}
            onClick={() => handleInsigniaClick()}
        >
            <Spline scene={"https://prod.spline.design/DVjbSoDcq5dzLgus/scene.splinecode"}/>
        </div>
    ));

    const HeaderElem = isHeadingsHidden ? null
        : (
            <Header
                activeSection={activeSection}
                profileMenuState={[isProfileLinksVisible, setProfileLinksVisibility]}
            />
        );
    const FooterElem = isHeadingsHidden ? null
        : (
            <footer
                className={`flex w-full justify-between font-neo text-primary border-t-small border-section px-[--px] py-[--py] place-self-end`}>
                <span>© Copyright 2025 Tern Systems LLC</span>
                <span>New York, New York</span>
            </footer>
        );

    const Layout = activeSection === 'Start'
        ? (
            <span className={`text-primary text-center mt-auto mb-[--py]`}>
                <SectionLink section={SectionsEnum.Home} className={'cursor-pointer'}>Tern</SectionLink>
            </span>
        )
        : (
            <>
                {HeaderElem}
                <Content
                    activeSection={activeSection}
                    headingsHiddenState={[isHeadingsHidden, setHeadingsHidden]}
                />
                {FooterElem}
            </>
        );

    return (
        <div className={"h-dvh max-h-dvh relative"}>
            {isHeadingsHidden ? null : Insignia}
            <div
                className={`flex flex-col flex-grow justify-between h-full ${isViewChange ? styles.fadeOut : styles.fadeIn}`}>
                {Layout}
            </div>
        </div>
    );
}
