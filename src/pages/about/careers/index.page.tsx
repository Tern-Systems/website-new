'use client';

import { ReactElement, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';

import { Career } from '@/app/types/blog';
import { ResourceLink } from '@/app/types/layout';
import { ImageListProps } from '@/app/ui/organisms/ImageList';
import { MISC_LINKS } from '@/app/static';

import { arrayToRecord } from '@/app/utils';
import { useModal } from '@/app/hooks';

import { Content, H1, H2, H3, Section } from '@/app/ui/atoms';
import { ImageList, ResourceCard } from '@/app/ui/organisms';
import { BookCoverSection, ResourceCards, Search } from '@/app/ui/templates';
import { PageLink } from '@/app/ui/layout';
import { MessageModal } from '@/app/ui/modals';

import BACKGROUND from '@/assets/images/carers-main.png';
import MICROSCOPE from '@/assets/images/chip-microscope.jpg';
import OFFICE_PEOPLE_1 from '@/assets/images/office-people-1.jpg';
import OFFICE_PEOPLE_2 from '@/assets/images/office-people-2.jpg';
import COMPASS from '@/assets/images/icons/compass.svg';
import CALENDAR from '@/assets/images/icons/calendar.svg';
import HEART from '@/assets/images/icons/heart.svg';
import HAND from '@/assets/images/icons/hand.svg';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

// TODO remove templates
const CAREER_TEMPLATE: Career = {
    id: 'af24gftre2',
    title: 'Frontend Software Engineer',
    description: 'Description',
    category: 'Operations',
    content: 'Some useful content',
    type: 'text',
};

const CAREERS_TEMPLATE: Career[] = Array(147)
    .fill(null)
    .map((_, idx) => ({ ...CAREER_TEMPLATE, title: CAREER_TEMPLATE.title }));

const IMAGE_LIST: ImageListProps = {
    image: MICROSCOPE,
    items: [
        {
            title: 'Attention to Detail',
            description:
                'Tern’s commitment to meticulous craftsmanship is evident in its development of the Cyrus microprocessor and Tidal software, where precision drives the success of their innovative ternary computing solutions.',
        },
        {
            title: 'Steadfast Commitment to Purpose',
            description:
                'Consistency guides Tern in revolutionizing computing, ensuring every step aligns with their goal of universal efficiency.',
        },
        {
            title: 'Confidence in Execution',
            description:
                'Acumen empowers Tern’s leadership and engineers to navigate complex challenges swiftly and effectively in advancing ternary technology.',
        },
        {
            title: 'Clever and Original Thinking',
            description:
                'Ingenuity fuels Tern’s pioneering spirit, creating groundbreaking ternary systems that redefine the future of computing.',
        },
        {
            title: 'Striving for Perfection',
            description:
                'At Tern, we pursue perfection, confident that it is attainable through dedication and faith in our ability to change the world.',
        },
    ],
};

const RESOURCE_LINKS: ResourceLink[] = [
    {
        icon: COMPASS,
        title: 'Clear mission and vision',
        description:
            'At Tern, our clear mission and vision guide every decision, ensuring we stay focused on our goals and values.',
    },
    {
        icon: CALENDAR,
        title: 'Team events',
        description:
            'Regular team events at Tern foster a sense of community, collaboration, and fun, strengthening our bonds and enhancing our work culture.',
    },
    {
        icon: HEART,
        title: 'Passion and purpose',
        description:
            'Every member of the Tern team is driven by passion and purpose, bringing enthusiasm and dedication to their work every day.',
    },
    {
        icon: HAND,
        title: 'Options for every employee',
        description:
            'At Tern, we believe in fairness and inclusivity, offering share options to every employee to ensure everyone shares in our success.',
    },
];

const OPPORTUNITY_ROWS = 12;

type CareersFilter = { category: string };

const DEFAULT_FILTER: CareersFilter = { category: '' };
const CATEGORY: Record<string, string> = arrayToRecord(['Executive', 'Finance', 'Marketing', 'Operation']);

const renderCareerItem = (item: Career): ReactElement => (
    <div
        className={cn(
            'grid justify-between items-center  pt-s w-full  border-t-s border-blue  sm:gap-y-xxs',
            'sm:grid-cols-1 grid-cols-[2fr,1fr,min-content]',
        )}
    >
        <span className={'text-21 md:text-27 lg:text-40'}>{item.title}</span>
        <span className={'text-blue'}>{item.category}</span>
        <PageLink
            icon={'arrow-right-long'}
            href={MISC_LINKS.Careers}
            className={'!flex-row-reverse p-3xs w-fit border-s border-gray-l1'}
            iconClassName={'[&_path]:fill-blue ml-xs'}
        >
            Apply
        </PageLink>
    </div>
);

function CarersPage() {
    const modalCtx = useModal();
    const [careers, setCareers] = useState<Career[]>([]);

    useEffect(() => {
        try {
            setCareers(CAREERS_TEMPLATE);
        } catch (err: unknown) {
            if (typeof err === 'string') modalCtx.openModal(<MessageModal>{err}</MessageModal>);
        }

        const inputElement = document.querySelector('input[placeholder="Search for courses..."]') as HTMLInputElement;
        if (inputElement) {
            inputElement.placeholder = '';
        }
    }, []);

    return (
        <>
            <style
                jsx
                global
            >{`
                .benefits-section svg path {
                    fill: white !important;
                }

                .hero-section-fix [class*='absolute'][class*='-z-10'][class*='inset-0'][class*='scale-'] {
                    background: linear-gradient(to right, rgba(0, 0, 0, 1) 1%, transparent 100%) !important;
                }

                .hero-section-fix h1,
                .hero-section-fix h2 {
                    text-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
                    filter: brightness(2) contrast(1.05);
                    position: relative;
                    z-index: 5;
                }

                @media (max-width: 834.98px) {
                    .microscope-section .contents img {
                        height: 42rem !important;
                        object-position: center;
                        max-height: 80vh;
                    }

                    .benefits-section span.text-27 {
                        font-size: 2rem !important;
                    }

                    .benefits-section span.leading-n {
                        font-size: 1.1rem !important;
                    }

                    .bookcover-section > div > div.grid {
                        height: 100% !important;
                        display: flex !important;
                    }

                    .bookcover-section > div > div.grid > div:first-child {
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: center !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    .bookcover-section > div > div.grid > div.mt-auto {
                        display: flex !important;
                        align-items: center !important;
                    }
                }
            `}</style>

            <Section
                type={'full-screen'}
                background={{ image: BACKGROUND, gradient: 'left' }}
                className={{
                    content: 'pb-[6.5rem] md:pb-[5.5rem] lg:py-6xl-1  pt-[2.7rem] md:pt-xxl',
                    section: 'hero-section-fix',
                }}
            >
                <H1
                    className='md:w-[75%]'
                    type={'large'}
                >
                    Build the future of efficient computing
                </H1>
                <H2 className={'sm:!text-24'}>
                    We’re looking for brilliant people who want to change <br className={'sm:hidden'} /> the world
                </H2>
            </Section>
            <Content
                heading={
                    <span className={'flex items-center gap-x-4xs mx-auto w-fit text-nowrap'}>
                        <span>See job postings</span>
                        <FontAwesomeIcon icon={faArrowDown} />
                    </span>
                }
                className={'flex flex-col  gap-y-5xl md:gap-y-6xl-1 lg:gap-y-7xl-1'}
            >
                <Section>
                    <ResourceCard
                        icon={OFFICE_PEOPLE_1}
                        title={'Mission-driven'}
                        className={{ content: 'row-start-1 col-start-1' }}
                    >
                        We are pursuing a challenging mission, but one we fully believe is worth pursuing. We are
                        committed to building a solution for the demand for AI and future computer-supported
                        technologies and enabling access to efficient, affordable computation for all.
                    </ResourceCard>
                </Section>
                <Section
                    className={{
                        content: 'sm:bg-cover microscope-section',
                    }}
                >
                    <ImageList {...IMAGE_LIST} />
                </Section>
                <Section>
                    <ResourceCard
                        icon={OFFICE_PEOPLE_2}
                        title={
                            'Our greatest creation is the company itself. Tern employees are the greatest asset we invest in.'
                        }
                        className={{
                            content:
                                'row-start-1 col-start-1 md:grid md:w-[22.5rem] md:mr-[1.875rem] md:gap-[4.375rem]',
                            image: '!object-cover sm:h-[40rem] md:h-[38.187rem] lg:h-[42.75rem] md:col-start-2',
                        }}
                    >
                        At Tern, we believe that our employees are the heart of our success. That&apos;s why we are
                        committed to creating a work environment that empowers them to thrive.
                        <br />
                        <br />
                        We offer flexible work arrangements, comprehensive benefits, and opportunities for growth and
                        development to support their personal and professional goals.
                        <br />
                        <br />
                        Our culture is built on inclusivity, respect, and collaboration, fostering a sense of belonging
                        and community.
                        <br />
                        <br />
                        We celebrate our employees&apos; achievements and recognize their hard work and dedication. At
                        Tern, we are dedicated to nurturing a workplace where every employee feels valued, supported,
                        and inspired to reach their full potential.
                    </ResourceCard>
                </Section>
                <Section
                    className={{
                        content: 'benefits-section',
                    }}
                >
                    <H3 className='sm:text-4xl'>Benefits</H3>
                    <ResourceCards links={RESOURCE_LINKS} />
                </Section>
                {/*TODO href*/}
                <BookCoverSection
                    className='sm:h-[62rem] bookcover-section sm:[&_h3]:!mt-[7rem] sm:[&_h3]:!self-start'
                    type={'blue'}
                    title={'Join us in our mission'}
                    Description={
                        <>
                            Building the world’s first ternary computer processor is a big challenge. Bring your skills,
                            experiences, and determination to help us in our mission. Together, we can make a future
                            with energy-efficient computer systems from the lab to reality.
                        </>
                    }
                    link={{ title: 'Meet the team', href: '' }}
                />
                <Section>
                    <H3 className={'text-center'}>Explore current career opportunities</H3>
                    <Search
                        type={'Content'}
                        rows={OPPORTUNITY_ROWS}
                        filterSetup={{
                            default: DEFAULT_FILTER,
                            option: { category: { multiple: true, options: CATEGORY } },
                        }}
                        renderItem={renderCareerItem}
                        items={careers}
                        className={{
                            wrapper: 'mt-n md:mt-xxl lg:mt-[5.63rem]',
                            list: 'sm:w-full sm:[&]:!grid-cols-1',
                        }}
                    />
                </Section>
            </Content>
        </>
    );
}

export default CarersPage;
