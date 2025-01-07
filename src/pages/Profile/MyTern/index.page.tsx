import React, {FC, ReactElement, useEffect, useState} from "react";
import {ReactSVG} from "react-svg";
import cn from "classnames";

import {PlanName} from "@/app/types/subscription";
import {ButtonIcon} from "@/app/ui/form/Button";
import {Route, TERN_AC_HREF} from "@/app/static";

import {capitalize, copyObject} from "@/app/utils";
import {useModal, useUser} from "@/app/context";
import {useBreakpointCheck, useLoginCheck, useNavigate} from "@/app/hooks";

import {PageLink} from "@/app/ui/layout";
import {HelpModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";
import {FAQsModal} from "./FAQs/index.page";


import SVG_ARROW from '@/assets/images/icons/arrow.svg';

import styles from "@/app/common.module.css";
import {ScrollEnd} from "@/app/ui/misc";


const EVENTS_TEMPLATE: TableEntry[] = [
    {name: 'Streaming on X: The Future of AR', data: Date.now(), href: 'https://youtube.com'},
    {name: 'Streaming on X: The Future of AR', data: Date.now(), href: 'https://youtube.com'},
    {name: 'Streaming on X: The Future of AR', data: Date.now(), href: 'https://youtube.com'},
    {name: 'Streaming on X: The Future of AR', data: Date.now(), href: 'https://youtube.com'},
    {name: 'Streaming on X: The Future of AR', data: Date.now(), href: 'https://youtube.com'},
    {name: 'Streaming on X: The Future of AR', data: Date.now(), href: 'https://youtube.com'},
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
                ['pr-[--p-content-xs] w-[1.3rem] rounded-r-normal   sm:x-[pr-[--p-content-xxxs],rounded-r-small]']: type === 'last',
                ['pl-[--p-content-xs] max-w-[9.7rem] rounded-l-normal   sm:x-[pl-[--p-content-xxxs],rounded-l-small]']: type === 'first'
            })}
            >
                <PageLink href={href} isExternal={isExternal}
                          className={`w-full overflow-x-hidden overflow-ellipsis text-nowrap
                                    py-[0.75rem] 
                                    sm:x-[py-[0.22rem],max-w-[41dvw],table-cell]
                                    sm:landscape:py-[0.4dvw]`}
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
                        p-[--p-content-s] max-h-[20rem]
                        sm:x-[p-[--p-content-xxs],max-h-[10rem]]
                        sm:landscape:x-[p-[--sy-sl]]`}>
            <h3 className={`font-bold px-[--p-content-xs]
                            text-heading
                            sm:x-[px-[--p-content-xxxs],text-section]`}
            >
                {table.title}
            </h3>
            <hr className={`relative border-control-white-d0
                            my-[--p-content-s]
                            sm:x-[mt-[--p-content-xxs],mb-[--p-content-xxxs]]
                            sm:landscape:x-[mt-[1.2dvw],mb-[0.6dvw]]`}/>
            <div className={`overflow-y-scroll
                            max-h-[calc(100%-var(--fz-heading)-2.5*var(--p-content-s))]
                            sm:max-h-[calc(100%-var(--fz-section)-2*var(--p-content-xxs))]`}
            >
                <table className={`w-full text-heading-s    sm:text-section-xs`}>
                    <thead className={`sticky top-0 z-10 bg-control-gray
                                        text-section-xs 
                                        sm:text-section-xxxs
                                        sm:landscape:text-[1.25dvw]`}
                    >
                    <tr className={'[&_td]:pb-[0.75rem]     sm:[&_td]:pb-[0.25rem]     sm:landscape:py-0'}>
                        <td className={'pl-[--p-content-xs]     sm:pl-[--p-content-xxxs]'}>{table.columnNames[0]}</td>
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
                            px-[0.73rem] py-[--p-content-xxs] text-heading-s
                            sm:x-[py-[0.47rem],px-[0.56rem],text-section-xs]
                            sm:landscape:x-[px-[1dvw],py-[0.5dvw],text-small]`
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
        <div className={`grid auto-rows-min max-w-[90.63rem] w-3/4 h-full text-left
                        mt-[5.94rem] mx-auto
                        sm:x-[mt-[--p-content-l],px-[--p-content-s],w-full]
                        sm:landscape:x-[auto-rows-auto,grid-cols-2,gap-x-[15dvw],mx-0]`}
        >
            <h1 className={`font-bold
                            pb-[--p-content-s] text-heading-l leading-none
                            sm:x-[pb-[--p-content-xxs],text-heading-s]
                            sm:landscape:x-[pb-[0.5dvw],text-content]`}
            >
                Dashboard
            </h1>
            <div className={`sm:portrait:overflow-y-scroll sm:portrait:max-h-[calc(100%-3.06rem)]
                            sm:landscape:x-[contents,text-[1.2dvw]]`}
            >
                <div
                    className={cn(`
                        text-section-xs
                        sm:text-section-xxxs
                        sm:landscape:col-start-1`,
                        {['hidden']: !userCtx.userData}
                    )}
                >
                    {renderSinceDate(userCtx.userData?.registrationDate)}
                </div>
                <div className={`flex flex-wrap
                                gap-[--p-content-s] my-[1.87rem]
                                sm:x-[my-[--p-content-s],gap-[--p-content-xxs]]
                                sm:landscape:x-[col-start-1,my-[1.3dvw],gap-[1.2dvw]]`}
                >
                    {NavBtns}
                </div>
                <div className={`grid
                                grid-cols-2 gap-[--p-content-xxs]
                                sm:grid-cols-1
                                sm:landscape:x-[row-start-1,col-start-2,row-span-4,overflow-y-scroll,max-h-[55dvh]]`}
                >
                    {renderTable(subscriptionTable)}
                    {renderTable({
                        title: 'Community Events',
                        columnNames: ['Event', 'Date'],
                        data: communityEvents
                    }, true)}
                </div>
                <div className={`flex-col inline-flex
                                gap-y-[1.56rem] mt-[3.13rem] text-section-xs
                                sm:x-[gap-y-[--p-content-xxs],mt-[3.88rem]]
                                sm:landscape:x-[col-start-1,gap-y-[1dvw],mt-[1dvw],w-fit]`}
                >
                    <span className={`font-bold
                                    mb-[0.32rem] text-heading
                                    sm:text-basic
                                    sm:landscape:x-[text-default,mb-0]`}
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