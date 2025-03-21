import React, { FC } from 'react';
import cn from 'classnames';

import { InfoSectionData } from '@/app/types/layout';
import { Route } from '@/app/static';

import { PageLink } from '@/app/ui/layout';
import { MainBackground } from '@/app/ui/atoms';
import { InfoSection, InsideTernSection } from '@/app/ui/templates';

import styles from '@/app/common.module.css';

import SVG_COMPUTER from '@/assets/images/old-computer.svg';
import SVG_ROCKET from '@/assets/images/rocket.png';
import SVG_NATURE from '@/assets/images/nature-section.png';

const INFO: InfoSectionData = {
    title: 'Enabling Efficient Computing',
    image: SVG_COMPUTER,
    subTitle: 'Leading the Next Wave',
    link: Route.Documentation,
    linkTitle: 'Go Deeper',
    description:
        'The successive era of computing is not speed or scale, it is optimization. Tern is focused on allowing computer systems to reach their full potential today rather than tomorrow.',
};

const AboutPage: FC = () => {
    return (
        <>
            <section className={cn(styles.section, styles.fullHeightSection)}>
                <MainBackground url={SVG_ROCKET} />
                <div className={cn(styles.content, 'relative z-10 flex items-center justify-end sm:items-start')}>
                    <div>
                        <h1
                            className={cn(
                                `w-min text-right font-bold leading-n`,
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

            <section className={cn(styles.section, styles.fullHeightSection, 'relative')}>
                <div
                    className={cn(
                        styles.fullHeightSection,
                        'max-w-dwv absolute left-0 top-0 z-10 w-dvw bg-cover bg-center bg-no-repeat',
                        'bg-gradient-to-b from-blue to-transparent to-60% md:from-[-10%] lg:to-40% lg:from-[-15%]',
                    )}
                />
                <div
                    className={cn(
                        styles.fullHeightSection,
                        'max-w-dwv absolute left-0 top-0 z-10 w-dvw bg-cover bg-center bg-no-repeat',
                        'bg-gradient-to-t from-blue to-transparent to-60% md:from-[-15%] md:to-30% lg:to-35% lg:from-[-15%]',
                    )}
                />
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
                                    'mb-xl text-heading-3xl sm:x-[mb-xs,text-heading]',
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
                                    'mb-xl text-heading-3xl sm:x-[mb-xs,text-heading]',
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
                                Ushering in the era of efficient computing, equipping all legacy devices with advanced
                                microprocessors.
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
                            `ml-auto w-min text-right font-bold leading-n text-black`,
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
                <div className='relative z-10 bg-black bg-gradient-to-b from-blue to-transparent to-60% md:to-35%  lg:x-[from-[-15%],to-20%]'>
                    <div
                        className={cn(
                            'hidden lg:block',
                            'h-full w-full absolute left-0 top-0 z-10',
                            'bg-gradient-to-t from-green to-transparent to-30%',
                        )}
                    />
                    <InfoSection
                        data={INFO}
                        className={cn('pt-[12rem] bg-transparent')}
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
                    <InsideTernSection
                        data={'alt1'}
                        className='bg-transparent'
                    />
                </div>
            </div>
        </>
    );
};

export default AboutPage;
