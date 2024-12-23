import React, {FC, ReactElement, useEffect, useState} from 'react'
import {usePathname} from "next/navigation";
import Image from "next/image";

import {Route} from "@/app/static";

import {ContentAnchors, DocumentationContent} from "@/app/types/documentation";

import {getRouteName} from "@/app/utils";
import {useNavigate} from "@/app/hooks";
import {useLayout} from "@/app/context";

import {Button, Select} from "@/app/ui/form";

import SVG_FULLSCREEN from "@/assets/images/icons/fullscreen.svg";
import SVG_VIEW_VIEW from "@/assets/images/icons/view-view.svg";


interface Props {
    contents: Record<string, DocumentationContent>;
}

const DocumentationScreen: FC<Props> = (props: Props) => {
    const {contents} = props;
    const route = usePathname();
    const layoutCtx = useLayout();
    const [navigate] = useNavigate();

    const [isPiPMode, setPiPModeState] = useState(false);
    const [isPiPModeChild, setPiPModeChildState] = useState(false);
    const [isMenuOpened, setMenuOpened] = useState<boolean>(false);

    const documentationContent: DocumentationContent | null = route ? contents[route] : null;

    const toggleMenuOpen = () => setMenuOpened((prevState) => !prevState);

    const handleEnablePiP = () => {
        if (!route)
            return;
        const newWindow = window.open(route, '_blank', 'width=600,height=400');
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
                onClick={() => toggleMenuOpen()}
                className={`p-[0.2rem] h-[1.8rem] min-w-[1.8125rem] rounded-smallest border-2 border-white`}
            >
                <div
                    className={`bg-control-white box-border h-full rounded-s-[0.125rem] ${isMenuOpened ? 'w-[10%]' : 'w-[40%]'}`}/>
            </Button>
        );

    const ControlBtns = isPiPMode || isPiPModeChild
        ? null
        : (
            <>
                <Button onClick={() => layoutCtx.toggleFullscreen()} className={'size-[1.81rem]'}>
                    <Image src={SVG_FULLSCREEN} alt={'fullscreen'}/>
                </Button>
                <Button onClick={() => handleEnablePiP()}>
                    <Image src={SVG_VIEW_VIEW} alt={'view-view'}/>
                </Button>
            </>
        );

    const options: Record<string, string> = Object.fromEntries(
        Object.keys(contents).map((key) => [key, getRouteName(key) ?? ''])
    );

    const selectBgCn = isMenuOpened ? '[&]:bg-control-gray' : '[&]:bg-transparent';

    return (
        <div
            className={`self-center flex-grow h-full min-w-[70rem] 
                       ${layoutCtx.isNoLayout ? '' : 'max-h-[90%] max-w-[90%] pt-[--p-small] sm:max-h-full sm:max-w-full sm:pt-[1.25rem] sm:min-w-0'}`}>
            <div
                className={`flex h-full rounded-small border-small border-control-gray bg-control-navy text-[1.5rem]
                            leading-[130%] box-content overflow-hidden
                            sm:p-[0.`}>
                <aside
                    id={'documentation-menu'}
                    className={`text-[1.0625rem] p-[--p-small] text-left overflow-y-hidden      sm:absolute sm:top-0 sm:left-0 sm:p-[1.25rem] sm:h-full
                                ${isMenuOpened ? 'bg-[#4D4D4D] min-w-[19.44rem] sm:w-full' : 'h-fit bg-none'}`}
                >
                    <div className={`flex items-center sm:flex-col sm:items-start`}>
                        <span className={'flex gap-x-[0.62rem] lg:contents md:contents items-center h-[3rem]'}>
                            {MenuBtn}
                            <Select
                                options={options}
                                onChangeCustom={(route) => navigate(route as Route)}
                                value={route ?? ''}
                                classNameWrapper={'w-[min(35dvw,10rem)]'}
                                className={`md:hidden lg:hidden text-[1.3rem] font-bold font-oxygen border-none rounded-smallest
                                            px-[min(1.3dvw,1.62rem)] [&_img]:relative [&_img]:w-[1rem] [&_img]:-right-[0.3rem] ${selectBgCn}`}
                                classNameOption={`w-full ${selectBgCn} border-none`}
                            />
                        </span>
                        <span hidden={!isMenuOpened}
                              className={'ml-[2.31rem] text-content-small sm:ml-0 sm:mt-[2.7rem]'}>Table of Contents</span>
                    </div>
                    <div className={'mt-[1.86rem] h-full overflow-y-scroll sm:mt-[0.74rem]'}>
                        <ul
                            hidden={!isMenuOpened}
                            className={'ml-[-0.9rem]'}
                        >
                            {renderAnchorList(documentationContent?.anchors, documentationContent?.isChapter)}
                        </ul>
                    </div>
                </aside>
                <div
                    className={`px-[0.75rem] w-full text-left content-center p-[--p-small]     sm:p-[0.63rem]
                                ${layoutCtx.isNoLayout ? '' : 'max-w-[78.375rem]'}`}>
                    <div className={`h-full w-full overflow-y-scroll`}>
                        {isPiPMode
                            ? <span
                                className={'block text-center content-center text-[2rem] w-[70rem] h-full'}>Picture in picture mode</span>
                            : documentationContent?.children}
                    </div>
                </div>
                <aside className={`text-[1.0625rem] p-[--p-small] flex flex-col justify-between    sm:hidden`}>
                    {ControlBtns}
                </aside>
            </div>
        </div>
    );
}


export {DocumentationScreen};
