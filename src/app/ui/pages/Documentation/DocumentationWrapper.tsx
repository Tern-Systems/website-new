import React, {JSX, ReactElement, useEffect, useState} from 'react'
import Image from "next/image";

import {SectionsEnum} from "@/app/static";

import ManualView, {ManualAnchors} from "./Manual";
import GHandbookView, {GHandbookAnchors} from "./GHandbook";

import SVG_FULLSCREEN from "@/assets/images/icons/fullscreen.svg";
import SVG_VIEW_VIEW from "@/assets/images/icons/view-view.svg";


type TListEntry = Array<string | Record<string, TListEntry>>;

const COMING_SOON_DOC = {
    elem: () => <span className={'mx-auto text-[5rem]'}>Coming soon...</span>,
    anchors: [],
    isChapter: false
};

const ViewDict: Record<string, { elem: () => JSX.Element, anchors: TListEntry, isChapter: boolean }> = {
    [SectionsEnum.TernKeyManual]: {elem: ManualView, anchors: ManualAnchors, isChapter: false},
    [SectionsEnum.GHandbook]: {elem: GHandbookView, anchors: GHandbookAnchors, isChapter: true},
    [SectionsEnum.UserManual]: COMING_SOON_DOC,
    [SectionsEnum.ARCHManual]: COMING_SOON_DOC,
    [SectionsEnum.TernKitManual]: COMING_SOON_DOC,
    [SectionsEnum.BTMCHandbook]: COMING_SOON_DOC,
    [SectionsEnum.TernHandbook]: COMING_SOON_DOC,
}
const ViewDictKeys = Object.keys(ViewDict) as SectionsEnum[];


interface Props {
    view: SectionsEnum;
}

const DocumentationWrapper = (props: Props) => {
    const {view} = props;

    const [isMenuOpened, setMenuOpened] = useState<boolean>(false);
    const [isSelectExpanded, setSelectExpanded] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<SectionsEnum>(view);

    const toggleSelectExpand = () => setSelectExpanded((prevState) => !prevState);
    const toggleMenuOpen = () => setMenuOpened((prevState) => !prevState);

    // Click checking
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (isMenuOpened && !document.querySelector('#documentation-menu')?.contains(event.target as Node))
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
    const OptionsAllJSX: ReactElement[] = ViewDictKeys.map((value, idx) =>
        <li
            className={'flex'}
            key={value + idx}
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
        const ListOptions: ReactElement[] = list.map((entry, idx): ReactElement => {
            let anchorId: string;
            let anchorText: string;
            let SubListOptions: ReactElement[] = [];

            if (typeof entry === 'string') {
                anchorId = entry;
                anchorText = anchorId;
                if (isChapters && chapterCounter > 0) {
                    anchorText = chapterCounter + '.' + (idx + 1) + ' ' + anchorText;
                    anchorId = entry;
                    if (chapterFlag)
                        anchorId = chapterCounter + '-' + (idx + 1) + '-' + anchorId;
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
                <li key={anchorText + idx} className={'pl-[1rem]'}>
                    <span onClick={() => document.getElementById(anchorId)?.scrollIntoView({behavior: 'smooth'})}>
                        {anchorText}
                    </span>
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

    return (
        <div
            className={`pt-[3.88rem] self-center max-h-[49.25rem]
                        ${isMenuOpened ? 'sm:landscape:opacity-60 md:portrait:opacity-60' : ''}`}>
            <div
                className={`relative flex max-h-full rounded-small border-small border-control2 bg-section text-primary font-neo
                            text-[1.5rem] leading-[130%]box-content overflow-hidden`}>
                <aside
                    id={'documentation-menu'}
                    className={`flex flex-col px-[--px] py-[--py] max-h-screen text-primary text-[1.0625rem] text-left
                    z-[1] ${isMenuOpened ? 'bg-[#4D4D4D] w-[19.44rem] sm:portrait:w-screen' : 'h-fit bg-none'}`}
                >
                    <div className={`flex items-center`}>
                        {MenuBtn}
                        <span hidden={!isMenuOpened} className={'ml-[2.31rem] text-[1.125rem]'}>Table of Contents</span>
                    </div>
                    <div
                        hidden={!isMenuOpened}
                        className={`mt-[1.86rem] overflow-y-scroll w-full ${isSelectExpanded ? 'opacity-25' : ''}`}
                    >
                        <ul style={{marginLeft: '-0.9rem'}}>
                            {renderAnchorList(ViewDict[selectedOption].anchors, ViewDict[selectedOption].isChapter)}
                        </ul>
                    </div>
                </aside>
                <Image src={SVG_FULLSCREEN} alt={'fullscreen'}
                       className={'absolute top-[1.25rem] right-[1.25rem]'}/>
                <Image src={SVG_VIEW_VIEW} alt={'view-view'}
                       className={'absolute bottom-[1.25rem] right-[1.25rem]'}/>
                <div
                    className={'px-[0.44rem] py-[0.59rem] w-[78.375rem] overflow-y-scroll pr-[4.31rem] min-h-[49.25rem]'}>
                    {ViewDict[selectedOption].elem()}
                </div>
            </div>
        </div>
    );
}

export type {TListEntry};
export {DocumentationWrapper};
