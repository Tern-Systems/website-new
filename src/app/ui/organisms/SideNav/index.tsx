'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import cn from 'classnames';

import { SelectOptions } from '@/app/ui/form/Select';

import { getId } from '@/app/utils';
import { useScrollTrack } from '@/app/hooks';

import { Select } from '@/app/ui/form';

interface Props {
    sideOnly?: true;
    section: SelectOptions;
    className?: string;
}

const SideNav: FC<Props> = (props: Props) => {
    const { sideOnly, section, className } = props;

    const sectionIDs: string[] = Object.keys(section ?? {}).map((key) => getId(key));
    const sections: string[] = Object.values(section);

    const scrollValue = useScrollTrack();

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
                    onChange={(id: string) => {
                        setActiveSection(id);
                        document.querySelector('#' + id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={{
                        select: cn(`!border-0 !bg-gray-d2 [&]:h-4xl  md:h-7xl  sm:h-button-xl`, `px-xxs  md:px-xs `),
                        option: cn(
                            `h-6xl sm:h-button-xl`,
                            `[&]:x-[bg-gray,border-transparent,py-4xs]`,
                            `hover:bg-gray-l2`,
                            `text-18  md:text-20`,
                            `px-xxs  md:px-xs`,
                        ),
                        wrapper: cn(
                            `lg:hidden  w-full mb-4xs`,
                            `flex-col gap-y-xxs text-18`,
                            `border-b [&]:border-gray-l0`,
                        ),
                        label: 'mr-auto',
                        selected: 'w-full ',
                        chevron: 'ml-auto',
                        ul: `border border-gray-l0`,
                    }}
                />
            )}
        </div>
    );
};

SideNav.displayName = SideNav.name;

export { SideNav };
