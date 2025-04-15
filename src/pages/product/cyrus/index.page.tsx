'use client';
import React from 'react';
import cn from 'classnames';
import Image from 'next/image';

import { ReactElement } from 'react';

import { MainBackground } from '@/app/ui/atoms';
import { InsideTernSection } from '@/app/ui/templates';
import { PageLink } from '@/app/ui/layout';
import { Insignia } from '@/app/ui/organisms';

import styles from '@/app/common.module.css';

import BackgroundImage from '@/assets/images/security-abstract.png';
import Cyrus_Img2 from '@/assets/images/Cyrus_Page_Image2.png';
import CyrusImg3 from '@/assets/images/Cyrus_Page_Image3.png';
import CyrusImg4 from '@/assets/images/Cyrus_Page_Image4.png';
import CyrusImg5 from '@/assets/images/Cyrus_Page_Image5.png';

interface StatData {
    percent: string;
    description: string;
}

const STATS: StatData[] = [
    { percent: '25x', description: 'Increase in Storage Density' },
    { percent: '50%', description: 'Decrease in Active Power Consumption' },
    { percent: '37%', description: 'Increase in Data Efficiency' },
    { percent: '33%', description: 'Decrease in Passive Power Consumption' },
];

const BUTTON_CN = 'flex justify-between items-center px-3xs py-xxs  text-left text-14 lg:text-16';

const CyrusPage = () => {
    const StatItems: ReactElement[] = STATS.map((stat, idx) => (
        <div
            key={idx}
            className='bg-gray p-l'
        >
            <p className='font-bold leading-n text-64  md:text-80 lg:text-96'>{stat.percent}</p>
            <p className='text-18  leading-l  md:text-16 lg:text-24  mt-l'>{stat.description}</p>
        </div>
    ));

    return (
        <>
            <section className={cn(styles.section, styles.fullHeightSection)}>
                <MainBackground url={BackgroundImage} />
                <div className={cn(styles.content, 'relative z-10 flex flex-col justify-between')}>
                    <h1 className={'leading-l  mt-6xl-1 text-64 lg:text-96'}>Cyrus 1 Processor</h1>
                    <h3 className={'mb-l  text-24 lg:text-32'}>The great</h3>
                </div>
            </section>
            <section
                className={cn(
                    styles.section,
                    'bg-gradient-to-b from-blue to-transparent',
                    'sm:to-[32%] md:to-[17%] lg:to-[17%]',
                )}
            >
                <div className={cn(styles.content, 'pt-xl')}>
                    <h3 className={'flex justify-center  sm:text-21 md:text-27 lg:text-32'}>
                        Redefine Computing Forever
                    </h3>
                    <div className={'grid grid-cols-2  gap-n  mt-6xl md:mt-5xl'}>
                        <div className={'relative w-full'}>
                            <Image
                                src={Cyrus_Img2}
                                alt={'Cyrus_Img2'}
                                className='size-full max-h-[59.25rem]'
                            />
                        </div>

                        <div className={'flex justify-start items-center'}>
                            <p
                                className={
                                    'font-bold  text-40  sm:leading-[1.5] leading-[1.75]  md:text-96 lg:text-128'
                                }
                            >
                                Beauty
                                <br />
                                in
                                <br />
                                Design
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className={cn(styles.section, 'flex justify-center items-center  sm:py-5xl md:py-6xl-1 py-7xl')}>
                <div className={cn(styles.content, 'relative')}>
                    <div className={'grid place-items-center w-full max-h-[39.875rem]'}>
                        <div className={'contents'}>
                            <Image
                                src={CyrusImg3}
                                alt={'Power in Performance'}
                                className={'object-cover col-start-1 row-start-1'}
                            />
                        </div>
                        <h3
                            className={cn(
                                'text-white font-bold text-center',
                                'col-start-1  row-start-1',
                                'text-30 md:text-64 lg:text-96',
                            )}
                        >
                            Power in Performance
                        </h3>
                    </div>
                </div>
            </section>
            <section className={cn(styles.section)}>
                <div
                    className={cn(styles.content, 'relative z-50 grid gap-x-3xl leading-l  sm:grid-cols-1 grid-cols-2')}
                >
                    <div className={'contents'}>
                        <Image
                            src={CyrusImg4}
                            alt={'emulator sample'}
                            className={'m-auto w-full  sm:row-start-2 col-start-2  sm:col-start-1'}
                        />
                    </div>
                    <h3
                        className={cn(
                            'font-bold leading-n    col-start-1',
                            'lg:mt-[3.5625rem] md:mt-[3.3125rem]',
                            'sm:x-row-start-1  row-start-1',
                            'sm:mb-[2.3125rem]',
                            'text-24 md:text-27 lg:text-40',
                        )}
                    >
                        Leading the Next Paradigm Shift
                    </h3>
                    <div
                        className={cn(
                            'lg:mt-7xl md:mt-6xl',
                            'md:col-start-1 lg:col-start-1  md:row-start-1 lg:row-start-1',
                        )}
                    >
                        <p className={cn('w-full  sm:mt-[2.6875rem] mt-xxs   text-14 md:text-10 lg:text-16')}>
                            The Cyrus 1 Processor is leading a transformative change in computing by shifting from the
                            traditional binary system to a ternary framework, paving the way for the next generation of
                            digital technology. <br />
                            <br />
                            In contrast to binary computing, which operates with only two states—0 and 1—ternary
                            computing employs three states: -1, 0, and +1. This design enables each ternary unit, or
                            tert, to store more information than a binary bit, resulting in notable advancements in
                            energy efficiency, processing speed, and storage capacity.
                            <br />
                            <br />
                            As the first general-purpose ternary microprocessor, the Cyrus 1 addresses key challenges in
                            modern computing, such as the memory wall and power wall. These improvements make it
                            well-suited for high-performance applications, including artificial intelligence, big data
                            processing, and hyperscale computing. <br />
                            <br />
                            By moving beyond the constraints of binary systems, the Cyrus 1 Processor not only meets the
                            demands of future technologies but also plays a central role in shaping a more efficient and
                            powerful computing landscape.
                            <br />
                            <br />
                        </p>
                    </div>
                </div>
            </section>

            <section className={cn(styles.section)}>
                <div className={cn(styles.content, 'sm:mt-5xl md:mt-6xl-1 lg:mt-[9.375rem]')}>
                    <h3 className={'text-27 md:text-30 lg:text-32'}>Improvements</h3>
                </div>
            </section>

            <section className={cn(styles.section)}>
                <div className={cn(styles.content, 'pt-xl')}>
                    <div className='grid grid-cols-2 gap-n w-full  sm:grid-cols-1'>{StatItems}</div>
                </div>
            </section>

            <section className={cn(styles.section, 'sm:pt-5xl md:pt-6xl-1 lg:pt-[9.375rem]')}>
                <div className={cn(styles.content, 'grid')}>
                    <Image
                        src={CyrusImg5}
                        alt={'tern_Image'}
                        className={'w-full max-h-[88.625rem] col-start-1 row-start-1'}
                    />
                    <Insignia
                        className={cn(
                            'col-start-1 row-start-1 justify-self-end z-10',
                            'sm:[&_*]:!h-3xl md:[&_*]:!h-[4.5rem] lg:[&_*]:!h-[7rem]',
                            'sm:px-[4.0625rem] md:px-6xl-1 lg:px-[11.5625rem]',
                            'sm:pt-[2.1875rem] md:pt-xl lg:pt-6xl-1',
                        )}
                    />
                    <div
                        className={
                            'col-start-1 row-start-1 flex flex-col justify-center items-start text-left sm:pl-0 pl-[2.6875rem]'
                        }
                    >
                        <h3
                            className={cn(
                                'leading-l text-27 md:text-32 lg:text-40',
                                'sm:w-[10rem] mt-[13rem] md:mt-[12.375rem] lg:mt-[25.125rem]',
                                'sm:whitespace-pre-line sm:pl-xs whitespace-normal',
                            )}
                        >
                            Cyrus 1 Processor
                        </h3>

                        <p
                            className={cn(
                                'leading-l text-18 lg:text-21 sm:mr-[20px]',
                                'mt-[11.0625rem] md:mt-[1.9375rem] lg:mt-l',
                                'md:max-h-[19rem] md:max-w-[45%] lg:max-w-[40%]',
                            )}
                        >
                            Modern computing systems are increasingly power-intensive, presenting significant challenges
                            to energy efficiency and long-term sustainability.
                            <br />
                            <br />
                            By implementing a Design for Manufacture and Assembly (DFMA) approach, we can optimize the
                            development and production of advanced systems, achieving greater operational efficiency
                            while minimizing manufacturing complexity and energy consumption.
                        </p>

                        <PageLink
                            href=''
                            icon={'arrow-right-long'}
                            className={cn(
                                BUTTON_CN,
                                'block border bg-blue border-blue text-white max-w-[14.125rem]',
                                'mt-[1.9375rem] md:mt-[3.5625rem] lg:mt-[3.375rem]',
                            )}
                            iconClassName={'ml-xxl order-last [&_*]:fill-white size-8xs lg:size-7xs'}
                        >
                            Read whitepaper
                        </PageLink>
                    </div>
                </div>
            </section>

            <InsideTernSection
                data={'alt1'}
                className='bg-transparent  mb-[34rem] md:mb-[35.0625rem] lg:mb-[37.6875rem]'
            />
            <div
                className={cn(
                    'h-full w-full absolute left-0 top-0 z-0 bg-gradient-to-t from-blue to-transparent to-10%',
                )}
            />
        </>
    );
};

export default CyrusPage;
