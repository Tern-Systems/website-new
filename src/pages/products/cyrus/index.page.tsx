'use client';

import { ReactElement } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { Content, H1, H2, H3, Section } from '@/app/ui/atoms';
import { BookCoverSection, InsideTernSection } from '@/app/ui/templates';

import BackgroundImage from '@/assets/images/security-abstract.png';
import Cyrus_Img2 from '@/assets/images/Cyrus_Page_Image2.png';
import CyrusImg3 from '@/assets/images/Cyrus_Page_Image3.png';
import CyrusImg4 from '@/assets/images/Cyrus_Page_Image4.png';

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
            <Section
                type={'full-screen'}
                background={{ image: BackgroundImage, gradient: 'left' }}
                className={{ content: 'mt-6xl-1 mb-l', background: 'bg-center' }}
            >
                <H1 type={'large'}>Cyrus 1 Processor</H1>
                <H2>The great</H2>
            </Section>
            <Content>
                <Section className={{ content: 'pt-xl' }}>
                    <H3 className={'text-center'}>Redefine Computing Forever</H3>
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
                </Section>
                <Section className={{ content: 'sm:py-5xl md:py-6xl-1 py-7xl' }}>
                    <div className={'grid place-items-center w-full max-h-[39.875rem]'}>
                        <div className={'contents'}>
                            <Image
                                src={CyrusImg3}
                                alt={'Power in Performance'}
                                className={'object-cover col-start-1 row-start-1'}
                            />
                        </div>
                        <H3
                            type={'extra-huge'}
                            className={'col-start-1 row-start-1 font-bold'}
                        >
                            Power in Performance
                        </H3>
                    </div>
                </Section>
                <Section className={{ content: 'relative z-50 grid gap-x-3xl leading-l  sm:grid-cols-1 grid-cols-2' }}>
                    <div className={'contents'}>
                        <Image
                            src={CyrusImg4}
                            alt={'emulator sample'}
                            className={'w-full  sm:row-start-2 col-start-2  sm:col-start-1  sm:mt-[2.31rem]'}
                        />
                    </div>
                    <div className={'sm:contents  col-start-1 row-start-1 my-auto'}>
                        <H3
                            type={'large'}
                            className={'font-bold'}
                        >
                            Leading the Next Paradigm Shift
                        </H3>
                        <div
                            className={cn(
                                'mt-xl sm:mt-[2.7rem]',
                                'md:col-start-1 lg:col-start-1  md:row-start-1 lg:row-start-1',
                            )}
                        >
                            <p className={cn('w-full  sm:mt-[2.6875rem] mt-xxs   text-14 md:text-10 lg:text-16')}>
                                The Cyrus 1 Processor is leading a transformative change in computing by shifting from
                                the traditional binary system to a ternary framework, paving the way for the next
                                generation of digital technology. <br />
                                <br />
                                In contrast to binary computing, which operates with only two states—0 and 1—ternary
                                computing employs three states: -1, 0, and +1. This design enables each ternary unit, or
                                tert, to store more information than a binary bit, resulting in notable advancements in
                                energy efficiency, processing speed, and storage capacity.
                                <br />
                                <br />
                                As the first general-purpose ternary microprocessor, the Cyrus 1 addresses key
                                challenges in modern computing, such as the memory wall and power wall. These
                                improvements make it well-suited for high-performance applications, including artificial
                                intelligence, big data processing, and hyperscale computing. <br />
                                <br />
                                By moving beyond the constraints of binary systems, the Cyrus 1 Processor not only meets
                                the demands of future technologies but also plays a central role in shaping a more
                                efficient and powerful computing landscape.
                                <br />
                                <br />
                            </p>
                        </div>
                    </div>
                </Section>
                <Section className={{ content: 'sm:mt-5xl md:mt-6xl-1 lg:mt-[9.375rem]' }}>
                    <H3 className={'sm:!text-21 md:!text-30'}>Improvements</H3>
                </Section>
                <Section className={{ content: 'pt-xl' }}>
                    <div className='grid grid-cols-2 gap-n w-full  sm:grid-cols-1'>{StatItems}</div>
                </Section>
                {/*TODO href*/}
                <BookCoverSection
                    type={'navy'}
                    title={'Cyrus 1 Processor'}
                    Description={
                        <>
                            Modern computing systems are increasingly power-intensive, presenting significant challenges
                            to energy efficiency and long-term sustainability.
                            <br />
                            <br />
                            By implementing a Design for Manufacture and Assembly (DFMA) approach, we can optimize the
                            development and production of advanced systems, achieving greater operational efficiency
                            while minimizing manufacturing complexity and energy consumption.
                        </>
                    }
                    link={{ title: 'Read whitepaper', href: '' }}
                    className={'sm:mt-5xl md:mt-6xl-1 lg:mt-[9.375rem]'}
                />
                <InsideTernSection data={'alt1'} />
            </Content>
        </>
    );
};

export default CyrusPage;
