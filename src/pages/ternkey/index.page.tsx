'use client';

import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { Article } from '@/app/types/blog';
import { Breakpoint } from '@/app/hooks/useBreakpointCheck';
import { MISC_LINKS } from '@/app/static';

import { BlogService } from '@/app/services/blog.service';

import { useBreakpointCheck } from '@/app/hooks';
import { useModal, useUser } from '@/app/context';

import { Button } from '@/app/ui/form';
import { PageLink } from '@/app/ui/layout';
import { MessageModal } from '@/app/ui/modals';
import { MainBackground } from '@/app/ui/atoms';
import { ArticleCardLi } from '@/app/ui/templates';

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


type Tiles = {
    title: string;
    description: string;
    image: StaticImageData;
}


const TILES: Tiles[] = [
    {
        title: 'Universal Login',
        description: 'Use the same login for the website for all of our products and services including TernKey. One account and you’re free to experiment.',
        image: SVG_TILE_PROFILE,
    },
    {
        title: 'Universal Login',
        description: 'Use the same login for the website for all of our products and services including TernKey. One account and you’re free to experiment.',
        image: SVG_TILE_STAR,
    },
    {
        title: 'Universal Login',
        description: 'Use the same login for the website for all of our products and services including TernKey. One account and you’re free to experiment.',
        image: SVG_TILE_GLASS,
    },
    {
        title: 'Universal Login',
        description: 'Use the same login for the website for all of our products and services including TernKey. One account and you’re free to experiment.',
        image: SVG_TILE_SHARE,
    },
    {
        title: 'Universal Login',
        description: 'Use the same login for the website for all of our products and services including TernKey. One account and you’re free to experiment.',
        image: SVG_TILE_SAVE,
    },
    {
        title: 'Universal Login',
        description: 'Use the same login for the website for all of our products and services including TernKey. One account and you’re free to experiment.',
        image: SVG_TILE_HEART,
    },
];

const RELATED_CARDS_COUNT = 4;

// TODO neo->gothic


const BTN_CN = 'px-n  h-button-xxl  md:h-button-xl  sm:h-button-l';
const BTN_BLUE_CN = BTN_CN + ' bg-blue';
const BTN_BLACK_CN = BTN_CN + ' border-s border-gray-l0 bg-black text-blue';


function TernKeyPage() {
    const isLg = useBreakpointCheck() === Breakpoint.lg;
    const modalCtx = useModal();
    const userCtx = useUser();

    const [news, setNews] = useState<Article[]>([]);

    const demoSectionRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        const fetchNews = async () => {
            try {
                const { payload } = await BlogService.getArticles();
                setNews(payload.blogs.slice(0, RELATED_CARDS_COUNT));
            } catch (error: unknown) {
                if (typeof error === 'string')
                    modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        };
        fetchNews();
    }, []);


    // Elements
    const TilesLi: ReactElement[] = TILES.map((tile, idx) => (
        <li
            key={tile.title + idx}
            className={'flex flex-col max-w-[13.75rem] text-section'}
        >
            <ReactSVG src={tile.image.src}
                      className={'[&_*]:size-[6.25rem]  md:[&_*]:size-[4.375rem]  sm:[&_*]:x-[mx-auto,size-[2.5rem]]'} />
            <span className={'mt-s mb-5xs block font-bold'}>{tile.title}</span>
            <span>{tile.description}</span>
        </li>
    ));

    const NewsLi: ReactElement[] = news
        .slice(0, RELATED_CARDS_COUNT - +isLg)
        .map((article, idx) =>
            <ArticleCardLi key={article.id + idx} article={article} />,
        );


    const ternKeyUrl = MISC_LINKS.TernKey + (userCtx.token ? `/?website_login=${encodeURIComponent(userCtx.token)}` : '');

    return (
        <>
            <MainBackground url={PNG_BACKGROUND_MAIN} />
            <div className={'relative z-10'}>
                <section className={cn(styles.section, styles.fullHeightSection, styles.sectionShadowBlue)}>
                    <div className={cn(styles.content, 'content-center')}>
                        <div className={'pt-5xl pb-6xl  sm:x-[pt-l,pb-5xl]'}>
                            <h1 className={'text-heading-3xl  lg:text-heading-4xl'}>TernKey</h1>
                            <Image src={SVG_TERNKEY} alt={'logo'} className={'my-3xl w-[13.687rem] h-auto'} />
                            <p className={'text-section-xl  lg:text-heading-xl'}>Unlocking the potential of ternary
                                programming</p>
                            <div className={'mt-[2.31rem] text-heading-s'}>
                                <PageLink
                                    isExternal
                                    href={ternKeyUrl}
                                    className={cn(BTN_BLUE_CN, 'mr-l !h-button-xxl text-black')}
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
                        className={cn(styles.content, 'relative z-50 leading-n',
                            'pt-6xl pb-[17rem] text-heading-xl',
                            'md:x-[pt-[7.81em],pb-[12.55rem],text-section-xs]',
                            'sm:x-[pt-4xl,pb-[6.63rem],text-basic]',
                        )}
                    >
                        <h2 className={'mx-auto w-2/3 text-center font-bold leading-n  text-heading-3xl  md:text-heading-xxl  sm:text-heading'}>
                            TernKey is the World’s First Ternary Software Stack
                        </h2>
                        <p className={'mt-[6rem]  sm:mt-xxl'}>
                            We are driving the evolution from binary to ternary computing. By harnessing the
                            superior
                            data density and efficiency of ternary logic, TernKey provides developers with an
                            innovative
                            platform to redefine programming paradigms and unlock new computational possibilities.
                        </p>
                        <div className={'contents'}>
                            <Image
                                src={PNG_EMULATOR_SAMPLE}
                                alt={'emulator sample'}
                                className={'w-full h-auto  my-[7.56rem]  md:my-[6rem]  sm:my-xxl'}
                            />
                        </div>
                        <p>
                            This specialized sandbox environment is designed to support languages engineered
                            specifically for ternary logic computation. At its core is G, a sophisticated high-level
                            language structurally reminiscent of C, enabling a seamless adaptation for developers
                            familiar with conventional programming.
                        </p>
                        <div className={'mt-4xl  sm:mt-[2.25rem]'}>
                            <Button
                                onClick={() => demoSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                className={cn(BTN_BLACK_CN, 'text-heading-s  sm:text-basic')}
                            >
                                G Handbook
                            </Button>
                        </div>
                    </div>
                </section>
                <section ref={demoSectionRef} className={cn(styles.section, styles.sectionShadowBlack)}>
                    <div
                        className={cn(styles.content, styles.contentHighlight, 'relative z-10 py-6xl text-heading-xl leading-n')}
                    >
                        <iframe
                            allowFullScreen
                            src={MISC_LINKS.TernKeyDemoEmbed}
                            title={'TernKey demo'}
                            allow={'accelerometer; autoplay; clipboardwrite; encryptedmedia; gyroscope; pictureinpicture; webshare'}
                            referrerPolicy={'strict-origin-when-cross-origin'}
                            className={'w-full max-h-[42.886rem] h-[50dvw]'}
                        />
                    </div>
                </section>
                <section className={styles.section}>
                    <div
                        className={cn(styles.content,
                            'relative z-10 grid gap-x-5xl py-6xl leading-n  grid-cols-2  sm:grid-cols-1',
                        )}
                    >
                        <div className={'contents'}>
                            <Image src={PNG_GIRL} alt={'emulator sample'} className={'m-auto w-2/3'} />
                        </div>
                        <div className={'sm:contents'}>
                            <h2 className={'font-bold leading-n  text-heading-3xl  md:text-heading-xl  sm:x-[row-start-1,mb-xs,text-center,text-documentation]'}>
                                Turning Heads
                            </h2>
                            <p className={'mt-xxl text-heading-xl  md:text-heading  sm:x-[mx-auto,mt-xs,w-2/3,text-basic]'}>
                                Users can write code using the TernKey software and run that code within our online
                                emulator, enabling software developers from any experience level to explore this
                                untapped
                                scape of programming.
                            </p>
                        </div>
                    </div>
                </section>
                <section className={styles.section}>
                    <div
                        className={cn(styles.content, 'grid grid-cols-[1fr,1fr,max-content] max-h-min gap-y-5xl py-7xl leading-n',
                            'text-basic',
                            'lg:text-section-s',
                            'sm:x-[grid-cols-1,w-2/3,justify-items-center]',
                        )}
                    >
                        <h2 className={'text-center font-bold leading-n  col-span-3 text-heading-3xl  md:text-heading-l  sm:x-[col-span-1,text-heading]'}>
                            Learning Together
                        </h2>
                        <p className={'sm:text-center'}>
                            <span className={'block  text-heading  lg:text-[2rem]'}>Fostering Collaboration</span>
                            <span className={'block mt-5xs'}>
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
                                className={'mt-auto ml-auto h-[13.5rem] w-auto  col-start-3  sm:x-[row-start-2,col-start-1,ml-0]'}
                            />
                        </div>
                    </div>
                </section>
                <section className={styles.section}>
                    <div className={cn(styles.content, 'py-6xl')}>
                        <h2 className={'font-bold  text-heading-xl  md:text-heading-l  sm:x-[text-center,text-heading]'}>
                            Features
                        </h2>
                        <ul className={'grid gap-3xl mx-auto mt-5xl w-fit  grid-cols-3  lg:w-full  sm:grid-cols-1'}>
                            {TilesLi}
                        </ul>
                    </div>
                </section>
                <section className={styles.section}>
                    <div className={cn(styles.content, 'py-5xl')}>
                        <h2 className={'font-bold  text-heading-3xl  md:text-heading-xl  sm:text-heading'}>
                            Latest News
                        </h2>
                        <ul className={'grid gap-3xl mx-auto mt-5xl w-fit  grid-cols-3  lg:w-full  md:grid-cols-2  sm:grid-cols-1'}>
                            {NewsLi}
                        </ul>
                    </div>
                </section>
            </div>
        </>
    );
}


export default TernKeyPage;
