'use client';

import { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { InfoSectionData as InfoSectionData } from '@/app/types/layout';

import { PageLink } from '@/app/ui/layout';

import styles from '@/app/common.module.css';

interface Props {
    data: InfoSectionData;
    blur?: true;
    className?: string;
    classNameTitle?: string;
    classNameContent?: string;
    classNameSubTitle?: string;
    classNameDescription?: string;
    classNamePageLink?: string;
}

const InfoSection: FC<Props> = (props: Props) => {
    const {
        data,
        blur,
        className,
        classNameTitle,
        classNameContent,
        classNameSubTitle,
        classNameDescription,
        classNamePageLink,
    } = props;
    const { title, image, subTitle, link, linkTitle, description } = data;

    return (
        <section className={cn(styles.section, className)}>
            <div
                className={cn(styles.content, 'mb-[12.25rem] pt-3xl ', classNameContent, {
                    [styles.contentGradientBlue]: blur,
                })}
            >
                <h2 className={cn('mb-5xl text-center font-bold', 'text-30', 'lg:text-40', classNameTitle)}>{title}</h2>
                <div className={'flex items-center justify-between sm:x-[gap-y-xxl,flex-col-reverse]'}>
                    <span className={'w-[40%] text-left sm:x-[w-full,text-center]'}>
                        <span className={cn('mb-4xs block text-32 sm:text-14 md:text-24', classNameSubTitle)}>
                            {subTitle}
                        </span>
                        <span className={cn('block text-16 leading-n lg:text-20', classNameDescription)}>
                            {description}
                        </span>
                        <PageLink
                            href={link}
                            className={cn(
                                'bg-blue px-n',
                                'mt-xl h-button-l text-16',
                                'lg:x-[h-button-xl,text-21]',
                                'sm:mt-s',
                                classNamePageLink,
                            )}
                        >
                            {linkTitle}
                        </PageLink>
                    </span>
                    <Image
                        src={image}
                        alt={'circuit'}
                        className={'w-[15%] max-w-[13.5rem] sm:w-[30%] md:w-1/5'}
                    />
                </div>
            </div>
        </section>
    );
};

InfoSection.displayName = InfoSection.name;

export { InfoSection };
