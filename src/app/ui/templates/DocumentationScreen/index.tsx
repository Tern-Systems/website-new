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

import SVG_FULLSCREEN from "/public/images/icons/fullscreen.svg";
import SVG_VIEW_VIEW from "/public/images/icons/view-view.svg";


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
                <li key={anchorText + idx} className={'pl-[1rem] mt-[0.5rem]'}>
                    <span
                        onClick={() => {
                            document.getElementById(anchorId)?.scrollIntoView({behavior: 'smooth'})
                            setMenuOpened(false);
                        }}
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

    const selectCn = 'h-[2.5rem] ' + (isSelectOpened ? '[&]:bg-control-gray' : '[&]:bg-transparent border-none');

    return (
        <div
            className={cn(
                `self-center flex-grow h-full min-w-[min(calc(100%-2*var(--p-content-l)),70rem)] text-default`,
                `sm:min-w-full`,
                {
                    [cn(
                        `my-[--p-content-l] max-h-fit min-h-[calc(100%-2*var(--p-content))] max-w-[90%]`,
                        `sm:x-[max-w-full,my-0,mt-[--p-content-xs],min-w-0]`,
                        `sm:h-[calc(100%-var(--p-content-xs))]`,
                    )]: !layoutCtx.isNoLayout,
                }
            )}
        >
            <div
                className={`flex h-full rounded-small border-small border-control-gray bg-section-navy
                            leading-[130%] box-content`}>
                <aside
                    id={'documentation-menu'}
                    className={cn(
                        `p-[--p-content-xs] rounded-l-small text-left`,
                        `sm:x-[absolute,top-0,left-0,p-[--p-content-xs],h-full]`,
                        isMenuOpened
                            ? `bg-control-gray min-w-[19rem]    sm:portrait:w-full`
                            : `pr-0 ${isSelectOpened ? 'h-full' : 'sm:[&]:h-fit bg-none'}`
                    )}
                >
                    <div className={`flex items-center h-[2rem] sm:x-[flex-col,items-start,h-[5rem]]`}>
                        <span className={'flex gap-x-[0.62rem] lg:contents md:contents items-center h-[3rem]'}>
                            {MenuBtn}
                            <Select
                                options={options}
                                onChangeCustom={(route) => navigate(route as Route)}
                                value={route ?? ''}
                                onOpen={(isExpanded) => setSelectOpenState(isExpanded)}
                                classNameWrapper={'md:hidden lg:hidden'}
                                className={`text-[1.3rem] font-bold font-oxygen rounded-smallest 
                                            pl-[0.62rem] pr-[1rem] [&_img]:relative [&_img]:w-[1rem] [&_img]:-right-[0.5rem] ${selectCn}`}
                                classNameOption={`w-full ${selectCn} border-small border-control-white`}
                            />
                        </span>
                        <span hidden={!isMenuOpened}
                              className={cn(`
                                    ml-[0.77rem] text-section-s text-nowrap
                                    sm:portrait:x-[my-[2.7rem],text-section-s]
                                    sm:landscape:x-[my-[1rem]]`,
                                  {['brightness-50']: isSelectOpened}
                              )}
                        >
                            Table of Contents
                        </span>
                    </div>
                    <div
                        className={cn(`
                            pt-[1.5rem] h-[calc(100%-2rem)] text-section-s
                            sm:h-[calc(100%-5rem)] sm:mt-0 
                            sm:portrait:text-basic`,
                            {['brightness-50']: isSelectOpened}
                        )}
                    >
                        <ul
                            hidden={!isMenuOpened}
                            className={'overflow-y-scroll h-full'}
                        >
                            {renderAnchorList(documentationContent?.anchors, documentationContent?.isChapter)}
                        </ul>
                    </div>
                </aside>
                <div
                    className={cn(
                        `p-[--p-content-xs] pr-0 w-full h-full text-left content-center
                        sm:p-[0.63rem]`,
                        {['w-[58dvw] max-w-[70rem]']: !layoutCtx.isNoLayout}
                    )}
                >
                    <div className={`h-full w-full overflow-y-scroll text-documentation leading-[130%] select-all`}>
                        {isPiPMode
                            ? (
                                <span className={'block content-center w-[70rem] h-full text-center text-heading-l'}>
                                    Picture in picture mode
                                </span>
                            )
                            : documentationContent?.children}
                    </div>
                </div>
                <aside className={`p-[--p-content-xs] flex flex-col justify-between    sm:hidden`}>
                    {ControlBtns}
                </aside>
            </div>
        </div>
    );
}


export {DocumentationScreen};
