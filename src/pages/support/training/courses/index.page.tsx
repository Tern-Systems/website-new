'use client';

import { useEffect, useState } from 'react';

import { Content, H1, H2, Section } from '@/app/ui/atoms';
import { Route } from '@/app/static';

import { BookCoverSection } from '@/app/ui/templates';
import { CardsLibrary } from '@/app/ui/templates/Sections/CardsLibrary';
import { Course, COURSES_TEMPLATE } from '@/app/types/course';
import { InsideTernSection } from '@/app/ui/templates/Sections/InsideTern';
import PNG_COURSES_BG from '@/assets/images/courses-bg-main.png';

function CoursesPage() {
    return (
        <>
            <Section
                type={'short'}
                background={{ image: PNG_COURSES_BG, gradient: 'left' }}
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
                    cards={COURSES_TEMPLATE}
                    tags={['Popular', 'Featured', 'Free', 'Premium']}
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
