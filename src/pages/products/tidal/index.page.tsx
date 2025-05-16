'use client';

import { ReactElement, useRef } from 'react';
import Image, { StaticImageData } from 'next/image';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { ResourceSectionData } from '@/app/types/layout';
import { MISC_LINKS, Route } from '@/app/static';

import { Button } from '@/app/ui/form';
import { PageLink } from '@/app/ui/layout';
import { Content, H1, H2, H3, Section } from '@/app/ui/atoms';
import { Video } from '@/app/ui/organisms';
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
import { useNavigate } from '@/app/hooks';

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
    { Node: <PageLink href={Route.TidalPlans}>Pricing</PageLink> },
    { Node: <PageLink href={Route.TidalFAQs}>Help & FAQs</PageLink> },
    { Node: <PageLink href={Route.Documentation} /> },
];

const BTN_ICON = 'ml-xl size-5xs';

const BTN_CN = 'px-n  h-button-l  md:h-button-xl  lg:h-button-xxl';
const BTN_BLUE_CN = BTN_CN + ' bg-blue';
const BTN_BLACK_CN = BTN_CN + ' border-s border-gray-l0 bg-black text-blue';

function TidalPage() {
    const demoSectionRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLDivElement | null>(null);
    const [navigate] = useNavigate();

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
            <Section
                type={'full-screen'}
                background={{ image: PNG_BACKGROUND_MAIN, gradient: 'left' }}
                className={{
                    content: 'relative z-10 content-center  sm:pt-3xl pt-5xl  sm:pb-6xl-1 pb-6xl',
                }}
            >
                <H1 className={'sm:!text-64'}>TIDAL</H1>
                <Image
                    src={SVG_TIDAL}
                    alt={'logo'}
                    className={cn('h-auto min-w-[11.812rem]  w-[20.4%] lg:w-[15.2%]  sm:my-6xl-1 my-3xl')}
                />
                <H2 className={'!text-32 lg:!text-40'}>Do more with more</H2>
                <div className={cn('flex flex-wrap gap-x-l gap-y-xs text-nowrap text-21  mt-n md:mt-xxl lg:mt-xl')}>
                    <PageLink
                        external
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
            </Section>
            <Content type={'long-to-bottom'}>
                <Section
                    background={{ image: PNG_BACKGROUND_CIRCUIT }}
                    className={{ content: cn('py-4xl md:py-[7.81em] lg:py-6xl', 'text-16 md:text-14 lg:text-40') }}
                >
                    <H3
                        type={'extra-large'}
                        className={'mx-auto text-center font-bold  w-2/3 sm:w-full'}
                    >
                        Tidal is the World&apos;s First Ternary Software Stack
                    </H3>
                    <p className={'mt-6xl-1 sm:mt-xxl  text-16 md:text-30 lg:text-40'}>
                        We are driving the evolution from binary to ternary computing. By harnessing the superior data
                        density and efficiency of ternary logic, Tidal provides developers with an innovative platform
                        to redefine programming paradigms and unlock new computational possibilities.
                    </p>
                    <div className={'relative'}>
                        <ReactSVG
                            onClick={() =>
                                videoRef.current?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center',
                                })
                            }
                            src={SVG_PLAY.src}
                            className={'absolute left-1/2 -translate-x-1/2 bottom-[31.5%] cursor-pointer'}
                        />
                        <Image
                            src={PNG_EMULATOR_SAMPLE}
                            alt={'emulator sample'}
                            className={'h-auto w-full  mt-5xl md:mt-6xl-1 lg:mt-6xl'}
                        />
                    </div>
                    <p className={'mt-xxl md:mt-6xl-1 lg:mt-6xl'}>
                        This specialized sandbox environment is designed to support languages engineered specifically
                        for ternary logic computation. At its core is G, a sophisticated high-level language
                        structurally reminiscent of C, enabling a seamless adaptation for developers familiar with
                        conventional programming.
                    </p>
                    <div className={'mt-xl md:mt-4xl lg:mt-5xl'}>
                        <Button
                            onClick={() => navigate(Route.GDoc)}
                            className={cn(BTN_BLACK_CN, 'text-21 sm:text-16')}
                        >
                            G Handbook
                        </Button>
                    </div>
                </Section>
                <Section
                    className={{
                        section: cn(
                            styles.sectionShadowBlack,
                            'py-6xl-1 md:pt-[12.55rem] lg:pt-[16rem]',
                            'md:pb-[13rem] lg:pb-[19.5rem]',
                        ),
                        content: cn(styles.contentHighlight, 'lg:h-[39.5rem]'),
                    }}
                >
                    <Video
                        ref={videoRef}
                        url={MISC_LINKS.TidalDemoEmbed}
                        className={'size-full lg:w-auto'}
                    />
                </Section>
                <Section className={{ content: 'grid gap-x-5xl  grid-cols-2 sm:grid-cols-1' }}>
                    <div className={'contents'}>
                        <Image
                            src={PNG_GIRL}
                            alt={'emulator sample'}
                            className={'m-auto w-[20.9375rem] md:w-[22.0625rem] lg:w-[38.6875rem]'}
                        />
                    </div>
                    <div className={'sm:contents  my-auto'}>
                        <h2
                            className={cn(
                                'font-bold leading-n',
                                'sm:x-[row-start-1,mb-xs]',
                                'text-24 md:text-40 lg:text-64',
                            )}
                        >
                            Turning Heads
                        </h2>
                        <p className={cn('mt-xxl  sm:x-[mx-auto,mt-xs]', 'text-16 md:text-27 lg:text-40')}>
                            Users can write code using the Tidal software and run that code within our online emulator,
                            enabling software developers from any experience level to explore this untapped scape of
                            programming.
                        </p>
                    </div>
                </Section>
                <Section
                    className={{
                        content: cn(
                            styles.contentGradientBlue,
                            'grid max-h-min grid-cols-[1fr,1fr,max-content] gap-y-5xl leading-n',
                            'sm:x-[grid-cols-1,w-2/3,justify-items-center]',
                            'py-6xl md:x-[pt-[16.81rem],pb-[20.69rem]] lg:x-[pt-[19.25rem],pb-[21.56rem]]',
                        ),
                    }}
                >
                    <H3
                        type={'huge'}
                        className={'text-center font-bold  col-span-3 sm:col-span-1'}
                    >
                        Learning Together
                    </H3>
                    <div className={'sm:text-center  text-16 lg:text-18'}>
                        <span className={'block  text-27  lg:text-32'}>Fostering Collaboration</span>
                        <span className={'mt-5xs block'}>
                            Tidal enhances developer collaboration through Explore Keys, a comprehensive database of
                            Tidal programs, known as Keys. This platform connects users with software developers
                            globally, fostering an open and dynamic environment for learning, sharing, and growth.
                        </span>
                        <PageLink
                            external
                            href={MISC_LINKS.TidalExploreKeys}
                            className={cn(BTN_BLUE_CN, 'mt-n')}
                        >
                            Explore keys
                        </PageLink>
                    </div>
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
                </Section>
                <Section className={{ content: 'py-6xl' }}>
                    <H3
                        type={'large'}
                        className={'font-bold sm:text-center  sm:!text-27 md:!text-36'}
                    >
                        Features
                    </H3>
                    <ul
                        className={cn(
                            'grid gap-3xl mx-auto  grid-cols-3 sm:grid-cols-1',
                            'w-fit lg:w-full',
                            'mt-3xl md:mt-5xl lg:mt-5xl',
                        )}
                    >
                        {TilesLi}
                    </ul>
                </Section>
                <Section className={{ content: 'py-5xl' }}>
                    <H3
                        type={'huge'}
                        className={'font-bold  sm:!text-27 lg:!text-64'}
                    >
                        Get Started
                    </H3>
                    <div className={'flex flex-wrap gap-xl text-16  mt-3xl sm:mt-xl'}>
                        {/*TODO links*/}
                        <PageLink
                            external
                            href={MISC_LINKS.Tidal}
                            icon={'arrow-right-long'}
                            className={cn(BTN_BLUE_CN, ' !h-button-xxl flex-row-reverse')}
                            iconClassName={BTN_ICON}
                        >
                            Try Pro trial at no cost
                        </PageLink>
                        {/*TODO link*/}
                        <PageLink
                            href={''}
                            icon={'calendar'}
                            className={cn(BTN_BLACK_CN, ' !h-button-xxl flex-row-reverse text-primary !border-blue')}
                            iconClassName={BTN_ICON}
                        >
                            Book a meeting
                        </PageLink>
                    </div>
                </Section>
                <ResourcesSection
                    data={RESOURCES}
                    className={'mb-7xl md:mb-7xl lg:mb-[12.51rem]'}
                >
                    More ways to explore
                </ResourcesSection>
            </Content>
        </>
    );
}

export default TidalPage;
