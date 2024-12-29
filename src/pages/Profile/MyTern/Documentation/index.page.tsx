import React, {FC, ReactElement} from "react";
import {ReactSVG} from "react-svg";

import {Route} from "@/app/static";

import {PageLink} from "@/app/ui/layout";

import {useLoginCheck} from "@/app/hooks";

import SVG_ARROW from "@/assets/images/icons/arrow.svg";


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
    const isLoggedIn = useLoginCheck();
    if (!isLoggedIn)
        return null;

    const Links: ReactElement[] = LINKS.map((link, idx) => (
        <li key={link.text + idx}>
            <PageLink
                href={link.route}
                className={`flex-col justify-between [&]:items-start bg-control-gray min-h-[9rem] w-full  
                           px-[--1qdr] py-[--2dr] h-[min(38dvw,16rem)] rounded-[--1drs]
                           sm:landscape:x-[p-[--sy-sl],h-[13dvw],text-small]`}
            >
                <span className={'font-bold block   text-header sm:landscape:text-small'}>{link.title}</span>
                <span>{link.text}</span>
                <ReactSVG
                    src={SVG_ARROW.src}
                          className={`[&_path]:fill-[--bg-control-blue] rotate-180
                                    [&_*]:size-[min(3.7dvw,1.3rem)]
                                    sm:landscape:[&_*]:size-[1.75dvw]`}
                />
            </PageLink>
        </li>
    ));

    return (
        <div className={'text-left m-auto place-items-center'}>
            <div className={'sm:x-[overflow-y-hidden,max-h-full]'}>
                <h1 className={`font-bold block
                                pb-[min(4dvw,1.9rem)] text-section-header 
                                sm:landscape:x-[pb-[2.4dvw],text-content]`}>
                    Documentation
                </h1>
                <ul className={`grid gap-[0.12rem]
                                grid-cols-[repeat(3,30rem)] text-[min(3.7dvw,1rem)]
                                sm:x-[overflow-y-scroll]
                                sm:portrait:x-[grid-cols-1,max-h-[65dvh]]
                                sm:landscape:x-[grid-cols-2,text-small]`}
                >
                    {Links}
                </ul>
            </div>
        </div>
    );
}


export default DocumentationPage;
