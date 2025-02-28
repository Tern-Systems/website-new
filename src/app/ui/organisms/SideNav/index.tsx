import React, { FC, ReactElement, useEffect, useState } from 'react';
import cn from 'classnames';

import { useLayout } from '@/app/context';

import { Select } from '@/app/ui/form';

import styles from './SideNav.module.css';

interface Props {
    sideOnly?: true;
    sectionIDs: string[];
    sectionNames?: Record<string, string>;
}

const SideNav: FC<Props> = (props: Props) => {
    const { sideOnly, sectionIDs, sectionNames } = props;

    const { scrollState } = useLayout();
    const [scrollValue] = scrollState;

    const [activeSection, setActiveSection] = useState<string>(sectionIDs[0]);

    useEffect(() => {
        sectionIDs.forEach((section, idx, array) => {
            const elem = document.getElementById(section);
            if (!elem) return;

            const trackerTop =
                (Math.abs(scrollValue.scrollTop) / (scrollValue.scrollHeight - window.innerHeight)) *
                window.innerHeight;
            const { top, bottom } = elem.getBoundingClientRect();
            const inView = bottom > trackerTop && trackerTop > top;
            if (inView) setActiveSection(section);
            else if ((idx === array.length - 1 && bottom < trackerTop) || (!idx && top > trackerTop))
                setActiveSection(section);
        });
    }, [scrollValue]);

    const SectionsNavLi: ReactElement[] = sectionIDs.map((section, idx) => (
        <li key={section + idx}>
            <span
                onClick={() => {
                    const id = sectionIDs[idx];
                    setActiveSection(id);
                    document.querySelector('#' + id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={'capitalize cursor-pointer'}
            >
                {sectionNames?.[section] ?? section}
            </span>
        </li>
    ));

    const thumbHeight = 100 / sectionIDs.length;
    const activeSectionIdx = sectionIDs.findIndex((section) => section === activeSection);

    return (
        <div>
            <div className={'hidden lg:block  relative'}>
                <span className={styles.line}>
                    <span
                        style={{
                            top: activeSectionIdx * thumbHeight + '%',
                            height: thumbHeight + '%',
                        }}
                        className={styles.lineThumb}
                    />
                </span>
                <ul className={`flex flex-col gap-y-l pl-xs text-section-s`}>{SectionsNavLi}</ul>
            </div>
            {sideOnly ? null : (
                <Select
                    altIcon
                    options={Object.fromEntries(
                        sectionIDs.map((_, idx) => [sectionIDs[idx], sectionNames?.[idx] ?? sectionIDs?.[idx]]),
                    )}
                    value={activeSection}
                    placeholder={'Select'}
                    onChangeCustom={(id) => {
                        setActiveSection(id);
                        document.querySelector('#' + id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    classNameWrapper={cn(
                        `lg:hidden  w-full mb-4xs`,
                        `flex-col gap-y-xxs text-section-s`,
                        `border-b [&]:border-gray-l0`,
                    )}
                    classNameLabel={'mr-auto'}
                    classNameSelected={'w-full '}
                    classNameChevron={'ml-auto'}
                    className={cn(
                        `!border-0 !bg-gray-d2 [&]:h-[2.7681rem]  md:h-[3.3875rem]  sm:h-button-xl`,
                        `px-xxs  md:px-xs `,
                    )}
                    classNameUl={`border border-gray-l0`}
                    classNameOption={cn(
                        `h-[3.1375rem] sm:h-button-xl`,
                        `[&]:x-[bg-gray,border-transparent,py-4xs]`,
                        `hover:bg-[#979797]`,
                        `text-section-s  md:text-section`,
                        `px-xxs  md:px-xs`,
                    )}
                />
            )}
        </div>
    );
};

export { SideNav };
