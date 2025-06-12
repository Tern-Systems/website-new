'use client';

import { useEffect, useState } from 'react';

import { ArrayOfLength } from '@/app/types/utils';
import { Tip } from '@/app/types/blog';
import { Route } from '@/app/static';

import { useModal } from '@/app/hooks';
import styles from '@/app/common.module.css';
import cn from 'classnames';

import { Content, H1, H2, Section } from '@/app/ui/atoms';
import { CardsLibrary, InsideTernSection } from '@/app/ui/templates';
import { MessageModal } from '@/app/ui/modals';

import BACKGROUND from '@/assets/images/Abstract.png';
import { TernAcademy } from '@/app/ui/templates/Sections/TernAcademy';

// TODO remove templates
const COURSE_TEMPLATE: Tip = {
    title: 'Some title',
    description: 'Some useful description',
    category: 'Gen AI',
    content: 'Some course ',
    thumbnail: '',
    id: '',
    date: 264,
    label: 'Website',
    tag: 'Featured',
    type: 'text',
};

const TIPS_TEMPLATE: Tip[] = Array(183)
    .fill(null)
    .map((_, idx) => ({
        ...COURSE_TEMPLATE,
        id: COURSE_TEMPLATE.id + idx,
        title: COURSE_TEMPLATE.title + idx,
        durationMs: idx % 7 ? 492362 : undefined,
        tag: !(idx % 7) ? 'Popular' : !(idx % 5) ? 'Featured' : !(idx % 11) ? 'Videos' : 'Reads',
        type: idx % 7 ? 'video' : 'text',
    }));

// The items order is important
const COURSE_TAGS: ArrayOfLength<string, 4> = ['Popular', 'Featured', 'Videos', 'Reads'];

function CoursesPage() {
    const modalCtx = useModal();
    const [tips, setCourses] = useState<Tip[] | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setCourses(TIPS_TEMPLATE);
            } catch (error: unknown) {
                if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        };
        fetchCourses();
    }, []);

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
                <H2 type={'large'}>
                    Expect the unexpected, learn the unknown
                </H2>
            </Section>
            <Content>
                <CardsLibrary
                    section={{
                        preHref: Route.CoursesTutorial,
                        first: { title: 'Free Courses', href: Route.CoursesLib },
                        second: { title: 'Premium Courses', href: Route.CoursesLib },
                    }}
                    cards={tips}
                    tags={COURSE_TAGS}
                />
                <section className={styles.section}>
                    <div className={cn(styles.content, 'pt-xxl md:pt-3xl lg:pt-xl')}>
                        <TernAcademy alt />
                    </div>
                </section>
                <InsideTernSection data={'alt0'} />
            </Content>
        </>
    );
}

export default CoursesPage;
