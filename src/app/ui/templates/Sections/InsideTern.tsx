import React, {FC, ReactElement} from "react";
import Image from "next/image";
import cn from "classnames";

import {SectionCard} from "@/app/types/layout";

import {Button} from "@/app/ui/form";

import styles from "@/app/common.module.css";


interface Props {
    data: SectionCard[]
}

const InsideTern: FC<Props> = (props: Props) => {
    const CompanyLi: ReactElement[] = props.data.map((entry, idx) => (
        <li
            key={entry.title + idx}
            className={'flex flex-col gap-y-[--p-content-3xs] text-left'}
        >
            <h4 className={'mb-[0.1rem] text-[0.9375rem] text-placeholder'}>
                {entry.title}
            </h4>
            <p>{entry.description}</p>
            <Image src={entry.icon} alt={'office girl 2'} className={'w-full max-h-[22.5rem]'}/>
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
                'from-black via-black to-[--bg-section-green]',
                'lg:x-[bg-gradient-to-t,from-black,via-[#0a313a],to-[--bg-section-green]]',
            )}
        >
            <div
                className={cn(styles.content, 'pt-[8.19rem] text-section font-oxygen  pb-[3.25rem]  lg:pb-[9.44rem]')}>
                <h2 className={'font-bold text-[2.5rem] text-left  mb-[3.75rem]  lg:mb-[5rem]'}>
                    Inside Tern
                </h2>
                <ul className={'grid  grid-cols-1 gap-[--p-content-xxl]  lg:x-[grid-cols-2,gap-[3.63rem]]'}>
                    {CompanyLi}
                </ul>
            </div>
        </section>
    );
}


export {InsideTern};
