'use client';

import React, { FC, PropsWithChildren, ReactElement, ReactNode, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import cn from 'classnames';

import { IModalContext } from '@/app/context/Modal.context';
import { CONTACT_LINKS, MEDIA_LINKS, MISC_LINKS, Route } from '@/app/static';

import { getIdName } from '@/app/utils';
import { useLayout, useModal, useUser } from '@/app/context';

import { PageLink } from '@/app/ui/layout';
import { Insignia } from '@/app/ui/organisms';
import { HelpModal } from '@/app/ui/modals';
import { Header } from './Header';

import '@/app/globals.css';
import styles from '@/app/common.module.css';

type LinkAction = string | ((modalCtx: IModalContext) => void);

type FooterLink =
    | Route
    | {
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
            { title: 'Careers', action: MISC_LINKS.Careers },
        ],
    },
    {
        title: 'Engage',
        links: [
            Route.AllWays,
            { title: 'Events', action: MISC_LINKS.Events },
            { title: 'Newsletter', action: Route.AllWays },
            { title: 'Podcast', action: MEDIA_LINKS.YouTube.href },
            { title: 'Videos', action: MEDIA_LINKS.YouTube.href },
        ],
    },
    {
        title: 'Policies',
        links: [Route.Cookies, Route.Privacy, Route.Terms],
    },
    {
        title: 'Support',
        links: [
            {
                title: 'Billing',
                action: (modalCtx: IModalContext) => modalCtx.openModal(<HelpModal type={'brc'} />),
            },
            Route.MyDocumentation,
            {
                title: 'Resources',
                action: (modalCtx: IModalContext) => modalCtx.openModal(<HelpModal type={'support'} />),
            },
            { title: 'Training', action: MEDIA_LINKS.YouTube.href },
        ],
    },
];

const SCROLL_CHECK_INTERVAL_MS = 50;

const Layout: FC<PropsWithChildren> = ({ children }) => {
    const modalCtx = useModal();
    const params = useSearchParams();
    const router = useRouter();
    const layoutCtx = useLayout();
    const userCtx = useUser();

    const [_, setScrollState] = layoutCtx.scrollState;

    const ref = useRef<HTMLDivElement>(null);
    const scrollIntervalRef = useRef<null | NodeJS.Timeout>(null);

    useEffect(() => {
        const token = params?.get('resetToken');
        if (token) router.push(Route.Home + '?resetToken=' + token);
    }, [params?.size]);

    useEffect(() => {
        const handleScroll = () => {
            setScrollState((prevState) => ({
                ...prevState,
                scrollHeight: ref.current?.scrollHeight ?? 0,
                scrollTop: ref.current?.getBoundingClientRect().top ?? 0,
            }));
        };

        const handleMouseDown = (event: MouseEvent) => {
            if (event.button === 1 && !scrollIntervalRef.current) {
                scrollIntervalRef.current = setInterval(() => {
                    handleScroll();
                }, SCROLL_CHECK_INTERVAL_MS);
            } else if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
                handleScroll();
                scrollIntervalRef.current = null;
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (['ArrowDown', 'Escape', 'ArrowUp'].includes(event.key)) handleScroll();
        };

        window.addEventListener('wheel', handleScroll);
        window.addEventListener('mouseup', handleMouseDown);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('wheel', handleScroll);
            window.removeEventListener('mouseup', handleMouseDown);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [ref.current, scrollIntervalRef.current]);

    const FooterLinksLi: ReactElement[] = FOOTER_LINKS.map((section, idx: number) => {
        const LinksLi: ReactNode[] = section.links.map((link, linkIdx) => {
            const isString = typeof link === 'string';

            const action: LinkAction = isString ? link : link.action;
            const title: string = isString ? (getIdName(link) ?? '') : link.title;
            const checkLogin = !isString && link?.checkLogin === true;

            const isHref = typeof action === 'string';

            return !checkLogin || userCtx.isLoggedIn ? (
                <PageLink
                    key={title + linkIdx}
                    onClick={() => {
                        if (!isHref) action(modalCtx);
                    }}
                    prevent={!isHref}
                    isExternal={isHref && action.includes('https://')}
                    href={isHref ? action : ''}
                    className={`relative capitalize`}
                >
                    {title}
                </PageLink>
            ) : null;
        });

        return (
            <li
                key={section.title + idx}
                className={'xxs:flex-1'}
            >
                <ul className={'flex flex-col gap-y-xs'}>
                    <li className={'text-section-s font-bold capitalize'}>{section.title}</li>
                    {LinksLi}
                </ul>
            </li>
        );
    });

    const ContactLinks: ReactElement[] = [
        CONTACT_LINKS.X,
        CONTACT_LINKS.LinkedIn,
        MEDIA_LINKS.YouTube,
        MEDIA_LINKS.Instagram,
    ].map((link, idx) => (
        <li
            key={link.href + idx}
            className={`size-[2.5rem] sm:size-n ${styles.clickable}`}
        >
            <a
                href={link.href}
                target={'_blank'}
            >
                <Image
                    src={link.svg}
                    alt={link.href}
                    className={'h-full w-auto'}
                />
            </a>
        </li>
    ));

    const Layout = (
        <>
            <Header />
            <div
                id={'content'}
                className={cn(
                    `flex w-full flex-grow flex-col items-center`,
                    `w-screen bg-cover bg-fixed bg-no-repeat`,
                    `sm:overflow-hidden`,
                    `sm:landscape:overflow-y-scroll`,
                )}
            >
                <div
                    className={cn(
                        `flex h-full min-h-dvh w-full flex-col`,
                        layoutCtx.isFade ? styles.fadeOut : styles.fadeIn,
                        modalCtx.hideContent ? 'hidden' : modalCtx.darkenBg ? 'brightness-[60%]' : 'brightness-100',
                    )}
                >
                    {children}
                </div>
            </div>
            <footer className={'border-t-s border-gray'}>
                <div
                    className={cn(
                        styles.content,
                        `h-footer-lg grid grid-cols-[minmax(0,1fr),minmax(0,2fr)] py-l leading-none`,
                        `xs:x-[flex,flex-col,gap-y-xxl]`,
                    )}
                >
                    <Insignia className={'[&_*]:x-[!w-[5.875rem],h-auto]'} />
                    <ul
                        className={cn(
                            'flex w-full justify-between',
                            `xs:x-[justify-start,gap-x-xxl]`,
                            `xxs:x-[gap-y-n,flex-wrap]`,
                        )}
                    >
                        {FooterLinksLi}
                    </ul>
                    <div
                        className={cn(
                            'col-span-2 mt-[7rem] flex w-full items-center justify-between',
                            `xs:x-[flex,flex-col-reverse,gap-y-n,mt-0,items-start]`,
                        )}
                    >
                        <p className={'leading-n'}>Copyright © 2025 Tern Systems LLC </p>
                        <ul className={cn('col-span-3 flex flex-wrap gap-3xs')}>{ContactLinks}</ul>
                    </div>
                </div>
            </footer>
        </>
    );

    const LayoutFinal = layoutCtx.isNoLayout ? (
        children
    ) : (
        <div
            ref={ref}
            className={`flex min-h-full flex-grow select-none flex-col justify-between`}
        >
            {Layout}
        </div>
    );

    return <div className={'h-dvh max-h-dvh overflow-y-scroll text-primary'}>{LayoutFinal}</div>;
};

export { Layout };
