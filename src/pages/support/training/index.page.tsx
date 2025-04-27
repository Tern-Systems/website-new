'use client';

import { FC } from 'react';
import cn from 'classnames';

import { CardLink, ResourceLink } from '@/app/types/layout';
import { Route } from '@/app/static';

import { PageLink } from '@/app/ui/layout';
import { Content, H1, H2, H3, Section } from '@/app/ui/atoms';
import { Video } from '@/app/ui/organisms';
import { CardCheckersSection, ResourceCards } from '@/app/ui/templates';

import ACADEMY_COUCH_GIRL from '@/assets/images/academy-couch-girl.jpg';
import SVG_ARROW from '@/assets/images/icons/arrow.svg';
import PNG_CARD_1 from '@/assets/images/training-card-1.jpg';
import PNG_CARD_2 from '@/assets/images/training-card-2.png';
import PNG_CARD_3 from '@/assets/images/training-card-3.jpg';
import PNG_CARD_4 from '@/assets/images/training-card-4.jpg';

const links: ResourceLink[] = [
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

const CARDS: CardLink[] = [
    {
        title: 'Invest in Your Skills',
        description:
            'Looking to buy two or more fee-based courses? Save money by purchasing a subscription and have access to all the digital courses we have to offer. Features of your subscription include:',
        icon: PNG_CARD_1,
        action: {
            title: 'Subscribe Today',
            href: Route.Downloads,
        },
        bullets: [
            'Self-paced courses',
            'Hands-on labs',
            'Preparations for Tern certifications',
            'New content added frequently',
        ],
    },
    {
        title: 'Commit to Learning',
        description:
            'If you require access to a single course, you may purchase it individually, granting you unlimited access to the learning materials for a minimum of three months.',
        icon: PNG_CARD_2,
        action: {
            title: 'Learn more',
            href: Route.Tips,
        },
        bullets: [],
    },
    {
        title: 'Professional Certifications',
        description:
            'Verify your knowledge by earning the credentials you qualify for. We present an easy to navigate resource, making it easier for you to find the credentials and related learning material that matter most.',
        icon: PNG_CARD_3,
        action: {
            title: 'Explore Tern Credentials',
            href: Route.SupportHub,
        },
        bullets: ['Get certified', 'Earn a badge', 'View your earned credentials'],
    },
    {
        title: 'Engage with the Tern Community',
        description: 'Together, we can connect via forums, blogs, files and face-to-face networking.',
        icon: PNG_CARD_4,
        action: {
            title: 'Find your community',
            href: Route.Community,
        },
        bullets: [],
    },
];

const TrainingHomePage: FC = () => {
    return (
        <>
            <Section
                type={'full-screen'}
                background={{ image: ACADEMY_COUCH_GIRL, gradient: 'left' }}
                className={{
                    content: 'flex flex-col justify-between  py-4xl md:py-5xl lg:py-6xl-1',
                    background: '!bg-right-top',
                }}
            >
                <H1 type={'large'}>
                    Building skills is an investment in <span className={'text-blue'}>your</span> future
                </H1>
                <H2 className={'sm:text-20'}>
                    Tern Academy is your source for
                    <br />
                    quality training - get started for free!
                </H2>
            </Section>
            <Content>
                <Section>
                    <H3 type={'large'}>Train at Your Own Pace</H3>
                    <p className={'mt-3xl lg:mt-[4.375rem]  text-21 md:text-24 lg:text-32'}>
                        What Tern product area do you want to start learning today?
                    </p>
                    <ResourceCards
                        highlighted
                        icon={SVG_ARROW}
                        links={links}
                    />
                </Section>
                <Section
                    className={{
                        section: 'bg-transparent',
                        content: cn(
                            'grid items-center',
                            'grid-cols-1 lg:grid-cols-[1fr,2fr]',
                            'lg:gap-x-7xl-1  sm:gap-y-s md:gap-y-xs',
                            'my-3xl md:my-5xl lg:my-7xl-1',
                        ),
                    }}
                >
                    {/*TODO url*/}
                    <Video
                        url={''}
                        className={cn(
                            'before:x-[border-s,border-gray-l0]  lg:col-start-2  lg:mr-0',
                            'md:x-[min-h-[22.5rem],max-h-[50rem]]',
                            'lg:x-[min-h-[24.394rem],h-[30dvw],max-h-[30rem]]',
                        )}
                    />
                    <div className={'contents lg:flex  lg:row-start-1 lg:flex-col lg:gap-y-n'}>
                        <H3 className={'row-start-1'}>Why Tern Academy</H3>
                        <p className={'leading-l'}>Discover what Tern Academy has to offer</p>
                        <p className={'contents'}>
                            {/*TODO href*/}
                            <PageLink href={''}>Explore training solutions</PageLink>
                        </p>
                    </div>
                </Section>
                <CardCheckersSection cards={CARDS} />
            </Content>
        </>
    );
};

export default TrainingHomePage;
