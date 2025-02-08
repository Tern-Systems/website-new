import React, {FC, ReactElement, useEffect, useState} from "react";
import {ReactSVG} from "react-svg";
import cn from "classnames";

import {PlanName} from "@/app/types/subscription";
import {ButtonIcon} from "@/app/ui/form/Button";
import {Breakpoint} from "@/app/hooks/useBreakpointCheck";
import {MISC_LINKS, Route} from "@/app/static";

import {capitalize, copyObject} from "@/app/utils";
import {useModal, useUser} from "@/app/context";
import {useBreakpointCheck, useLoginCheck, useNavigate} from "@/app/hooks";

import {ScrollEnd} from "@/app/ui/misc";
import {PageLink} from "@/app/ui/layout";
import {HelpModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";
import {FAQsModal} from "./faqs/index.page";


import SVG_ARROW from '/public/images/icons/arrow.svg';

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
    {title: 'Build Key', icon: 'plus', href: MISC_LINKS.TernKey, isExternal: true},
    {title: 'Explore Keys', icon: 'glass', href: MISC_LINKS.TernKey + '/explore', isExternal: true},
];

const SUBSCRIPTION_LINK_DICT: Record<PlanName, string> = {
    // dot: Route.Dot,
    TernKey: MISC_LINKS.TernKey,
    trial: '',
}

const renderTable = (table: TableSection, isExternal?: boolean) => {
    const renderTd = (title: ReactElement | string, href: string, type?: 'first' | 'last') => {
        return (
            <td className={cn({
                ['pr-3xs w-[1.3rem] rounded-r-n   sm:x-[pr-5xs,rounded-r-s]']: type === 'last',
                ['pl-3xs max-w-[15rem] rounded-l-n   sm:x-[pl-5xs,min-w-[40%],w-[50%],rounded-l-s]     sm:landscape:w-[60%]']: type === 'first'
            })}
            >
                <PageLink href={href} isExternal={isExternal}
                          className={cn(
                              'w-full overflow-hidden overflow-ellipsis text-nowrap max-w-[20rem]',
                              `py-[0.75rem]`,
                              `md:py-[0.875rem]`,
                              `sm:x-[py-[0.22rem],table-cell]`,
                              `sm:portrait:max-w-[8rem]`,
                              `sm:landscape:py-[calc(0.5*var(--p-3xs))] sm:landscape:max-w-[15rem]`,
                          )}
                >
                    {title}
                </PageLink>
            </td>
        );
    }

    const TableItems: ReactElement[] = table.data.map((row, idx) => (
        <tr key={row.name.slice(5) + idx} className={'hover:bg-gray-l0'}>
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
            className={cn(
                `bg-gray rounded-xs`,
                `p-xs max-h-[20rem]`,
                `md:p-xxs`,
                `sm:x-[p-4xs,max-h-[10rem]]`,
                `sm:landscape:x-[p-xxs]`
            )}
        >
            <h3 className={cn(
                `font-bold px-3xs`,
                `text-heading`,
                `md:px-4xs`,
                `sm:x-[px-5xs,text-section-s]`
            )}
            >
                {table.title}
            </h3>
            <hr className={cn(
                `relative border-white-d0`,
                `my-xs`,
                `sm:x-[mt-4xs,mb-5xs]`,
                `sm:landscape:x-[mt-4xs,mb-5xs]`,
            )}
            />
            <div className={cn(
                `overflow-y-scroll`,
                `max-h-[calc(100%-var(--fz-heading)-2.5*var(--p-xs))]`,
                `sm:max-h-[calc(100%-var(--fz-section)-2*var(--p-4xs))]`,
            )}
            >
                <table className={`w-full text-heading-s    sm:text-section-xs`}>
                    <thead className={cn(
                        `sticky top-0 z-10 bg-gray`,
                        `text-section-xs`,
                        `sm:text-section-xxxs`,
                        `sm:landscape:text-section-xxxs`,
                    )}
                    >
                    <tr className={'[&_td]:pb-[0.75rem]     sm:[&_td]:pb-[0.25rem]     sm:landscape:py-0'}>
                        <td className={'pl-3xs     sm:pl-5xs'}>{table.columnNames[0]}</td>
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
    const isSmScreen = useBreakpointCheck() <= Breakpoint.sm;

    const [communityEvents, setCommunityEvents] = useState<TableEntry[]>([]);

    const navBtns = copyObject(NAV_BTNS_DEFAULT);
    if (userCtx.userData?.subscriptions?.find((plan) => plan.subscription === 'trial'))
        navBtns.splice(1, 0, {title: 'Try TernKey Pro', icon: 'diamond', href: Route.TernKeyPricing});

    const subscriptionTable: TableSection = {
        title: 'Subscription',
        columnNames: ['Item', 'Plan Type'],
        data: userCtx.userData?.subscriptions
            ?.filter((plan) => plan.subscription !== 'trial')
            ?.map((plan) => ({
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
                className={cn(
                    `bg-gray rounded-xs`,
                    `px-[0.73rem] py-4xs text-heading-s`,
                    `sm:x-[py-[0.47rem],px-[0.56rem],text-section-xs]`,
                    `sm:landscape:text-section-xs`,
                )}
                classNameIcon={cn(`[&_path]:fill-primary`, `sm:[&_svg]:w-[0.875rem]`)}
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
            `lg:x-[auto-rows-min,w-3/4,mt-xxl,mx-auto]`,
            `md:x-[mt-xl,px-xl]`,
            `sm:grid-rows-[min-content,1fr]`,
            `sm:x-[mt-0,px-xs]`,
            `sm:landscape:max-h-[calc(100%-2*var(--p-xs))]`,
            `sm:landscape:grid-cols-[1fr,2fr]`,
            `sm:landscape:x-[auto-rows-auto,gap-x-xl,mx-0,mt-xs]`
        )}
        >
            <h1 className={cn(
                `flex font-bold`,
                `pb-xs text-heading-l`,
                `md:x-[pb-xxs]`,
                `sm:x-[pb-4xs,text-heading-s]`,
                `sm:portrait:x-[h-[5rem],items-end]`,
                `sm:landscape:text-heading-s`,
            )}
            >
                Dashboard
            </h1>
            <div className={cn(
                `sm:portrait:h-[calc(100%-var(--p-xl))] sm:portrait:overflow-y-scroll`,
                `sm:landscape:contents`
            )}
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
                <div className={cn(
                    `flex flex-wrap`,
                    `gap-xs my-n`,
                    `md:my-s`,
                    `sm:x-[my-xs,gap-4xs]`,
                    `sm:landscape:x-[col-start-1,gap-4xs,my-[0.94rem]]`,
                )}
                >
                    {NavBtns}
                </div>
                <div className={cn(
                    `grid`,
                    `grid-cols-2 gap-4xs`,
                    `md:x-[grid-cols-1,gap-s]`,
                    `sm:grid-cols-1`,
                    `sm:landscape:x-[row-start-1,col-start-2,row-span-4,overflow-y-scroll]`,
                )}
                >
                    {renderTable(subscriptionTable)}
                    {renderTable({
                        title: 'Community Events',
                        columnNames: ['Event', 'Date'],
                        data: communityEvents
                    }, true)}
                </div>
                <div className={cn(
                    `flex-col inline-flex`,
                    `gap-y-s mt-xl text-section-xs`,
                    `md:x-[mt-xl,text-basic]`,
                    `sm:x-[gap-y-4xs,mt-[3.88rem],text-section-xxs]`,
                    `sm:landscape:x-[col-start-1,gap-y-4xs,mt-[1dvw],w-fit]`,
                )}
                >
                    <span className={`font-bold
                                    mb-5xs text-heading
                                    sm:text-basic
                                    sm:landscape:mb-0`}
                    >
                        Additional Resources
                    </span>
                    <PageLink href={Route.MyDocumentation}/>
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