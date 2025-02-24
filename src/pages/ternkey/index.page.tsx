'use client';

import React, { ReactElement, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { ReactSVG } from 'react-svg';
import dynamic from 'next/dynamic';
import cn from 'classnames';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

import { ResourceSectionData } from '@/app/types/layout';
import { MISC_LINKS, Route } from '@/app/static';

import { useUser } from '@/app/context';

import { Button } from '@/app/ui/form';
import { PageLink } from '@/app/ui/layout';
import { MainBackground } from '@/app/ui/atoms';
import { ResourcesSection } from '@/app/ui/templates';

import styles from '@/app/common.module.css';

import PNG_BACKGROUND_MAIN from '/public/images/ternkey-bg-main.png';
import PNG_BACKGROUND_CIRCUIT from '/public/images/ternkey-bg-circuit.png';

import SVG_TERNKEY from '/public/images/ternkey-logo.svg';
import PNG_EMULATOR_SAMPLE from '/public/images/emulator-sample.png';
import PNG_GIRL from '/public/images/ternkey-girl.png';
import PNG_GLOBE_GLASS from '/public/images/ternkey-globe-glass.png';
import SVG_TILE_PROFILE from '/public/images/icons/profile.svg';
import SVG_TILE_STAR from '/public/images/icons/star-alt.svg';
import SVG_TILE_GLASS from '/public/images/icons/search.svg';
import SVG_TILE_SHARE from '/public/images/icons/share.svg';
import SVG_TILE_SAVE from '/public/images/icons/save.svg';
import SVG_TILE_HEART from '/public/images/icons/heart.svg';
import SVG_PLAY from '/public/images/icons/play.svg';

type Tiles = {
    title: string;
    description: string;
    image: StaticImageData;
};

const TILES: Tiles[] = [
    {
        title: 'Universal Login',
        description:
            'Use the same login for the website for all of our products and services including TernKey. One account and you’re free to experiment.',
        image: SVG_TILE_PROFILE,
    },
    {
        title: 'Universal Login',
        description:
            'Use the same login for the website for all of our products and services including TernKey. One account and you’re free to experiment.',
        image: SVG_TILE_STAR,
    },
    {
        title: 'Universal Login',
        description:
            'Use the same login for the website for all of our products and services including TernKey. One account and you’re free to experiment.',
        image: SVG_TILE_GLASS,
    },
    {
        title: 'Universal Login',
        description:
            'Use the same login for the website for all of our products and services including TernKey. One account and you’re free to experiment.',
        image: SVG_TILE_SHARE,
    },
    {
        title: 'Universal Login',
        description:
            'Use the same login for the website for all of our products and services including TernKey. One account and you’re free to experiment.',
        image: SVG_TILE_SAVE,
    },
    {
        title: 'Universal Login',
        description:
            'Use the same login for the website for all of our products and services including TernKey. One account and you’re free to experiment.',
        image: SVG_TILE_HEART,
    },
];

const RESOURCES: ResourceSectionData[] = [
    { Node: <PageLink href={Route.TernKeyPricing}>Pricing</PageLink> },
    { Node: <PageLink href={Route.FAQs} /> },
    { Node: <PageLink href={Route.Documentation} /> },
];

const BTN_ICON = 'ml-xl [&_*]:size-[1.06rem]';

const BTN_CN = 'px-n  h-button-xxl  md:h-button-xl  sm:h-button-l';
const BTN_BLUE_CN = BTN_CN + ' bg-blue';
const BTN_BLACK_CN = BTN_CN + ' border-s border-gray-l0 bg-black text-blue';

function TernKeyPage() {
    const userCtx = useUser();

    const [videoStarted, setVideoStarted] = useState(false);

    const demoSectionRef = useRef<HTMLDivElement | null>(null);

    const videoRef = useRef<HTMLDivElement | null>(null);

    // Elements
    const TilesLi: ReactElement[] = TILES.map((tile, idx) => (
        <li
            key={tile.title + idx}
            className={'flex flex-col mx-auto sm:w-2/3  text-section-xxs md:text-basic lg:text-section'}
        >
            <ReactSVG
                src={tile.image.src}
                className={'sm:[&_*]:x-[mx-auto,size-[2.5rem]] md:[&_*]:size-[4.375rem] [&_*]:size-[6.25rem]'}
            />
            <span className={'mb-5xs mt-s block font-bold'}>{tile.title}</span>
            <span className={'leading-n'}>{tile.description}</span>
        </li>
    ));

    const ternKeyUrl =
        MISC_LINKS.TernKey + (userCtx.token ? `/?website_login=${encodeURIComponent(userCtx.token)}` : '');

    return (
        <>
            <section className={cn(styles.section, styles.fullHeightSection, styles.sectionShadowBlue, 'relative')}>
                <MainBackground url={PNG_BACKGROUND_MAIN} />
                <div className={cn(styles.content, 'relative z-10 content-center')}>
                    <div className={'pb-6xl pt-5xl  sm:x-[pt-l,pb-5xl]'}>
                        <h1 className={'text-heading-3xl  lg:text-heading-4xl'}>TIDE</h1>
                        <Image
                            src={SVG_TERNKEY}
                            alt={'logo'}
                            className={'h-auto  my-3xl sm:my-4xl  w-[20.4%] lg:w-[15.2%]'}
                        />
                        <p className={'text-section-xl  lg:text-heading-xl'}>
                            Unlocking the potential of ternary programming
                        </p>
                        <div
                            className={
                                'flex flex-wrap gap-x-l gap-y-xs text-nowrap text-heading-s  mt-[2.81rem] md:mt-[2.71rem] lg:mt-[2.31rem]'
                            }
                        >
                            <PageLink
                                isExternal
                                href={ternKeyUrl}
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
                style={{ backgroundImage: `url("${PNG_BACKGROUND_CIRCUIT.src}")` }}
                className={styles.section}
            >
                <div
                    className={cn(
                        'max-w-dwv absolute left-0 top-0 z-10 w-dvw h-full bg-cover bg-center bg-no-repeat',
                        'bg-gradient-to-b from-blue to-transparent to-50%',
                    )}
                />
                <div
                    className={cn(
                        styles.content,
                        'relative z-50 leading-n',
                        'pt-4xl md:pt-[7.81em] lg:pt-6xl',
                        'text-basic md:text-section-xs lg:text-heading-xl',
                    )}
                >
                    <h2
                        className={cn(
                            'mx-auto text-center font-bold leading-n  w-2/3 sm:w-full',
                            'text-heading md:text-heading-xxl lg:text-heading-3xl',
                            'pt-[6.63rem] md:pt-[12.55rem] lg:pt-[17rem]',
                        )}
                    >
                        TernKey is the World’s First Ternary Software Stack
                    </h2>
                    <p className={'mt-[6rem] sm:mt-xxl  text-basic md:text-section-l lg:text-heading-xl'}>
                        We are driving the evolution from binary to ternary computing. By harnessing the superior data
                        density and efficiency of ternary logic, TernKey provides developers with an innovative platform
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
                            className={'h-auto w-full  mt-[4.5rem] md:mt-[6rem] lg:mt-[7.56rem]'}
                        />
                    </div>
                    <p className={'mt-xxl md:mt-[6rem] lg:mt-[7.59rem]'}>
                        This specialized sandbox environment is designed to support languages engineered specifically
                        for ternary logic computation. At its core is G, a sophisticated high-level language
                        structurally reminiscent of C, enabling a seamless adaptation for developers familiar with
                        conventional programming.
                    </p>
                    <div className={'mt-[2.25rem] md:mt-4xl lg:mt-[4.75rem]'}>
                        <Button
                            onClick={() => demoSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                            className={cn(BTN_BLACK_CN, 'text-heading-s sm:text-basic')}
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
                        'text-heading-xl leading-n',
                        'pt-[6.62rem] pb-[7rem] md:x-[pt-[12.55rem],pb-[13rem]] lg:x-[pt-[16rem],pb-[19.5rem]]',
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
                                '[&_*]:!size-[2.0625rem] md:[&_*]:!size-[4.75rem] lg:[&_*]:!size-[5.75rem]',
                                { ['hidden']: videoStarted },
                            )}
                        />
                        <div className={'[&_*]:!size-full size-full'}>
                            <ReactPlayer
                                url={MISC_LINKS.TernKeyDemoEmbed}
                                playing={videoStarted}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className={cn(styles.section, '!bg-transparent')}>
                <div
                    className={cn(styles.content, 'relative z-50 grid gap-x-5xl leading-n  grid-cols-2 sm:grid-cols-1')}
                >
                    <div className={'contents'}>
                        <Image
                            src={PNG_GIRL}
                            alt={'emulator sample'}
                            className={'m-auto w-2/3'}
                        />
                    </div>
                    <div className={'sm:contents'}>
                        <h2
                            className={cn(
                                'font-bold leading-n',
                                'sm:x-[row-start-1,mb-xs,text-center]',
                                'text-documentation md:text-heading-xl lg:text-heading-3xl',
                            )}
                        >
                            Turning Heads
                        </h2>
                        <p
                            className={cn(
                                'mt-xxl  sm:x-[mx-auto,mt-xs,w-2/3]',
                                'text-basic md:text-heading lg:text-heading-xl',
                            )}
                        >
                            Users can write code using the TernKey software and run that code within our online
                            emulator, enabling software developers from any experience level to explore this untapped
                            scape of programming.
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
                        'text-basic lg:text-section-s',
                    )}
                >
                    <h2
                        className={cn(
                            'text-center font-bold leading-n  col-span-3 sm:col-span-1',
                            'text-heading md:text-heading-l lg:text-heading-3xl',
                        )}
                    >
                        Learning Together
                    </h2>
                    <p className={'sm:text-center'}>
                        <span className={'block  text-heading  lg:text-section-xl'}>Fostering Collaboration</span>
                        <span className={'mt-5xs block'}>
                            TernKey enhances developer collaboration through Explore Keys, a comprehensive database of
                            TernKey programs, known as Keys. This platform connects users with software developers
                            globally, fostering an open and dynamic environment for learning, sharing, and growth.
                        </span>
                        <PageLink
                            isExternal
                            href={MISC_LINKS.TernKeyExploreKeys}
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
                    <h2 className={'font-bold sm:x-[text-center,text-heading] md:text-heading-l lg:text-heading-xl'}>
                        Features
                    </h2>
                    <ul
                        className={cn(
                            'grid gap-3xl mx-auto  grid-cols-3 sm:grid-cols-1',
                            'w-fit lg:w-full',
                            'mt-3xl md:mt-[4.75rem] lg:mt-5xl',
                        )}
                    >
                        {TilesLi}
                    </ul>
                </div>
            </section>
            <section className={styles.section}>
                <div className={cn(styles.content, 'py-5xl')}>
                    <h2 className={'text-heading-3xl  font-bold  sm:text-heading  md:text-heading-xl'}>Get Started</h2>
                    <div className={'flex flex-wrap gap-xl text-basic  mt-3xl sm:mt-xl'}>
                        {/*TODO links*/}
                        <PageLink
                            isExternal
                            href={MISC_LINKS.TernKey}
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
                className={'mb-7xl md:mb-[9.34rem] lg:mb-[12.51rem]'}
            >
                More ways to explore
            </ResourcesSection>
        </>
    );
}

export default TernKeyPage;
