'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import cn from 'classnames';

import { useLayout } from '@/app/hooks';

import { Select } from '@/app/ui/form';
import { getId } from '@/app/utils';

interface Props {
    sideOnly?: true;
    section: Record<string, string>;
    className?: string;
}

const SideNav: FC<Props> = (props: Props) => {
    const { sideOnly, section, className } = props;

    const { scrollState } = useLayout();
    const [scrollValue] = scrollState;

    const sectionIDs: string[] = Object.keys(section ?? {}).map((key) => getId(key));
    const sections: string[] = Object.values(section);

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

    const activeIdx = sectionIDs.findIndex((section) => section === activeSection);

    const SectionsNavLi: ReactNode = sectionIDs.map((id, idx) => (
        <li
            key={id + idx}
            className={cn(
                'relative pl-xs',
                'before:x-[absolute,left-0,border-l-[0.30rem],border-white] before:top-[calc(-0.5*var(--p-l))] before:h-[calc(100%+var(--p-l))]',
                { ['before:!border-blue']: idx === activeIdx },
            )}
        >
            <span
                onClick={() => {
                    const id = sectionIDs[idx];
                    if (!id) return;
                    setActiveSection(id);
                    document.querySelector('#' + id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={'capitalize cursor-pointer text-nowrap'}
            >
                {sections[idx]}
            </span>
        </li>
    ));

    return (
        <div className={cn(className, 'h-fit')}>
            <div className={'hidden lg:block  relative'}>
                <ul className={`flex flex-col gap-y-l text-14`}>{SectionsNavLi}</ul>
            </div>
            {sideOnly ? null : (
                <Select
                    altIcon
                    options={Object.fromEntries(
                        sectionIDs
                            .filter((id): id is string => id !== undefined)
                            .map((id) => [id, section?.[id] ?? id]),
                    )}
                    value={activeSection}
                    placeholder={'Select'}
                    onChangeCustom={(id: string) => {
                        setActiveSection(id);
                        document.querySelector('#' + id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    classNameWrapper={cn(
                        `lg:hidden  w-full mb-4xs`,
                        `flex-col gap-y-xxs text-18`,
                        `border-b [&]:border-gray-l0`,
                    )}
                    classNameLabel={'mr-auto'}
                    classNameSelected={'w-full '}
                    classNameChevron={'ml-auto'}
                    className={cn(`!border-0 !bg-gray-d2 [&]:h-4xl  md:h-7xl  sm:h-button-xl`, `px-xxs  md:px-xs `)}
                    classNameUl={`border border-gray-l0`}
                    classNameOption={cn(
                        `h-6xl sm:h-button-xl`,
                        `[&]:x-[bg-gray,border-transparent,py-4xs]`,
                        `hover:bg-gray-l2`,
                        `text-18  md:text-20`,
                        `px-xxs  md:px-xs`,
                    )}
                />
            )}
        </div>
    );
};

SideNav.displayName = SideNav.name;

export { SideNav };
