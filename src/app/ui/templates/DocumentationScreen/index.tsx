import React, {FC, ReactElement, useEffect, useState} from 'react'
import {usePathname} from "next/navigation";
import Image from "next/image";
import cn from "classnames";

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
    const [isMenuOpened, setMenuOpened] = useState(false);
    const [isSelectOpened, setSelectOpenState] = useState(false);

    const documentationContent: DocumentationContent | null = route ? contents[route] : null;

    const toggleMenuOpen = () => setMenuOpened((prevState) => !prevState);

    const handleEnablePiP = () => {
        if (!route)
            return;
        const newWindow = window.open(route, '_blank', 'width=600,height=400');
        newWindow?.sessionStorage.setItem('pip-mode-child', '');

        const handleLoad = () => {
            setPiPModeState(true);
            setMenuOpened(false);
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

        window.addEventListener('mousedown', handleClick);
        return () => {
            sessionStorage.removeItem('pip-mode-parent');
            window.removeEventListener('mousedown', handleClick);
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
            className={cn(
                `self-center flex-grow h-full min-w-[min(90dvw,70rem)] text-default 
                sm:landscape:pb-[--2dr]`,
                {['max-h-[90%] max-w-[90%] pt-[--s-default] sm:x-[max-h-full,max-w-full,pt-[1.25rem],min-w-0]']: !layoutCtx.isNoLayout}
            )}
        >
            <div
                className={`flex h-full rounded-small border-small border-control-gray bg-control-navy text-[1.5rem]
                            leading-[130%] box-content overflow-hidden`}>
                <aside
                    id={'documentation-menu'}
                    className={cn(
                        `p-[--s-default] pr-0 text-left
                        sm:x-[absolute,top-0,left-0,p-[1.25rem],h-full]`,
                        isMenuOpened
                            ? 'bg-[#4D4D4D] min-w-[19rem] sm:portrait:w-full'
                            : (isSelectOpened ? 'h-full' : 'h-fit bg-none')
                    )}
                >
                    <div className={`flex items-center h-[2rem] sm:x-[flex-col,items-start,h-[5rem]]`}>
                        <span className={'flex gap-x-[0.62rem] lg:contents md:contents items-center h-[3rem]'}>
                            {MenuBtn}
                            <Select
                                options={options}
                                onChangeCustom={(route) => navigate(route as Route)}
                                value={route ?? ''}
                                onClick={() => setSelectOpenState(prevState => !prevState)}
                                classNameWrapper={'w-[min(35dvw,10rem)] md:hidden lg:hidden'}
                                className={`text-[1.3rem] font-bold font-oxygen border-none rounded-smallest
                                            px-[min(1.3dvw,1.62rem)] [&_img]:relative [&_img]:w-[1rem] [&_img]:-right-[0.3rem] ${selectBgCn}`}
                                classNameOption={`w-full ${selectBgCn} border-none`}
                            />
                        </span>
                        <span hidden={!isMenuOpened}
                              className={`text-content-small text-nowrap ml-[1rem]
                                        sm:portrait:x-[my-[2.7rem],text-header]
                                        sm:landscape:x-[my-[--1dr]]`}
                        >
                            Table of Contents
                        </span>
                    </div>
                    <div
                        className={'h-[calc(100%-2rem)] overflow-y-scroll text-content-small sm:h-[calc(100%-5rem)] sm:portrait:text-content'}>
                        <ul
                            hidden={!isMenuOpened}
                            className={'ml-[-0.9rem] overflow-y-scroll h-full'}
                        >
                            {renderAnchorList(documentationContent?.anchors, documentationContent?.isChapter)}
                        </ul>
                    </div>
                </aside>
                <div
                    className={`px-[0.75rem] w-full text-left content-center p-[--s-default] h-full
                                ${layoutCtx.isNoLayout ? '' : 'w-[58dvw] max-w-[70rem]'}
                                sm:p-[0.63rem]`}>
                    <div className={`h-full w-full overflow-y-scroll`}>
                        {isPiPMode
                            ? <span
                                className={'block text-center content-center text-[2rem] w-[70rem] h-full'}>Picture in picture mode</span>
                            : documentationContent?.children}
                    </div>
                </div>
                <aside className={`p-[--s-default] flex flex-col justify-between    sm:hidden`}>
                    {ControlBtns}
                </aside>
            </div>
        </div>
    );
}


export {DocumentationScreen};
