import React, {FC, ReactElement, useEffect, useState} from "react";
import {ReactSVG} from "react-svg";
import cn from "classnames";

import {Subscription} from "@/app/types/subscription";
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

const SUBSCRIPTION_LINK_DICT: Record<Subscription['subscription'], string> = {
    arch: Route.ARCodeToolCreate,
    ternKey: TERN_AC_HREF,
    trial: '',
}

const renderTable = (table: TableSection, isExternal?: boolean) => {
    const renderTd = (title: ReactElement | string, href: string, type?: 'first' | 'last') => {
        return (
            <td className={cn({
                ['w-[1.3rem] pr-[min(3.6dvw,0.81rem)] rounded-r-[1rem]']: type === 'last',
                ['max-w-[9.7rem] pl-[min(3.6dvw,0.81rem)] rounded-l-[1rem]']: type === 'first'
            })}
            >
                <PageLink href={href} isExternal={isExternal}
                          className={`w-full overflow-x-hidden overflow-ellipsis
                                    py-[min(2.7dvw,0.75rem)] 
                                    sm:x-[max-w-[41dvw],table-cell]
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
                        p-[--2dr] max-h-[20rem]
                        sm:max-h-[15rem]
                        sm:landscape:x-[p-[--sy-sl]]`}>
            <h3 className={`font-bold
                            pl-[min(3.6dvw,0.81rem)] text-header 
                            sm:landscape:text-small`}
            >
                {table.title}
            </h3>
            <hr className={`border-control-white-d0
                            mt-[--1qdrs] mb-[min(1.35dvw,1.25rem)]
                            sm:landscape:x-[mt-[1.2dvw],mb-[0.6dvw]]`}/>
            <div className={'overflow-y-scroll max-h-[70%] sm:max-h-[83%]'}>
                <table className={`w-full text-content`}>
                    <thead className={`sticky top-0 z-10 bg-control-gray
                                    text-small 
                                    sm:landscape:text-[1.25dvw]`}>
                    <tr>
                        <td className={`pl-[min(3.6dvw,0.81rem)] py-[min(2.7dvw,0.75rem)]
                                        sm:landscape:py-0`}>
                            {table.columnNames[0]}
                        </td>
                        <td>{table.columnNames[1]}</td>
                        <td/>
                    </tr>
                    </thead>
                    <tbody className={'text-content sm:landscape:text-small'}>
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
                name: plan.subscription === 'arch' ? plan.subscription.toUpperCase() : capitalize(plan.subscription),
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
                    `bg-control-gray rounded-smallest text-content
                    p-[min(2.4dvw,0.6rem)]
                    sm:landscape:x-[px-[1dvw],py-[0.5dvw],text-small]`,
                    {['[&_path]:fill-primary [&_svg]:sm:landscape:w-[0.875rem]']: btn.icon === 'plus'}
                )}
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
            <span className={userCtx.userData ? '' : 'hidden'}>
                    Member since {date.toLocaleString('default', {month: 'long'}) + ' ' + date.getFullYear()}
                </span>
        );
    }

    return (
        <div className={`grid min-w-[75%] text-left
                        mt-[3rem] mx-auto
                        sm:mt-0
                        sm:landscape:x-[auto-rows-auto,grid-cols-2,gap-x-[15dvw],mx-0]`}
        >
            <h1 className={`font-bold block
                            pb-[1.25rem] text-section-header
                            sm:x-[pb-[4dvw],mb-0]
                            sm:landscape:x-[pb-[0.5dvw],text-content]`}
            >
                Dashboard
            </h1>
            <div className={`sm:portrait:x-[overflow-y-scroll,max-h-[65dvh]]
                            sm:landscape:x-[contents,text-[1.2dvw]]`}
            >
                <div className={'sm:landscape:col-start-1'}>
                    {renderSinceDate(userCtx.userData?.registrationDate)}
                </div>
                <div className={`flex flex-wrap
                                gap-[--1qdrs] my-[min(5.4dvw,1.9rem)]
                                sm:landscape:x-[col-start-1,my-[1.3dvw],gap-[1.2dvw]]`}
                >
                    {NavBtns}
                </div>
                <div className={`grid
                                grid-cols-2 gap-[0.63rem]
                                sm:grid-cols-1
                                sm:landscape:x-[row-start-1,col-start-2,row-span-4,max-h-[55dvh]]`}
                >
                    {renderTable(subscriptionTable)}
                    {renderTable({
                        title: 'Community Events',
                        columnNames: ['Event', 'Date'],
                        data: communityEvents
                    }, true)}
                </div>
                <div className={`flex-col inline-flex
                                gap-y-[min(2.6dvw,1.6rem)] mt-[3rem]
                                sm:mt-[3.8rem]
                                sm:landscape:x-[col-start-1,gap-y-[1.2dvw],mt-[3dvw]]`}
                >
                    <span className={`font-bold
                                    mb-[0.3rem] text-header
                                    sm:landscape:x-[text-default,mb-[0.4dvw]]`}
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
        </div>
    );
}

export default MyTernPage;