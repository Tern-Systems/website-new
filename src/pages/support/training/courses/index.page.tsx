'use client';

import { useEffect, useState } from 'react';

import { Content, H1, H2, Section } from '@/app/ui/atoms';
import { Route } from '@/app/static';

import ABSTRACT_DATA_STREAM from '@/assets/images/abstract-data-stream.jpg';
import { BookCoverSection } from '@/app/ui/templates';
import { CardsLibrary } from '@/app/ui/templates/Sections/CardsLibrary';
import { Course } from '@/app/types/course';
import { InsideTernSection } from '@/app/ui/templates/Sections/InsideTern';

const COURSE_LINKS: Course[] = [
    {
        title: 'Tidal',
        description: 'Creating a Profile, Explore Keys, Favorites, Key Creation, Save Features, My Keys, Key Editor',
        id: 'tidal-1',
        category: 'Individual',
        content: '',
        thumbnail: '',
        date: Date.now(),
        label: 'Course',
        durationMs: 3600000,
        subject: 'Tidal',
        tag: 'popular',
        type: 'text',
    },
    {
        title: 'G25',
        description:
            'Writing Your First G Program, Syntax Rules, Language Overview, Literals, Data Type Specifiers, Keywords, State Operators',
        id: 'g25-1',
        category: 'Individual',
        content: '',
        thumbnail: '',
        date: Date.now(),
        label: 'Course',
        durationMs: 3600000,
        subject: 'G25',
        tag: 'featured',
        type: 'text',
    },
    {
        title: 'T27I',
        description:
            'How to Read TERN, Syntax Rules, Language Overview, Instructions, Arithmetic, Branching, Tertwise, Opcode Meanings',
        id: 't27i-1',
        category: 'Individual',
        content: '',
        thumbnail: '',
        date: Date.now(),
        label: 'Course',
        durationMs: 3600000,
        subject: 'T27I',
        tag: 'popular',
        type: 'text',
    },
    {
        title: 'BTMC',
        description:
            'Balanced Ternary Logic, Basic Arithmetic, Language Structure, Heptavintimal Encoding, Advanced Arithmetic, UEF',
        id: 'btmc-1',
        category: 'Individual',
        content: '',
        thumbnail: '',
        date: Date.now(),
        label: 'Course',
        durationMs: 3600000,
        subject: 'BTMC',
        tag: 'featured',
        type: 'text',
    },
];

function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setCourses(COURSE_LINKS);
        setIsLoading(false);
    }, []);

    return (
        <>
            <Section
                type={'short'}
                background={{ image: ABSTRACT_DATA_STREAM, gradient: 'left' }}
                className={{
                    content: 'flex flex-col justify-between  py-xxl sm:pb-[2.81rem]',
                    background: 'sm:bg-center',
                }}
            >
                <H1
                    type={'large'}
                    className={'!w-full'}
                >
                    Courses
                </H1>
                <H2 className={'sm:!text-20 md:!text-27'}>
                    Expect the unexpected,
                    <br />
                    learn the unknown
                </H2>
            </Section>
            <Content className={'pt-3xlmd:pt-6xl-1 lg:pt-6xl  mb-[5rem] md:mb-[6.25rem] lg:mb-[9.37rem]'}>
                <CardsLibrary
                    section={{
                        preHref: Route.Courses,
                        first: { title: 'Most Popular', href: Route.AllWays },
                        second: { title: 'Featured', href: Route.AllWays },
                    }}
                    cards={COURSE_LINKS}
                    tags={['popular', 'featured', 'popular', 'featured']}
                />
                <BookCoverSection
                    className='sm:h-[62rem] bookcover-section sm:[&_h3]:!mt-[7rem] sm:[&_h3]:!self-start'
                    type={'light'}
                    title={'Tern Academy'}
                    Description={
                        <>
                            Tern Academy is your premier destination for diving into the world of ternary computing,
                            offering a comprehensive lineup of expertly designed courses that cover all things Tern.
                            <br />
                            <br />
                            Whether you&apos;re exploring foundational languages like G25 and BTMC, mastering the
                            innovative Tidal software stack, or delving into advanced topics like T27I, our curriculum
                            spans a wide array of subjects to equip you with cutting-edge skills.
                            <br />
                            <br />
                            With courses tailored for both beginners and seasoned developers, Tern Academy ensures you
                            have the tools and knowledge to excel in this groundbreaking field, no matter your starting
                            point.
                        </>
                    }
                    link={{ title: 'Explore all courses', href: '' }}
                />
                <InsideTernSection />
            </Content>
        </>
    );
}

export default CoursesPage;
