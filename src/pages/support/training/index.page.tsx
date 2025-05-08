'use client';

import { FC } from 'react';
import cn from 'classnames';

import { ResourceLink } from '@/app/types/layout';

import { PageLink } from '@/app/ui/layout';
import { Content, H1, H2, H3, Section } from '@/app/ui/atoms';
import { Video } from '@/app/ui/organisms';
import { CardCheckersSection, ResourceCards } from '@/app/ui/templates';

import ACADEMY_COUCH_GIRL from '@/assets/images/academy-couch-girl.jpg';
import SVG_ARROW from '@/assets/images/icons/arrow.svg';

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
                            'grid-cols-1 lg:!grid-cols-[auto,2fr] lg:gap-x-l',
                            'lg:gap-x-7xl-1  sm:gap-y-s md:gap-y-xs',
                            'my-3xl md:my-5xl lg:my-7xl-1',
                        ),
                    }}
                >
                    {/*TODO url*/}
                    <Video
                        url={''}
                        className={cn(
                            'flex flex-col w-full x3s:!h-[45dvw] xxs:h-[51dvw] h-[52dvw] before:x-[border-s,border-gray-l0]  lg:col-start-2 lg:mr-0',
                            'md:x-[min-h-[22.5rem],max-h-[50rem]]',
                            'lg:x-[min-h-[24.394rem],h-[30dvw],max-h-[30rem]]',
                        )}
                    />
                    <div className={'contents w-full lg:flex lg:row-start-1 lg:flex-col lg:gap-y-n'}>
                        <H3 className={'row-start-1'}>Why Tern Academy?</H3>
                        <p className={'leading-l'}>Discover what Tern Academy has to offer.</p>
                        <div className={'contents'}>
                            {/*TODO href*/}
                            <PageLink
                                href={''}
                                className={'flex-row-reverse p-xxs w-fit bg-blue'}
                            >
                                <div className='inline-block !size-5xs ml-xs'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='26'
                                        height='27'
                                        viewBox='0 0 26 27'
                                        fill='none'
                                        className='injected-svg'
                                        data-src='/_next/static/media/arrow-right-long.9237f077.svg'
                                        role='img'
                                    >
                                        <g id='Group 1439'>
                                            <g id='Page-1'>
                                                <g id='Dribbble-Light-Preview'>
                                                    <g id='icons'>
                                                        <path
                                                            id='arrow_right-[#355]-15'
                                                            fillRule='evenodd'
                                                            clipRule='evenodd'
                                                            d='M0.896219 12.7796L0.895908 14.5561L22.058 14.5287L15.281 21.3057L16.5535 22.5782L25.463 13.6686L16.4929 4.69847L15.2011 5.9523L22.0446 12.7957L0.896219 12.7796Z'
                                                            fill='white'
                                                        ></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                                Explore training solutions
                            </PageLink>
                        </div>
                    </div>
                </Section>
                <CardCheckersSection type={'regular'} />
            </Content>
        </>
    );
};

export default TrainingHomePage;
