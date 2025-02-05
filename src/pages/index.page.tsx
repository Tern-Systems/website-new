'use client'

import React, {FC, ReactElement, useEffect} from "react";
import {useSearchParams} from "next/navigation";
import Image, {StaticImageData} from "next/image";
import cn from "classnames";

import {useBackground, useBreakpointCheck, useLoginCheck} from "@/app/hooks";
import {useFlow, useModal} from "@/app/context";

import {ResetPasswordModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";

import styles from "@/app/common.module.css";

import SVG_CITY from "/public/images/city-glowing-way.jpg";
import SVG_MICROPROCESSOR from "/public/images/microprocessor.png";
import SVG_NATURE from "/public/images/nature.png";
import SVG_CIRCUIT from '/public/images/circuit.svg'
import SVG_OFFICE_GIRL_1 from '/public/images/office-girl-2.png'
import SVG_OFFICE_GIRL_2 from '/public/images/office-girl-1.png'


const CARDS: { title: string; info: string; image: StaticImageData; link: { title: string; href: string } }[] = [
    {
        title: 'Exec Tech',
        info: 'Join team Tern as they discuss how the current state of chip technology with team members and other guests.',
        link: {title: 'Listen to Podcast', href: 'https://'},
        image: SVG_CITY,
    },
    {
        title: 'All Ways',
        info: 'Keep up with us by reading our daily blog where we highlight the hottest topics in computer technology.',
        link: {title: 'Read Blog', href: 'https://'},
        image: SVG_MICROPROCESSOR,
    },
    {
        title: 'Company Server',
        info: 'We focus on fostering community around our mission and vision. Join our online community to be apart of the next technological revolution!',
        link: {title: 'Join Community', href: 'https://'},
        image: SVG_NATURE,
    },
]

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
    const isLg = useBreakpointCheck() === 'lg';
    useLoginCheck();

    useEffect(() => {
        const token = params?.get('resetToken');
        if (token && !modalCtx.isOpened)
            return modalCtx.openModal(<ResetPasswordModal token={token}/>);
        flowCtx.next()?.();
        //eslint-disable-next-line
    }, [params?.size])

    // const Paragraphs = PARAGRAPHS.map((p, idx) => <p key={p.slice(5) + idx}>{p}</p>)

    const Cards: ReactElement[] = CARDS.map((card, idx) => (
        <li
            key={card.title + idx}
            className={'flex flex-col h-full overflow-hidden rounded-normal border-small border-control-gray-l1'}
        >
            <div
                style={{backgroundImage: `url("${card.image.src}")`}}
                className={cn(
                    'flex h-[14.125rem] justify-center items-end',
                    'bg-cover bg-no-repeat',
                )}
            >
                <div className={'pb-[--p-content-4xs] w-full bg-gradient-to-b from-transparent to-black'}>
                    <h4 className={cn(styles.textGlow, 'text-heading font-oxygen font-bold')}>
                        {card.title}
                    </h4>
                </div>
            </div>
            <div
                className={'flex-grow flex flex-col p-[--p-content-xs] pb-[--p-content-xl] justify-between items-center leading-[1.2]'}>
                <p>{card.info}</p>
                <Button
                    onClick={() => window.open(card.link.href, '_blank')}
                    className={'mt-auto px-[--p-content-xs] w-fit h-[2.375rem] rounded-full border-small border-control-gray-l0 text-blue text-section-s'}
                >
                    {card.link.title}
                </Button>
            </div>
        </li>
    ));

    return (
        <>
            <div
                style={{backgroundImage: `url("${bgSrc}")`}}
                className={'absolute top-0 left-0 w-dvw max-w-dwv h-screen max-h-[100rem] bg-cover bg-center bg-no-repeat'}
            />
            <div className={'w-screen bg-[url("/images/neurons.png")] bg-cover bg-no-repeat bg-fixed'}>
                <div
                    className={cn(
                        'relative z-10 grid auto-rows-min mx-auto justify-items-center max-h-fit',
                        '[&>*]:x-[px-[--p-content-l],w-3/4,max-w-[90rem],min-h-fit]',
                    )}
                >
                    <section
                        className={cn(
                            {[styles.highlight]: !isLg},
                            `h-[100dvh] max-h-[100rem] place-content-center`,
                            `sm:landscape:w-[41dvw]`,
                        )}
                    >
                        <h1
                            className={cn(styles.textGlow,
                                `font-oxygen text-[5.0625rem] text-nowrap`,
                                `mb-[--p-content] text-[6.25rem]`,
                                `sm:x-[mb-[0.94rem]]`,
                                `sm:portrait:text-[3.125rem]`,
                                `sm:landscape:text-[6.2dvw]`
                            )}
                        >
                            <span>The Future of <span className={cn(styles.textBlueGlow, 'text-blue')}>AI</span></span>
                            <span>&nbsp;is Built on <span className={'font-bold'}>tern</span></span>
                        </h1>
                        <p>
                            <Button
                                className={'mr-[--p-content-xs] px-[--p-content] h-[3.125rem] rounded-full bg-blue text-heading-s text-black'}
                            >
                                Discover Tern
                            </Button>
                            <Button
                                className={cn(
                                    'px-[--p-content] h-[3.125rem] rounded-full border-small border-control-gray-l0',
                                    'bg-black text-heading-s text-blue'
                                )}
                            >
                                Watch Demo
                            </Button>
                        </p>
                    </section>
                    {/*<Highlighted*/}
                    {/*    heading={'Our Credo'}*/}
                    {/*    classNameWrapper={'lg:x-[ml-auto,max-h-fit,max-w-full] sm:landscape:max-h-[21.4rem]'}*/}
                    {/*    classNameContentWrapper={'overflow-y-visible'}*/}
                    {/*    className={`sm:text-section-sm*/}
                    {/*        sm:landscape:x-[gap-y-[0.5rem],tracking-[0.05rem]]`}*/}
                    {/*>*/}
                    {/*    {Paragraphs}*/}
                    {/*</Highlighted>*/}
                    <section className={'flex flex-col gap-y-[3.75rem] pt-[5.44rem] justify-between'}>
                        <h2
                            className={cn(styles.textGlow,
                                'font-bold font-oxygen text-nowrap text-[2.5rem] leading-[3rem] tracking-[0.1rem]',
                            )}
                        >
                            <p>Redesigning the Computer from the Inside Out with Tern.</p>
                            <p>All Ways.</p>
                        </h2>
                        <ul className={'grid grid-cols-3 gap-[--p-content-xl] h-[35.3125rem] flex-grow'}>
                            {Cards}
                        </ul>
                        <p
                            className={cn(styles.textGlow,
                                'mt-[13rem] w-[82%] text-left text-[2rem] font-bold leading-[1.2]'
                            )}
                        >
                            Amidst the most demanding era of computational energy in history, we are reminded,
                        </p>
                    </section>
                    <section
                        className={cn(styles.textGlow, '!w-dvw !max-w-[100dvw] p-0 pb-[35rem] bg-gradient-to-t from-[--bg-section-green] via-[#0a313a] to-transparent')}>
                        <div className={'mx-auto px-[--p-content-xl] w-3/4 max-w-[90rem]'}>
                            <h2 className={'my-[3.75rem] font-arial italic text-[5rem] font-bold'}>
                                the world is not binary
                            </h2>
                            <p className={'text-right text-[2rem] font-bold'}>and neither is the future.</p>
                        </div>
                    </section>
                    <section className={'pt-[3.5rem] pb-[12.25rem] !w-dvw !max-w-[100dvw] bg-[--bg-section-green] font-oxygen'}>
                        <div className={'mx-auto px-[--p-content-xl] w-3/4 max-w-[90rem]'}>
                            <h2 className={'mb-[4.62rem] font-bold font-oxygen text-[2.5rem]'}>
                                Building the Ternary Microprocessor
                            </h2>
                            <div className={'flex justify-between'}>
                                <span className={'w-[40%] text-left'}>
                                    <span className={'block mb-[--p-content-5xs] text-[2rem]'}>
                                        Imperative Paradigm Shift
                                    </span>
                                    <span className={'block text-section leading-[1.2]'}>
                                        AI is here to stay, and it’s crucial to ensure we meet the
                                        growing demand for energy consumption. Our advanced microprocessor designs serve as
                                        the catalyst for the next technological revolution in computing.
                                    </span>
                                    <Button
                                        className={'mt-[--p-content-xl] px-[--p-content] h-[2.375rem] rounded-full bg-blue text-heading-s'}
                                    >
                                        Review Documentation
                                    </Button>
                                </span>
                                <Image src={SVG_CIRCUIT} alt={'circuit'} className={'min-h-full w-auto'}/>
                            </div>
                        </div>
                    </section>
                    <section
                        className={'pt-[8.19rem] pb-[9.44rem] !w-dvw !max-w-[100dvw] bg-gradient-to-t  from-black via-[#0a313a] to-[--bg-section-green] oxygen'}>
                        <div className={'mx-auto px-[--p-content-xl] w-3/4 max-w-[90rem] text-[1.25rem]'}>
                            <h2 className={'mb-[5rem] font-bold text-[2.5rem] text-left'}>Inside Tern</h2>
                            <ul className={'grid grid-cols-2 gap-x-[3.63rem]'}>
                                <li className={'flex flex-col gap-y-[--p-content-3xs] text-left'}>
                                    <h4 className={'mb-[0.1rem] text-[0.9375rem] text-placeholder'}>
                                        Tern Careers
                                    </h4>
                                    <p>Become a Ternster</p>
                                    <Image src={SVG_OFFICE_GIRL_1} alt={'office girl 1'} className={'w-full'}/>
                                    <Button
                                        icon={'arrow'}
                                        onClick={() => window.open('https://', '_blank')}
                                        className={'self-start text-blue flex-row-reverse'}
                                        classNameIcon={'[&_path]:fill-blue rotate-180'}
                                    >
                                        Explore Jobs
                                    </Button>
                                </li>
                                <li className={'flex flex-col gap-y-[--p-content-3xs] text-left'}>
                                    <h4 className={'mb-[0.1rem] text-[0.9375rem] text-placeholder'}>
                                        Tern Academy
                                    </h4>
                                    <p>Explore Learning Opportunities</p>
                                    <Image src={SVG_OFFICE_GIRL_2} alt={'office girl 2'} className={'w-full'}/>
                                    <Button
                                        icon={'arrow'}
                                        onClick={() => window.open('https://', '_blank')}
                                        className={'self-start text-blue flex-row-reverse'}
                                        classNameIcon={'[&_path]:fill-blue rotate-180'}
                                    >
                                        Start Learning
                                    </Button>
                                </li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

export default HomePage;