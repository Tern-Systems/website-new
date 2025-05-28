'use client';

import { ReactElement, useEffect, useState } from 'react';
import cn from 'classnames';

import styles from '@/app/common.module.css';
import { BreadcrumbRoute, SearchBar } from '@/app/ui/atoms';
import { CourseCard, CourseCardType } from '@/app/ui/organisms/CourseCard';
import { Course } from '@/app/types/blog';
import { useModal } from '@/app/hooks';
import { CoursesDTO, CourseService } from '@/app/services/course.service';
import { MessageModal } from '@/app/ui/modals';
import { Button } from '@/app/ui/form';

import SVG_CLOSE from '@/assets/images/icons/close.svg';

const CONTENT_TYPES: Record<string, string> = {
    tbd: 'TBD',
};
const ITEMS_PER_PAGE = 24;

const STYLE_ARROW_BUTTON = 'px-4 py-3 border border-[#979797]';

const renderCourses = (type: CourseCardType, courses: Course[] = []) =>
    courses.map((course) => (
        <li
            key={course.id}
            className={'contents'}
        >
            <CourseCard
                type={type}
                course={course}
                className={'[&:not(:first-of-type)]:border-t-0'}
            />
        </li>
    ));

function LibraryPage() {
    const modalCtx = useModal();

    const [courses, setCourses] = useState<CoursesDTO | null>(null);
    const [tags, setTags] = useState<string[]>(['Tag1', 'Tag2', 'Tag3', 'Tag4']);
    const [page, setPage] = useState(1);

    useEffect(() => {
        CourseService.getCourses()
            .then(({ payload }) => setCourses(payload))
            .catch((err: unknown) => {
                if (typeof err === 'string') {
                    modalCtx.openModal(<MessageModal>{err}</MessageModal>);
                }
            });
    }, []);

    const TagsLi: ReactElement[] = tags.map((tag) => (
        <li
            key={tag}
            className='flex items-center gap-1 pr-4 hover:cursor-pointer'
            onClick={() => {
                setTags((prev) => prev.filter((t) => t !== tag));
            }}
        >
            <div className='text-12'>{tag}</div>
            <Button
                icon={SVG_CLOSE}
                classNameIcon='w-[7px]'
            />
        </li>
    ));

    const totalPages = courses ? Math.ceil(courses.library.length / ITEMS_PER_PAGE) : 0;

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = courses?.library.slice(start, end) ?? [];

    const CardsLibraryLi: ReactElement[] = renderCourses('compact', pageItems);

    return (
        <>
            <div className={(styles.section, cn('pb-xxs'))}>
                <section className={styles.content}>
                    <BreadcrumbRoute />
                    <h1 className={'mt-xxl text-48 md:text-40 sm:text-24'}>All Courses</h1>
                    <div>
                        <SearchBar
                            contentTypes={CONTENT_TYPES}
                            className={(styles.content, cn('mt-xl w-full'))}
                        />
                        <ul className='mt-4xs flex h-[24px]'>{TagsLi}</ul>
                    </div>
                </section>
            </div>
            <ul className={cn(styles.content, 'grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4xl')}>
                {CardsLibraryLi}
            </ul>
            <div className={cn(styles.content, 'flex justify-start items-center gap-0 mt-xxl mb-7xl')}>
                <Button
                    onClick={() => setPage((curr) => Math.max(1, curr - 1))}
                    className={STYLE_ARROW_BUTTON}
                    disabled={page === 1}
                >
                    &laquo;
                </Button>
                {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={cn(
                            'p-3 border-[1px] border-[#979797] text-blue',
                            page === i + 1 ? 'bg-blue text-white' : null,
                        )}
                    >
                        {i + 1}
                    </Button>
                ))}
                <Button
                    onClick={() => setPage((curr) => Math.min(totalPages, curr + 1))}
                    disabled={page === totalPages}
                    className={STYLE_ARROW_BUTTON}
                >
                    &raquo;
                </Button>
            </div>
            <div className='absolute bottom-0 left-0 right-0 h-[100px] lg:h-[140px] bg-gradient-to-t from-blue to-transparent z-0' />
        </>
    );
}

export default LibraryPage;
