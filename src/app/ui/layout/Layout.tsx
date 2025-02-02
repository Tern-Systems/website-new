'use client'

import React, {FC, PropsWithChildren, ReactElement, useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import Image from "next/image";
import cn from "classnames";

import {IModalContext} from "@/app/context/Modal.context";
import {CONTACT_LINKS, LAYOUT, MEDIA_LINKS, MISC_LINKS, Route} from "@/app/static";

import {getRouteName} from "@/app/utils";
import {useBackground} from "@/app/hooks";
import {useLayout, useModal} from "@/app/context";

import {Header, PageLink} from "@/app/ui/layout";
import {HelpModal} from "@/app/ui/modals";

import "@/app/globals.css";
import styles from "@/app/common.module.css";

import SVG_LOGO from "/public/images/tern-logo.png";


type FooterLink = Route | { title: string; action: string | ((modalCtx: IModalContext) => void) };


const FOOTER_LINKS: { title: string; links: FooterLink[] }[] = [
    {
        title: 'Company',
        links: [
            Route.About,
            Route.TernKey,
            Route.Contact,
            // {title: 'TernKit', action: 'https://'},
            // {title: 'Cyrus', action: 'https://'},
            {title: 'Careers', action: MISC_LINKS.Careers.href}
        ]
    },
    {
        title: 'Engage',
        links: [
            Route.AllWays,
            {title: 'Events', action: MISC_LINKS.Events.href},
            {title: 'Podcast', action: MEDIA_LINKS.YouTube.href},
        ]
    },
    {
        title: 'Resources',
        links: [
            {
                title: 'Billing Resolution Center',
                action: (modalCtx: IModalContext) => modalCtx.openModal(<HelpModal type={'brc'}/>)
            },
            {
                title: 'Support Hub',
                action: (modalCtx: IModalContext) => modalCtx.openModal(<HelpModal type={'support'}/>)
            },
            Route.MyDocumentation,
            {title: 'Learning Material', action: MEDIA_LINKS.YouTube.href}
        ]
    },
    {
        title: 'Policies',
        links: [
            Route.Cookies,
            Route.Privacy,
            Route.Terms,
        ]
    }
];


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


    const FooterLinksLi: ReactElement[] = FOOTER_LINKS.map((section, idx: number) => {
        const LinksLi: ReactElement[] = section.links.map((link, linkIdx) => {
            const action = typeof link === 'string' ? link : link.action;
            const title = typeof link === 'string' ? getRouteName(link) ?? '' : link.title;

            const isHref = typeof action === 'string';

            return (
                <PageLink
                    key={title + linkIdx}
                    onClick={() => {
                        if (!isHref)
                            action(modalCtx);
                    }}
                    prevent={!isHref}
                    isExternal={isHref && action.includes('https://')}
                    href={isHref ? action : ''}
                    className={`relative capitalize`}
                >
                    {title}
                </PageLink>
            )
        });

        return (
            <li key={section.title + idx}>
                <ul className={'flex flex-col gap-y-[--p-content-xs]'}>
                    <li className={'font-bold text-section-s capitalize'}>{section.title}</li>
                    {LinksLi}
                </ul>
            </li>
        );
    });

    const ContactLinks: ReactElement[] = Object.entries({...CONTACT_LINKS, ...MEDIA_LINKS}).map(([title, link], idx) => (
        <li key={title + idx} className={`size-[2.5rem] sm:size-[--p-content] ${styles.clickable}`}>
            <a href={link.href} target={'_blank'}>
                <Image src={link.svg} alt={link.href} className={'h-full w-auto'}/>
            </a>
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
                    {[`lg:!bg-none`]: route === Route.Home},
                    `sm:overflow-hidden`,
                    `sm:landscape:overflow-y-scroll`,
                )}
            >
                <div
                    className={cn(
                        `h-full min-h-dvh w-full flex flex-col`,
                        `lg:mx-auto`,
                        layoutCtx.isFade ? styles.fadeOut : styles.fadeIn,
                        modalCtx.hideContent ? 'hidden' : (modalCtx.darkenBg ? 'brightness-[60%]' : 'brightness-100'),
                        {['lg:x-[w-3/4,max-w-[90rem],px-[--p-content-l]]']: route !== Route.Home}
                    )}
                >
                    {children}
                </div>
            </div>
            <footer className={'border-t-small border-section'}>
                <div
                    className={cn(
                        `flex justify-between items-center`,
                        `px-[--p-content-l] w-full h-[calc(0.8*var(--h-heading-lg))] content-center leading-none`,
                        `lg:x-[grid,mx-auto,w-3/4,max-w-[90rem],h-[--h-footer-lg],py-[--p-content-l],items-start,justify-items-end]`,
                        `lg:grid-cols-[minmax(0,1fr),minmax(0,2fr)]`,
                        `sm:x-[flex-col-reverse,items-center,justify-between,px-[--p-content-xs],py-[--p-content-xxs],text-center]`,
                        `sm:portrait:h-[calc(1.2*var(--h-heading-lg))]`,
                        `sm:landscape:h-heading-lg sm:landscape:x-[flex-row,py-0]`
                    )}
                >
                    <p className={'contents  lg:x-[justify-self-start,flex,flex-col,gap-y-[--p-content-5xs]]'}>
                        <Image
                            src={SVG_LOGO}
                            alt={'Logo'}
                            className={cn(
                                'hidden mb-auto',
                                'lg:x-[inline-flex,gap-x-[--p-content-5xs],w-[5.875rem],items-center]'
                            )}
                        />
                    </p>
                    <ul className={'flex w-full justify-between'}>
                        {FooterLinksLi}
                    </ul>
                    <div className={'col-span-2 flex mt-[7rem] w-full justify-between items-center'}>
                        <p>Copyright © 2025 Tern Systems LLC</p>
                        <ul className={'col-span-3 flex gap-[--p-content-3xs]'}>{ContactLinks}</ul>
                    </div>
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
