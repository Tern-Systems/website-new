import React, { FC, ReactElement } from "react";
import Image from "next/image";
import cn from "classnames";

import { useBreakpointCheck } from "@/app/hooks";

import { SectionCard } from "@/app/types/layout";

import { Button } from "@/app/ui/form";

import styles from "@/app/common.module.css";


interface Props {
    data: SectionCard[]
    className?: string
    classNameContent?: string
    classNameCompanyLi?: string
}

const InsideTern: FC<Props> = (props: Props) => {
    const { data, className, classNameContent, classNameCompanyLi } = props;

    const isMdScreen = useBreakpointCheck() === 'md';

    const CompanyLi: ReactElement[] = data.map((entry, idx) => (
        <li
            key={entry.title + idx}
            className={cn('flex flex-col', 'gap-y-[--p-content-3xs]','w-full', 'text-left')}
        >
            <h4 className={'mb-[0.1rem] text-[0.9375rem] text-placeholder'}>
                {entry.title}
            </h4>
            <p>{entry.description}</p>
            <div className={'flex bg-control-blue'}>
            <div className={'md:w-[14.325rem]'}></div>
                <div className={cn('relative', 'w-full', 'max-h-[22.5rem]')}>
                    <Image
                    src={entry.icon}
                    alt="office girl 2"
                    className={cn('w-full', 'h-full', 'object-cover')}
                    />
                    <div className="absolute inset-0 md:bg-gradient-to-r from-blue via-[#178AB7]/20 to-transparent"></div>
                </div>
            </div>

            <Button
                icon={entry.btnIcon}
                onClick={() => window.open(entry.href, '_blank')}
                className={'self-start text-blue flex-row-reverse'}
                classNameIcon={cn('[&_path]:fill-blue-l0', entry.btnIconCN)}
            >
                {entry.action}
            </Button>
        </li>
    ));

    return (
        <section
            className={cn(styles.section,
                'from-black via-black',
                className
            )}
        >
            <div
                className={cn(styles.content, 'pt-[8.19rem] text-section font-oxygen  pb-[3.25rem]  lg:pb-[9.44rem]', 'md:x-[bg-gradient-to-b,from-blue,via-[#0a313a]/10,to-transparent,pt-[11.75rem]]')}>
                <h2 className={'font-bold text-[2.5rem] text-left  mb-[3.75rem]  lg:mb-[5rem]'}>
                    Inside Tern
                </h2>
                <ul className={cn('grid  grid-cols-1 gap-[--p-content-xxl]  lg:x-[grid-cols-2,gap-[3.63rem]]', classNameCompanyLi)}>
                    {CompanyLi}
                </ul>
            </div>
        </section>
    );
}


export { InsideTern };
