'use client';

import cn from 'classnames';
import Image from 'next/image';

import { MainBackground } from '@/app/ui/atoms';

import styles from '@/app/common.module.css';

import JPG_OPENOFFICE2 from '@/assets/images/open-office-2.jpg';
import PNG_MICROPROCESSOR from '@/assets/images/microprocessor.png';
import JPG_CARD_BACK from '@/assets/images/tern-academy-card.jpg';
import SVG_LOGO from '@/assets/images/tern-logo.svg';
import { Carousel, ArticleCard, ResourceCard } from '@/app/ui/organisms';

import { useModal } from '@/app/hooks';

import { AllWaysCard, InsideTernSection } from '@/app/ui/templates';
import { ArticleCardType } from '@/app/ui/organisms/ArticleCard';
import { Course } from '@/app/types/blog';
import { ReactElement, useEffect, useState } from 'react';
import { CoursesDTO, CourseService } from '@/app/services/course.service';
import { MessageModal } from '@/app/ui/modals';
import { Route } from '@/app/static';
import { ReactSVG } from 'react-svg';
import { PageLink } from '@/app/ui/layout';

const CAROUSEL_UL_CN = 'mx-0 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full sm:w-fit';

const renderCourses = (type: ArticleCardType, courses: Course[] = []): ReactElement[] =>
    courses.map((course) => (
        <li
            key={course.id}
            className='contents'
        >
            <ArticleCard
                type={type}
                article={course}
                className='[&:not(:first-of-type)]:border-t-0'
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

    const CardsPopularLi: ReactElement[] = renderCourses('alt-vertical', courses?.popular);
    const CardsFeaturedLi: ReactElement[] = renderCourses('alt', courses?.featured);
    const CardsFreeLi: ReactElement[] = renderCourses('default', courses?.free);
    const CardsPremiumLi: ReactElement[] = renderCourses('default', courses?.premium);

    return (
        <>
            <section className={cn(styles.section, 'h-[346px] overflow-hidden')}>
                <MainBackground url={JPG_OPENOFFICE2} />
                <div className={cn(styles.content, 'relative z-10 flex flex-col justify-between', 'py-5xl  sm:py-xxl')}>
                    <h1 className={cn('text-64 md:text-80 lg:text-96')}>Courses</h1>
                    <h2 className={'w-full lg:w-2/3  leading-n sm:text-20 text-36'}>
                        Expect the unexpected, <br />
                        learn the unknown
                    </h2>
                </div>
                <div className='absolute inset-0 bg-gradient-to-r from-black via-black via-0% lg:via-5% to-transparent sm:to-60% md:to-40% lg:to-50% z-0' />
            </section>
            <div className={cn(styles.section, 'relative bg-black')}>
                <div className='absolute top-0 left-0 right-0 h-[100px] lg:h-[140px] bg-gradient-to-b from-blue to-transparent z-0' />
                <div className='absolute bottom-0 left-0 right-0 h-[100px] lg:h-[140px] bg-gradient-to-t from-blue to-transparent z-0' />
                <section className={cn(styles.section, 'bg-gradient-to-b from-blue to-transparent to-10%')}>
                    <div
                        className={cn(
                            styles.content,
                            'grid grid-rows-2',
                            'md:grid-cols-2 lg:grid-cols-[15fr,14fr,14fr]',
                            'sm:gap-y-xxl gap-n',
                            'pt-6xl-1 md:pt-6xl-1 lg:pt-6xl',
                        )}
                    >
                        <div className={'row-span-2 flex flex-col'}>
                            <h4 className={' mb-xs md:mb-n lg:mb-xxl  sm:x-[mx-auto,w-card]  sm:text-27 text-40'}>
                                Most Popular
                            </h4>
                            <ul className={'flex flex-col h-full'}>{CardsPopularLi}</ul>
                        </div>
                        <div className={'flex flex-col h-full  lg:col-span-2'}>
                            <Carousel
                                altData={{
                                    title: 'Featured',
                                    link: Route.TipsVideos,
                                    cards: CardsFeaturedLi,
                                    altSpinner: true,
                                }}
                                classNameUl={'flex-grow grid grid-rows-2 gap-0  grid-cols-1 lg:grid-cols-2'}
                            />
                        </div>
                        <ResourceCard
                            type='highlighted'
                            icon={PNG_MICROPROCESSOR}
                            title='Anticipate Tomorrow'
                            action={{ title: 'Subscribe Today', href: '' }}
                            className={{
                                wrapper:
                                    'text-black  lg:x-[!grid-cols-2,gap-x-0] lg:col-span-2  sm:x-[mx-auto,max-w-card]',
                                image: '!size-full object-cover',
                                content: 'lg:pl-l',
                                link: 'text-primary',
                            }}
                        >
                            Subscribe to the All Ways Newsletter for expert insights on the future of cutting-edge
                            technology.
                        </ResourceCard>
                    </div>
                </section>
                <section className={styles.section}>
                    <div className={cn(styles.content, 'pt-xxl md:pt-3xl lg:pt-xl')}>
                        <Carousel
                            altData={{ title: 'Premium Courses', link: Route.TipsReads, cards: CardsFreeLi }}
                            classNameUl={CAROUSEL_UL_CN}
                        />
                    </div>
                </section>
                <section className={styles.section}>
                    <div className={cn(styles.content, 'pt-xxl md:pt-3xl lg:pt-xl')}>
                        <AllWaysCard alt />
                    </div>
                </section>
                <section className={styles.section}>
                    <div className={cn(styles.content, 'pt-xxl md:pt-3xl lg:pt-xl')}>
                        <Carousel
                            altData={{ title: 'Premium Courses', link: Route.TipsReads, cards: CardsPremiumLi }}
                            classNameUl={CAROUSEL_UL_CN}
                        />
                    </div>
                </section>
                <section className={cn(styles.content, 'flex flex-col mt-xxl ')}>
                    <div className={cn('relative flex flex-col min-h-full max-h-full sm:x-[mx-auto]')}>
                        <span className='absolute w-[50%] z-10 left-0 sm:bottom-7xl md:bottom-[120px] lg:bottom-[300px] text-black sm:p-xs p-xl lg:py-xl'>
                            <h3 className='sm:text-27 md:text-36 lg:text-40 pb-xl w-[100%]'>Tern Academy</h3>
                            <div className='text-21 w-[373px] space-y-s sm:space-y-n md:space-y-l sm:hidden'>
                                <p>
                                    Tern Academy is your premier destination for diving into the world of ternary
                                    computing, offering a comprehensive lineup of expertly designed courses that cover
                                    all things Tern.
                                </p>
                                <p>
                                    Whether you&apos;re exploring foundational languages like G25 and BTMC, mastering
                                    the innovative Tidal software stack, or delving into advanced topics like T27I, our
                                    curriculum spans a wide array of subjects to equip you with cutting-edge skills.
                                </p>
                                <p>
                                    With courses tailored for both beginners and seasoned developers, Tern Academy
                                    ensures you have the tools and knowledge to excel in this groundbreaking field, no
                                    matter your starting point.
                                </p>
                            </div>
                            <PageLink
                                href={''} // TODO
                                icon={'arrow-right-long'}
                                className={cn(
                                    'flex-row-reverse justify-between px-xxs py-3xs w-full bg-blue mt-4xl',
                                    'text-14 lg:text-16 text-white',
                                    'right-n bottom-n h-fit !w-fit',
                                    'sm:hidden',
                                )}
                                iconClassName='sm:size-6xs sm:[&_*]size-6xs size-3xs ml-xl'
                            >
                                Explore all courses
                            </PageLink>
                        </span>
                        <ReactSVG
                            src={SVG_LOGO.src}
                            onClick={() => {}}
                            className={cn(
                                'right-[10rem] sm:right-[3rem] top-[3rem] absolute object-cover object-center z-50 sm:w-[120px] md:w-[240px] lg:w-[300px]',
                            )}
                        />
                        <Image
                            src={JPG_CARD_BACK}
                            alt='cubes'
                            className='w-full min-h-full scale-y-[-1] object-cover flex-grow object-center translate-y-0'
                        />
                    </div>
                </section>
                <section>
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
