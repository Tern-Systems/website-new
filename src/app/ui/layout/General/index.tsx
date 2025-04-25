'use client';

import { FC, PropsWithChildren, ReactElement, ReactNode, useEffect, useRef } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { IModalContext } from '@/app/contexts/modal.context';
import { CONTACT_LINKS, MEDIA_LINKS, MISC_LINKS, Route } from '@/app/static';

import { getIdName } from '@/app/utils';
import { useLayout, useModal, useUser } from '@/app/hooks';

import { PageLink } from '@/app/ui/layout';
import { Insignia } from '@/app/ui/organisms';
import { HelpModal } from '@/app/ui/modals';
import { Header } from './Header';

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
            Route.Product,
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
    const layoutCtx = useLayout();
    const userCtx = useUser();

    const [_, setScrollState] = layoutCtx.scrollState;

    const ref = useRef<HTMLDivElement>(null);
    const scrollIntervalRef = useRef<null | NodeJS.Timeout>(null);

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
                    external={isHref && action.includes('https://')}
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
                className={'w-fit'}
            >
                <ul className={'flex flex-col gap-y-xs'}>
                    <li className={'text-18 font-bold capitalize'}>{section.title}</li>
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
            className={`size-3xl ${styles.clickable}`}
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
                        `pt-xxl pb-n leading-none tracking-wide`,
                        `xs:x-[flex,flex-col,gap-y-6xl-1]`,
                        `sm:x-[flex,flex-col,gap-y-6xl-1]`,
                    )}
                >
                    <div
                        className={cn(
                            `h-footer-lg grid grid-cols-[min-content,minmax(0,2fr)] `,
                            `sm:x-[flex,flex-col,gap-y-xxl]`,
                        )}
                    >
                        <Insignia className={'[&&_*]:!h-xl [&_*]:[max-width:unset] self-start'} />
                        <ul
                            className={cn(
                                'flex w-full  md:justify-items-end  lg:justify-items-end',
                                'grid gap-y-xxl',
                                'grid-cols-2 md:grid-cols-4 lg:grid-cols-4',
                                'xs:gap-x-xxl',
                            )}
                        >
                            {FooterLinksLi}
                        </ul>
                    </div>
                    <div
                        className={cn(
                            'col-span-2 flex w-full items-center justify-between  md:mt-[10.9375rem]  lg:mt-7xl ',
                            `xs:x-[flex,flex-col-reverse,gap-y-xxl,mt-0,items-start]`,
                        )}
                    >
                        <p className={'leading-n  xs:self-start  sm:self-end  md:self-end  lg:self-end'}>
                            Copyright © 2025 Tern Inc.{' '}
                        </p>
                        <ul className={cn('flex flex-wrap gap-3xs col-span-3')}>{ContactLinks}</ul>
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
            className={`flex min-h-full flex-grow flex-col select-none justify-between`}
        >
            {Layout}
        </div>
    );

    return <div className={'h-dvh max-h-dvh overflow-y-scroll text-primary'}>{LayoutFinal}</div>;
};

export { Layout };
