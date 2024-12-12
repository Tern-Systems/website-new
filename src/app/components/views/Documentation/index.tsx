import React, {FC, ReactElement} from "react";
import Image from "next/image";

import {SectionsEnum} from "@/app/utils/sections";

import {withSectionLink} from "@/app/hocs";

import {DocumentationWrapper} from './DocumentationWrapper';

import SVG_ARROW from "@/assets/images/icons/arrow-right.svg";


const LINKS: { title: string; text: string; link: SectionsEnum }[] = [
    {
        title: 'TernKey Manual',
        text: 'Discover the sandbox application that unlocks the potential of ternary programming.',
        link: SectionsEnum.TernKeyManual
    },
    {
        title: 'ARCH Manual',
        text: 'Maximize your AR code\'s potential with this comprehensive user manual.',
        link: SectionsEnum.ARCHManual
    },
    {
        title: 'TernKit Manual',
        text: 'Research and test ternary code on a machine equipped for ternary logic execution.',
        link: SectionsEnum.TernKitManual
    },
    {
        title: 'G Handbook',
        text: 'Master the G high-level programming language, optimized for ternary-based computing.',
        link: SectionsEnum.GHandbook
    },
    {
        title: 'TERN Handbook',
        text: 'Discover the TERN assembly programming language and redefine coding beyond binary limits.',
        link: SectionsEnum.TernHandbook
    },
    {
        title: 'BTMC Textbook',
        text: 'This textbook outlines BTMC fundamentals and the implementation of balanced ternary logic in systems.',
        link: SectionsEnum.BTMCHandbook
    },
]

const DocumentationView: FC = () => {
    const SectionLink = withSectionLink<SectionsEnum, string>();

    const Links: ReactElement[] = LINKS.map((link, index) => (
        <li
            key={link.text + index}
        >
            <SectionLink
                section={link.link}
                className={'bg-control rounded-[1rem] flex-col flex justify-between h-[16.18rem] px-[1.25rem] py-[--py]' +
                    '       [&]:items-start'}
            >
                <span className={'text-[1.69rem] font-bold'}>{link.title}</span>
                <span>{link.text}</span>
                <Image
                    src={SVG_ARROW}
                    alt={'arrow'}
                />
            </SectionLink>
        </li>
    ));

    return (
        <div className={'px-[15rem] pt-[9rem] text-left'}>
            <h1 className={'text-[2.25rem] font-bold mb-[1.9rem]'}>Documentation</h1>
            <ul className={'grid grid-cols-3 grid-rows-2 gap-[0.12rem]'}>{Links}</ul>
        </div>
    );
}

export {DocumentationView, DocumentationWrapper}