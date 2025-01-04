'use client'

import React, {FC, PropsWithChildren, useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import cn from "classnames";

import {LAYOUT, Route} from "@/app/static";

import {useBackground, useNavigate} from "@/app/hooks";
import {useLayout, useModal} from "@/app/context";

import {Insignia} from "@/app/ui/misc";
import {Header, PageLink} from "@/app/ui/layout";

import "@/app/globals.css";
import styles from "@/app/common.module.css";


const Layout: FC<PropsWithChildren> = ({children}) => {
    const route = usePathname();
    const modalCtx = useModal();
    const params = useSearchParams();
    const router = useRouter();
    const layoutCtx = useLayout();
    const [navigate] = useNavigate();
    const bgSrc = useBackground();

    const [isInsigniaMoved, setInsigniaMoved] = useState(false);
    const [isProfileLinksVisible, setProfileLinksVisibility] = useState(false);

    useEffect(() => {
        const token = params?.get('resetToken');
        if (token)
            router.push(Route.Home + '?resetToken=' + token);
        //eslint-disable-next-line
    }, [params]);

    useEffect(() => {
        if (route)
            setInsigniaMoved(route !== Route.Start);
        setTimeout(() => {
            setProfileLinksVisibility(false);
        }, LAYOUT.fadeDuration);
    }, [route]);


    // Elements
    const Layout = route === Route.Start
        ? (
            <div
                className={`mt-auto mb-[--s-default] text-content font-oxygen text-center`}
            >
                <span
                    onClick={() => {
                        setInsigniaMoved(true);
                        setTimeout(() => navigate(Route.Home), 2 * LAYOUT.fadeDuration);
                    }}
                    className={`cursor-pointer ${styles.clickable}`}
                >
                    Tern
                </span>
            </div>
        )
        : (
            <>
                <Header profileMenuState={[isProfileLinksVisible, setProfileLinksVisibility]}/>
                <div
                    id={'content'}
                    style={{backgroundImage: `url("${bgSrc}")`}}
                    className={`relative flex flex-col flex-grow h-full w-full justify-center items-center 
                                bg-cover bg-no-repeat bg-fixed text-center bg-center
                                overflow-y-scroll text-[min(2.6dvw,1rem)]`}
                >
                    <div
                        className={cn(
                            `h-full w-full flex flex-col
                            sm:landscape:x-[overflow-scroll]`,
                            layoutCtx.isFade ? styles.fadeOut : styles.fadeIn,
                            modalCtx.hideContent ? 'hidden' : (modalCtx.darkenBg ? 'brightness-[60%]' : 'brightness-100'),
                        )}
                    >
                        {children}
                    </div>
                </div>
                <footer
                    className={`flex justify-between items-center
                            px-[--p-content] w-full h-[5.12rem] border-t-small border-section content-center text-[1rem] leading-none
                            sm:x-[flex-col-reverse,items-center,justify-between,p-[--p-content-sm],text-center]
                            sm:portrait:[h-[4.94rem]]
                            sm:landscape:x-[flex-row,p-[2.4dvw],h-[3.19rem]]`}>
                    <span>Copyright © 2025 Tern Systems LLC</span>
                    <span className={'flex'}>
                        <PageLink href={Route.Cookies}/>
                        &nbsp;·&nbsp;
                        <PageLink href={Route.Privacy}/>
                        &nbsp;·&nbsp;
                        <PageLink href={Route.Terms}/>
                    </span>
                </footer>
            </>
        );

    const LayoutFinal = layoutCtx.isNoLayout
        ? children
        : (
            <>
                <Insignia insigniaMoved={isInsigniaMoved}
                          className={`absolute z-30 w-[30rem] cursor-pointer
                            ml-[--insignia-pl-moved] mt-[--insignia-pt-moved]
                            sm:x-[ml-[--p-content-sm],mt-[--p-content-sm]]
                            ${isInsigniaMoved
                              ? 'animate-[insignia_1s_ease-in-out_forwards]'
                              : 'animate-[insignia_1s_ease-in-out_forwards_reverse]'}`}
                />
                <div
                    className={`flex flex-col flex-grow justify-between h-full`}>
                    {Layout}
                </div>
            </>
        );

    return <div className={"h-dvh max-h-dvh relative font-neo text-primary"}>{LayoutFinal}</div>;
}

export {Layout};
