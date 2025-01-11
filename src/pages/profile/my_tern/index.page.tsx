import React, {FC, ReactElement, useEffect, useState} from "react";
import {ReactSVG} from "react-svg";
import cn from "classnames";

import {PlanName} from "@/app/types/subscription";
import {ButtonIcon} from "@/app/ui/form/Button";
import {Route, TERN_AC_HREF} from "@/app/static";

import {capitalize, copyObject} from "@/app/utils";
import {useModal, useUser} from "@/app/context";
import {useBreakpointCheck, useLoginCheck, useNavigate} from "@/app/hooks";

import {ScrollEnd} from "@/app/ui/misc";
import {PageLink} from "@/app/ui/layout";
import {HelpModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";
import {FAQsModal} from "./faqs/index.page";


import SVG_ARROW from '@/assets/images/icons/arrow.svg';

import styles from "@/app/common.module.css";


const EVENTS_TEMPLATE: TableEntry[] = [
    {name: 'Streaming on X: ihhffffffffffffffffvipcow[esssssofaaaaaa', data: Date.now(), href: 'https://youtube.com'},
    {name: 'Streaming on youtube: sdjla ', data: Date.now(), href: 'https://youtube.com'},
    {name: 'Streaming on X: ads', data: Date.now(), href: 'https://youtube.com'},
    {name: 'Streaming on X: ', data: Date.now(), href: 'https://youtube.com'},
    {name: 'Streaming on X: ', data: Date.now(), href: 'https://youtube.com'},
    {name: 'Streaming on X: ', data: Date.now(), href: 'https://youtube.com'},
];


type TableEntry = {
    name: string;
    data: number | string;
    href: string | Route;
}

type TableSection = {
    title: string;
    columnNames: [string, string];
    data: TableEntry[];
}


const NAV_BTNS_DEFAULT: { title: string; icon: ButtonIcon; href: string, isExternal?: boolean }[] = [
    {title: 'Build Key', icon: 'plus', href: TERN_AC_HREF, isExternal: true},
    {title: 'Explore Keys', icon: 'glass', href: TERN_AC_HREF + '/explore', isExternal: true},
    {title: 'Create AR Code', icon: 'plus', href: Route.ARCodeToolCreate},
];

const SUBSCRIPTION_LINK_DICT: Record<PlanName, string> = {
    ARCH: Route.ARCodeToolCreate,
    dot: Route.Dot,
    TernKey: TERN_AC_HREF,
    trial: '',
}

const renderTable = (table: TableSection, isExternal?: boolean) => {
    const renderTd = (title: ReactElement | string, href: string, type?: 'first' | 'last') => {
        return (
            <td className={cn({
                ['pr-[--p-content-3xs] w-[1.3rem] rounded-r-normal   sm:x-[pr-[--p-content-5xs],rounded-r-small]']: type === 'last',
                ['pl-[--p-content-3xs] max-w-[15rem] rounded-l-normal   sm:x-[pl-[--p-content-5xs],min-w-[40%],w-[50%],rounded-l-small]     sm:landscape:w-[60%]']: type === 'first'
            })}
            >
                <PageLink href={href} isExternal={isExternal}
                          className={cn(
                              'w-full overflow-hidden overflow-ellipsis text-nowrap max-w-[20rem]',
                              `py-[0.75rem]`,
                              `md:py-[0.875rem]`,
                              `sm:x-[py-[0.22rem],table-cell]`,
                              `sm:portrait:max-w-[8rem]`,
                              `sm:landscape:py-[calc(0.5*var(--p-content-3xs))] sm:landscape:max-w-[15rem]`,
                          )}
                >
                    {title}
                </PageLink>
            </td>
        );
    }

    const TableItems: ReactElement[] = table.data.map((row, idx) => (
        <tr key={row.name.slice(5) + idx} className={'hover:bg-control-gray-l0'}>
            {renderTd(row.name, row.href, 'first')}
            {renderTd(typeof row.data === 'string' ? row.data : new Date(row.data).toLocaleDateString(), row.href)}
            {renderTd(
                <ReactSVG
                    src={SVG_ARROW.src}
                    className={`[&_path]:fill-blue [&_*]:w-[1.3rem] rotate-180    sm:[&_*]:w-[0.875rem]`}
                />,
                row.href,
                'last'
            )}
        </tr>
    ));

    return (
        <div
            className={`bg-control-gray rounded-smallest
                        p-[--p-content-xs] max-h-[20rem]
                        md:p-[--p-content-xxs]
                        sm:x-[p-[--p-content-4xs],max-h-[10rem]]
                        sm:landscape:x-[p-[--p-content-xxs]]`}>
            <h3 className={`font-bold px-[--p-content-3xs]
                            text-heading
                            md:px-[--p-content-4xs]
                            sm:x-[px-[--p-content-5xs],text-section-s]`}
            >
                {table.title}
            </h3>
            <hr className={`relative border-control-white-d0
                            my-[--p-content-xs]
                            sm:x-[mt-[--p-content-4xs],mb-[--p-content-5xs]]
                            sm:landscape:x-[mt-[--p-content-4xs],mb-[--p-content-5xs]]`}/>
            <div className={`overflow-y-scroll
                            max-h-[calc(100%-var(--fz-heading)-2.5*var(--p-content-xs))]
                            sm:max-h-[calc(100%-var(--fz-section)-2*var(--p-content-4xs))]`}
            >
                <table className={`w-full text-heading-s    sm:text-section-xs`}>
                    <thead className={`sticky top-0 z-10 bg-control-gray
                                        text-section-xs 
                                        sm:text-section-xxxs
                                        sm:landscape:text-section-xxxs`}
                    >
                    <tr className={'[&_td]:pb-[0.75rem]     sm:[&_td]:pb-[0.25rem]     sm:landscape:py-0'}>
                        <td className={'pl-[--p-content-3xs]     sm:pl-[--p-content-5xs]'}>{table.columnNames[0]}</td>
                        <td>{table.columnNames[1]}</td>
                        <td/>
                    </tr>
                    </thead>
                    <tbody className={'text-heading-s sm:text-section-xs'}>
                    {TableItems}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


const MyTernPage: FC = () => {
    const userCtx = useUser();
    const modalCtx = useModal();
    const isLoggedIn = useLoginCheck();
    const [navigate] = useNavigate();
    const isSmScreen = useBreakpointCheck();

    const [communityEvents, setCommunityEvents] = useState<TableEntry[]>([]);

    const navBtns = copyObject(NAV_BTNS_DEFAULT);
    if (userCtx.userData?.subscriptions.find((plan) => plan.subscription === 'trial'))
        navBtns.splice(1, 0, {title: 'Try TernKey Pro', icon: 'diamond', href: Route.ServicePricing});

    const subscriptionTable: TableSection = {
        title: 'Subscription',
        columnNames: ['Item', 'Plan Type'],
        data: userCtx.userData?.subscriptions
            .filter((plan) => plan.subscription !== 'trial')
            .map((plan) => ({
                name: plan.subscription,
                data: capitalize(plan.type) + ' (' + capitalize(plan.recurrency ?? '') + ')',
                href: SUBSCRIPTION_LINK_DICT[plan.subscription]
            })) ?? []
    }

    useEffect(() => {
        try {
            // TODO fetch events
            setCommunityEvents(EVENTS_TEMPLATE);
        } catch (error: unknown) {
        }
    }, []);

    if (!isLoggedIn)
        return null;

    // Elements
    const NavBtns: ReactElement[] = navBtns.map((btn, idx) => {
        const Btn = (
            <Button
                icon={btn.icon}
                className={`bg-control-gray rounded-smallest
                            px-[0.73rem] py-[--p-content-4xs] text-heading-s
                            sm:x-[py-[0.47rem],px-[0.56rem],text-section-xs]
                            sm:landscape:text-section-xs`
                }
                classNameIcon={`[&_path]:fill-primary
                                sm:[&_svg]:w-[0.875rem]`}
            >
                {btn.title}
            </Button>
        );

        return btn.isExternal
            ? <a key={btn.title + idx} href={btn.href} target={'_blank'} rel={'noopener noreferrer'}>{Btn}</a>
            : <PageLink key={btn.title + idx} href={btn.href}>{Btn}</PageLink>;
    });

    const renderSinceDate = (dateNumber: number | undefined) => {
        if (!dateNumber)
            return null;
        const date = new Date(dateNumber ?? 0)
        return (
            <span>
                Member since {date.toLocaleString('default', {month: 'long'}) + ' ' + date.getFullYear()}
            </span>
        );
    }

    return (
        <div className={cn(
            `grid max-w-[90.63rem] w-full h-full text-left`,
            `lg:x-[auto-rows-min,w-3/4,mt-[5.94rem],mx-auto]`,
            `md:x-[mt-[--p-content-xl],px-[--p-content-xl]]`,
            `sm:grid-rows-[min-content,1fr]`,
            `sm:x-[mt-0,px-[--p-content-xs]]`,
            `sm:landscape:max-h-[calc(100%-2*var(--p-content-xs))]`,
            `sm:landscape:grid-cols-[1fr,2fr]`,
            `sm:landscape:x-[auto-rows-auto,gap-x-[--p-content-xl],mx-0,mt-[--p-content-xs]]`
        )}
        >
            <h1 className={cn(
                `font-bold`,
                `pb-[--p-content-xs] text-heading-l`,
                `md:x-[pb-[--p-content-xxs]]`,
                `sm:x-[pb-[--p-content-4xs],text-heading-s]`,
                `sm:portrait:x-[h-[5rem],place-content-end]`,
                `sm:landscape:text-heading-s`,
            )}
            >
                Dashboard
            </h1>
            <div className={`sm:portrait:overflow-y-scroll sm:portrait:h-[calc(100%-3rem)]
                            sm:landscape:contents`}
            >
                <div
                    className={cn(
                        `text-section-xs`,
                        `sm:text-section-xxxs`,
                        `sm:landscape:col-start-1`,
                        {['hidden']: !userCtx.userData}
                    )}
                >
                    {renderSinceDate(userCtx.userData?.registrationDate)}
                </div>
                <div className={`flex flex-wrap
                                gap-[--p-content-xs] my-[--p-content]
                                md:my-[--p-content-s]
                                sm:x-[my-[--p-content-xs],gap-[--p-content-4xs]]
                                sm:landscape:x-[col-start-1,gap-[--p-content-4xs],my-[0.94rem]]`}
                >
                    {NavBtns}
                </div>
                <div className={`grid
                                grid-cols-2 gap-[--p-content-4xs]
                                md:x-[grid-cols-1,gap-[--p-content-s]]
                                sm:grid-cols-1
                                sm:landscape:x-[row-start-1,col-start-2,row-span-4,overflow-y-scroll]`}
                >
                    {renderTable(subscriptionTable)}
                    {renderTable({
                        title: 'Community Events',
                        columnNames: ['Event', 'Date'],
                        data: communityEvents
                    }, true)}
                </div>
                <div className={`flex-col inline-flex
                                gap-y-[--p-content-s] mt-[--p-content-xl] text-section-xs
                                md:x-[mt-[--p-content-xl],text-basic]
                                sm:x-[gap-y-[--p-content-4xs],mt-[3.88rem],text-section-xxs]
                                sm:landscape:x-[col-start-1,gap-y-[--p-content-4xs],mt-[1dvw],w-fit]`}
                >
                    <span className={`font-bold
                                    mb-[--p-content-5xs] text-heading
                                    sm:text-basic
                                    sm:landscape:mb-0`}
                    >
                        Additional Resources
                    </span>
                    <PageLink href={Route.Documentation}/>
                    <span
                        className={`cursor-pointer ${styles.clickable}`}
                        onClick={() => isSmScreen
                            ? navigate(Route.Help)
                            : modalCtx.openModal(<FAQsModal/>, {darkenBg: true})}
                    >
                        Help & FAQs
                    </span>
                    <span
                        className={`cursor-pointer ${styles.clickable}`}
                        onClick={() => modalCtx.openModal(<HelpModal type={'support'}/>, {darkenBg: true})}
                    >
                        Support Hub
                    </span>
                </div>
            </div>
            <ScrollEnd/>
        </div>
    );
}

export default MyTernPage;