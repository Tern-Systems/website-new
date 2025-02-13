'use client';

import React, { FC, ReactElement, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image, { StaticImageData } from 'next/image';
import { ButtonIcon } from '@/app/ui/form/Button';
import cn from 'classnames';

import { InfoSection, SectionCard } from '@/app/types/layout';

import { CONTACT_LINKS, MEDIA_LINKS, MISC_LINKS, Route } from '@/app/static';

import { useBackground, useLoginCheck } from '@/app/hooks';
import { useFlow, useModal } from '@/app/context';

import { ResetPasswordModal } from '@/app/ui/modals';
import { Button } from '@/app/ui/form';
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

const INFO: InfoSection = {
    title: 'Building the Ternary Microprocessor',
    image: SVG_CIRCUIT,
    subTitle: 'Imperative Paradigm Shift',
    link: Route.Documentation,
    linkTitle: 'Review Documentation',
    description:
        'AI is here to stay, and it’s crucial to ensure we meet the growing demand for energy consumption. Our advanced microprocessor designs serve as the catalyst for the next technological revolution in computing.',
};

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
        if (token && !modalCtx.isOpened) return modalCtx.openModal(<ResetPasswordModal token={token} />);
        flowCtx.next()?.();
        //eslint-disable-next-line
    }, [params?.size])


    // const Paragraphs = PARAGRAPHS.map((p, idx) => <p key={p.slice(5) + idx}>{p}</p>)

    const CardsLi: ReactElement[] = CARDS.map((card, idx) => (
        <li
            key={card.title + idx}
            className={
                'flex h-full flex-col overflow-hidden rounded-n border-n border-white-d0 text-center  md:max-w-[22.0625rem]'
            }
        >
            <div
                style={{ backgroundImage: `url("${card.image.src}")` }}
                className={cn(
                    'flex h-[14.125rem] w-[calc(100%-2px)] items-end justify-center',
                    'bg-cover bg-center bg-no-repeat',
                )}
            >
                <div className={'w-full bg-gradient-to-b from-transparent to-black pb-4xs'}>
                    <h4 className={cn(styles.textGlow, 'font-oxygen text-heading font-bold')}>{card.title}</h4>
                </div>
            </div>
            <div
                className={cn(
                    'flex flex-grow flex-col items-center justify-between p-xs leading-n',
                    'pb-xl',
                    'sm:pb-n',
                )}
            >
                <p>{card.info}</p>
                <PageLink
                    href={card.link.href}
                    isExternal={card.link.href.startsWith('https://')}
                    className={cn(
                        'h-button-xl w-fit rounded-full border-s border-gray-l0 px-xs text-blue',
                        'text-section-s',
                        'md:text-basic',
                        'sm:mt-xl',
                    )}
                >
                    {card.link.title}
                </PageLink>
            </div>
        </li>
    ));

    const CompanyLi: ReactElement[] = COMPANY.map((entry, idx) => (
        <li
            key={entry.title + idx}
            className={'flex flex-col gap-y-[--p-content-3xs] text-left'}
        >
            <h4 className={'mb-[0.1rem] text-[0.9375rem] text-placeholder'}>{entry.title}</h4>
            <p>{entry.description}</p>
            <Image
                src={entry.icon}
                alt={'office girl 2'}
                className={'w-full'}
            />
            <Button
                icon={entry.btnIcon}
                onClick={() => window.open(entry.href, '_blank')}
                className={'flex-row-reverse self-start text-blue'}
                classNameIcon={cn('[&_path]:fill-blue-l0', entry.btnIconCN)}
            >
                {entry.action}
            </Button>
        </li>
    ));

    return (
        <>
            <div
                style={{ backgroundImage: `url("${bgSrc}")` }}
                className={
                    'max-w-dwv absolute left-0 top-0 h-screen max-h-[100rem] w-dvw bg-cover bg-center bg-no-repeat'
                }
            />
            <div className={'relative z-10'}>
                <section className={cn(styles.section, styles.fullHeightSection)}>
                    <div className={cn(styles.content, 'flex items-center justify-center')}>
                        <div>
                            <h1
                                className={cn(
                                    styles.textGlow,
                                    `text-center font-oxygen leading-n`,
                                    `mb-n text-[5.0625rem]`,
                                    `md:text-[3.4375rem]`,
                                    `sm:x-[mb-xs,text-[2.9375rem]]`,
                                )}
                            >
                                We Design Advanced Semiconductors
                            </h1>
                            <p className={'flex justify-center gap-x-xs text-heading-s sm:text-basic'}>
                                <PageLink
                                    isExternal
                                    href={MISC_LINKS.TernKey}
                                    className={cn(
                                        'h-[3.125rem] rounded-full bg-blue px-n text-black',
                                        'sm:x-[px-xs,h-button-l]',
                                    )}
                                >
                                    Discover Tern
                                </PageLink>
                                <PageLink
                                    isExternal
                                    href={MISC_LINKS.TernKeyDemo}
                                    className={cn(
                                        'h-[3.125rem] rounded-full border-n border-gray-l0 px-n',
                                        'bg-black text-blue',
                                        'sm:x-[px-xs,h-button-l]',
                                    )}
                                >
                                    Watch Demo
                                </PageLink>
                            </p>
                        </div>
                    </div>
                </section>
                <section className={cn(styles.section, styles.fullHeightSection, 'sm:!h-fit')}>
                    <div
                        className={cn(
                            styles.content,
                            'flex flex-col gap-y-[3.75rem] pt-[5rem]',
                            'sm:x-[gap-y-xl,pt-xl]',
                        )}
                    >
                        <h2
                            className={cn(
                                styles.textGlow,
                                'text-center font-oxygen text-[2.5rem] font-bold leading-n tracking-[0.1rem]',
                                'md:text-[1.75rem]',
                                'sm:text-[1.1875rem]',
                            )}
                        >
                            <span>
                                <span>The Future of&nbsp;</span>
                                <span className={cn(styles.textBlueGlow, 'text-blue')}>AI</span>
                            </span>
                            <span>
                                &nbsp;is Built on <span className={'font-bold'}>tern</span>
                            </span>
                        </h2>
                        <Carousel
                            className={'lg:contents'}
                            classNameUl={
                                'grid-cols-[repeat(3,22rem)] !h-[30.3125rem]  lg:max-h-[30.3125rem]  sm:grid-cols-[minmax(0,21rem)] sm:!h-fit'
                            }
                            classNameArrow={'hidden  md:block'}
                        >
                            {CardsLi}
                        </Carousel>
                        <p
                            className={cn(
                                styles.textGlow,
                                'mt-auto w-[82%] text-left font-bold leading-n',
                                'text-section-xl',
                                'md:text-[1.5rem]',
                                'sm:x-[mt-[10.5rem],text-section]',
                            )}
                        >
                            Amidst the most demanding era of computational energy in history, we are reminded,
                        </p>
                    </div>
                </section>
                <section
                    className={cn(
                        styles.textGlow,
                        styles.section,
                        'from-green bg-gradient-to-t via-[#0a313a] to-transparent',
                        'pb-[28rem]',
                        'md:pb-[23rem]',
                    )}
                >
                    <div className={styles.content}>
                        <h2
                            className={cn(
                                'my-[3.75rem] text-center font-arial font-bold italic',
                                'text-[5rem]',
                                'md:text-[4.5rem]',
                                'sm:text-[1.9375rem]',
                            )}
                        >
                            the world is not binary
                        </h2>
                        <p className={'text-right text-section-xl font-bold sm:text-[1.25rem] md:text-[1.5rem]'}>
                            and neither is the future.
                        </p>
                    </div>
                </section>
                <Info
                    data={INFO}
                    className={cn(
                        'md:h-[401px]',
                        'bg-[radial-gradient(circle,_transparent_0%,_rgba(10,49,58,0.8)_100%)]',
                    )}
                    classNameTitle={
                        'font-oxygen text-center text-[1.75rem] leading-[2.21] tracking-[0.1rem] mt-[-2rem]'
                    }
                    classNameSubTitle={'md:x-[font-oxygen,text-left,text-[1.5rem],leading-[1.8],mt-[-2rem]]'}
                    classNameDescription={'md:x-[font-oxygen,text-left,text-[0.9375rem],leading-[1.40625]]'}
                    classNamePageLink={'!rounded-none'}
                />
                <InsideTern data={COMPANY} />
            </div>
        </>
    );
};

export default HomePage;
