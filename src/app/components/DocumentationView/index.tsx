import React, {ReactElement, useState, JSX, useEffect} from 'react'
import Image from "next/image";

import Manual, {ManualAnchors} from "./Manual";
import GHandbook, {GHandbookAnchors} from "./GHandbook";

import styles from './DocumentationView.module.css';

import SVG_CHEVRON from '@/assets/images/icons/select-chewron.svg';


// Anchors list type
type TListEntry = Array<string | Record<string, TListEntry>>;

// Views
const ViewDict: Record<string, { elem: () => JSX.Element, anchors: TListEntry, isChapter: boolean }> = {
    'TernKey Manual': {elem: Manual, anchors: ManualAnchors, isChapter: false},
    'GHandbook': {elem: GHandbook, anchors: GHandbookAnchors, isChapter: true}
}
const ViewDictKeys = Object.keys(ViewDict);

interface IDocumentationViewProps {
    view: string;
}

const DocumentationView = (props: IDocumentationViewProps) => {
    const {view} = props;

    const [isMenuOpened, setMenuOpened] = useState<boolean>(false);
    const [isSelectExpanded, setSelectExpanded] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>(view);

    // Toggles
    const toggleSelectExpand = () => setSelectExpanded((prevState) => !prevState);
    const toggleMenuOpen = () => setMenuOpened((prevState) => !prevState);

    // Options list
    const OptionsAllJSX: ReactElement[] = ViewDictKeys.map((value, index) =>
        <li key={value + index} className={styles.optionWrapper} onClick={() => setSelectedOption(value)}>{value}</li>
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
                    <ul className={styles.anchorList}>{SubListOptions}</ul>
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

    return (
        <div className={`${isMenuOpened ? 'flex' : ''}`}>
            <aside
                id={'documentation-menu'}
                className={`${styles.menu} ${isMenuOpened ? 'h-[100%] bg-[#4D4D4D]' : 'h-fit bg-none'}`}
            >
                <div className={`flex items-center ${styles.menuBtns}`}>
                    <div
                        className={'cursor-pointer absolute z-10 flex items-center align-middle p-[0.2rem] h-[1.8125rem] w-[1.8125rem] br-[5px] border-2 border-white border-solid'}
                        style={{borderRadius: '5px'}}
                        onClick={() => toggleMenuOpen()}
                    >
                        <div className={`bg-white box-border h-[100%]`}
                             style={{
                                 borderTopLeftRadius: '2px',
                                 borderBottomLeftRadius: '2px',
                                 width: isMenuOpened ? '10%' : '40%'
                             }}
                        />
                    </div>
                    <div
                        className={`${styles.selectWrapper} ${isSelectExpanded ? styles.selectActive : ''}`}
                        onClick={() => toggleSelectExpand()}
                        onBlur={() => setSelectExpanded(false)}
                    >
                        <label htmlFor={'documentation-select'}/>
                        <div className={styles.selectControlWrapper}>
                            <div
                                id={'documentation-select'}
                                className={styles.selectControl}
                            >
                                {OptionsAllJSX[selectedOptionIdx]}
                            </div>
                            <Image
                                src={SVG_CHEVRON}
                                alt={'select chevron'}
                                className={`${styles.chevron} ${isSelectExpanded ? 'rotate-180' : ''}`}
                            />
                        </div>
                        {isSelectExpanded ? (
                            <ul className={styles.optionsList}>
                                {OptionsJSX}
                            </ul>
                        ) : null}
                    </div>
                </div>
                {!isMenuOpened ? null : (
                    <div
                        className={`mt-[1.86rem] overflow-y-scroll w-[102%] box-content pr-[7rem] ${isSelectExpanded ? 'opacity-25' : ''}`}>
                        <div className={'mb-[0.74rem]'}>
                            <span>Table of Contents</span>
                        </div>
                        <ul style={{marginLeft: '-0.9rem'}}>
                            {renderAnchorList(ViewDict[selectedOption].anchors, ViewDict[selectedOption].isChapter)}
                        </ul>
                    </div>
                )}
            </aside>
            <div className={`max-h-[86.6vh] ${isMenuOpened ? 'pt-[2.06rem] pl-[23.69rem]' : 'pt-[2.06rem]'}`}>
                <div className={styles.content}>
                    <div className={styles.text}>
                        {ViewDict[selectedOption].elem()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DocumentationView;
export type {TListEntry};