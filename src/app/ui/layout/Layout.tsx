'use client'

import React, {FC, PropsWithChildren, ReactElement, useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import Spline from "@splinetool/react-spline";

import {FADE_DURATION, Route} from "@/app/static";

import {useNavigate} from "@/app/hooks";
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
    const [navigate] = useNavigate();


    const [isInsigniaMoved, setInsigniaMoved] = useState(false);
    const [isProfileLinksVisible, setProfileLinksVisibility] = useState(false);


    useEffect(() => {
        const token = params?.get('resetToken');
        if (token)
            router.replace(Route.Home + '?resetToken=' + token);
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (route)
            setInsigniaMoved(route !== Route.Start);
        setTimeout(() => {
            setProfileLinksVisibility(false);
        }, FADE_DURATION);
    }, [route]);


    // Elements
    // 2 pre-rendered insignias for moving without flickering
    const Insignia: ReactElement[] = [isInsigniaMoved, !isInsigniaMoved].map((state, idx) => {
        const cn = `absolute z-10 size-[15rem] bg-transparent pointer-events-auto 
                        ${isInsigniaMoved ? 'animate-[insignia_1s_ease-in-out_forwards] cursor-pointer' : 'animate-[insignia_1s_ease-in-out_forwards_reverse]'}
                        ${state ? 'hidden' : ''}`
        return (
            <div
                key={state.toString() + idx}
                onClick={() => {
                    if (route !== Route.Start)
                        navigate(Route.Home);
                }}
                className={cn}
            >
                <Spline scene={"https://prod.spline.design/DVjbSoDcq5dzLgus/scene.splinecode"}/>
            </div>
        );
    });

    const Layout = route === Route.Start
        ? (
            <div
                className={`text-primary mt-auto mb-[--p-small] text-[1.3125rem] font-oxygen text-center`}
            >
                <span
                    onClick={() => {
                        setInsigniaMoved(true);
                        setTimeout(() => navigate(Route.Home), 2 * FADE_DURATION);
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
                    className={`relative flex flex-col flex-grow w-full overflow-y-scroll justify-center items-center 
                                bg-content bg-cover bg-no-repeat bg-fixed text-primary text-center font-neo text-[1rem]`}
                >
                    <div
                        className={`h-full w-full flex flex-col p-[--p-small] pb-0
                                    ${modalCtx.hideContent ? 'hidden' : ''}
                                    ${layoutCtx.isFade ? styles.fadeOut : styles.fadeIn}`}>
                        {children}
                        <span className={'block pt-[--p-small]'}/>
                    </div>
                </div>
                <footer
                    className={`flex w-full justify-between font-neo text-primary border-t-small border-section 
                                px-[--p-small] py-[1rem] place-self-end text-[0.6rem]`}>
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
                {Insignia}
                <div
                    className={`flex flex-col flex-grow justify-between h-full`}>
                    {Layout}
                </div>
            </>
        );

    return <div className={"h-dvh max-h-dvh relative"}>{LayoutFinal}</div>;
}

export {Layout};
