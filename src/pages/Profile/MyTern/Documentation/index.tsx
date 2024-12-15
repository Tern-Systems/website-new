import React, {FC, ReactElement} from "react";
import Image from "next/image";

import {Route} from "@/app/static";


import SVG_ARROW from "@/assets/images/icons/arrow-right.svg";
import {PageLink} from "@/app/ui/layout";


const LINKS: { title: string; text: string; route: Route }[] = [
    {
        title: 'TernKey Manual',
        text: 'Discover the sandbox application that unlocks the potential of ternary programming.',
        route: Route.TernKeyManual
    },
    {
        title: 'ARCH Manual',
        text: 'Maximize your AR code\'s potential with this comprehensive user manual.',
        route: Route.ARCHManual
    },
    {
        title: 'TernKit Manual',
        text: 'Research and test ternary code on a machine equipped for ternary logic execution.',
        route: Route.TernKitManual
    },
    {
        title: 'G Handbook',
        text: 'Master the G high-level programming language, optimized for ternary-based computing.',
        route: Route.GHandbook
    },
    {
        title: 'TERN Handbook',
        text: 'Discover the TERN assembly programming language and redefine coding beyond binary limits.',
        route: Route.TernHandbook
    },
    {
        title: 'BTMC Textbook',
        text: 'This textbook outlines BTMC fundamentals and the implementation of balanced ternary logic in systems.',
        route: Route.BTMCHandbook
    },
]


const DocumentationPage: FC = () => {
    const Links: ReactElement[] = LINKS.map((link, idx) => (
        <li
            key={link.text + idx}
        >
            <PageLink
                href={link.route}
                className={`bg-control rounded-[1rem] flex-col flex justify-between h-[16.18rem] px-[1.25rem] py-[--py]
                            [&]:items-start`}
            >
                <span className={'text-[1.69rem] font-bold'}>{link.title}</span>
                <span>{link.text}</span>
                <Image
                    src={SVG_ARROW}
                    alt={'arrow'}
                />
            </PageLink>
        </li>
    ));

    return (
        <div className={'px-[15rem] text-left my-auto place-items-center'}>
            <div>
                <h1 className={'text-[2.25rem] font-bold mb-[1.9rem] block'}>Documentation</h1>
                <ul className={'grid grid-cols-[repeat(3,30rem)] grid-rows-2 gap-[0.12rem]'}>{Links}</ul>
            </div>
        </div>
    );
}


export default DocumentationPage;