'use client';

import React, { FC, ReactElement, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { StaticImageData } from 'next/image';
import cn from 'classnames';

import { InfoSection, SectionCard } from '@/app/types/layout';

import { CONTACT_LINKS, MEDIA_LINKS, MISC_LINKS, Route } from '@/app/static';

import { useBackground, useLoginCheck } from '@/app/hooks';
import { useFlow, useModal } from '@/app/context';

import { ResetPasswordModal } from '@/app/ui/modals';
import { Carousel } from '@/app/ui/misc';
import { PageLink } from '@/app/ui/layout';
import { Info, InsideTern } from '@/app/ui/templates';

import styles from '@/app/common.module.css';

import SVG_CITY from '/public/images/city-glowing-way.jpg';
import SVG_MICROPROCESSOR from '/public/images/microprocessor.png';
import SVG_NATURE from '/public/images/nature.png';
import SVG_OFFICE_GIRL_1 from '/public/images/office-girl-2.png';
import SVG_OFFICE_GIRL_2 from '/public/images/office-girl-1.png';
import SVG_CIRCUIT from '/public/images/microchip.png';


const CARDS: {
    title: string;
    info: string;
    image: StaticImageData;
    link: { title: string; href: Route.AllWays | string }
}[] = [
    {
        title: 'Your Tern',
        info: 'Join team Tern as they discuss how the current state of chip technology with team members and other guests.',
        link: {title: 'Listen to Podcast', href: MEDIA_LINKS.YouTube.href},
        image: SVG_CITY,
    },
    {
        title: 'All Ways',
        info: 'Keep up with us by reading our daily blog where we highlight the hottest topics in computer technology.',
        link: {title: 'Read Blog', href: Route.AllWays},
        image: SVG_MICROPROCESSOR,
    },
    {
        title: 'One Team',
        info: 'We focus on fostering community around our mission and vision. Join our online community to be apart of the next technological revolution!',
        link: {title: 'Join Community', href: CONTACT_LINKS.Discord.href},
        image: SVG_NATURE,
    },
];

const INFO: InfoSection = {
    title: 'Building the Ternary Microprocessor',
    image: SVG_CIRCUIT,
    subTitle: 'Imperative Paradigm Shift',
    link: Route.Documentation,
    linkTitle: 'Review Documentation',
    description: 'AI is here to stay, and it’s crucial to ensure we meet the growing demand for energy consumption. Our advanced microprocessor designs serve as the catalyst for the next technological revolution in computing.',
}

const COMPANY: SectionCard[] = [
    {
        title: 'Tern Careers',
        description: 'Become a ternster',
        action: 'Explore Jobs',
        href: MISC_LINKS.Careers,
        icon: SVG_OFFICE_GIRL_1,
        btnIcon: 'arrow',
        btnIconCN: 'rotate-180',
    },
    {
        title: 'Tern Academy',
        description: 'Explore Learning Opportunities',
        action: 'Start Learning',
        href: MEDIA_LINKS.YouTube.href,
        icon: SVG_OFFICE_GIRL_2,
        btnIcon: 'arrow-square',
    },
];


// const PARAGRAPHS: string[] = [
//     "We abide by the following doctrine, which outlines our core ideology's six core values and exclusive purpose. We look for consistency, earnestness, acumen, flexibility, obsession, and ingenuity in each constituent we interact with. These six values, defined as follows, outline our organization's expectations and illustrate the characteristics we respect and adhere to.",
//     "Consistency is conveyed through established dependability and predictability of character, stemming from unwavering commitment to their purpose Earnestness inspires sincere and intense conviction, sustained by a strongly formed belief in one’s principles Acumen produces sound judgments and quick decisions, bolstered by an unwavering confidence in one’s expertise and abilities. Flexibility increases the propensity to bend easily without breaking and is derived from frequently maintaining an open mind Obsession provokes fanatical attention to detail past the point of rationality but stems from a place of deep, unapologetic love. Ingenuity encapsulates cleverness, originality, and inventiveness, originating from resolute passion.",
//     "While our values may serve as a general guide for the characteristics sought by groups and individuals, our purpose encapsulates an exacting and eternal meaning for our company's existence.. The overarching perpetual driving purpose of Tern is to develop, manufacture, preserve, and enhance fundamental computer software and hardware, emphasizing universal efficiency across all processes. This ideology serves as our organization’s moral compass. We aim to pursue these values and purpose everlastingly.",
// ];


const HomePage: FC = () => {
    const params = useSearchParams();
    const modalCtx = useModal();
    const flowCtx = useFlow();
    const bgSrc = useBackground();
    useLoginCheck();


    useEffect(() => {
        const token = params?.get('resetToken');
        if (token && !modalCtx.isOpened)
            return modalCtx.openModal(<ResetPasswordModal token={token}/>);
        flowCtx.next()?.();
        //eslint-disable-next-line
    }, [params?.size])


    // const Paragraphs = PARAGRAPHS.map((p, idx) => <p key={p.slice(5) + idx}>{p}</p>)

    const CardsLi: ReactElement[] = CARDS.map((card, idx) => (
        <li
            key={card.title + idx}
            className={'flex flex-col h-full overflow-hidden rounded-normal border-normal border-control-white-d0 text-center'}
        >
            <div
                style={{backgroundImage: `url("${card.image.src}")`}}
                className={cn(
                    'flex h-[14.125rem] w-[calc(100%-2px)] justify-center items-end',
                    'bg-cover bg-center bg-no-repeat',
                )}
            >
                <div className={'pb-[--p-content-4xs] w-full bg-gradient-to-b from-transparent to-black'}>
                    <h4 className={cn(styles.textGlow, 'text-heading font-oxygen font-bold')}>
                        {card.title}
                    </h4>
                </div>
            </div>
            <div
                className={cn(
                    'flex-grow flex flex-col p-[--p-content-xs] justify-between items-center leading-[1.2]',
                    'pb-[--p-content-xl]',
                    'sm:pb-[--p-content]',
                )}
            >
                <p>{card.info}</p>
                <PageLink
                    href={card.link.href}
                    isExternal={card.link.href.startsWith('https://')}
                    className={cn(
                        'px-[--p-content-xs] w-fit h-[2.375rem] rounded-full border-small border-control-gray-l0 text-blue',
                        'text-section-s',
                        'md:text-basic',
                        'sm:mt-[--p-content-xl]',
                    )}
                >
                    {card.link.title}
                </PageLink>
            </div>
        </li>
    ));

    return (
        <>
            <div
                style={{backgroundImage: `url("${bgSrc}")`}}
                className={'absolute top-0 left-0 w-dvw max-w-dwv h-screen max-h-[100rem] bg-cover bg-center bg-no-repeat'}
            />
            <div className={'relative z-10'}>
                <section className={cn(styles.section, styles.fullHeightSection)}>
                    <div className={cn(styles.content, 'flex justify-center items-center')}>
                        <div>
                            <h1
                                className={cn(styles.textGlow,
                                    `font-oxygen text-center leading-[1.2]`,
                                    `mb-[--p-content] text-[5.0625rem]`,
                                    `md:text-[3.4375rem]`,
                                    `sm:x-[mb-[--p-content-xs],text-[2.9375rem]]`,
                                )}
                            >
                                <span>
                                <span>The Future of&nbsp;</span>
                                <span className={cn(styles.textBlueGlow, 'text-blue')}>AI</span></span>
                                <span>&nbsp;is Built on <span className={'font-bold'}>tern</span>
                                </span>
                            </h1>
                            <p className={'flex gap-x-[--p-content-xs] justify-center  text-heading-s  sm:text-basic'}>
                                <PageLink
                                    isExternal
                                    href={MISC_LINKS.TernKey}
                                    className={cn(
                                        'px-[--p-content] h-[3.125rem] rounded-full bg-blue text-black',
                                        'sm:x-[px-[--p-content-xs],h-[1.875rem]]',
                                    )}
                                >
                                    Discover Tern
                                </PageLink>
                                <PageLink
                                    isExternal
                                    href={MISC_LINKS.TernKeyDemo}
                                    className={cn(
                                        'px-[--p-content] h-[3.125rem] rounded-full border-normal border-control-gray-l0',
                                        'bg-black text-blue',
                                        'sm:x-[px-[--p-content-xs],h-[1.875rem]]',
                                    )}
                                >
                                    Watch Demo
                                </PageLink>
                            </p>
                        </div>
                    </div>
                </section>
                <section className={cn(styles.section, styles.fullHeightSection, 'sm:!h-fit')}>
                    <div className={cn(styles.content,
                        'flex flex-col pt-[5rem] gap-y-[3.75rem]',
                        'sm:x-[gap-y-[--p-content-xl],pt-[--p-content-xl]]',
                    )}
                    >
                        <h2
                            className={cn(styles.textGlow,
                                'font-bold font-oxygen text-center text-[2.5rem] leading-[1.2] tracking-[0.1rem]',
                                'md:text-[1.75rem]',
                                'sm:text-[1.1875rem]',
                            )}
                        >
                            <p>Redesigning the Computer from the Inside Out with Tern.</p>
                            <p>All Ways.</p>
                        </h2>
                        <Carousel
                            className={'lg:contents  sm:'}
                            classNameUl={'grid-cols-[repeat(3,22rem)] !h-[30.3125rem]  lg:max-h-[30.3125rem]  sm:grid-cols-[minmax(0,21rem)] sm:!h-fit'}
                            classNameArrow={'hidden  md:block'}
                        >
                            {CardsLi}
                        </Carousel>
                        <p
                            className={cn(styles.textGlow,
                                'mt-auto w-[82%] text-left font-bold leading-[1.2]',
                                'text-[2rem]',
                                'md:text-[1.5rem]',
                                'sm:x-[mt-[10.5rem],text-section]',
                            )}
                        >
                            Amidst the most demanding era of computational energy in history, we are reminded,
                        </p>
                    </div>
                </section>
                <section
                    className={cn(styles.textGlow, styles.section,
                        'bg-gradient-to-t from-[--bg-section-green] via-[#0a313a] to-transparent',
                        'pb-[28rem]',
                        'md:pb-[23rem]',
                    )}
                >
                    <div className={styles.content}>
                        <h2
                            className={cn(
                                'my-[3.75rem] font-arial text-center italic font-bold',
                                'text-[5rem]',
                                'md:text-[4.5rem]',
                                'sm:text-[1.9375rem]',
                            )}
                        >
                            the world is not binary
                        </h2>
                        <p className={'text-right font-bold  text-[2rem]  md:text-[1.5rem]  sm:text-[1.25rem]'}>
                            and neither is the future.
                        </p>
                    </div>
                </section>
                <Info data={INFO} className={'bg-[--bg-section-green]'}/>
                <InsideTern data={COMPANY} className={cn('to-[--bg-section-green]','lg:x-[bg-gradient-to-t,from-black,via-[#0a313a],to-[--bg-section-green]]')}/>
            </div>
        </>
    );
}


export default HomePage;
