'use client'

import React, {FC, PropsWithChildren, ReactElement, useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import Image from "next/image";
import cn from "classnames";

import {LAYOUT, LINKS, Route} from "@/app/static";

import {useBackground} from "@/app/hooks";
import {useLayout, useModal} from "@/app/context";
import {Header, PageLink} from "@/app/ui/layout";

import "@/app/globals.css";
import styles from "@/app/common.module.css";

import SVG_INSIGNIA from "/public/images/insignia-logo.png";
import {NavLink} from "@/app/context/Layout.context";


const Layout: FC<PropsWithChildren> = ({children}) => {
    const route = usePathname();
    const modalCtx = useModal();
    const params = useSearchParams();
    const router = useRouter();
    const layoutCtx = useLayout();
    const bgSrc = useBackground();

    const [isProfileLinksVisible, setProfileLinksVisibility] = useState(false);

    useEffect(() => {
        const token = params?.get('resetToken');
        if (token)
            router.push(Route.Home + '?resetToken=' + token);
        //eslint-disable-next-line
    }, [params?.size]);

    useEffect(() => {
        setTimeout(() => {
            setProfileLinksVisibility(false);
        }, LAYOUT.fadeDuration);
        //eslint-disable-next-line
    }, [route]);


    // Elements
    const NavLinks: ReactElement[] = LAYOUT.profileLinks?.map((link: Route, idx) => (
        <PageLink
            key={link + idx}
            href={link}
            className={`relative justify-center`}
        />
    ));
    const NavLinks2: ReactElement[] = [...layoutCtx.navLinks[NavLink.Nav]]?.map((link: Route, idx) => (
        <PageLink
            key={link + idx}
            href={link}
            className={`relative justify-center`}
        />
    ));

    const Links = LINKS.map((link, idx) => (
        <li key={link.href + idx} className={`contents`}>
            <a href={link.href} target={'_blank'} className={styles.clickable}>{link.title}</a>
        </li>
    ));

    const Layout = (
        <>
            <Header profileMenuState={[isProfileLinksVisible, setProfileLinksVisibility]}/>
            <div
                id={'content'}
                style={{backgroundImage: `url("${bgSrc}")`}}
                className={cn(
                    `relative flex flex-col flex-grow w-full items-center`,
                    `bg-cover bg-no-repeat bg-fixed text-center bg-center`,
                    `overflow-y-scroll`,
                    `sm:overflow-hidden`,
                    `sm:landscape:overflow-y-scroll`,
                )}
            >
                <div
                    className={cn(
                        `h-full w-full flex flex-col`,
                        `lg:x-[mx-auto,px-[--p-content-l],w-3/4,max-w-[90rem]]`,
                        layoutCtx.isFade ? styles.fadeOut : styles.fadeIn,
                        modalCtx.hideContent ? 'hidden' : (modalCtx.darkenBg ? 'brightness-[60%]' : 'brightness-100'),
                    )}
                >
                    {children}
                </div>
            </div>
            <footer className={'border-t-small border-section'}>
                <div
                    className={cn(
                        `flex justify-between items-center`,
                        `px-[--p-content-l] w-full h-[calc(0.8*var(--h-heading-lg))] content-center text-section-3xs leading-none`,
                        `lg:x-[grid,grid-cols-4,mx-auto,w-3/4,max-w-[90rem],h-[--h-footer-lg],py-[--p-content-l],items-start] lg:grid-rows-[1fr,max-content]`,
                        `sm:x-[flex-col-reverse,items-center,justify-between,px-[--p-content-xs],py-[--p-content-xxs],text-center]`,
                        `sm:portrait:h-[calc(1.2*var(--h-heading-lg))]`,
                        `sm:landscape:h-heading-lg sm:landscape:x-[flex-row,py-0]`
                    )}
                >
                    <p className={'contents  lg:x-[flex,flex-col,gap-y-[--p-content-5xs]]'}>
                        <span
                            className={cn(
                                'hidden mb-auto font-bold font-oxygen text-heading-l',
                                'lg:x-[inline-flex,gap-x-[--p-content-5xs],items-center]'
                            )}
                        >
                            <Image src={SVG_INSIGNIA} alt={'insignia'} className={'inline size-[2rem]'}/>
                            <span>Tern</span>
                        </span>
                    </p>
                    <div
                        className={cn(
                            'contents',
                            '[&>*]:x-[flex-col,gap-y-[--p-content-3xs],h-full,items-start]',
                            '[&>ul]:hidden lg:[&>ul]:flex',
                        )}
                    >
                        <ul>{NavLinks2}</ul>
                        <ul>{Links}</ul>
                        <p className={'flex  lg:flex-col'}>
                            <PageLink href={Route.Cookies}/>
                            <span className={'lg:hidden'}>&nbsp;&nbsp;·&nbsp;&nbsp;</span>
                            <PageLink href={Route.Privacy}/>
                            <span className={'lg:hidden'}>&nbsp;&nbsp;·&nbsp;&nbsp;</span>
                            <PageLink href={Route.Terms}/>
                        </p>
                    </div>
                    <span>Copyright © 2025 Tern Systems LLC</span>
                </div>
            </footer>
        </>
    );

    const LayoutFinal = layoutCtx.isNoLayout
        ? children
        : (
            <div className={`flex flex-col flex-grow justify-between min-h-full select-none`}>
                {Layout}
            </div>
        );

    return <div className={"h-dvh max-h-dvh relative font-neo text-primary  lg:overflow-y-scroll"}>{LayoutFinal}</div>;
}

export {Layout};
