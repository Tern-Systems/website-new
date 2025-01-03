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


const CONTENT_P_CN = 'p-[min(5.3dvw,var(--s-default))]';


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
                    className={`relative flex flex-col flex-grow w-full justify-center items-center 
                                bg-cover bg-no-repeat bg-fixed text-center bg-center
                                overflow-y-scroll ${CONTENT_P_CN} text-[min(2.6dvw,1rem)]
                                sm:portrait:pt-[13.3dvw]
                                sm:landscape:p-[2.5dvw]`}
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
                    className={`flex w-full justify-between border-t-small border-section
                                ${CONTENT_P_CN} py-[min(5.3dvw,1rem)]
                                sm:x-[flex-col,items-center,gap-y-[0.95rem],text-center]
                                sm:landscape:x-[flex-row,p-[2.4dvw]]`}>
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
                          className={`z-30 cursor-pointer
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
