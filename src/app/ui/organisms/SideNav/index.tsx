import React, { FC, ReactNode, useEffect, useState } from 'react';
import cn from 'classnames';

import { useLayout } from '@/app/context';

import { Select } from '@/app/ui/form';

interface Props {
    sideOnly?: true;
    sectionIDs: (string | undefined)[];
    sectionNames?: Record<string, string>;
    className?: string;
}

const SideNav: FC<Props> = (props: Props) => {
    const { sideOnly, sectionIDs, sectionNames, className } = props;

    const { scrollState } = useLayout();
    const [scrollValue] = scrollState;

    const [activeSection, setActiveSection] = useState<string>(sectionIDs[0] ?? '');

    useEffect(() => {
        sectionIDs.forEach((section, idx, array) => {
            if (!section) return;

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

    const activeSectionIdx = sectionIDs.findIndex((section) => section === activeSection);

    const SectionsNavLi: ReactNode = sectionIDs.map((section, idx) =>
        section ? (
            <li
                key={section + idx}
                className={cn(
                    'relative pl-xs',
                    'before:x-[absolute,left-0,border-l-[0.30rem],border-white] before:top-[calc(-0.5*var(--p-l))] before:h-[calc(100%+var(--p-l))]',
                    { ['before:!border-blue']: idx === activeSectionIdx },
                )}
            >
                <span
                    onClick={() => {
                        const id = sectionIDs[idx];
                        if (!id) return;
                        setActiveSection(id);
                        document.querySelector('#' + id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={'capitalize cursor-pointer'}
                >
                    {sectionNames?.[section] ?? section}
                </span>
            </li>
        ) : null,
    );

    return (
        <div className={cn(className, 'h-fit')}>
            <div className={'hidden lg:block  relative'}>
                <ul className={`flex flex-col gap-y-l text-section-xs`}>{SectionsNavLi}</ul>
            </div>
            {sideOnly ? null : (
                <Select
                    altIcon
                    options={Object.fromEntries(
                        sectionIDs.map((_, idx) => [sectionIDs[idx], sectionNames?.[idx] ?? sectionIDs?.[idx]]),
                    )}
                    value={activeSection}
                    placeholder={'Select'}
                    onChangeCustom={(id: string) => {
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

SideNav.displayName = 'SideNav';

export { SideNav };
