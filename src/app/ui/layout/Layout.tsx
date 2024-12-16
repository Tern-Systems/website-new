'use client'

import React, {FC, PropsWithChildren, ReactElement, useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import Spline from "@splinetool/react-spline";

import {FADE_DURATION, Route} from "@/app/static";

import {Header, PageLink} from "@/app/ui/layout";

import "@/app/globals.css";
import styles from "@/app/common.module.css";
import {useModal} from "@/app/context";


const Layout: FC<PropsWithChildren> = ({children}) => {
    const route = usePathname();
    const modalCtx = useModal();
    const params = useSearchParams();
    const router = useRouter();


    const [isInsigniaMoved, setInsigniaMoved] = useState(false);
    const [isProfileLinksVisible, setProfileLinksVisibility] = useState(false);


    useEffect(() => {
        const token = params?.get('resetToken');
        console.log(1)
        if (token)
            router.replace(Route.Home + '?resetToken=' + token);
    }, []);

    useEffect(() => {
        if (route !== null)
            setInsigniaMoved(route !== Route.Start);
        setTimeout(() => {
            setProfileLinksVisibility(false);
        }, FADE_DURATION);
    }, [route]);


    // Elements
    // 2 pre-rendered insignias for moving without flickering

    const SplineElem = <Spline scene={"https://prod.spline.design/DVjbSoDcq5dzLgus/scene.splinecode"}/>
    const Insignia: ReactElement[] = [isInsigniaMoved, !isInsigniaMoved].map((state, idx) => {
        const cn = `absolute z-10 size-[11.5rem] bg-transparent pointer-events-auto
                        ${isInsigniaMoved ? 'after:absolute after:top-0 after:w-full after:h-full cursor-pointer' : ''}
                        ${isInsigniaMoved ? 'animate-[insignia_0.3s_ease-in-out_forwards]' : 'animate-[insignia_0.3s_ease-in-out_forwards_reverse]'}
                        ${state ? 'hidden' : ''}`
        return (
            route === Route.Start
                ? <div key={state.toString() + idx} className={cn}>{SplineElem}</div>
                : (
                    <PageLink
                        key={state.toString() + idx}
                        onDrag={(event) => event.preventDefault()}
                        className={cn}
                    >
                        {SplineElem}
                    </PageLink>
                )
        )
    });

    const Layout = route === Route.Start
        ? (
            <div className={`text-primary mt-auto mb-[--py] text-[1.3125rem] font-oxygen text-center`}>
                <PageLink href={Route.Home} className={'inline-block place-self-center'}>Tern</PageLink>
            </div>
        )
        : (
            <>
                <Header profileMenuState={[isProfileLinksVisible, setProfileLinksVisibility]}/>
                <div
                    id={'content'}
                    className={`relative flex flex-col flex-grow w-full overflow-y-scroll justify-center items-center 
                                bg-content bg-cover bg-no-repeat text-primary text-center font-neo text-[1rem]
                                 ${modalCtx.isFade ? styles.fadeOut : styles.fadeIn}`}
                >
                    <div className={'h-full w-full flex flex-col p-[--py] pb-0'}>
                        {children}
                        <span className={'block pt-[--py]'}/>
                    </div>
                </div>
                <footer
                    className={`flex w-full justify-between font-neo text-primary border-t-small border-section 
                                px-[--px] py-[--py] place-self-end`}>
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

    return (
        <div className={"h-dvh max-h-dvh relative"}>
            {Insignia}
            <div
                className={`flex flex-col flex-grow justify-between h-full`}>
                {Layout}
            </div>
        </div>
    );
}

export {Layout};
