import React, {FC} from "react";
import cn from "classnames";

import {InfoSection, SectionCard} from "@/app/types/layout";
import {MEDIA_LINKS, MISC_LINKS, Route} from "@/app/static";

import {PageLink} from "@/app/ui/layout";
import {Info, InsideTern} from "@/app/ui/templates";

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
                style={{backgroundImage: `url("${SVG_ROCKET.src}")`}}
                className={'absolute top-0 left-0 w-dvw max-w-dwv h-screen max-h-[100rem] bg-cover bg-center bg-no-repeat'}
            />
            <div className={'relative z-10'}>
                <section className={cn(styles.section, styles.fullHeightSection)}>
                    <div className={cn(styles.content, 'flex justify-end items-center')}>
                        <div>
                            <h1
                                className={cn(styles.textGlow,
                                    `w-min font-oxygen font-bold text-right leading-[1.2]`,
                                    `mb-[--p-content] text-[8rem]`,
                                    `md:text-[3.4375rem]`,
                                    `sm:x-[mb-[--p-content-xs],text-[2.9375rem]]`,
                                )}
                            >
                                Reaching New Heights
                            </h1>
                        </div>
                    </div>
                </section>

                <section
                    className={cn(styles.textGlow, styles.section, styles.fullHeightSection,
                        'relative bg-gradient-to-t from-[--bg-control-blue] via-transparent to-[--bg-control-blue]',
                    )}
                >
                    <div
                        style={{backgroundImage: `url("${SVG_NEURONS.src}")`}}
                        className={cn(styles.fullHeightSection, 'absolute top-0 left-0 w-dvw max-w-dwv bg-cover bg-center bg-no-repeat')}
                    />
                    <div
                        className={cn(styles.content, 'flex h-full items-center justify-center bg-cover bg-center bg-no-repeat')}>
                        <div>
                            <div className={'mb-[12rem]'}>
                                <h2 className={'mb-[--p-content-xl] font-oxygen text-[4rem]'}>Mission</h2>
                                <p className={'text-[2.5rem]'}>
                                    Revolutionize computing by harnessing the power of ternary microprocessors.
                                </p>
                            </div>
                            <div>
                                <h2 className={'mb-[--p-content-xl] font-oxygen text-[4rem]'}>Vision</h2>
                                <p className={'text-[2.5rem]'}>
                                    Ushering in the era of efficient computing, equipping all legacy devices with
                                    advanced microprocessors.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={cn(styles.section, styles.fullHeightSection, 'relative')}>
                    <div className={cn(styles.content, 'flex flex-col py-[7rem] w-full justify-between')}>
                        <div
                            style={{backgroundImage: `url("${SVG_NATURE.src}")`}}
                            className={cn(styles.fullHeightSection, 'absolute -z-10 top-0 left-0 w-dvw max-w-dwv bg-cover bg-center bg-no-repeat')}
                        />
                        <h1
                            className={cn(styles.textGlow,
                                `ml-auto w-min font-oxygen font-bold text-right leading-[1.2] text-black`,
                                `mb-[--p-content] text-[6rem]`,
                                `md:text-[3.4375rem]`,
                                `sm:x-[mb-[--p-content-xs],text-[2.9375rem]]`,
                            )}
                        >
                            Understand Our Why
                        </h1>
                        <div>
                            <PageLink
                                href={Route.About}
                                className={'px-[--p-content-s] h-[2.375rem] rounded-full bg-white text-black'}
                            >
                                Read Our Credo
                            </PageLink>
                        </div>
                    </div>
                </section>
                <Info data={INFO} className={'pt-[12rem] bg-gradient-to-b from-[--bg-control-blue] to-transparent'}/>
                <InsideTern data={COMPANY}/>
            </div>
        </>
    );
}


export default AboutPage;
