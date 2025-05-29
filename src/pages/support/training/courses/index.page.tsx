'use client';

import cn from 'classnames';

import { MainBackground } from '@/app/ui/atoms';

import styles from '@/app/common.module.css';

import JPG_OPENOFFICE2 from '@/assets/images/open-office-2.jpg';
import { Carousel, CourseCard } from '@/app/ui/organisms';
import { SubscribeCard } from './SubscribeCard';

import { useModal } from '@/app/hooks';

import { AllWaysCard, InsideTernSection } from '@/app/ui/templates';
import { TernAcademyCard } from '@/app/ui/templates/Sections/TernAcademyCard';
import { CourseCardType } from '@/app/ui/organisms/CourseCard';
import { Course } from '@/app/types/blog';
import { ReactElement, useEffect, useState } from 'react';
import { CoursesDTO, CourseService } from '@/app/services/course.service';
import { MessageModal } from '@/app/ui/modals';
import { Route } from '@/app/static';

const CAROUSEL_UL_CN = 'mx-0 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full sm:w-fit';

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

function CoursesPage() {
    const modalCtx = useModal();

    const [courses, setCourses] = useState<CoursesDTO | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { payload } = await CourseService.getCourses();
                setCourses(payload);
            } catch (error: unknown) {
                if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        };
        fetchCourses();
    }, []);

    const CardsPopularLi: ReactElement[] = renderCourses('popular', courses?.popular);
    const CardsFeaturedLi: ReactElement[] = renderCourses('featured', courses?.featured);
    const CardsFreeLi: ReactElement[] = renderCourses('default', courses?.free);
    const CardsPremiumLi: ReactElement[] = renderCourses('default', courses?.premium);

    return (
        <>
            <section className={cn(styles.section, 'h-[346px] overflow-hidden')}>
                <MainBackground url={JPG_OPENOFFICE2} />
                <div className={cn(styles.content, 'relative z-10 py-5xl  sm:py-xxl')}>
                    <h1 className={cn(`sm:text-40 text-96`)}>Courses</h1>
                    <h2 className={cn(`sm:mt-6xl mt-5xl  sm:text-20 text-36`)}>
                        Expect the unexpected, <br />
                        learn the unknown
                    </h2>
                </div>
                <div className='absolute inset-0 bg-gradient-to-r from-black via-black via-0% lg:via-5% to-transparent sm:to-60% md:to-40% lg:to-50% z-0' />
            </section>
            <div className={cn(styles.section, 'relative bg-black')}>
                <div className='absolute top-0 left-0 right-0 h-[100px] lg:h-[140px] bg-gradient-to-b from-blue to-transparent z-0' />
                <div className='absolute bottom-0 left-0 right-0 h-[100px] lg:h-[140px] bg-gradient-to-t from-blue to-transparent z-0' />
                <section className={cn(styles.content, 'flex flex-col')}>
                    <div className='flex flex-row sm:flex-col pt-6xl gap-8'>
                        <div className='lg:w-1/3 md:w-1/2 flex flex-col'>
                            <h2 className='text-40 pb-xl'>Most Popular</h2>
                            <ul>{CardsPopularLi}</ul>
                        </div>
                        <div className='lg:w-2/3 md:w-1/2 flex flex-col'>
                            <h2 className='text-40 pb-xl'>Featured</h2>
                            <ul className='box-content grid grid-cols-1 lg:grid-cols-2 grid-rows-2 pb-xl h-[452px]'>
                                {CardsFeaturedLi}
                            </ul>
                            <SubscribeCard />
                        </div>
                    </div>
                    <div className='py-6xl flex w-full flex-col'>
                        <Carousel
                            altData={{
                                title: 'Free Courses',
                                link: Route.CourseVideo,
                                cards: CardsFreeLi,
                            }}
                            className='w-full'
                            classNameUl={cn(CAROUSEL_UL_CN)}
                        />
                    </div>
                </section>
                <section className={cn(styles.content, 'flex flex-col')}>
                    <AllWaysCard
                        alt={true}
                        className={{
                            wrapper: cn('w-full sm:!max-w-full !m-0'),
                        }}
                    />
                    <div className='pt-xxl pb-6xl flex flex-col'>
                        <Carousel
                            altData={{
                                title: 'Premium Courses',
                                link: Route.CourseVideo,
                                cards: CardsPremiumLi,
                            }}
                            className='w-full'
                            classNameUl={cn(CAROUSEL_UL_CN)}
                        />
                    </div>
                </section>
                <section className={cn(styles.content, 'flex flex-col')}>
                    <TernAcademyCard />
                </section>
                <section className=''>
                    <InsideTernSection
                        data={'alt0'}
                        className='bg-transparent pb-7xl'
                    />
                </section>
            </div>
        </>
    );
}

export default CoursesPage;
