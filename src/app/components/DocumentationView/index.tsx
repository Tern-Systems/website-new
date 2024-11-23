import React, {ReactElement, useState, JSX, useEffect} from 'react'
import Image from "next/image";

import {SectionsEnum} from "@/app/utils/sections";

import Manual, {ManualAnchors} from "./Manual";
import GHandbook, {GHandbookAnchors} from "./GHandbook";

import SVG_CHEVRON from '@/assets/images/icons/select-chewron.svg';
import {log} from "util";


// Anchors list type
type TListEntry = Array<string | Record<string, TListEntry>>;

// Views
const ViewDict: Record<string, { elem: () => JSX.Element, anchors: TListEntry, isChapter: boolean }> = {
    ['TernKey Manual' as SectionsEnum.TernKey]: {elem: Manual, anchors: ManualAnchors, isChapter: false},
    ['G Handbook' as SectionsEnum.GHandbook]: {elem: GHandbook, anchors: GHandbookAnchors, isChapter: true},
}
const ViewDictKeys = Object.keys(ViewDict) as SectionsEnum[];

interface IDocumentationViewProps {
    view: SectionsEnum;
}

const DocumentationView = (props: IDocumentationViewProps) => {
    const {view} = props;

    const [isMenuOpened, setMenuOpened] = useState<boolean>(false);
    const [isSelectExpanded, setSelectExpanded] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<SectionsEnum>(view);

    const toggleSelectExpand = () => setSelectExpanded((prevState) => !prevState);
    const toggleMenuOpen = () => setMenuOpened((prevState) => !prevState);

    // Click checking
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (isMenuOpened && !document.querySelector('#documentation-menu')?.contains(e.target as Node))
                setMenuOpened(false);
        }
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [isMenuOpened, setMenuOpened])

    // Returning to the top
    useEffect(() => {
        window.scrollTo({top: 1});
    }, [selectedOption])

    // Options list
    const OptionsAllJSX: ReactElement[] = ViewDictKeys.map((value, index) =>
        <li
            className={'flex'}
            key={value + index}
            onClick={() => setSelectedOption(value)}
        >
            {value}
        </li>
    );

    // Remove selected (current) option from the options list
    const selectedOptionIdx: number = ViewDictKeys.indexOf(selectedOption);
    const OptionsJSX: ReactElement[] = [
        ...OptionsAllJSX.slice(0, selectedOptionIdx),
        ...OptionsAllJSX.slice(selectedOptionIdx + 1)
    ];

    // Renders an anchor list for the opened document
    const renderAnchorListHelper = (list: TListEntry, isChapters: boolean, chapterFlag: boolean, chapterCounter: number): ReactElement => {
        const ListOptions: ReactElement[] = list.map((entry, index): ReactElement => {
            let anchorId: string;
            let anchorText: string;
            let SubListOptions: ReactElement[] = [];

            if (typeof entry === 'string') {
                anchorId = entry;
                anchorText = anchorId;
                if (isChapters && chapterCounter > 0) {
                    anchorText = chapterCounter + '.' + (index + 1) + ' ' + anchorText;
                    anchorId = entry;
                    if (chapterFlag)
                        anchorId = chapterCounter + '-' + (index + 1) + '-' + anchorId;
                }
            } else {
                chapterFlag = isChapters && true;
                anchorId = Object.keys(entry)[0] || '';
                anchorText = anchorId;
                if (chapterFlag) {
                    chapterCounter++;
                    anchorText = 'Chapter ' + chapterCounter + '. ' + anchorText;
                }
                SubListOptions = Object.values(entry).map((subEntry: TListEntry) => renderAnchorListHelper(subEntry, isChapters, chapterFlag, chapterCounter));
                chapterFlag = isChapters && false;
            }

            return (
                <li key={anchorText + index} className={'pl-[1rem]'}>
                    <a href={'#'}
                       onClick={() => document.getElementById(anchorId)?.scrollIntoView({behavior: 'smooth'})}
                    >
                        {anchorText}
                    </a>
                    <ul>{SubListOptions}</ul>
                </li>
            );
        });
        return <>{ListOptions}</>
    }
    const renderAnchorList = (list: TListEntry, isChapters: boolean): ReactElement => {
        const chapterCounter = 0;
        const chapterFlag = false;
        return renderAnchorListHelper(list, isChapters, chapterFlag, chapterCounter);
    }

    // Misc
    const MenuBtn = (
        <div
            className={'cursor-pointer flex items-center align-middle p-[0.2rem] h-[1.8125rem] w-[1.8125rem] rounded-[0.3125rem] border-2 border-white border-solid'}
            onClick={() => toggleMenuOpen()}
        >
            <div
                className={`bg-white box-border h-[100%] rounded-s-[0.125rem] ${isMenuOpened ? 'w-[10%]' : 'w-[40%]'}`}/>
        </div>
    );
    const ViewSelect = (
        <div
            className={'cursor-pointer'}
            onClick={() => toggleSelectExpand()}
            onBlur={() => setSelectExpanded(false)}
        >
            <div className={'relative inline-block mx-[0.62rem] w-[160px] text-nowrap'}>
                <div>{OptionsAllJSX[selectedOptionIdx]}</div>
                <ul className={`absolute z-10 ${isSelectExpanded ? '' : 'invisible'}`}>
                    {OptionsJSX}
                </ul>
            </div>
            <Image
                src={SVG_CHEVRON}
                alt={'select chevron'}
                className={`inline ${isSelectExpanded ? 'rotate-180' : ''}`}
            />
        </div>
    );
    const MenuContent = (
        <div
            className={`mt-[1.86rem] overflow-y-scroll w-full ${isSelectExpanded ? 'opacity-25' : ''}`}>
            <div className={'mb-[0.74rem]'}>
                <span>Table of Contents</span>
            </div>
            <ul style={{marginLeft: '-0.9rem'}}>
                {renderAnchorList(ViewDict[selectedOption].anchors, ViewDict[selectedOption].isChapter)}
            </ul>
        </div>
    );

    return (
        <>
            <aside
                id={'documentation-menu'}
                className={`
                    absolute left-0 top-0 flex flex-col px-[--px] py-[--py] max-h-screen text-primary text-[1.0625rem]
                    z-[1] ${isMenuOpened ? 'bg-[#4D4D4D] w-[23.6825rem] sm:portrait:w-screen' : 'h-fit bg-none'}`}
            >
                <div className={`flex items-center font-oxygen text-primary font-bold lg:justify-between`}>
                    {MenuBtn}
                    {ViewSelect}
                </div>
                {!isMenuOpened ? null : MenuContent}
            </aside>
            <div
                className={`max-h-full pt-[3.88rem] ${isMenuOpened ? 'sm:landscape:opacity-60 md:portrait:opacity-60 lg:pl-[23.69rem] md:landscape:pl-[23.69rem]' : ''}`}>
                <div
                    className={'max-h-full rounded-small border-small border-control2 bg-section text-primary font-neo text-[1.5rem] leading-[130%] overflow-y-scroll'}>
                    <div className={'px-[0.44rem] py-[0.59rem]'}>
                        {ViewDict[selectedOption].elem()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default DocumentationView;
export type {TListEntry};