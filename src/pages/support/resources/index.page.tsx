'use client';

import { ReactElement } from 'react';
import cn from 'classnames';

import { CardLink } from '@/app/types/layout';
import { Route } from '@/app/static';

import { MainBackground } from '@/app/ui/atoms';
import { ResourceCard } from '@/app/ui/organisms';
import { InsideTernSection } from '@/app/ui/templates';

import styles from '@/app/common.module.css';

import JPG_MAIN from '@/assets/images/resources-bg-main.jpg';
import PNG_CARD_1 from '@/assets/images/resources-card-1.png';
import PNG_CARD_2 from '@/assets/images/resources-card-2.png';
import PNG_CARD_3 from '@/assets/images/resources-card-3.png';
import PNG_CARD_4 from '@/assets/images/resources-card-4.png';
import PNG_CARD_5 from '@/assets/images/resources-card-5.png';

const CARDS: CardLink[] = [
    {
        title: 'Downloads',
        description: 'Explore and download the latest software from Tern',
        icon: PNG_CARD_1,
        action: {
            title: 'Explore downloads',
            href: Route.Downloads,
        },
    },
    {
        title: 'Get Expert Tips',
        description: 'Our experts share how to best manage and operate your Tern products, services and accounts.',
        icon: PNG_CARD_2,
        action: {
            title: 'Learn more',
            href: Route.Tips,
        },
    },
    {
        title: 'Stay ahead with the latest tech news',
        description:
            'Weekly insights, research and expert views on AI, security, cloud and more in the All Ways Newsletter.',
        icon: PNG_CARD_3,
        action: {
            title: 'Subscribe today',
            href: Route.AllWays,
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
            href: Route.SupportHub,
        },
    },
    {
        title: 'Engage with the Tern Community',
        description: 'Together, we can connect via forums, blogs, files and face-to-face networking.',
        icon: PNG_CARD_5,
        action: {
            title: 'Find your community',
            href: Route.Community,
        },
    },
];

function ResourcesPage() {
    const CardsLi: ReactElement[] = CARDS.map((card, idx) => (
        <li key={card.title + idx}>
            <ResourceCard
                type={card.alt ? 'highlighted' : 'default'}
                icon={card.icon}
                title={card.title}
                action={card.action}
                className={{
                    wrapper: 'mt-[9.38rem] md:mt-5xl sm:mt-3xl',
                    image: cn({ ['lg:col-start-2']: idx % 2 }),
                    content: cn({ ['lg:x-[row-start-1,col-start-1]']: idx % 2 }),
                }}
            >
                {card.description}
            </ResourceCard>
        </li>
    ));

    return (
        <div className={' pb-[32.91rem] md:pb-[28.12rem] bg-black'}>
            <section
                className={cn(styles.section, styles.fullHeightSection, styles.contentGradientBlackLeft, 'relative')}
            >
                <MainBackground
                    url={JPG_MAIN}
                    className={styles.sectionInsetShadowBlack}
                />
                <div
                    className={cn(
                        styles.content,
                        'relative z-10 flex flex-col justify-between  py-[6.25rem] md:py-xxl sm:py-[2.72rem]',
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
            <section className={cn(styles.section, 'bg-transparent')}>
                <div
                    className={cn(
                        'h-full w-full absolute left-0 top-0 z-10 bg-gradient-to-b from-blue to-transparent to-[60%] lg:to-[55%]',
                    )}
                />
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
            <section className={cn(styles.section, 'bg-transparent')}>
                <div className={styles.content}>
                    <ul className={'flex flex-col'}>{CardsLi}</ul>
                </div>
            </section>
            <InsideTernSection className='bg-transparent' />
            <div
                className={cn(
                    'h-full w-full absolute left-0 top-0 z-0 bg-gradient-to-t from-blue to-transparent to-10% md:to-5%',
                )}
            />
        </div>
    );
}

export default ResourcesPage;
