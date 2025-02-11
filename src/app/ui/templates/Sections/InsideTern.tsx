import React, { FC, ReactElement } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { useBreakpointCheck } from '@/app/hooks';

import { SectionCard } from '@/app/types/layout';

import { Button } from '@/app/ui/form';

import styles from '@/app/common.module.css';
import { Breakpoint } from '@/app/hooks/useBreakpointCheck';


interface Props {
    data: SectionCard[]
    className?: string
    classNameContent?: string
    classNameCompanyLi?: string
}

const InsideTern: FC<Props> = (props: Props) => {
    const { data, className, classNameContent, classNameCompanyLi } = props;

    const isMdScreen = useBreakpointCheck() === Breakpoint.md;

    const CompanyLi: ReactElement[] = data.map((entry, idx) => (
        <li
            key={entry.title + idx}
            className={'flex flex-col gap-y-[--p-content-3xs] text-left'}
        >
            <h4 className={'mb-[0.1rem] text-[0.9375rem] text-section-3xs'}>
                {entry.title}
            </h4>
            <p>{entry.description}</p>

            {isMdScreen ?
                <div className="w-full flex justify-end relative">
                    <Image src={entry.icon} alt={'office girl 2'} className={'w-full max-w-[33.75rem] max-h-[22.5rem]'} />
                    <div className="absolute inset-0 bg-gradient-to-r from-[--bg-control-blue] from-[min(20dvw*2,40%)] to-transparent to-70% pointer-events-none "></div>
                </div>
                :
                <Image src={entry.icon} alt={'office girl 2'} className={'w-full max-h-[22.5rem]'} />
            }


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
                className={cn(styles.content, 'pt-[8.19rem] text-section font-oxygen  pb-[3.25rem]  lg:pb-[9.44rem]', classNameContent)}>
                <h2 className={'font-bold text-[2.5rem] text-left  mb-[3.75rem]  lg:mb-[5rem]'}>
                    Inside Tern
                </h2>
                <ul className={cn('grid  grid-cols-1 gap-xxl  lg:x-[grid-cols-2,gap-[3.63rem]]', classNameCompanyLi)}>
                    {CompanyLi}
                </ul>
            </div>
        </section>
    );
}


export { InsideTern };
