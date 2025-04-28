'use client';

import { ReactElement } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { CardLink, ResourceLink } from '@/app/types/layout';
import { Breakpoint } from '@/app/static';

import { useBreakpointCheck } from '@/app/hooks';

import { Content, Gradient, H1, H2, H3, Section } from '@/app/ui/atoms';
import { PageLink } from '@/app/ui/layout';
import { AllWaysCard, BookCoverSection, ResourceCards } from '@/app/ui/templates';
import { ResourceCard } from '@/app/ui/organisms';

import styles from '@/app/common.module.css';

import PNG_MAIN from '@/assets/images/subscriptions-bg-main.png';
import PNG_GIRL_LAPTOP from '@/assets/images/subscriptions-girl-laptop.png';
import PNG_STUDY from '@/assets/images/subscriptions-study.png';
import PNG_FREE from '@/assets/images/subscriptions-free.png';
import PNG_QUESTIONS from '@/assets/images/subscriptions-questions.png';
import SVG_ARROW from '@/assets/images/icons/arrow.svg';

type Course = {
    title: string;
    description: string;
    href: string;
};

// TODO: Add href
const COURSE_LINKS: Course[] = [
    {
        title: 'Tidal',
        description: 'Creating a Profile, Explore Keys, Favorites, Key Creation, Save Features, My Keys, Key Editor',
        href: '',
    },
    {
        title: 'G25',
        description:
            'Writing Your First G Program, Syntax Rules, Language Overview, Literals, Data Type Specifiers, Keywords, State Operators',
        href: '',
    },
    {
        title: 'T271',
        description:
            'How to Read TERN, Syntax Rules, Language Overview, Instructions, Arithmetic, Branching, Tertwise, Opcode Meanings',
        href: '',
    },
    {
        title: 'BTMC',
        description:
            'Balanced Ternary Logic, Basic Arithmetic, Language Structure, Heptavintimal Encoding, Advanced Arithmetic, UEF',
        href: '',
    },
];

// TODO: Add href
const CARDS: CardLink[] = [
    {
        title: 'Study Time',
        description:
            'Our robust documentation library allows you to catch up or get ahead in any of our subject surrounding ternary computation. Checkout our resources and start learning!',
        icon: PNG_STUDY,
        action: {
            title: 'View material',
            href: '',
        },
    },
    {
        title: 'Free Courses',
        description:
            'Feeling unsure about jumping in just yet? Dip your toes into the educational tools by viewing some of our publicly available free courses to see if Tern Academy is for you.',
        icon: PNG_FREE,
        action: {
            title: 'Watch now',
            href: '',
        },
    },
    {
        title: 'Any Questions?',
        description:
            'If you need some clarification please visit our FAQs page that has all the information you need to start your journey with Tern Academy!',
        icon: PNG_QUESTIONS,
        action: {
            title: 'Find FAQs',
            href: '',
        },
    },
];

const Description = (
    <>
        Dive into the world of ternary computing with a comprehensive lineup of expertly designed courses. Explore
        foundational languages like G25 and BTMC, master the innovative Tidal software stack, or delve into advanced
        topics like T27I.
        <br />
        <br />
        With a curriculum tailored for both beginners and seasoned developers, you&apos;ll gain the tools and knowledge
        to excel in this groundbreaking field, no matter your starting point.
    </>
);

const SECTION_SPACING_CN = 'flex flex-col  gap-y-5xl md:gap-y-6xl-1 lg:gap-y-[9.38rem]';

function SubscriptionsPage() {
    const links: ResourceLink[] = COURSE_LINKS;

    const sm = useBreakpointCheck() <= Breakpoint.sm;

    const ResourceCardDivs: ReactElement[] = CARDS.map((card: CardLink, idx) => (
        <ResourceCard
            key={card.title + idx}
            type={card.alt ? 'highlighted' : 'default'}
            icon={card.icon}
            title={card.title}
            action={card.action}
            className={{
                image: cn({ ['lg:col-start-2']: idx % 2 }),
                content: cn({ ['lg:x-[row-start-1,col-start-1]']: idx % 2 }),
            }}
        >
            {card.description}
        </ResourceCard>
    ));

    return (
        <>
            <Section
                type={'short'}
                background={{ image: PNG_MAIN, gradient: 'left' }}
                className={{ content: 'flex flex-col justify-between  py-xxl sm:pb-[2.81rem]' }}
            >
                <H1
                    type={'large'}
                    className={'!w-full'}
                >
                    Commit to Learning
                </H1>
                <H2 className={'sm:!text-20 md:!text-27'}>
                    We give big ideas the room they
                    <br />
                    need to grow
                </H2>
            </Section>
            <Content className={SECTION_SPACING_CN}>
                <Section>
                    <div className={'lg:relative  grid grid-flow-row  sm:gap-y-xs gap-y-n'}>
                        <div className={'contents'}>
                            <Gradient />
                            <Image
                                src={PNG_GIRL_LAPTOP}
                                alt={'Girl with tablet'}
                                className={'-z-50 w-full h-auto  row-start-2 lg:row-start-1'}
                            />
                        </div>
                        <div className={'contents lg:flex  lg:x-[absolute,top-[6.44rem],left-xxl,flex-col,gap-y-n]'}>
                            <H3>Get Full Access</H3>
                            <p className={'!leading-l text-16'}>
                                When you sign up for the Tern Academy Premium plan you will gain
                                <br />
                                access to our entire digital library of courses and materials.
                            </p>
                            {/* TODO: add href */}
                            <PageLink
                                external
                                href={''}
                                icon={'arrow-right-long'}
                                className={'flex-row-reverse px-xxs py-xxs h-button-5x w-fit bg-blue'}
                                iconClassName={'ml-xl size-5xs'}
                            >
                                Get access
                            </PageLink>
                        </div>
                    </div>
                </Section>
                <Section>
                    <H3 type={'large'}>Shop by Course</H3>
                    <p className={cn('leading-l  mt-xs md:mt-xl lg:mt-xxl  text-21 md:text-24 lg:text-32')}>
                        What Tern product area do you want to start learning today?
                    </p>
                    <div className={cn(styles.contentHighlight, 'after:blur-[3.125rem]')}>
                        <ResourceCards
                            icon={SVG_ARROW}
                            links={links}
                        />
                    </div>
                </Section>
                <Section>{ResourceCardDivs[0]}</Section>
                <Section>
                    <AllWaysCard alt />
                </Section>
                <Section>{ResourceCardDivs[1]}</Section>
                {/* TODO: href */}
                <BookCoverSection
                    type={'light'}
                    title={sm ? 'Invest in Your Skills' : 'Tern Academy'}
                    Description={Description}
                    link={{ title: 'Start learning', href: '' }}
                    className={SECTION_SPACING_CN}
                />
                <Section>{ResourceCardDivs[2]}</Section>
            </Content>
        </>
    );
}

export default SubscriptionsPage;
