'use client';

import { ReactElement, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image, { StaticImageData } from 'next/image';
import cn from 'classnames';

import { InfoSectionData } from '@/app/types/layout';

import { CONTACT_LINKS, MEDIA_LINKS, MISC_LINKS, Route, SearchParamsEnum } from '@/app/static';

import { useBackground, useFlow, useLoginCheck, useModal } from '@/app/hooks';

import { ResetPasswordModal } from '@/app/ui/modals';
import { MainBackground } from '@/app/ui/atoms';
import { Carousel } from '@/app/ui/organisms';
import { PageLink } from '@/app/ui/layout';
import { InfoSection, InsideTernSection } from '@/app/ui/templates';

import styles from '@/app/common.module.css';

import SVG_CITY from '@/assets/images/city-glowing-way.jpg';
import SVG_MICROPROCESSOR from '@/assets/images/microprocessor.png';
import SVG_NATURE from '@/assets/images/nature.png';
import SVG_CIRCUIT from '@/assets/images/microchip.png';

//commenting or automation testing

const CARDS: {
    title: string;
    info: string;
    image: StaticImageData;
    link: { title: string; href: Route.AllWays | string };
}[] = [
    {
        title: 'Your Tern',
        info: 'Join team Tern as they discuss how the current state of chip technology with team members and other guests.',
        link: { title: 'Listen to Podcast', href: MEDIA_LINKS.YouTube.href },
        image: SVG_CITY,
    },
    {
        title: 'All Ways',
        info: 'Keep up with us by reading our daily blog where we highlight the hottest topics in computer technology.',
        link: { title: 'Read Blog', href: Route.AllWays },
        image: SVG_MICROPROCESSOR,
    },
    {
        title: 'One Team',
        info: 'We focus on fostering community around our mission and vision. Join our online community to be apart of the next technological revolution!',
        link: { title: 'Join Community', href: CONTACT_LINKS.Discord.href },
        image: SVG_NATURE,
    },
];

const INFO: InfoSectionData = {
    title: 'Building the Ternary Microprocessor',
    image: SVG_CIRCUIT,
    subTitle: 'Imperative Paradigm Shift',
    link: Route.Documentation,
    linkTitle: 'Review Documentation',
    description:
        'AI is here to stay, and it’s crucial to ensure we meet the growing demand for energy consumption. Our advanced microprocessor designs serve as the catalyst for the next technological revolution in computing.',
};

const BTN_CN = 'px-s h-button-l  lg:h-button-xxl';

// const PARAGRAPHS: string[] = [
//     "We abide by the following doctrine, which outlines our core ideology's six core values and exclusive purpose. We look for consistency, earnestness, acumen, flexibility, obsession, and ingenuity in each constituent we interact with. These six values, defined as follows, outline our organization's expectations and illustrate the characteristics we respect and adhere to.",
//     "Consistency is conveyed through established dependability and predictability of character, stemming from unwavering commitment to their purpose Earnestness inspires sincere and intense conviction, sustained by a strongly formed belief in one’s principles Acumen produces sound judgments and quick decisions, bolstered by an unwavering confidence in one’s expertise and abilities. Flexibility increases the propensity to bend easily without breaking and is derived from frequently maintaining an open mind Obsession provokes fanatical attention to detail past the point of rationality but stems from a place of deep, unapologetic love. Ingenuity encapsulates cleverness, originality, and inventiveness, originating from resolute passion.",
//     "While our values may serve as a general guide for the characteristics sought by groups and individuals, our purpose encapsulates an exacting and eternal meaning for our company's existence.. The overarching perpetual driving purpose of Tern is to develop, manufacture, preserve, and enhance fundamental computer software and hardware, emphasizing universal efficiency across all processes. This ideology serves as our organization’s moral compass. We aim to pursue these values and purpose everlastingly.",
// ];

function HomePage() {
    const params = useSearchParams();
    const modalCtx = useModal();
    const flowCtx = useFlow();
    const bgSrc = useBackground();
    useLoginCheck();

    useEffect(() => {
        const token = params?.get(SearchParamsEnum.token);
        if (token && !modalCtx.isOpened) return modalCtx.openModal(<ResetPasswordModal token={token} />);
        flowCtx.next()?.();
    }, [params?.size]);

    // const Paragraphs = PARAGRAPHS.map((p, idx) => <p key={p.slice(5) + idx}>{p}</p>)

    const CardsLi: ReactElement[] = CARDS.map((card, idx) => (
        <li
            key={card.title + idx}
            className={
                'relative flex h-full flex-col overflow-hidden border-s border-white-d0 text-center  md:max-w-[22rem]'
            }
        >
            <div className={'relative -z-10 h-[14.125rem] w-full'}>
                <div className={'absolute bg-gradient-to-t from-black to-transparent to-30%'} />
                <Image
                    width={500}
                    height={500}
                    src={card.image.src}
                    alt={card.image.src}
                    className={'h-full w-full object-cover'}
                />
            </div>
            <div
                className={cn(
                    'flex flex-grow flex-col items-center justify-between p-xs pt-n leading-n',
                    'pb-xl',
                    'sm:pb-n',
                )}
            >
                <h4 className={cn('sm:text-24 text-27 font-bold')}>{card.title}</h4>
                <p className={'mt-n'}>{card.info}</p>
                <PageLink
                    href={card.link.href}
                    isExternal={card.link.href.startsWith('https://')}
                    className={cn(
                        'mt-xs  h-button-xl w-fit text-nowrap border-s border-gray-l0 px-xs text-blue',
                        'text-18',
                        'md:text-16',
                        'sm:mt-xl',
                    )}
                >
                    {card.link.title}
                </PageLink>
            </div>
        </li>
    ));

    return (
        <>
            <div className={'relative z-10'}>
                <section className={cn(styles.section, styles.fullHeightSection)}>
                    <MainBackground
                        url={bgSrc}
                        className={styles.sectionInsetShadowBlack}
                    />
                    <div className={cn(styles.content, 'relative z-10 flex items-center justify-center')}>
                        <div>
                            <h1
                                className={cn(
                                    `text-center leading-n`,
                                    `mb-n text-64`,
                                    `md:text-48`,
                                    `sm:x-[mb-xs,text-36]`,
                                )}
                            >
                                We Design Advanced Semiconductors
                            </h1>
                            <p
                                className={
                                    'flex flex-wrap justify-center gap-s text-nowrap text-16 lg:x-[gap-x-xl,text-21]'
                                }
                            >
                                <PageLink
                                    isExternal
                                    href={MISC_LINKS.Tidal}
                                    className={cn(BTN_CN, 'bg-blue text-black')}
                                >
                                    Discover Tern
                                </PageLink>
                                <PageLink
                                    isExternal
                                    href={MISC_LINKS.TidalDemo}
                                    className={cn(BTN_CN, 'h-button-l border-n border-gray-l0 bg-black text-blue')}
                                >
                                    Watch Demo
                                </PageLink>
                            </p>
                        </div>
                    </div>
                </section>
                <section className={cn(styles.section, styles.fullHeightSection)}>
                    <div
                        className={cn(
                            styles.content,
                            'flex flex-col',
                            'sm:pt-xl pt-5xl',
                            'pb-7xl md:pb-[16rem] lg:pb-[20rem]',
                        )}
                    >
                        <h2
                            className={cn(
                                'text-center font-[500]',
                                'sm:leading-l leading-relaxed',
                                'text-24 md:text-48 lg:text-48',
                            )}
                        >
                            <span>There’s Always a Better Way</span>
                            <span className={'block text-blue'}>All Ways</span>
                        </h2>
                        <Carousel
                            className={'lg:contents'}
                            classNameUl={cn(
                                'grid-cols-[repeat(3,22rem)]',
                                'lg:max-h-[30.3125rem]',
                                'sm:!h-fit sm:grid-cols-[minmax(0,21rem)]',
                            )}
                            classNameArrow={'hidden  md:block'}
                        >
                            {CardsLi}
                        </Carousel>
                    </div>
                </section>
                <section
                    className={cn(
                        styles.section,
                        'from-green bg-gradient-to-t via-[#0a313a] to-transparent',
                        'pb-[19rem] md:pb-[21rem] lg:pb-[24rem]',
                    )}
                >
                    <div className={styles.content}>
                        <p
                            className={cn(
                                'text-left font-bold leading-n',
                                'text-20 md:text-24 lg:text-32',
                                'sm:mt-[10.5rem] mt-auto',
                                'sm:w-full w-[82%]',
                            )}
                        >
                            Amidst the most demanding era of computational energy in history, we are reminded,
                        </p>
                        <h2
                            className={cn(
                                'my-3xl text-center font-arial font-bold italic',
                                'text-80',
                                'md:text-64',
                                'sm:text-30',
                            )}
                        >
                            the world is not binary
                        </h2>
                        <p className={'text-right text-32 font-bold sm:text-20 md:text-24'}>
                            and neither is the future.
                        </p>
                    </div>
                </section>
                <InfoSection
                    blur
                    data={INFO}
                    classNameContent='mb-[15rem]'
                />
                <InsideTernSection className={'!bg-transparent'} />
            </div>
        </>
    );
}

export default HomePage;
