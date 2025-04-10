'use client';

import { ReactElement, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { ReactSVG } from 'react-svg';
import dynamic from 'next/dynamic';
import cn from 'classnames';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

import { ResourceSectionData } from '@/app/types/layout';
import { MISC_LINKS, Route } from '@/app/static';

import { useUser } from '@/app/hooks';

import { Button } from '@/app/ui/form';
import { PageLink } from '@/app/ui/layout';
import { MainBackground } from '@/app/ui/atoms';
import { ResourcesSection } from '@/app/ui/templates';

import styles from '@/app/common.module.css';

import PNG_BACKGROUND_MAIN from '@/assets/images/tidal-bg-main.png';
import PNG_BACKGROUND_CIRCUIT from '@/assets/images/tidal-bg-circuit.png';

import SVG_TIDAL from '@/assets/images/tidal-logo.svg';
import PNG_EMULATOR_SAMPLE from '@/assets/images/emulator-sample.png';
import PNG_GIRL from '@/assets/images/tidal-girl.png';
import PNG_GLOBE_GLASS from '@/assets/images/tidal-globe-glass.png';
import SVG_TILE_PROFILE from '@/assets/images/icons/profile.svg';
import SVG_TILE_STAR from '@/assets/images/icons/star-alt.svg';
import SVG_TILE_GLASS from '@/assets/images/icons/search.svg';
import SVG_TILE_SHARE from '@/assets/images/icons/share.svg';
import SVG_TILE_SAVE from '@/assets/images/icons/save.svg';
import SVG_TILE_HEART from '@/assets/images/icons/heart.svg';
import SVG_PLAY from '@/assets/images/icons/play.svg';

type Tiles = {
    title: string;
    description: string;
    image: StaticImageData;
};

const TILES: Tiles[] = [
    {
        title: 'Universal Login',
        description:
            'Use the same login for the website for all of our products and services including Tidal. One account and you’re free to experiment.',
        image: SVG_TILE_PROFILE,
    },
    {
        title: 'Universal Login',
        description:
            'Use the same login for the website for all of our products and services including Tidal. One account and you’re free to experiment.',
        image: SVG_TILE_STAR,
    },
    {
        title: 'Universal Login',
        description:
            'Use the same login for the website for all of our products and services including Tidal. One account and you’re free to experiment.',
        image: SVG_TILE_GLASS,
    },
    {
        title: 'Universal Login',
        description:
            'Use the same login for the website for all of our products and services including Tidal. One account and you’re free to experiment.',
        image: SVG_TILE_SHARE,
    },
    {
        title: 'Universal Login',
        description:
            'Use the same login for the website for all of our products and services including Tidal. One account and you’re free to experiment.',
        image: SVG_TILE_SAVE,
    },
    {
        title: 'Universal Login',
        description:
            'Use the same login for the website for all of our products and services including Tidal. One account and you’re free to experiment.',
        image: SVG_TILE_HEART,
    },
];

const RESOURCES: ResourceSectionData[] = [
    { Node: <PageLink href={Route.TidalPricing}>Pricing</PageLink> },
    { Node: <PageLink href={Route.TidalFAQs}>Help & FAQs</PageLink> },
    { Node: <PageLink href={Route.Documentation} /> },
];

const BTN_ICON = 'ml-xl size-5xs';

const BTN_CN = 'px-n  h-button-l  md:h-button-xl  lg:h-button-xxl';
const BTN_BLUE_CN = BTN_CN + ' bg-blue';
const BTN_BLACK_CN = BTN_CN + ' border-s border-gray-l0 bg-black text-blue';

function TidalPage() {
    const userCtx = useUser();

    const [videoStarted, setVideoStarted] = useState(false);

    const demoSectionRef = useRef<HTMLDivElement | null>(null);

    const videoRef = useRef<HTMLDivElement | null>(null);

    // Elements
    const TilesLi: ReactElement[] = TILES.map((tile, idx) => (
        <li
            key={tile.title + idx}
            className={cn('flex flex-col mx-auto  sm:w-2/3', 'text-12 md:text-16 lg:text-20')}
        >
            <ReactSVG
                src={tile.image.src}
                className={'mx-auto sm:!size-3xl md:!size-8xl !size-10xl'}
            />
            <span className={'mb-5xs mt-s block font-bold'}>{tile.title}</span>
            <span className={'leading-n'}>{tile.description}</span>
        </li>
    ));

    return (
        <>
            <section className={cn(styles.section, styles.fullHeightSection, styles.sectionShadowBlue, 'relative')}>
                <MainBackground url={PNG_BACKGROUND_MAIN} />
                <div className={cn(styles.content, 'relative z-10 content-center')}>
                    <div className={'sm:x-[pt-l,pb-5xl] pt-5xl pb-6xl'}>
                        <h1 className={'text-64  lg:text-96'}>TIDAL</h1>
                        <Image
                            src={SVG_TIDAL}
                            alt={'logo'}
                            className={'h-auto w-[20.4%] lg:w-[15.2%]  sm:my-4xl my-3xl'}
                        />
                        <p className={'text-32  lg:text-40'}>Unlocking the potential of ternary programming</p>
                        <div
                            className={cn(
                                'flex flex-wrap gap-x-l gap-y-xs text-nowrap text-21',
                                'mt-xxl md:mt-xxl lg:mt-xl',
                            )}
                        >
                            <PageLink
                                isExternal
                                href={MISC_LINKS.Tidal}
                                className={cn(BTN_BLUE_CN, ' !h-button-xxl text-black')}
                            >
                                Try it Free
                            </PageLink>
                            <Button
                                onClick={() => demoSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                className={cn(BTN_BLACK_CN, '!h-button-xxl')}
                            >
                                Watch Demo
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
            <section
                style={{
                    backgroundImage: [
                        // 1) Gradient at the top: semi‑opaque blue → transparent
                        'linear-gradient(to bottom, rgba(59,130,246,0.6) 0%, rgba(59,130,246,0) 50%)',
                        // 2)image underneath
                        `url("${PNG_BACKGROUND_CIRCUIT.src}")`,
                    ].join(','),
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div
                    className={cn(
                        styles.content,
                        'relative z-[100] leading-n',
                        'pt-4xl md:pt-[10em] lg:pt-[12em]',
                        'text-16 md:text-14 lg:text-40',
                    )}
                    style={{ opacity: 1 }}
                >
                    <h2
                        className={cn(
                            'mx-auto text-center font-bold leading-n  w-2/3 sm:w-full',
                            'text-27 md:text-48 lg:text-64',
                            'pt-6xl-1 md:pt-[12.55rem] lg:pt-[17rem]',
                        )}
                    >
                        Tidal is the World’s First Ternary Software Stack
                    </h2>
                    <p className={'mt-6xl-1 sm:mt-xxl  text-16 md:text-30 lg:text-40'}>
                        We are driving the evolution from binary to ternary computing. By harnessing the superior data
                        density and efficiency of ternary logic, Tidal provides developers with an innovative platform
                        to redefine programming paradigms and unlock new computational possibilities.
                    </p>
                    <div className={'relative'}>
                        <ReactSVG
                            onClick={() => videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                            src={SVG_PLAY.src}
                            className={'absolute left-1/2 -translate-x-1/2 bottom-[31.5%] cursor-pointer'}
                        />
                        <Image
                            src={PNG_EMULATOR_SAMPLE}
                            alt={'emulator sample'}
                            className={'h-auto w-full  mt-5xl md:mt-6xl-1 lg:mt-6xl'}
                        />
                    </div>
                    <p className={'mt-xxl md:mt-6xl-1 lg:mt-5xl text-16 md:text-30 lg:text-40'}>
                        This specialized sandbox environment is designed to support languages engineered specifically
                        for ternary logic computation. At its core is G, a sophisticated high-level language
                        structurally reminiscent of C, enabling a seamless adaptation for developers familiar with
                        conventional programming.
                    </p>
                    <div className={'mt-xl md:mt-4xl lg:mt-5xl'}>
                        <Button
                            onClick={() => demoSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                            className={cn(BTN_BLACK_CN, 'text-21 sm:text-16')}
                        >
                            G Handbook
                        </Button>
                    </div>
                </div>
            </section>
            <section
                ref={demoSectionRef}
                className={cn(styles.section, styles.sectionShadowBlack)}
            >
                <div
                    className={cn(
                        styles.content,
                        styles.contentHighlight,
                        'text-40 leading-n',
                        'pt-6xl-1 md:pt-[12.55rem] lg:pt-[16rem]',
                        'pb-6xl-1 md:pb-[13rem] lg:pb-[19.5rem]',
                    )}
                >
                    <div
                        ref={videoRef}
                        onClick={() => {
                            if (!videoStarted) setVideoStarted(true);
                        }}
                        className={cn(
                            'relative h-[50dvw] max-h-[42.886rem] w-full cursor-pointer',
                            'before:x-[absolute,size-full,bg-black]',
                            { ['before:hidden']: videoStarted },
                        )}
                    >
                        <ReactSVG
                            src={SVG_PLAY.src}
                            className={cn(
                                'absolute z-50 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2',
                                '[&_*]:!size-l md:[&_*]:!size-9xl lg:[&_*]:!size-[5.75rem]',
                                { ['hidden']: videoStarted },
                            )}
                        />
                        <div className={'[&_*]:!size-full size-full'}>
                            <ReactPlayer
                                url={MISC_LINKS.TidalDemoEmbed}
                                playing={videoStarted}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section
                className='relative z-10 w-full h-fit bg-cover bg-center bg-no-repeat'
                style={{
                    backgroundImage: `url("${PNG_BACKGROUND_CIRCUIT.src}")`,
                }}
            >
                {/* Remove any overlay div here like bg-gradient-to-b from-blue/60 to-transparent */}

                <div className='mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-8 px-4 py-16 sm:grid-cols-2 sm:py-24 lg:grid-cols-2 lg:px-6 relative z-20'>
                    <Image
                        src={PNG_GIRL}
                        className='h-auto w-full rounded-lg'
                        alt='Turning Heads'
                    />
                    <div className='text-white text-16 md:text-27 lg:text-40'>
                        <h2 className='mb-4 text-27 md:text-48 lg:text-64 font-extrabold tracking-tight'>
                            Turning Heads
                        </h2>
                        <p className='opacity-100 text-white'>
                            Users can write code using the Tidal software and run that code within our online emulator,
                            enabling software developers from any experience level to explore this untapped scape of
                            programming.
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div
                    className={cn(
                        styles.content,
                        styles.contentGradientBlue,
                        'grid max-h-min grid-cols-[1fr,1fr,max-content] gap-y-5xl leading-n',
                        'sm:x-[grid-cols-1,w-2/3,justify-items-center]',
                        'py-6xl md:x-[pt-[16.81rem],pb-[20.69rem]] lg:x-[pt-[19.25rem],pb-[21.56rem]]',
                        'text-16 lg:text-18',
                    )}
                >
                    <h2
                        className={cn(
                            'text-center font-bold leading-n  col-span-3 sm:col-span-1',
                            'text-27 md:text-36 lg:text-64',
                        )}
                    >
                        Learning Together
                    </h2>
                    <p className={'sm:text-center'}>
                        <span className={'block  text-27  lg:text-32'}>Fostering Collaboration</span>
                        <span className={'mt-5xs block'}>
                            Tidal enhances developer collaboration through Explore Keys, a comprehensive database of
                            Tidal programs, known as Keys. This platform connects users with software developers
                            globally, fostering an open and dynamic environment for learning, sharing, and growth.
                        </span>
                        <PageLink
                            isExternal
                            href={MISC_LINKS.TidalExploreKeys}
                            className={cn(BTN_BLUE_CN, 'mt-n')}
                        >
                            Explore keys
                        </PageLink>
                    </p>
                    <div className={'contents'}>
                        <Image
                            src={PNG_GLOBE_GLASS}
                            alt={'globe glass'}
                            className={cn(
                                'col-start-3 ml-auto mt-auto h-[13.5rem] w-auto',
                                'sm:x-[row-start-2,col-start-1,ml-0]',
                            )}
                        />
                    </div>
                </div>
            </section>
            <section className={cn(styles.section, 'bg-transparent')}>
                <div className={cn(styles.content, 'py-6xl')}>
                    <h2 className={'font-bold sm:x-[text-center,text-27] md:text-36 lg:text-40'}>Features</h2>
                    <ul
                        className={cn(
                            'grid gap-3xl mx-auto  grid-cols-3 sm:grid-cols-1',
                            'w-fit lg:w-full',
                            'mt-3xl md:mt-5xl lg:mt-5xl',
                        )}
                    >
                        {TilesLi}
                    </ul>
                </div>
            </section>
            <section className={styles.section}>
                <div className={cn(styles.content, 'py-5xl')}>
                    <h2 className={'text-64  font-bold  sm:text-27  md:text-40'}>Get Started</h2>
                    <div className={'flex flex-wrap gap-xl text-16  mt-3xl sm:mt-xl'}>
                        {/*TODO links*/}
                        <PageLink
                            isExternal
                            href={MISC_LINKS.Tidal}
                            icon={'arrow-right-long'}
                            className={cn(BTN_BLUE_CN, ' !h-button-xxl flex-row-reverse')}
                            iconClassName={BTN_ICON}
                        >
                            Try Pro trial at no cost
                        </PageLink>
                        <PageLink
                            icon={'calendar'}
                            className={cn(BTN_BLACK_CN, ' !h-button-xxl flex-row-reverse text-primary !border-blue')}
                            iconClassName={BTN_ICON}
                        >
                            Book a meeting
                        </PageLink>
                    </div>
                </div>
            </section>
            <ResourcesSection
                data={RESOURCES}
                className={'mb-7xl md:mb-7xl lg:mb-[12.51rem]'}
            >
                More ways to explore
            </ResourcesSection>
        </>
    );
}

export default TidalPage;
