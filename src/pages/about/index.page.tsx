import React, { FC } from 'react';
import cn from 'classnames';

import { InfoSection, SectionCard } from '@/app/types/layout';
import { MEDIA_LINKS, MISC_LINKS, Route } from '@/app/static';

import { PageLink } from '@/app/ui/layout';
import { Info, InsideTern } from '@/app/ui/templates';

import styles from '@/app/common.module.css';

import SVG_CITY_WAY from '/public/images/city-glowing-way.jpg';
import SVG_OFFICE_PEOPLE from '/public/images/office-people.png';
import SVG_COMPUTER from '/public/images/old-computer.svg';
import SVG_ROCKET from '/public/images/rocket.png';
import SVG_NEURONS from '/public/images/neurons-blue.png';
import SVG_NATURE from '/public/images/nature-section.png';

const INFO: InfoSection = {
    title: 'Enabling Efficient Computing',
    image: SVG_COMPUTER,
    subTitle: 'Leading the Next Wave',
    link: Route.Documentation,
    linkTitle: 'Go Deeper',
    description:
        'The successive era of computing is not speed or scale, it is optimization. Tern is focused on allowing computer systems to reach their full potential today rather than tomorrow.',
};

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
                    'absolute left-0 top-0',
                    'bg-black bg-[size:auto_100%] bg-center bg-repeat-x',
                    'h-screen w-full',
                    'sm:bg-[25%_center]',
                    'md:bg-[35%_center]',
                )}
            />
            <div className={'relative z-10'}>
                <section className={cn(styles.section, styles.fullHeightSection)}>
                    <div className={cn(styles.content, 'flex items-center justify-end sm:items-start')}>
                        <div>
                            <h1
                                className={cn(
                                    styles.textGlow,
                                    `w-min text-right font-oxygen font-bold leading-n`,
                                    `mb-n text-[8rem]`,
                                    `md:text-heading-4xl md:landscape:text-[2.5rem]`,
                                    `sm:x-[flex,w-[20rem],mt-n,text-[2.5rem]]`,
                                )}
                            >
                                Reaching New Heights
                            </h1>
                        </div>
                    </div>
                </section>

                <section className={cn(styles.textGlow, styles.section, styles.fullHeightSection, 'relative bg-black')}>
                    <div
                        style={{ backgroundImage: `url("${SVG_NEURONS.src}")` }}
                        className={cn(
                            styles.fullHeightSection,
                            'max-w-dwv absolute left-0 top-0 z-10 w-dvw bg-cover bg-center bg-no-repeat',
                        )}
                    />
                    <div className='absolute inset-x-0 top-0 z-0 h-[45%] bg-gradient-to-b from-[--bg-control-blue] to-transparent sm:h-[60%] md:h-[60%]' />
                    <div className='absolute inset-x-0 bottom-0 z-0 h-[40%] bg-gradient-to-t from-[--bg-control-blue] to-transparent sm:h-[60%] md:h-[22%]' />
                    <div
                        className={cn(
                            styles.content,
                            'relative z-20 flex h-full items-center justify-center bg-cover bg-center bg-no-repeat md:x-[max-w-[62rem],mx-auto]',
                        )}
                    >
                        <div
                            className={cn(
                                'flex flex-col gap-[12rem]',
                                'md:gap-[min(23dvh,13rem)]',
                                'sm:gap-[min(25dvh,15rem)] sm:landscape:gap-[min(15dvh,6.25rem)]',
                            )}
                        >
                            <div>
                                <h2
                                    className={cn(
                                        'mb-xl font-oxygen text-heading-3xl sm:x-[mb-xs,text-heading]',
                                        'md:text-[3rem] md:landscape:x-[text-heading,mb-xs]',
                                    )}
                                >
                                    Mission
                                </h2>
                                <p
                                    className={cn(
                                        'text-[2.5rem] leading-tight sm:text-[1.1875rem]',
                                        'md:text-heading-l md:landscape:text-[1.1875rem]',
                                    )}
                                >
                                    Revolutionize computing by harnessing the power of ternary microprocessors.
                                </p>
                            </div>
                            <div>
                                <h2
                                    className={cn(
                                        'mb-xl font-oxygen text-heading-3xl sm:x-[mb-xs,text-heading]',
                                        'md:text-[3rem] md:landscape:x-[text-heading,mb-xs]',
                                    )}
                                >
                                    Vision
                                </h2>
                                <p
                                    className={cn(
                                        'text-[2.5rem] leading-tight sm:text-[1.1875rem]',
                                        'md:text-heading-l md:landscape:text-[1.1875rem]',
                                    )}
                                >
                                    Ushering in the era of efficient computing, equipping all legacy devices with
                                    advanced microprocessors.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={cn(styles.section, styles.fullHeightSection, 'relative')}>
                    <div
                        className={cn(
                            styles.content,
                            'flex w-full flex-col justify-between py-[7rem] sm:landscape:py-[1.875rem] md:landscape:py-[1.875rem]',
                        )}
                    >
                        <div
                            style={{ backgroundImage: `url("${SVG_NATURE.src}")` }}
                            className={cn(
                                styles.fullHeightSection,
                                'max-w-dwv absolute left-0 top-0 -z-10 w-dvw bg-cover bg-center bg-no-repeat',
                            )}
                        />
                        <h1
                            className={cn(
                                styles.textGlow,
                                `ml-auto w-min text-right font-oxygen font-bold leading-n text-black`,
                                `mb-n text-heading-4xl`,
                                `md:text-heading-3xl md:landscape:text-[3rem]`,
                                `sm:x-[mb-xs,text-[3rem]]`,
                            )}
                        >
                            Understand Our Why
                        </h1>
                        <div>
                            <PageLink
                                href={Route.Credo}
                                className={
                                    'flex h-button-xl w-full max-w-[10.5rem] justify-center bg-white text-section-s text-black'
                                }
                            >
                                Read Our Credo
                            </PageLink>
                        </div>
                    </div>
                </section>
                <div className='relative h-full'>
                    <div className='absolute inset-x-0 top-0 z-0 h-[65%] bg-gradient-to-b from-[--bg-control-blue] to-transparent' />
                    <div className='relative z-10'>
                        <Info
                            data={INFO}
                            className={'pt-[12rem]'}
                            classNameTitle={'md:text-heading-l  sm:x-[text-[1.75rem],mb-xl]'}
                            classNameSubTitle={'mb-4xs text-documentation  lg:text-[2.5rem]  sm:text-documentation'}
                            classNameContent={'md:x-[max-w-[62rem],mx-auto]'}
                            classNameDescription={'text-basic  lg:text-section'}
                            classNamePageLink={cn(
                                'flex items-center justify-center rounded-none',
                                'w-full max-w-[8.4375rem] h-button-xl mt-n [&]:p-0 ',
                                '[&]:text-section-s  [&]:sm:text-basic',
                                'md:mt-n',
                                'sm:x-[mt-n,h-button-l,max-w-[7.3125rem],text-basic] ',
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
};

export default AboutPage;
