import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import cn from 'classnames';

import { Route } from '@/app/static';

import { ContentAnchors, DocumentationContent } from '@/app/types/documentation';

import { getIdName } from '@/app/utils';
import { useNavigate, useOuterClickClose } from '@/app/hooks';
import { useLayout } from '@/app/context';

import { Button, Select } from '@/app/ui/form';

import SVG_FULLSCREEN from '/public/images/icons/fullscreen.svg';
import SVG_VIEW_VIEW from '/public/images/icons/view-view.svg';

interface Props {
    contents: Record<string, DocumentationContent>;
}

const DocumentationScreen: FC<Props> = (props: Props) => {
    const { contents } = props;
    const route = usePathname();
    const layoutCtx = useLayout();
    const [navigate] = useNavigate();

    const [isPiPMode, setPiPModeState] = useState(false);
    const [isPiPModeChild, setPiPModeChildState] = useState(false);
    const [menuOpened, setMenuOpened] = useState(false);
    const [isSelectOpened, setSelectOpenState] = useState(false);

    const documentationContent: DocumentationContent | null = route ? contents[route] : null;

    const menuRef = useRef<HTMLDivElement | null>(null);

    const toggleMenuOpen = () => setMenuOpened((prevState) => !prevState);

    const handleEnablePiP = () => {
        if (!route) return;
        const newWindow = window.open(route, '_blank', 'width=600,height=400');
        newWindow?.sessionStorage.setItem('pip-mode-child', '');

        const handleLoad = () => {
            setPiPModeState(true);
            setMenuOpened(false);
            sessionStorage.setItem('pip-mode-parent', '');
        };
        const handleUnload = () => {
            setPiPModeState(false);
            sessionStorage.removeItem('pip-mode-parent');
        };

        newWindow?.addEventListener('load', handleLoad);
        newWindow?.addEventListener('unload', handleUnload);
    };

    useOuterClickClose(menuRef, menuOpened, setMenuOpened);

    // Click checking
    useEffect(() => {
        setPiPModeState(sessionStorage.getItem('pip-mode-parent') !== null);
        setPiPModeChildState(sessionStorage.getItem('pip-mode-child') !== null);

        return () => sessionStorage.removeItem('pip-mode-parent');
    }, []);

    // Renders an anchor list for the opened document
    const renderAnchorListHelper = (
        list: ContentAnchors,
        isChapters: boolean,
        chapterFlag: boolean,
        chapterCounter: number,
    ): ReactElement => {
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
                    if (chapterFlag) anchorId = chapterCounter + '-' + (idx + 1) + '-' + anchorId;
                }
            } else {
                chapterFlag = isChapters && true;
                anchorId = Object.keys(entry)[0] || '';
                anchorText = anchorId;
                if (chapterFlag) {
                    chapterCounter++;
                    anchorText = 'Chapter ' + chapterCounter + '. ' + anchorText;
                }
                SubListOptions = Object.values(entry).map((subEntry: ContentAnchors) =>
                    renderAnchorListHelper(subEntry, isChapters, chapterFlag, chapterCounter),
                );
                chapterFlag = isChapters && false;
            }

            return (
                <li
                    key={anchorText + idx}
                    className={'mt-[0.5rem] pl-[1rem]'}
                >
                    <span
                        onClick={() => {
                            document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' });
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
        return <>{ListOptions}</>;
    };

    const renderAnchorList = (list: ContentAnchors | undefined, isChapters: boolean | undefined): ReactElement => {
        const chapterCounter = 0;
        const chapterFlag = false;
        return renderAnchorListHelper(list ?? [], isChapters === true, chapterFlag, chapterCounter);
    };

    // Misc
    const MenuBtn = isPiPMode ? null : (
        <Button
            onClick={() => toggleMenuOpen()}
            className={`h-[1.8rem] min-w-[1.8125rem] rounded-xs border-2 border-white p-[0.2rem]`}
        >
            <div className={`box-border h-full rounded-s-[0.125rem] bg-white ${menuOpened ? 'w-[10%]' : 'w-[40%]'}`} />
        </Button>
    );

    const ControlBtns =
        isPiPMode || isPiPModeChild ? null : (
            <>
                <Button
                    onClick={() => layoutCtx.toggleFullscreen()}
                    className={'size-[1.81rem]'}
                >
                    <Image
                        src={SVG_FULLSCREEN}
                        alt={'fullscreen'}
                    />
                </Button>
                <Button onClick={() => handleEnablePiP()}>
                    <Image
                        src={SVG_VIEW_VIEW}
                        alt={'view-view'}
                    />
                </Button>
            </>
        );

    const options: Record<string, string> = Object.fromEntries(
        Object.keys(contents).map((key) => [key, getIdName(key) ?? '']),
    );

    const selectCn = 'h-[2.5rem] ' + (isSelectOpened ? '[&]:bg-gray' : '[&]:bg-transparent border-none');

    return (
        <div
            className={cn(
                `h-full min-w-[min(calc(100%-2*var(--p-l)),70rem)] flex-grow self-center text-basic`,
                `sm:min-w-full`,
                {
                    [cn(
                        `my-l max-h-fit min-h-[calc(100%-2*var(--p-n))] max-w-[90%]`,
                        `sm:x-[max-w-full,my-0,mt-xs,min-w-0]`,
                        `sm:h-[calc(100%-var(--p-xs))]`,
                    )]: !layoutCtx.isNoLayout,
                },
            )}
        >
            <div className={`box-content flex h-full rounded-s border-s border-gray bg-navy-d0 leading-[130%]`}>
                <aside
                    ref={menuRef}
                    className={cn(
                        `rounded-l-s p-xs text-left`,
                        `sm:x-[absolute,top-0,left-0,p-xs,h-full]`,
                        menuOpened
                            ? `min-w-[19rem] bg-gray sm:portrait:w-full`
                            : `pr-0 ${isSelectOpened ? 'h-full' : 'bg-none sm:[&]:h-fit'}`,
                    )}
                >
                    <div className={`flex h-[2rem] items-center sm:x-[flex-col,items-start,h-[5rem]]`}>
                        <span className={'flex h-[3rem] items-center gap-x-[0.62rem] md:contents lg:contents'}>
                            {MenuBtn}
                            <Select
                                options={options}
                                onChangeCustom={(route) => navigate(route as Route)}
                                value={route ?? ''}
                                onOpen={(isExpanded) => setSelectOpenState(isExpanded)}
                                classNameWrapper={'md:hidden lg:hidden'}
                                className={`rounded-xs pl-[0.62rem] pr-[1rem] text-[1.3rem] font-bold [&_img]:relative [&_img]:-right-[0.5rem] [&_img]:w-[1rem] ${selectCn}`}
                                classNameOption={`w-full ${selectCn} border-s border-white`}
                            />
                        </span>
                        <span
                            hidden={!menuOpened}
                            className={cn(
                                `ml-[0.77rem] text-nowrap text-section-s sm:portrait:x-[my-[2.7rem],text-section-s] sm:landscape:x-[my-[1rem]]`,
                                { ['brightness-50']: isSelectOpened },
                            )}
                        >
                            Table of Contents
                        </span>
                    </div>
                    <div
                        className={cn(
                            `h-[calc(100%-2rem)] pt-[1.5rem] text-section-s sm:mt-0 sm:h-[calc(100%-5rem)] sm:portrait:text-basic`,
                            { ['brightness-50']: isSelectOpened },
                        )}
                    >
                        <ul
                            hidden={!menuOpened}
                            className={'h-full overflow-y-scroll'}
                        >
                            {renderAnchorList(documentationContent?.anchors, documentationContent?.isChapter)}
                        </ul>
                    </div>
                </aside>
                <div
                    className={cn(`h-full w-full content-center p-xs pr-0 text-left sm:p-[0.63rem]`, {
                        ['w-[58dvw] max-w-[70rem]']: !layoutCtx.isNoLayout,
                    })}
                >
                    <div className={`h-full w-full select-all overflow-y-scroll text-documentation leading-[130%]`}>
                        {isPiPMode ? (
                            <span className={'block h-full w-[70rem] content-center text-center text-heading-l'}>
                                Picture in picture mode
                            </span>
                        ) : (
                            documentationContent?.children
                        )}
                    </div>
                </div>
                <aside className={`flex flex-col justify-between p-xs sm:hidden`}>{ControlBtns}</aside>
            </div>
        </div>
    );
};

export { DocumentationScreen };
