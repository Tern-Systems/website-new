import React, { FC } from "react";
import cn from "classnames";

import { InfoSection, SectionCard } from "@/app/types/layout";
import { MEDIA_LINKS, MISC_LINKS, Route } from "@/app/static";

import { PageLink } from "@/app/ui/layout";
import { Info, InsideTern } from "@/app/ui/templates";

import styles from "@/app/common.module.css";

import SVG_CITY_WAY from '/public/images/city-glowing-way.jpg';
import SVG_OFFICE_PEOPLE from '/public/images/office-people.png';
import SVG_COMPUTER from '/public/images/old-computer.svg'
import SVG_ROCKET from '/public/images/rocket.png'
import SVG_NEURONS from '/public/images/neurons-blue.png'
import SVG_NATURE from '/public/images/nature-section.png'


const INFO: InfoSection = {
    title: 'Enabling Efficient Computing',
    image: SVG_COMPUTER,
    subTitle: 'Leading the Next Wave',
    link: Route.Documentation,
    linkTitle: 'Go Deeper',
    description: 'The successive era of computing is not speed or scale, it is optimization. Tern is focused on allowing computer systems to reach their full potential today rather than tomorrow.',
}

const COMPANY: SectionCard[] = [
    {
        title: 'Your Tern',
        description: 'Be Our Next Guest',
        action: 'Join the Podcast',
        href: MEDIA_LINKS.YouTube.href,
        icon: SVG_CITY_WAY,
        btnIcon: 'arrow',
        btnIconCN: 'rotate-180',
    },
    {
        title: 'Tern Events',
        description: 'Discover Events Near You',
        action: 'Attend',
        href: MISC_LINKS.Events,
        icon: SVG_OFFICE_PEOPLE,
        btnIcon: 'arrow-square',
    },
];

const AboutPage: FC = () => {
    return (
        <>
            <div
                style={{
                    backgroundImage: `url("${SVG_ROCKET.src}")`,
                }}
                className={cn(
                    'absolute top-0 left-0',
                    'bg-black bg-center bg-repeat-x bg-[size:auto_100%]',
                    'w-full h-screen',
                    'sm:bg-[25%_center]',
                    'md:bg-[35%_center]',
                )}
            />
            <div className={'relative z-10'}>
                <section className={cn(styles.section, styles.fullHeightSection)}>
                    <div className={cn(styles.content, 'flex justify-end items-center  sm:items-start')}>
                        <div>
                            <h1
                                className={cn(styles.textGlow,
                                    `w-min font-oxygen font-bold text-right leading-[1.2]`,
                                    `mb-[--p-content] text-[8rem]`,
                                    `md:text-[6rem]  md:landscape:text-[2.5rem]`,
                                    `sm:x-[flex,w-[20rem],mt-[--p-content-xl],text-[2.5rem]]`,
                                )}
                            >
                                Reaching New Heights
                            </h1>
                        </div>
                    </div>
                </section>

                <section
                    className={cn(styles.textGlow, styles.section, styles.fullHeightSection,
                        'relative bg-black',
                    )}
                >
                    <div
                        style={{ backgroundImage: `url("${SVG_NEURONS.src}")` }}
                        className={cn(styles.fullHeightSection, 'absolute top-0 left-0 w-dvw max-w-dwv bg-cover bg-center bg-no-repeat z-10')}
                    />
                    <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-[--bg-control-blue] to-transparent z-0  md:h-[60%]  sm:h-[60%]" />
                    <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[--bg-control-blue] to-transparent z-0  md:h-[22%]  sm:h-[60%]" />
                    <div
                        className={cn(styles.content, 'relative flex h-full items-center justify-center bg-cover bg-center bg-no-repeat z-20  md:x-[max-w-[62rem],mx-auto]')}>

                        <div className={cn(
                            'flex flex-col gap-[12rem] ',
                            'md:gap-[min(23dvh,13rem)]',
                            'sm:gap-[min(25dvh,15rem)] sm:landscape:gap-[min(15dvh,6.25rem)]'
                        )}>
                            <div>
                                <h2 className={cn(
                                    'mb-[--p-content-xl] font-oxygen text-[4rem]  sm:x-[mb-[--p-content-xs],text-[1.6875rem]]',
                                    'md:text-[3rem] md:landscape:x-[text-[1.6875rem],mb-[--p-content-xs]]'
                                )}>
                                    Mission
                                </h2>
                                <p className={cn(
                                    'leading-tight text-[2.5rem]   sm:text-[1.1875rem]',
                                    'md:text-[2.25rem] md:landscape:text-[1.1875rem]'
                                )}>
                                    Revolutionize computing by harnessing the power of ternary microprocessors.
                                </p>
                            </div>
                            <div>
                                <h2 className={cn(
                                    'mb-[--p-content-xl] font-oxygen text-[4rem]  sm:x-[mb-[--p-content-xs],text-[1.6875rem]]',
                                    'md:text-[3rem] md:landscape:x-[text-[1.6875rem],mb-[--p-content-xs]]'
                                )}>
                                    Vision
                                </h2>
                                <p className={cn(
                                    'leading-tight text-[2.5rem]   sm:text-[1.1875rem]',
                                    'md:text-[2.25rem] md:landscape:text-[1.1875rem]'
                                )}>
                                    Ushering in the era of efficient computing, equipping all legacy devices with
                                    advanced microprocessors.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={cn(styles.section, styles.fullHeightSection, 'relative')}>
                    <div className={cn(styles.content, 'flex flex-col py-[7rem] w-full justify-between  md:landscape:py-[1.875rem]  sm:landscape:py-[1.875rem]')}>
                        <div
                            style={{ backgroundImage: `url("${SVG_NATURE.src}")` }}
                            className={cn(styles.fullHeightSection, 'absolute -z-10 top-0 left-0 w-dvw max-w-dwv bg-cover bg-center bg-no-repeat')}
                        />
                        <h1
                            className={cn(styles.textGlow,
                                `ml-auto w-min font-oxygen font-bold text-right leading-[1.2] text-black`,
                                `mb-[--p-content] text-[6rem]`,
                                `md:text-[4rem]  md:landscape:text-[3rem]`,
                                `sm:x-[mb-[--p-content-xs],text-[3rem]]`,
                            )}
                        >
                            Understand Our Why
                        </h1>
                        <div>
                            <PageLink
                                href={Route.About}
                                className={'flex justify-center w-full max-w-[10.5rem] h-[2.375rem] bg-white text-section-s text-black'}
                            >
                                Read Our Credo
                            </PageLink>
                        </div>
                    </div>
                </section>
                <div className="relative h-full">
                    <div className="absolute inset-x-0 top-0 h-[65%] bg-gradient-to-b from-[--bg-control-blue] to-transparent z-0" />
                    <div className="relative z-10">
                        <Info
                            data={INFO}
                            className={'pt-[12rem]'}
                            classNameTitle={'md:text-heading-l  sm:x-[text-[1.75rem],mb-[--p-content-xl]]'}
                            classNameSubTitle={'mb-[--p-content-4xs] text-documentation  lg:text-[2.5rem]  sm:text-documentation'}
                            classNameContent={'md:x-[max-w-[62rem],mx-auto]'}
                            classNameDescription={'text-basic  lg:text-section'}
                            classNamePageLink={cn(
                                'flex items-center justify-center rounded-none',
                                'w-full max-w-[8.4375rem] h-[2.375rem] mt-[--p-content-xxl] [&]:p-0 ',
                                '[&]:text-section-s  [&]:sm:text-basic',
                                'md:mt-[--p-content-xl]',
                                'sm:x-[mt-[--p-content],h-[1.875rem],max-w-[7.3125rem],text-basic] ',
                            )}
                        />
                        <InsideTern
                            data={COMPANY}
                            className={'bg-gradient-to-t from-black from-0% to-transparent to-90%'}
                            classNameContent={'w-full  md:x-[max-w-[62rem],mx-auto]'}
                            classNameCompanyLi={'sm:x-[max-w-[33.75rem],mx-auto]'}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}


export default AboutPage;
