'use client';

import { useEffect, useState } from 'react';

import { ArrayOfLength } from '@/app/types/utils';
import { Course } from '@/app/types/blog';
import { Route } from '@/app/static';

import { useModal } from '@/app/hooks';

import { Content, H1, H2, Section } from '@/app/ui/atoms';
import { MessageModal } from '@/app/ui/modals';
import { BookCoverSection, CardsLibrary, InsideTernSection } from '@/app/ui/templates';

import BACKGROUND from '@/assets/images/courses-bg-main.png';

// TODO remove templates
const COURSE_TEMPLATE: Course = {
    title: 'Some title',
    description: 'Some useful description',
    category: 'Individual',
    content: 'Some tip ',
    thumbnail: '',
    id: '9uqhe45gf032j0',
    date: 264,
    label: 'Website',
    durationMs: 39874,
    subject: 'BTMC',
    tag: 'Featured',
    type: 'text',
};

const COURSES_TEMPLATE: Course[] = Array(183)
    .fill(null)
    .map((_, idx) => ({
        ...COURSE_TEMPLATE,
        id: COURSE_TEMPLATE.id + idx,
        tag: !(idx % 7) ? 'Free' : !(idx % 5) ? 'Featured' : !(idx % 11) ? 'Popular' : 'Premium',
        type: idx % 3 ? 'video' : 'text',
    }));

// The items order is important
const COURSE_TAGS: ArrayOfLength<string, 4> = ['Popular', 'Featured', 'Free', 'Premium'];

const Description = (
    <>
        Tern Academy is your premier destination for diving into the world of ternary computing, offering a
        comprehensive lineup of expertly designed courses that cover all things Tern.
        <br />
        <br />
        Whether you are exploring foundational languages like G25 and BTMC, mastering the innovative Tidal software
        stack, or delving into advanced topics like T27I, our curriculum spans a wide array of subjects to equip you
        with cutting-edge skills.
        <br />
        <br />
        With courses tailored for both beginners and seasoned developers, Tern Academy ensures you have the tools and
        knowledge to excel in this groundbreaking field, no matter your starting point.
    </>
);

function CoursesPage() {
    const modalCtx = useModal();

    const [cards, setCards] = useState<Course[] | null>(null);

    useEffect(() => {
        const fetchTips = async () => {
            try {
                setCards(COURSES_TEMPLATE);
            } catch (error: unknown) {
                if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        };
        fetchTips();
    }, []);

    return (
        <>
            <Section
                type={'short'}
                background={{ image: BACKGROUND, gradient: 'left' }}
                className={{ background: 'bg-center', content: 'sm:pb-[2.81rem] md:pb-[3.81rem] py-xxl' }}
            >
                <H1
                    type={'large'}
                    className={'sm:text-54'}
                >
                    Courses
                </H1>
                <H2 type={'large'}>
                    Expect the unexpected,
                    <br />
                    learn the unknown
                </H2>
            </Section>
            <Content>
                <CardsLibrary
                    section={{
                        preHref: Route.CoursesLib,
                        first: { title: 'Free Courses', href: Route.FreeCourses },
                        second: { title: 'Premium Courses', href: Route.PremiumCourses },
                    }}
                    cards={cards}
                    tags={COURSE_TAGS}
                />
                <BookCoverSection
                    type={'light'}
                    title={'Tern Academy'}
                    Description={Description}
                    link={{ title: 'Explore all courses', href: Route.CoursesLib }}
                    className={'mt-[3.28rem] md:mt-6xl lg:mt-7xl-1'}
                />
                <InsideTernSection data={'alt0'} />
            </Content>
        </>
    );
}

export default CoursesPage;
