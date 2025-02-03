import React, {FC} from "react";
import Image from "next/image";
import cn from "classnames";

import {InfoSection as InfoSection} from "@/app/types/layout";

import {PageLink} from "@/app/ui/layout";

import styles from "@/app/common.module.css";


interface Props {
    data: InfoSection;
    className?: string;
}

const Info: FC<Props> = (props: Props) => {
    const {data, className} = props;
    const {title, image, subTitle, link, linkTitle, description} = data;

    return (
        <section className={cn(styles.section, 'bg-[--bg-section-green]', className)}>
            <div className={cn(styles.content, 'pt-[3.5rem] pb-[12.25rem] font-oxygen')}>
                <h2
                    className={cn(
                        'mb-[4.62rem] text-center font-bold font-oxygen',
                        'text-[1.75rem]',
                        'lg:text-[2.5rem]',
                    )}
                >
                    {title}
                </h2>
                <div
                    className={'flex justify-between items-center  sm:x-[gap-y-[--p-content-xxl],flex-col-reverse]'}>
                            <span className={'w-[40%] text-left   sm:x-[w-full,text-center]'}>
                                <span
                                    className={'block mb-[--p-content-5xs]  text-[2rem]  md:text-[1.5rem]  sm:text-section-xs'}>
                                    {subTitle}
                                </span>
                                <span className={'block leading-[1.2]  text-[0.9375rem]  lg:text-section'}>
                                   {description}
                                </span>
                                <PageLink
                                    href={link}
                                    className={cn(
                                        'px-[--p-content] rounded-full bg-blue',
                                        'mt-[--p-content-xl] h-[1.875rem] text-basic',
                                        'lg:x-[h-[2.375rem],text-heading-s]',
                                        'sm:mt-[--p-content-s]',
                                    )}
                                >
                                    {linkTitle}
                                </PageLink>
                            </span>
                    <Image
                        src={image}
                        alt={'circuit'}
                        className={'max-w-[13.5rem] w-[15%]  md:w-1/5  sm:w-[30%]'}
                    />
                </div>
            </div>
        </section>
    );
}


export {Info};
