import React, {FC, ReactElement, ReactNode, useEffect, useState} from "react";
import Image from "next/image";

import {ButtonIcon} from "@/app/ui/form/Button";
import {Route} from "@/app/static";

import {useModal, useUser} from "@/app/context";
import {useLoginCheck} from "@/app/hooks";

import {PageLink} from "@/app/ui/layout";
import {FAQsModal, HelpModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";

import SVG_ARROW from "@/assets/images/icons/arrow-right.svg";


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

const NAV_BTNS: { title: string; icon: ButtonIcon; href: Route }[] = [ // TODO
    {title: 'Build Key', icon: 'plus', href: Route.CreateKey},
    {title: 'Try TernKey Pro', icon: 'diamond', href: Route.ServicePricing},
    {title: 'Explore Keys', icon: 'glass', href: Route.ExploreKeys},
    {title: 'Create AR Code', icon: 'plus', href: Route.ARCodeToolEdit},
];

const SUBSCRIPTION_TABLE: TableSection = {
    title: 'Subscription',
    columnNames: ['Item', 'Plan Type'],
    data: [
        {name: 'TernKey', data: 'Pro (Annual)', href: Route.ServicePricing},
        {name: 'ARCH', data: 'Standard (Monthly)', href: Route.ServicePricing},
    ]
}

const renderLink = (href: string, isExternalLink: boolean, children: ReactNode) => (
    isExternalLink
        ? (<a key={href} href={href} target={'_blank'} rel={'noopener noreferrer'}>{children}</a>)
        : <PageLink href={href as Route}>{children}</PageLink>
);

const renderTable = (table: TableSection, isExternal?: boolean) => {
    const TableItems: ReactElement[] = table.data.map((row, idx) => (
        <tr key={row.name.slice(5) + idx} className={'hover:bg-control2'}
        >
            <td className={'pl-[0.81rem] py-[0.75rem] rounded-l-[1rem]'}>{row.name}</td>
            <td>
                {typeof row.data === 'string'
                    ? row.data
                    : new Date(row.data).toLocaleDateString()
                }
            </td>
            <td className={'pr-[0.81rem] rounded-r-[1rem] w-[1.3125rem] box-content'}>
                {renderLink(row.href, isExternal === true, <Image src={SVG_ARROW} alt={'arrow'}/>)}
            </td>
        </tr>
    ));

    return (
        <div className={'bg-control rounded-[0.375rem] p-[--py]'}>
            <h3 className={'text-[1.69rem] font-bold'}>{table.title}</h3>
            <hr className={'border-control3 my-[1.25rem]'}/>
            <table
                className={`w-full text-[1.3125rem]`}>
                <thead>
                <tr className={'contents text-[0.875rem]'}>
                    <td className={'pl-[0.81rem] py-[0.75rem]'}>{table.columnNames[0]}</td>
                    <td className={'pr-[0.81rem]'}>{table.columnNames[1]}</td>
                </tr>
                </thead>
                <tbody>
                {TableItems}
                </tbody>
            </table>
        </div>
    );
}


const MyTernPage: FC = () => {
    const userCtx = useUser();
    const modalCtx = useModal();
    const isLoggedIn = useLoginCheck();

    const [communityEvents, setCommunityEvents] = useState<TableEntry[]>([]);

    useEffect(() => {
        try {
            // TODO fetch events
            const communityEvents: TableEntry[] = [{
                name: 'Streaming on X: The Future of AR',
                data: Date.now(),
                href: 'https://youtube.com'
            }];
            setCommunityEvents(communityEvents);
        } catch (error: unknown) {
        }
    }, []);

    if (!isLoggedIn)
        return null;

    // Elements
    const NavBtns: ReactElement[] = NAV_BTNS.map((btn, idx) => (
        <PageLink key={btn.title + idx} href={btn.href}>
            <Button
                icon={btn.icon}
                className={`px-[0.7rem] py-[0.6rem] bg-control rounded-[0.375rem] text-[1.3125rem]
                        ${btn.icon === 'plus' ? '[&_img]:brightness-[300%]' : ''}`}
            >
                {btn.title}
            </Button>
        </PageLink>
    ));

    const renderSinceDate = (dateNumber: number | undefined) => {
        if (!dateNumber)
            return null;
        const date = new Date(dateNumber ?? 0)
        return (
            <div>
                <span className={userCtx.userData ? '' : 'hidden'}>
                    Member since {date.toLocaleString('default', {month: 'long'}) + ' ' + date.getFullYear()}
                </span>
            </div>
        );
    }

    return (
        <div className={'pt-[5rem] px-[14rem] text-left'}>
            <h1 className={'text-[2.25rem] font-bold mb-[1.25rem]'}>Dashboard</h1>
            {renderSinceDate(userCtx.userData?.registrationDate)}
            <div className={'flex gap-x-[1.25rem] my-[1.9rem]'}>{NavBtns}</div>
            <div className={'grid grid-cols-2 gap-x-[0.63rem] h-[20.5rem]'}>
                {renderTable(SUBSCRIPTION_TABLE)}
                {renderTable({title: 'Community Events', columnNames: ['Event', 'Date'], data: communityEvents}, true)}
            </div>
            <div className={'flex-col flex gap-y-[1.6rem] mt-[3rem]'}>
                <span className={'text-[1.69rem] font-bold mb-[0.3rem]'}>Additional Resources</span>
                <PageLink href={Route.Documentation}/>
                <span
                    className={'cursor-pointer'}
                    onClick={() => modalCtx.openModal(<FAQsModal/>, {darkenBg: true})}
                >
                    Help & FAQs
                </span>
                <span
                    className={'cursor-pointer'}
                    onClick={() => modalCtx.openModal(<HelpModal type={'support'}/>, {darkenBg: true})}>
                    Support Hub
                </span>
            </div>
        </div>
    );
}

export default MyTernPage;