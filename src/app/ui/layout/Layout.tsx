'use client'

import React, {FC, PropsWithChildren, useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import cn from "classnames";

import {LAYOUT, Route} from "@/app/static";

import {useBackground} from "@/app/hooks";
import {useLayout, useModal} from "@/app/context";

import {Insignia} from "@/app/ui/misc";
import {Header, PageLink} from "@/app/ui/layout";

import "@/app/globals.css";
import styles from "@/app/common.module.css";


const INSIGNIA_MOVING_TIME = 1000;


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
    }, [params]);

    useEffect(() => {
        if (route) {
            layoutCtx.setMovingAnimationState(route !== Route.Start);
            layoutCtx.setInsigniaMoved(route !== Route.Start);
        }
        setTimeout(() => {
            setProfileLinksVisibility(false);
        }, LAYOUT.fadeDuration);
        //eslint-disable-next-line
    }, [route]);


    // Elements
    const Layout = route === Route.Start
        ? (
            <div
                className={`mt-auto mb-[--s-default] text- font-oxygen text-center`}
            >
                <PageLink href={Route.Home} timeout={INSIGNIA_MOVING_TIME}
                          onClick={() => layoutCtx.setMovingAnimationState(true)}>
                    Tern
                </PageLink>
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
                                overflow-y-scroll
                                sm:overflow-hidden
                                sm:landscape:overflow-y-scroll`}
                >
                    <div
                        className={cn(
                            `h-full w-full flex flex-col
                            lg:overflow-scroll md:overflow-scroll`,
                            layoutCtx.isFade ? styles.fadeOut : styles.fadeIn,
                            modalCtx.hideContent ? 'hidden' : (modalCtx.darkenBg ? 'brightness-[60%]' : 'brightness-100'),
                        )}
                    >
                        {children}
                    </div>
                </div>
                <footer
                    className={cn(
                        `flex justify-between items-center`,
                        `px-[--p-content-l] w-full min-h-[5.12rem] border-t-small border-section content-center text-basic leading-none`,
                        `sm:x-[flex-col-reverse,items-center,justify-between,p-[--p-content-xs],text-center]`,
                        `sm:portrait:x-[min-h-[4.94rem]]`,
                        `sm:landscape:x-[flex-row,py-0,min-h-[3.19rem]]`
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
                </footer>
            </>
        );

    const LayoutFinal = layoutCtx.isNoLayout
        ? children
        : (
            <>
                <Insignia insigniaMoved={layoutCtx.isInsigniaMoved}
                          className={`absolute z-30 w-[29rem] h-[24rem] cursor-pointer
                          ${layoutCtx.isInsigniaMoved
                              ? `[&]:size-[--insignia-moved-size] ml-[--insignia-pl-moved] mt-[--insignia-pt-moved]
                                sm:x-[ml-[--p-content-xs],mt-[--p-content-xs]]`
                              : (layoutCtx.isInsigniaMovedAnim
                                  ? `animate-[insignia_1s_ease-in-out_forwards]`
                                  : 'animate-[insigniaReverse_1s_ease-in-out_forwards]')
                          }`}
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
