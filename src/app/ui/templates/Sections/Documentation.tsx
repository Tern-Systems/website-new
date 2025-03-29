'use client';

import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import cn from 'classnames';

import { ContentAnchors, DocumentationContent } from '@/app/types/documentation';
import { useLayout, useOuterClickClose } from '@/app/hooks';

import { BreadcrumbRoute } from '@/app/ui/atoms';
import { Button } from '@/app/ui/form';

import styles from '@/app/common.module.css';

import { faExpand, faEye } from '@fortawesome/free-solid-svg-icons';

const PIP_MODE_PARENT = 'pip-mode-parent';
const PIP_MODE_CHILD = 'pip-mode-child';

const ASIDE_P_CN = 'p-4xs md:p-xxs lg:p-xs';

interface Props {
    contents: Record<string, DocumentationContent>;
}

const DocumentationSection: FC<Props> = (props: Props) => {
    const { contents } = props;
    const route = usePathname();
    const layoutCtx = useLayout();

    const [pipMode, setPiPMode] = useState(false);
    const [pipModeChild, setPiPModeChild] = useState(false);
    const [menuOpened, setMenuOpened] = useState(false);

    const content: DocumentationContent | null = route ? contents[route] : null;

    const menuAsideRef = useRef<HTMLDivElement | null>(null);

    const toggleMenuOpen = () => setMenuOpened((prevState) => !prevState);

    const handleEnablePiP = () => {
        if (!route) return;
        const newWindow = window.open(route, '_blank', 'width=600,height=400');
        newWindow?.sessionStorage.setItem(PIP_MODE_CHILD, '');

        const handleLoad = () => {
            setPiPMode(true);
            setMenuOpened(false);
            sessionStorage.setItem(PIP_MODE_PARENT, '');
        };
        const handleUnload = () => {
            setPiPMode(false);
            sessionStorage.removeItem(PIP_MODE_PARENT);
        };

        newWindow?.addEventListener('load', handleLoad);
        newWindow?.addEventListener('unload', handleUnload);
    };

    useOuterClickClose(menuAsideRef, menuOpened, setMenuOpened);

    // Click checking
    useEffect(() => {
        setPiPMode(sessionStorage.getItem(PIP_MODE_PARENT) !== null);
        setPiPModeChild(sessionStorage.getItem(PIP_MODE_CHILD) !== null);

        return () => sessionStorage.removeItem(PIP_MODE_PARENT);
    }, []);

    // Renders an anchor list for the opened document
    const renderAnchorListHelper = (
        list: ContentAnchors,
        root: boolean,
        chapters: boolean,
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
                if (chapters && chapterCounter > 0) {
                    anchorText = chapterCounter + '.' + (idx + 1) + ' ' + anchorText;
                    anchorId = entry;
                    if (chapterFlag) anchorId = chapterCounter + '-' + (idx + 1) + '-' + anchorId;
                }
            } else {
                chapterFlag = chapters && true;
                anchorId = Object.keys(entry)[0] || '';
                anchorText = anchorId;
                if (chapterFlag) {
                    chapterCounter++;
                    anchorText = 'Chapter ' + chapterCounter + '. ' + anchorText;
                }
                SubListOptions = Object.values(entry).map((subEntry: ContentAnchors) =>
                    renderAnchorListHelper(subEntry, false, chapters, chapterFlag, chapterCounter),
                );
                chapterFlag = chapters && false;
            }

            return (
                <li
                    key={anchorText + idx}
                    className={cn({ ['pl-xxs']: !root })}
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

    const renderAnchorList = (list: ContentAnchors | undefined, chapters: boolean | undefined): ReactElement => {
        const chapterCounter = 0;
        const chapterFlag = false;
        return renderAnchorListHelper(list ?? [], true, chapters === true, chapterFlag, chapterCounter);
    };

    // Misc
    const MenuBtn = pipMode ? null : (
        <Button
            onClick={() => toggleMenuOpen()}
            className={`h-button-l min-w-button-l rounded-xs border-n border-white p-[0.2rem]`}
        >
            <div className={`box-border h-full rounded-s-[0.125rem] bg-white ${menuOpened ? 'w-[10%]' : 'w-[40%]'}`} />
        </Button>
    );

    const ControlBtns =
        pipMode || pipModeChild ? null : (
            <>
                <Button
                    onClick={() => layoutCtx.toggleFullscreen()}
                    className={'size-[1.81rem]'}
                >
                    <FontAwesomeIcon icon={faExpand} />
                </Button>

                <Button onClick={() => handleEnablePiP()}>
                    <FontAwesomeIcon icon={faEye} />
                </Button>
            </>
        );

    const Documentation: ReactElement = (
        <div
            className={cn(
                'relative border-n border-blue-d0 bg-navy-d0 leading-l',
                'flex sm:flex-col',
                layoutCtx.isNoLayout
                    ? 'absolute inset-0'
                    : cn({
                          [cn(
                              'mb-[6.28rem] md:mb-[7.84rem] lg:mb-[9.46rem]',
                              'mt-xxl md:mt-3xl lg:mt-4xl',
                              'h-[75dvh]',
                          )]: !pipModeChild,
                      }),
            )}
        >
            <aside
                ref={menuAsideRef}
                className={cn(
                    `text-left h-full !pr-0 sm:sticky top-0`,
                    ASIDE_P_CN,
                    menuOpened ? `sm:min-w-0 min-w-[19rem] p-4xs  bg-gray sm:x-[absolute,inset-0]` : 'bg-inherit',
                    { ['h-screen']: menuOpened && pipModeChild },
                )}
            >
                <div className={`flex h-[2rem] items-center`}>
                    {MenuBtn}
                    {menuOpened ? <span className={`ml-3xs text-nowrap text-section-s`}>Table of Contents</span> : null}
                </div>
                {menuOpened ? (
                    <div className={cn(`h-[calc(100%-2rem)] pt-s text-section-s  sm:mt-0`)}>
                        <ul className={'flex flex-col h-full overflow-y-scroll  gap-y-4xs sm:gap-y-5xs'}>
                            {renderAnchorList(content?.anchors, content?.isChapter)}
                        </ul>
                    </div>
                ) : null}
            </aside>

            <div className={cn(`contents`, { ['sm:hidden']: menuOpened })}>
                <div
                    className={cn(
                        `content-center text-left  py-4xs md:py-3xs lg:py-xs  px-4xs md:px-xxs lg:px-xs`,
                        `size-full sm:h-[calc(100%-2rem-2*var(--p-4xs))]`,
                    )}
                >
                    <div className={`size-full select-text overflow-y-scroll text-documentation leading-l`}>
                        {pipMode ? (
                            <span className={'block size-full content-center text-center text-heading-l'}>
                                Picture in picture mode
                            </span>
                        ) : (
                            content?.children
                        )}
                    </div>
                </div>

                <aside className={cn(ASIDE_P_CN, `!pl-0 justify-between  flex flex-col sm:hidden`)}>
                    {ControlBtns}
                </aside>
            </div>
        </div>
    );

    return layoutCtx.isNoLayout ? (
        Documentation
    ) : (
        <section className={cn(styles.section, styles.fullHeightSection)}>
            <div className={styles.content}>
                <BreadcrumbRoute length={3} />
                {Documentation}
            </div>
        </section>
    );
};

DocumentationSection.displayName = 'DocumentationSection';
export { DocumentationSection };
