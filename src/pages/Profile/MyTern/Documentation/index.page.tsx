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
                className={`bg-control-gray rounded-[min(2.4dvw,1rem)] flex-col justify-between min-h-[9rem] h-[min(38.4dvw,16rem)]
                            w-full px-[min(4dvw,1.25rem)] py-[min(4dvw,var(--p-small))] [&]:items-start`}
            >
                <span className={'text-header] font-bold block'}>{link.title}</span>
                <span className={'text-[min(3.7dvw,1rem)]'}>{link.text}</span>
                <ReactSVG src={SVG_ARROW.src}
                          className={'[&_path]:fill-[--bg-control-blue] rotate-180 [&_*]:size-[min(3.7dvw,1.3rem)]'}/>
            </PageLink>
        </li>
    ));

    return (
        <div className={'text-left m-auto place-items-center'}>
            <div className={'sm:overflow-y-hidden sm:max-h-full'}>
                <h1 className={`text-[min(5.6dvw,2.25rem)] font-bold pb-[min(4dvw,1.9rem)] block sm:mb-0`}>
                    Documentation
                </h1>
                <ul className={`grid grid-cols-[repeat(3,30rem)] gap-[0.12rem]
                                sm:grid-cols-1 sm:overflow-y-scroll sm:max-h-[65dvh]`}>
                    {Links}
                </ul>
            </div>
        </div>
    );
}


export default DocumentationPage;