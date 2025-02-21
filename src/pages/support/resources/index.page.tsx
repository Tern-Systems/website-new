import React, { ReactElement } from 'react';
import Image, { StaticImageData } from 'next/image';
import cn from 'classnames';

import { Route } from '@/app/static';

import { MainBackground } from '@/app/ui/atoms';
import { PageLink } from '@/app/ui/layout';
import { InsideTernSection } from '@/app/ui/templates';

import styles from '@/app/common.module.css';

import JPG_MAIN from '/public/images/resources-bg-main.jpg';
import PNG_CARD_1 from '/public/images/resources-card-1.png';
import PNG_CARD_2 from '/public/images/resources-card-2.png';
import PNG_CARD_3 from '/public/images/resources-card-3.png';
import PNG_CARD_4 from '/public/images/resources-card-4.png';
import PNG_CARD_5 from '/public/images/resources-card-5.png';

const CARDS: {
    title: string;
    description: string;
    icon: StaticImageData;
    action: { title: string; link: Route };
    alt?: true;
}[] = [
    {
        title: 'Downloads',
        description: 'Explore and download the latest software from Tern',
        icon: PNG_CARD_1,
        action: {
            title: 'Explore downloads',
            link: Route.Downloads,
        },
    },
    {
        title: 'Get Expert Tips',
        description: 'Our experts share how to best manage and operate your Tern products, services and accounts.',
        icon: PNG_CARD_2,
        action: {
            title: 'Learn more',
            link: Route.Tips,
        },
    },
    {
        title: 'Stay ahead with the latest tech news',
        description:
            'Weekly insights, research and expert views on AI, security, cloud and more in the All Ways Newsletter.',
        icon: PNG_CARD_3,
        action: {
            title: 'Subscribe today',
            link: Route.AllWays,
        },
        alt: true,
    },
    {
        title: 'Enter the Support Hub',
        description:
            'Take control and manage all aspects of your account support with the support hub where you have access to FAQs, handling cases, insights and more!',
        icon: PNG_CARD_4,
        action: {
            title: 'Enter support hub',
            link: Route.SupportHub,
        },
    },
    {
        title: 'Engage with the Tern Community',
        description: 'Together, we can connect via forums, blogs, files and face-to-face networking.',
        icon: PNG_CARD_5,
        action: {
            title: 'Find your community',
            link: Route.Community,
        },
    },
];

function ResourcesPage() {
    const CardsLi: ReactElement[] = CARDS.map((card, idx) => (
        <li
            key={card.title + idx}
            className={cn(
                'grid items-center  lg:x-[gap-x-xl,justify-items-center]  lg:grid-cols-2',
                'gap-y-n sm:gap-y-xs',
                'mt-[9.38rem] md:mt-5xl sm:mt-3xl',
                {
                    [cn(
                        styles.cardGrayGradient,
                        'lg:grid-cols-[2fr,3fr]  p-xxs md:x-[px-xxl,p-[2.31rem]] lg:p-[3.25rem]',
                    )]: card.alt,
                },
            )}
        >
            <Image
                src={card.icon}
                alt={card.title}
                className={cn('w-full h-auto', { ['lg:col-start-2']: idx % 2 })}
            />
            <span
                className={cn('contents lg:flex  flex-col gap-y-n', {
                    ['lg:x-[row-start-1,col-start-1]']: idx % 2,
                    ['h-full']: card.alt,
                })}
            >
                <span className={'row-start-1  text-section-xl md:text-heading sm:text-section'}>{card.title}</span>
                <span className={cn('leading-l', { ['lg:w-1/2']: card.alt })}>{card.description}</span>
                <PageLink
                    icon={'arrow-right-long'}
                    href={card.action.link}
                    className={cn('flex-row-reverse p-xxs w-fit bg-blue', { ['lg:mt-auto']: card.alt })}
                    iconClassName={'ml-xs [&_*]:size-[1.06rem]'}
                >
                    {card.action.title}
                </PageLink>
            </span>
        </li>
    ));

    return (
        <>
            <MainBackground
                url={JPG_MAIN}
                className={styles.sectionInsetShadowBlack}
            />
            <div className={'relative z-10  pb-[32.91rem] md:pb-[28.12rem]'}>
                <section className={cn(styles.section, styles.fullHeightSection, styles.contentGradientBlackLeft)}>
                    <div
                        className={cn(
                            styles.content,
                            'flex flex-col justify-between  py-[6.25rem] md:py-xxl sm:py-[2.72rem]',
                        )}
                    >
                        <h1 className={'text-heading-4xl sm:text-heading-xl  w-[70%] sm:w-1/2  leading-l'}>
                            All your resources in one place
                        </h1>
                        <h2
                            className={
                                'leading-l  w-[65%] md:w-[75%] sm:w-full  text-section-xl md:text-documentation sm:text-section'
                            }
                        >
                            Learn how to get the most out of Tern with downloads, tips, the support hub and our engaging
                            community.
                        </h2>
                    </div>
                </section>
                <section className={styles.section}>
                    <div className={cn(styles.content, 'pt-[7.25rem] md:pt-[6.75rem] sm:pt-[7.2rem]')}>
                        <h3 className={'text-heading-xl md:text-heading sm:text-documentation'}>
                            Prepare for your journey with Tern
                        </h3>
                        <h4
                            className={
                                'pt-[3.69rem] md:pt-3xl sm:pt-xxl  text-section-xl md:text-documentation sm:text-heading-s'
                            }
                        >
                            What tools do you need to succeed?
                        </h4>
                    </div>
                </section>
                <section className={styles.section}>
                    <div className={styles.content}>
                        <ul className={'flex flex-col'}>{CardsLi}</ul>
                    </div>
                </section>
                <InsideTernSection />
            </div>
        </>
    );
}

export default ResourcesPage;
