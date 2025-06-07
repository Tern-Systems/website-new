'use client';

import { useEffect, useState } from 'react';

import { ArrayOfLength } from '@/app/types/utils';
import { Course} from '@/app/types/course';
import { COURSE_TEMPLATE, COURSES_TEMPLATE } from '@/app/types/course';
import { Route } from '@/app/static';

import { useModal } from '@/app/hooks';

import {Section,H1,H2,H3, Content} from '@/app/ui/atoms';
import { BookCoverSection, CardsLibrary, InsideTernSection } from '@/app/ui/templates';
import { MessageModal } from '@/app/ui/modals';

import BACKGROUND from '@/assets/images/courses-bg-main.png';

import '@/app/globals.css';
import cn from 'classnames';



const COURSE_TAGS: ArrayOfLength<string, 4> = ['Popular', 'Featured', 'Free', 'Premium'];


function CoursesLib(){

    const modalCtx = useModal();
    const [courses, setCourses] = useState<Course[] | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
        try {
            setCourses(COURSES_TEMPLATE);
        } catch (err: unknown) {
            if (typeof err === 'string') {
            modalCtx.openModal(<MessageModal>{err}</MessageModal>);
            }
        }
        };
        fetchCourses();
    }, [modalCtx]);



    return (
        <>
            <Section
                type={'short'}
                background={{ image: BACKGROUND, gradient: 'left' }}
                className={{ content: 'sm:pb-[2.81rem] md:pb-[3.81rem] py-xxl' }}
            >
                <H1
                    type={'large'}
                    className={'sm:text-54'}
                >
                    Courses
                </H1>
                <H2>Expect the unexpected, 
                    <br/>
                    learn the unknown</H2>
            </Section>
            <Content>
                <CardsLibrary
                    section={{
                        preHref: Route.Courses,
                        first: { title: 'Free Courses', href: Route.FreeCourses },
                        second: { title: 'Premium Courses', href: Route.PremiumCourses },
                    }}
                    cards={courses}
                    tags={COURSE_TAGS}
                />
                <BookCoverSection
                    type={'light'}
                    title={'Tern Academy'}
                    Description={
                        <>
                            Tern Academy is your premier destination for diving into the world of ternary computing, offering a comprehensive lineup of expertly designed courses that cover all things Tern. 
                            <br />
                            <br />
                            Whether you're exploring foundational languages like G25 and BTMC, mastering the innovative Tidal software stack, or delving into advanced topics like T27I, our curriculum spans a wide array of subjects to equip you with cutting-edge skills. 
                            <br />
                            <br />
                            With courses tailored for both beginners and seasoned developers, Tern Academy ensures you have the tools and knowledge to excel in this groundbreaking field, no matter your starting point.
                        </>
                    }
                    link={{ title: 'Explore all Courses', href: '' }}
                    className={'sm:mt-5xl md:mt-6xl-1 lg:mt-[9.375rem]'}
                />
                <InsideTernSection data={'alt0'} />
            </Content>
        </>
    );
}
export default CoursesLib;



