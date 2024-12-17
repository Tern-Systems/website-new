import React, {FC, ReactElement, useEffect, useState} from 'react'
import {usePathname} from "next/navigation";
import Image from "next/image";

import {ContentAnchors, DocumentationContent} from "@/app/types/documentation";

import {useLayout} from "@/app/context";

import {Button} from "@/app/ui/form";

import SVG_FULLSCREEN from "@/assets/images/icons/fullscreen.svg";
import SVG_VIEW_VIEW from "@/assets/images/icons/view-view.svg";


interface Props {
    contents: Record<string, DocumentationContent>;
}

const DocumentationScreen: FC<Props> = (props: Props) => {
    const {contents} = props;
    const route = usePathname();
    const layoutCtx = useLayout();

    const [isPiPMode, setPiPModeState] = useState(false);
    const [isPiPModeChild, setPiPModeChildState] = useState(false);
    const [isMenuOpened, setMenuOpened] = useState<boolean>(false);

    const documentationContent: DocumentationContent | null = route ? contents[route] : null;

    const toggleMenuOpen = () => setMenuOpened((prevState) => !prevState);

    const handleEnablePiP = () => {
        if (!route)
            return;
        const newWindow = window.open(route, '_blank no', 'width=600,height=400');
        newWindow?.sessionStorage.setItem('pip-mode-child', '');

        const handleLoad = () => {
            setPiPModeState(true);
            sessionStorage.setItem('pip-mode-parent', '');
        }
        const handleUnload = () => {
            setPiPModeState(false);
            sessionStorage.removeItem('pip-mode-parent');
        }

        newWindow?.addEventListener('load', handleLoad);
        newWindow?.addEventListener('unload', handleUnload);
    }

    // Click checking
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (isMenuOpened && !document.querySelector('#documentation-menu')?.contains(event.target as Node))
                setMenuOpened(false);
        }

        setPiPModeState(sessionStorage.getItem('pip-mode-parent') !== null)
        setPiPModeChildState(sessionStorage.getItem('pip-mode-child') !== null)

        window.addEventListener('click', handleClick);
        return () => {
            sessionStorage.removeItem('pip-mode-parent');
            window.removeEventListener('click', handleClick);
        }
        //eslint-disable-next-line
    }, [])

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
    const MenuBtn = isPiPMode
        ? null
        : (
            <Button
                className={'p-[0.2rem] h-[1.8125rem] min-w-[1.8125rem] rounded-[0.3125rem] border-2 border-white'}
                onClick={() => toggleMenuOpen()}
            >
                <div
                    className={`bg-white box-border h-[100%] rounded-s-[0.125rem] ${isMenuOpened ? 'w-[10%]' : 'w-[40%]'}`}/>
            </Button>
        );

    const ControlBtns = isPiPMode || isPiPModeChild
        ? null
        : (
            <>
                <Button
                    onClick={() => layoutCtx.toggleFullscreen()}
                    className={'absolute top-[1.25rem] right-[1.25rem]'}
                >
                    <Image src={SVG_FULLSCREEN} alt={'fullscreen'}/>
                </Button>
                <Button
                    onClick={() => handleEnablePiP()}
                    className={'absolute bottom-[1.25rem] right-[1.25rem]'}
                >
                    <Image src={SVG_VIEW_VIEW} alt={'view-view'}/>
                </Button>
            </>
        );

    return (
        <div
            className={`self-center flex-grow ${layoutCtx.isNoLayout ? 'h-full' : 'max-h-[90%] max-w-[90%] pt-[--py]'}`}>
            <div
                className={`relative flex h-full rounded-small border-small border-control2 bg-section text-primary font-neo
                            text-[1.5rem] leading-[130%] box-content overflow-hidden`}>
                <aside
                    id={'documentation-menu'}
                    className={`px-[--px] py-[--py] text-primary text-[1.0625rem] text-left overflow-y-hidden
                                ${isMenuOpened ? 'bg-[#4D4D4D] min-w-[19.44rem] sm:portrait:w-screen' : 'h-fit bg-none'}`}
                >
                    <div className={`flex items-center`}>
                        {MenuBtn}
                        <span hidden={!isMenuOpened} className={'ml-[2.31rem] text-[1.125rem]'}>Table of Contents</span>
                    </div>
                    <div className={'mt-[1.86rem] h-full overflow-y-scroll'}>
                        <ul
                            hidden={!isMenuOpened}
                            className={'ml-[-0.9rem]'}
                        >
                            {renderAnchorList(documentationContent?.anchors, documentationContent?.isChapter)}
                        </ul>
                    </div>
                </aside>
                {ControlBtns}
                <div
                    className={`pl-[0.44rem] py-[--py] pr-[4.31rem] text-left content-center 
                                ${layoutCtx.isNoLayout ? '' : 'max-w-[78.375rem]'} `}>
                    <div className={`h-full overflow-y-scroll `}>
                        {isPiPMode
                            ? <span
                                className={'block text-center content-center text-[2rem] w-[70rem] h-full'}>Picture in picture mode</span>
                            : documentationContent?.children}
                    </div>
                </div>
            </div>
        </div>
    );
}


export {DocumentationScreen};
