import React, {FC} from "react";
import Image from "next/image";
import cn from "classnames";

import {InfoSection as InfoSection} from "@/app/types/layout";

import {PageLink} from "@/app/ui/layout";

import styles from "@/app/common.module.css";


interface Props {
    data: InfoSection;
    className?: string;
    classNameTitle?: string;
    classNameContent?: string;
    classNameSubTitle?: string;
    classNameDescription?: string;
    classNamePageLink?: string;
}

const Info: FC<Props> = (props: Props) => {
    const {data, className, classNameTitle, classNameContent, classNameSubTitle, classNameDescription, classNamePageLink} = props;
    const {title, image, subTitle, link, linkTitle, description} = data;

    return (
        <section className={cn(styles.section, className)}>
            <div className={cn(styles.content, 'pt-[3.5rem] pb-[12.25rem] font-gothic', classNameContent)}>
                <h2
                    className={cn(
                        'mb-[4.62rem] text-center font-bold font-gothic',
                        'text-[1.75rem]',
                        'lg:text-[2.5rem]',
                        classNameTitle
                    )}
                >
                    {title}
                </h2>
                <div
                    className={'flex justify-between items-center  sm:x-[gap-y-xxl,flex-col-reverse]'}>
                            <span className={'w-[40%] text-left   sm:x-[w-full,text-center]'}>
                                <span
                                    className={cn('block mb-5xs  text-[2rem]  md:text-[1.5rem]  sm:text-section-xs', classNameSubTitle)}>
                                    {subTitle}
                                </span>
                                <span className={cn('block leading-[1.2]  text-[0.9375rem]  lg:text-section', classNameDescription)}>
                                   {description}
                                </span>
                                <PageLink
                                    href={link}
                                    className={cn(
                                        'px-n rounded-full bg-blue',
                                        'mt-xl h-[1.875rem] text-basic',
                                        'lg:x-[h-[2.375rem],text-heading-s]',
                                        'sm:mt-s',
                                        classNamePageLink
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
