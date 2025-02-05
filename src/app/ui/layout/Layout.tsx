'use client'

import React, {FC, PropsWithChildren, ReactElement, ReactNode, useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import Image from "next/image";
import cn from "classnames";

import {IModalContext} from "@/app/context/Modal.context";
import {CONTACT_LINKS, LAYOUT, MEDIA_LINKS, MISC_LINKS, Route} from "@/app/static";

import {getRouteName} from "@/app/utils";
import {useLayout, useModal, useUser} from "@/app/context";

import {Header, PageLink} from "@/app/ui/layout";
import {Insignia} from "@/app/ui/misc";
import {HelpModal} from "@/app/ui/modals";

import "@/app/globals.css";
import styles from "@/app/common.module.css";

import PNG_NEURONS from "/public/images/neurons.png";


type LinkAction = string | ((modalCtx: IModalContext) => void);

type FooterLink = Route | {
    title: string;
    action: LinkAction;
    checkLogin?: true;
};


const FOOTER_LINKS: { title: string; links: FooterLink[] }[] = [
    {
        title: 'Company',
        links: [
            Route.About,
            Route.TernKey,
            Route.Contact,
            // {title: 'TernKit', action: 'https://'},
            // {title: 'Cyrus', action: 'https://'},
            {title: 'Careers', action: MISC_LINKS.Careers}
        ]
    },
    {
        title: 'Engage',
        links: [
            Route.AllWays,
            {title: 'Events', action: MISC_LINKS.Events},
            {title: 'Podcast', action: MEDIA_LINKS.YouTube.href},
            {title: 'News', action: Route.AllWays},
        ],
    },
    {
        title: 'Support',
        links: [
            {
                title: 'Billing',
                action: (modalCtx: IModalContext) => modalCtx.openModal(<HelpModal type={'brc'}/>),
                checkLogin: true,
            },
            {
                title: 'Resources',
                action: (modalCtx: IModalContext) => modalCtx.openModal(<HelpModal type={'support'}/>)
            },
            Route.MyDocumentation,
            {title: 'Training', action: MEDIA_LINKS.YouTube.href}
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
    const userCtx = useUser();

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
        const LinksLi: ReactNode[] = section.links.map((link, linkIdx) => {
            const isString = typeof link === 'string';

            const action: LinkAction = isString ? link : link.action;
            const title: string = isString ? getRouteName(link) ?? '' : link.title;
            const checkLogin = !isString && link?.checkLogin === true;

            const isHref = typeof action === 'string';

            return !checkLogin || userCtx.isLoggedIn
                ? (
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
                : null
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
                style={{backgroundImage: `url("${PNG_NEURONS.src}")`}}
                className={cn(
                    `relative flex flex-col flex-grow w-full items-center`,
                    `w-screen bg-cover bg-no-repeat bg-fixed`,
                    `sm:overflow-hidden`,
                    `sm:landscape:overflow-y-scroll`,
                )}
            >
                <div
                    className={cn(
                        `h-full min-h-dvh w-full flex flex-col`,
                        layoutCtx.isFade ? styles.fadeOut : styles.fadeIn,
                        modalCtx.hideContent ? 'hidden' : (modalCtx.darkenBg ? 'brightness-[60%]' : 'brightness-100'),
                    )}
                >
                    {children}
                </div>
            </div>
            <footer className={'border-t-small border-section'}>
                <div
                    className={cn(styles.content,
                        `grid grid-cols-[minmax(0,1fr),minmax(0,2fr)] h-[--h-footer-lg] py-[--p-content-l] leading-none`,
                        `sm:gap-y-[--p-content-xxl]`,
                    )}
                >
                    <Insignia className={'[&_*]:h-[2.5rem]'}/>
                    <ul className={'flex w-full justify-between  sm:x-[row-start-2,flex-col,mx-auto,gap-y-[--p-content-xxl],w-fit]'}>
                        {FooterLinksLi}
                    </ul>
                    <div className={'col-span-2 flex mt-[7rem] w-full justify-between items-center  sm:contents'}>
                        <p className={'sm:x-[row-start-3,col-span-2,pb-[--p-content],text-center]'}>
                            Copyright © 2025 Tern Systems LLC
                        </p>
                        <ul
                            className={cn(
                                'col-span-3 flex gap-[--p-content-3xs]',
                                'sm:x-[col-start-1,row-start-2,col-span-1,flex-col,h-full,justify-between]',
                            )}
                        >
                            {ContactLinks}
                        </ul>
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

    return (
        <div className={"h-dvh max-h-dvh relative overflow-y-scroll font-neo text-primary"}>
            {LayoutFinal}
        </div>
    );
}

export {Layout};
