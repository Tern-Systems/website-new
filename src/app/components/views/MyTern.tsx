import React, {FC, ReactElement, useEffect, useState} from "react";
import Image from "next/image";

import {SectionsEnum} from "@/app/utils/sections";

import {useNavigate} from "@/app/hooks/useNavigate";

import {useUser} from "@/app/context";

import {Button, ButtonIcon} from "@/app/components/form";

import SVG_ARROW from "@/assets/images/icons/arrow-right.svg";
import {withSectionLink} from "@/app/hocs";


type TableEntry = {
    name: string;
    data: number | string;
    link: string | SectionsEnum;
}

type TableSection = {
    title: string;
    columnNames: [string, string];
    data: TableEntry[];
}

const NAV_BTNS: { title: string; icon: ButtonIcon; link: SectionsEnum }[] = [
    {title: 'Build Key', icon: 'plus', link: SectionsEnum.CreateKey},
    {title: 'Try TernKey Pro', icon: 'diamond', link: SectionsEnum.Pricing},
    {title: 'Explore Keys', icon: 'glass', link: SectionsEnum.ExploreKeys},
    {title: 'Create AR Code', icon: 'plus', link: SectionsEnum.ARCodeTool},
    {title: 'Open a Case', icon: 'label', link: SectionsEnum.OpenCase},
    {title: 'Give Feedback', icon: 'notepad', link: SectionsEnum.Feedback},
];

const SUBSCRIPTION_TABLE: TableSection = {
    title: 'Subscription',
    columnNames: ['Item', 'Plan Type'],
    data: [
        {name: 'TernKey', data: 'Pro (Annual)', link: SectionsEnum.Pricing},
        {name: 'ARCH', data: 'Standard (Monthly)', link: SectionsEnum.Pricing},
    ]
}

const renderTable = (table: TableSection, navigate?: (link: string) => void) => {
    const TableItems: ReactElement[] = table.data.map((entry, index) => (
        <tr key={entry.name.slice(5) + index} className={'hover:bg-control2'}
        >
            <td className={'pl-[0.81rem] py-[0.75rem] rounded-l-[1rem]'}>{entry.name}</td>
            <td>
                {typeof entry.data === 'string'
                    ? entry.data
                    : new Date(entry.data).toLocaleDateString()
                }
            </td>
            <td className={'pr-[0.81rem] rounded-r-[1rem] w-[1.3125rem] box-content'}>
                <a
                    key={entry.name.slice(5) + index}
                    href={navigate ? '' : entry.link}
                    target={navigate ? '' : '_blank'}
                    onClick={(event) => {
                        if (navigate) {
                            navigate(entry.link)
                            event.preventDefault();
                        }
                    }}
                >
                    <Image
                        src={SVG_ARROW}
                        alt={'arrow'}
                        className={''}
                    />
                </a>
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

const MyTernView: FC = () => {
    const userCtx = useUser();
    const [navigate, router] = useNavigate();

    const [communityEvents, setCommunityEvents] = useState<TableEntry[]>([]);

    useEffect(() => {
        try {
            // TODO fetch events
            const communityEvents: TableEntry[] = [{
                name: 'Streaming on X: The Future of AR',
                data: Date.now(),
                link: 'https://youtube.com'
            }];
            setCommunityEvents(communityEvents);
        } catch (error: unknown) {
        }
    }, []);


    const SectionLink = withSectionLink<SectionsEnum, string>();


    // Elements
    const NavBtns: ReactElement[] = NAV_BTNS.map((btn, index) => (
        <Button
            key={btn.title + index}
            icon={btn.icon}
            onClick={() => navigate(btn.link)}
            className={`px-[0.7rem] py-[0.6rem] bg-control rounded-[0.375rem] text-[1.3125rem]
                        ${btn.icon === 'plus' ? '[&_img]:brightness-[300%]' : ''}`}
        >
            {btn.title}
        </Button>
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
                {renderTable(SUBSCRIPTION_TABLE, navigate)}
                {renderTable({title: 'Community Events', columnNames: ['Event', 'Date'], data: communityEvents})}
            </div>
            <div className={'flex-col flex gap-y-[1.6rem] mt-[3rem]'}>
                <span className={'text-[1.69rem] font-bold mb-[0.3rem]'}>Additional Resources</span>
                <SectionLink section={SectionsEnum.Documentation}/>
                <SectionLink section={SectionsEnum.HelpFAQ}/>
                <SectionLink section={SectionsEnum.SupportHub}/>
            </div>
        </div>
    );
}

export {MyTernView}