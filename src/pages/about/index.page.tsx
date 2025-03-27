import { FC } from 'react';
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
                <div
                    className={cn(
                        styles.content,
                        'relative flex justify-end z-10',
                        'items-start md:items-center lg:items-center',
                    )}
                >
                    <div>
                        <h1
                            className={cn(
                                'flex mb-n text-right font-bold leading-n',
                                'sm:mt-n',
                                'w-[20rem] md:w-min lg:w-min',
                                'text-40 md:[&]:text-96 md:[&]:landscape:text-40 lg:text-128',
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
                        'absolute w-dvw max-w-dwv left-0 top-0 z-10',
                        'bg-gradient-to-b bg-cover bg-center bg-no-repeat',
                        'from-blue md:from-[-10%] lg:from-[-15%]',
                        'to-transparent to-60% lg:to-40%',
                    )}
                />
                <div
                    className={cn(
                        styles.fullHeightSection,
                        'absolute w-dvw max-w-dwv left-0 top-0 z-10',
                        'bg-gradient-to-t bg-cover bg-center bg-no-repeat',
                        'from-blue md:from-[-15%] lg:from-[-15%]',
                        'to-transparent to-60%  md:to-30% lg:to-35%',
                    )}
                />
                <div
                    className={cn(
                        styles.content,
                        'relative flex h-full z-20 items-center justify-center',
                        'bg-cover bg-center bg-no-repeat',
                        'md:x-[max-w-[62rem],mx-auto]',
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
                                    'mb-xs md:mb-n md:landscape:mb-xs lg:mb-xl',
                                    'text-27 md:text-48 md:landscape:text-27 lg:text-64',
                                )}
                            >
                                Mission
                            </h2>
                            <p className={cn('leading-tight', 'text-18 md:text-36 md:landscape:text-18 lg:text-40')}>
                                Revolutionize computing by harnessing the power of ternary microprocessors.
                            </p>
                        </div>
                        <div>
                            <h2
                                className={cn(
                                    'mb-xs md:mb-n md:landscape:mb-xs lg:mb-xl',
                                    'text-27 md:text-48 md:landscape:text-27 lg:text-64',
                                )}
                            >
                                Vision
                            </h2>
                            <p className={cn('leading-tight', 'text-18 md:text-36 md:landscape:text-18 lg:text-40')}>
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
                        'flex w-full flex-col justify-between py-[7rem]',
                        'sm:landscape:py-n md:landscape:py-n',
                    )}
                >
                    <div
                        style={{ backgroundImage: `url("${SVG_NATURE.src}")` }}
                        className={cn(
                            styles.fullHeightSection,
                            'absolute w-dvw max-w-dwv left-0 top-0 -z-10',
                            'bg-cover bg-center bg-no-repeat',
                        )}
                    />
                    <h1
                        className={cn(
                            `w-min ml-auto text-right font-bold leading-n text-black`,
                            `text-48 md:text-64 md:landscape:text-48 lg:text-96`,
                            `sm:mb-xs mb-n`,
                        )}
                    >
                        Understand Our Why
                    </h1>
                    <div>
                        <PageLink
                            href={Route.Credo}
                            className={
                                'flex h-button-xl w-full max-w-[10.5rem] justify-center bg-white text-18 text-black'
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
                        classNameTitle={'sm:x-[text-30,mb-xl,leading-n]  md:text-36'}
                        classNameSubTitle={'mb-4xs [&]:text-24 lg:[&]:text-32'}
                        classNameContent={'md:x-[max-w-[62rem],mx-auto]'}
                        classNameDescription={'[&]:leading-l text-16 lg:text-20'}
                        classNamePageLink={cn(
                            'flex w-full [&]:p-0 items-center justify-center rounded-none',
                            'text-16 md:text-18 lg:[&]:text-18',
                            'sm:max-w-[7.1875rem] max-w-[8.4375rem]',
                            'sm:h-button-l h-button-xl',
                            'mt-n md:mt-xl lg:mt-xxl',
                        )}
                    />
                    <InsideTernSection
                        data={'alt1'}
                        className={'bg-transparent'}
                    />
                </div>
            </div>
        </>
    );
};

export default AboutPage;
