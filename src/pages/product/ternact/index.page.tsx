'use client';

import { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { ResourceLink } from '@/app/types/layout';

import { Content, H1, H2, H3, Section } from '@/app/ui/atoms';
import { BookCoverSection, InsideTernSection, ResourceCards } from '@/app/ui/templates';

import SVG_CENTER from '@/assets/images/data-center.png';
import PNG_ABOUT from '@/assets/images/ternact-about.png';
import HELIX from '@/assets/images/ternact-card-3.png';
import PNG_CARD_2 from '@/assets/images/ternact-card-2.png';

// TODO links
const IMPROVEMENT: ResourceLink[] = [
    {
        title: 'Tidal',
        description: 'Tap into Ternact with Tidal',
        href: '',
    },
    {
        title: 'Collaborate',
        description: 'Work with leading developers',
        href: '',
    },
    {
        title: 'Experience',
        description: 'Don’t wait, anticipate',
        href: '',
    },
    {
        title: 'Contribute',
        description: 'Help us test and build Cyrus 1',
        href: '',
    },
];

const DESCRIPTION = (
    <>
        Ternact represents a groundbreaking advancement as the first general-purpose ternary computer, providing remote
        access for executing ternary-compatible programs
        <br />
        <br />
        This innovative system not only addresses critical computing challenges, such as the memory wall and power wall,
        but also serves as a preparatory platform for the imminent paradigm shift heralded by the forthcoming Cyrus 1
        Processor.
        <br />
        <br />
        Through Tidal, a sophisticated educational emulator, users can master ternary programming, thereby positioning
        themselves at the vanguard of this technological evolution.
    </>
);

const TernactPage: FC = () => {
    return (
        <>
            <Section
                screenHeight
                background={{ image: SVG_CENTER, gradient: 'left' }}
                className={{
                    background: '!bg-right-top',
                    content: 'flex flex-col justify-between  py-xxl md:py-xxl lg:py-6xl-1',
                }}
            >
                <H1
                    type={'large'}
                    className={`sm:text-64`}
                >
                    Ternact
                </H1>
                <H2 className={`sm:text-24`}>Play with the future</H2>
            </Section>
            <Content heading={'Access True Power'}>
                <Section className={{ content: 'grid grid-cols-2  mt-5xl md:mt-6xl-1 lg:mt-7xl' }}>
                    <Image
                        src={PNG_ABOUT}
                        alt='About'
                        className={'size-full max-h-[59.26rem]'}
                    />
                    <p
                        className={cn(
                            'w-min break-words content-center font-bold leading-[2]',
                            'px-xxs md:px-n lg:px-3xl',
                            'text-40 md:text-64 lg:text-96',
                        )}
                    >
                        Lead the Charge
                    </p>
                </Section>
                <Section
                    className={{ content: 'relative flex justify-center items-center  mt-5xl md:mt-6xl-1 lg:mt-7xl' }}
                >
                    <span className='absolute  text-40 md:text-64 lg:text-96'>Redefine the Paradigm</span>
                    <Image
                        src={HELIX}
                        alt={'helix'}
                        className={'w-full object-cover  h-[11.738rem] md:h-[27.12rem] lg:h-[39.875rem]'}
                    />
                </Section>
                <Section
                    className={{
                        content: cn(
                            'grid justify-items-center items-center',
                            'sm:grid-cols-1 grid-cols-2',
                            'sm:gap-y-xl  md:gap-x-l lg:gap-x-xxl',
                            'mt-5xl md:mt-6xl-1 lg:mt-7xl-1',
                        ),
                    }}
                >
                    <Image
                        src={PNG_CARD_2}
                        alt={'woman portrait'}
                        className={cn(
                            'w-auto  sm:row-start-2',
                            'sm:col-start-1 col-start-2',
                            'sm:w-full  md:h-[29.082rem] lg:h-[42.75rem]',
                        )}
                    />
                    <div className={'sm:contents  row-start-1'}>
                        <H3
                            type={'large'}
                            className={'!leading-l  md:text-24'}
                        >
                            Wait or Anticipate. The Choice is Yours.
                        </H3>
                        <p className={cn('!leading-l  md:mt-xs lg:mt-xl  text-14 lg:text-16')}>
                            Ternact represents a groundbreaking leap in computing as the world&apos;s first
                            general-purpose ternary computer system, marking a pivotal moment in the evolution of
                            digital technology. Unlike traditional binary systems that rely on two-state logic—zeros and
                            ones—Ternact harnesses the power of three-state logic, incorporating a third value that
                            unlocks superior efficiency, accelerated computation, and reduced energy consumption.
                            <br />
                            <br />
                            These advantages position Ternact to tackle modern computing challenges, such as the memory
                            wall, where processors idle while awaiting data, and the power wall, where escalating energy
                            demands limit scalability. What sets Ternact apart is not just its innovative design but its
                            reality as a physical, operational machine, powered by the Cyrus microprocessor, a ternary
                            chip engineered by Tern.
                            <br />
                            <br />
                            This is no theoretical prototype or simulation—users can remotely access Ternact, connecting
                            to a real ternary computer to run their ternary-ready programs and experience this
                            cutting-edge technology firsthand.
                        </p>
                    </div>
                </Section>
                <Section>
                    <p className='hidden md:flex lg:flex text-27 lg:text-32'>
                        <span className={'sm:inline hidden'}>Improvements</span>
                        <span>Explore the Future</span>
                    </p>
                    <ResourceCards
                        icon={null}
                        links={IMPROVEMENT}
                    />
                </Section>
                {/*TODO href*/}
                <BookCoverSection
                    title={'Ternact'}
                    Description={DESCRIPTION}
                    link={{ title: 'Read Whitepaper', href: '' }}
                    className={'mt-5xl md:mt-6xl-1 lg:mt-[9.37rem]'}
                />
                <InsideTernSection data={'alt1'} />
            </Content>
        </>
    );
};

export default TernactPage;
