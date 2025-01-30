'use client'

import React, {FC, PropsWithChildren, useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import cn from "classnames";

import {LAYOUT, Route} from "@/app/static";

import {useBackground} from "@/app/hooks";
import {useLayout, useModal} from "@/app/context";
import {Header, PageLink} from "@/app/ui/layout";

import "@/app/globals.css";
import styles from "@/app/common.module.css";


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
    const Layout = (
        <>
            <Header profileMenuState={[isProfileLinksVisible, setProfileLinksVisibility]}/>
            <div
                id={'content'}
                style={{backgroundImage: `url("${bgSrc}")`}}
                className={cn(
                    `relative flex flex-col flex-grow w-full justify-center items-center`,
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
            <header className={'border-t-small border-section'}>
                <div
                    className={cn(
                        `flex justify-between items-center`,
                        `px-[--p-content-l] w-full h-[calc(0.8*var(--h-heading-lg))] content-center text-section-3xs leading-none`,
                        `lg:x-[mx-auto,w-3/4,max-w-[90rem]]`,
                        `sm:x-[flex-col-reverse,items-center,justify-between,px-[--p-content-xs],py-[--p-content-xxs],text-center]`,
                        `sm:portrait:h-[calc(1.2*var(--h-heading-lg))]`,
                        `sm:landscape:h-heading-lg sm:landscape:x-[flex-row,py-0]`
                    )}
                >
                    <span>Copyright © 2025 Tern Systems LLC</span>
                    <span className={'flex'}>
                    <PageLink href={Route.Cookies}/>
                        &nbsp;&nbsp;·&nbsp;&nbsp;
                        <PageLink href={Route.Privacy}/>
                        &nbsp;&nbsp;·&nbsp;&nbsp;
                        <PageLink href={Route.Terms}/>
                </span>
                </div>
            </header>
        </>
    );

    const LayoutFinal = layoutCtx.isNoLayout
        ? children
        : (
            <div className={`flex flex-col flex-grow justify-between h-full select-none`}>
                {Layout}
            </div>
        );

    return <div className={"h-dvh max-h-dvh relative font-neo text-primary"}>{LayoutFinal}</div>;
}

export {Layout};
