import React, {FC, ReactElement, useEffect, useState} from 'react'
import {useParams} from "next/navigation";
import Image from "next/image";

import {ContentAnchors, DocumentationContent} from "@/app/types/documentation";

import SVG_FULLSCREEN from "@/assets/images/icons/fullscreen.svg";
import SVG_VIEW_VIEW from "@/assets/images/icons/view-view.svg";


interface Props {
    contents: Record<string, DocumentationContent>;
}

const DocumentationScreenTool: FC<Props> = (props: Props) => {
    const {contents} = props;
    const {content} = useParams() as { content: string } ?? {};


    const [isMenuOpened, setMenuOpened] = useState<boolean>(false);
    const [contentParam, setContentParam] = useState<string | null>(null);

    const documentationContent: DocumentationContent | null = contentParam ? contents[contentParam] : null;


    const toggleMenuOpen = () => setMenuOpened((prevState) => !prevState);

    useEffect(() => {
        setContentParam('/' + content);
    }, [content]);

    // Click checking
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (isMenuOpened && !document.querySelector('#documentation-menu')?.contains(event.target as Node))
                setMenuOpened(false);
        }
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [isMenuOpened, setMenuOpened])


    // Renders an anchor list for the opened document
    const renderAnchorListHelper = (list: ContentAnchors, isChapters: boolean, chapterFlag: boolean, chapterCounter: number): ReactElement => {
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
                SubListOptions = Object.values(entry).map((subEntry: ContentAnchors) => renderAnchorListHelper(subEntry, isChapters, chapterFlag, chapterCounter));
                chapterFlag = isChapters && false;
            }

            return (
                <li key={anchorText + idx} className={'pl-[1rem]'}>
                    <span
                        onClick={() => document.getElementById(anchorId)?.scrollIntoView({behavior: 'smooth'})}
                        className={'cursor-pointer'}
                    >
                        {anchorText}
                    </span>
                    <ul>{SubListOptions}</ul>
                </li>
            );
        });
        return <>{ListOptions}</>
    }
    const renderAnchorList = (list: ContentAnchors | undefined, isChapters: boolean | undefined): ReactElement => {
        const chapterCounter = 0;
        const chapterFlag = false;
        return renderAnchorListHelper(list ?? [], isChapters === true, chapterFlag, chapterCounter);
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
            className={`pt-[--py] self-center max-h-[49.25rem]
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
                        className={`mt-[1.86rem] overflow-y-scroll w-full`}
                    >
                        <ul style={{marginLeft: '-0.9rem'}}>
                            {renderAnchorList(documentationContent?.anchors, documentationContent?.isChapter)}
                        </ul>
                    </div>
                </aside>
                <Image src={SVG_FULLSCREEN} alt={'fullscreen'}
                       className={'absolute top-[1.25rem] right-[1.25rem]'}/>
                <Image src={SVG_VIEW_VIEW} alt={'view-view'}
                       className={'absolute bottom-[1.25rem] right-[1.25rem]'}/>
                <div
                    className={`px-[0.44rem] py-[0.59rem] w-[78.375rem] overflow-y-scroll pr-[4.31rem] min-h-[49.25rem]
                                text-left`}>
                    {documentationContent?.children}
                </div>
            </div>
        </div>
    );
}


export {DocumentationScreenTool};
