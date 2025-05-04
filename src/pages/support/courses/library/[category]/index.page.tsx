'use client';

import { useEffect, useState } from 'react';

import { Course } from '@/app/types/course';

import { CategoryFallback } from '@/app/static';

import { arrayToRecord } from '@/app/utils';
import { useModal } from '@/app/hooks';
import { LibraryTemplate } from '@/app/ui/templates';
import { MessageModal } from '@/app/ui/modals';
import { MediaCard } from '@/app/ui/organisms';

// TODO remove templates
const COURSE_TEMPLATE: Course = {
    id: 'aspdjaosdjoa',
    title: 'Some title',
    content: 'Some content',
    thumbnail: '',
    durationMs: 5_014_783,
    date: 0,
    description: 'Some useful description',
    label: 'Tidal',
    category: 'New',
    subject: 'BTMC',
    tag: 'Featured',
    type: 'video',
};

const COURSES_TEMPLATE = Array(150)
    .fill(null)
    .map((_) => COURSE_TEMPLATE);

type CoursesFilter = {
    subject: string;
    category: string;
};

const DEFAULT_FILTER: CoursesFilter = {
    subject: '',
    category: '',
};

const CATEGORY: Record<string, string> = arrayToRecord([
    CategoryFallback,
    'Individual',
    'Free',
    'Premium',
    'Series',
    'New',
]);
const SUBJECT: Record<string, string> = arrayToRecord(['G25', 'T27I', 'BTMC', 'Tidal']);

function CoursesLibraryPage() {
    const modalCtx = useModal();

    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // TODO API call
                setCourses(COURSES_TEMPLATE);
            } catch (error: unknown) {
                if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        };
        fetchCourses();
    }, []);

    return (
        <LibraryTemplate
            type={'Media'}
            heading={'All Courses'}
            items={courses}
            filterSetup={{
                default: DEFAULT_FILTER,
                option: {
                    category: { options: CATEGORY },
                    subject: { options: SUBJECT },
                },
            }}
            urlParamName={'category'}
            renderItem={(item) => <MediaCard {...item} />}
        />
    );
}

export default CoursesLibraryPage;
