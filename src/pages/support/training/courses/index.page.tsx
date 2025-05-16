'use client';

import cn from 'classnames';

import { MainBackground } from '@/app/ui/atoms';

import styles from '@/app/common.module.css';

import JPG_OPENOFFICE2 from '@/assets/images/open-office-2.jpg';
import { CourseCard } from '@/app/ui/organisms';
import { SubscribeCard } from './SubscribeCard';
import { Button } from '@/app/ui/form';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { AllWaysCard, InsideTernSection } from '@/app/ui/templates';
import { TernAcademyCard } from '@/app/ui/templates/Sections/TernAcademyCard';

function CoursesPage() {
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
                <div className='absolute top-0 left-0 right-0 h-[120px] lg:h-[160px] bg-gradient-to-b from-blue to-transparent z-0' />
                <div className='absolute bottom-0 left-0 right-0 h-[120px] lg:h-[160px] bg-gradient-to-t from-blue to-transparent z-0' />
                <section className={cn(styles.content, 'flex flex-col')}>
                    <div className='flex flex-row sm:flex-col pt-6xl gap-8'>
                        <div className='lg:w-1/3 md:w-1/2 flex flex-col'>
                            <h2 className='text-40 pb-xl'>Most Popular</h2>
                            <CourseCard
                                type={'popular'}
                                course={null}
                                // article={articlesFinal[0]}
                            />
                            <CourseCard
                                type={'popular'}
                                course={null}
                                // article={articlesFinal[1]}
                            />
                            <CourseCard
                                type={'popular'}
                                course={null}
                                // article={articlesFinal[2]}
                            />
                        </div>
                        <div className='lg:w-2/3 md:w-1/2 flex flex-col'>
                            <h2 className='text-40 pb-xl'>Featured</h2>
                            <div className='box-content grid grid-cols-1 lg:grid-cols-2 grid-rows-2 pb-xl h-[452px]'>
                                <CourseCard
                                    type={'featured'}
                                    course={null}
                                    // article={articlesFinal[2]}
                                />
                                <CourseCard
                                    type={'featured'}
                                    course={null}
                                    // article={articlesFinal[2]}
                                />
                                <CourseCard
                                    type={'featured'}
                                    course={null}
                                    // artic    le={articlesFinal[2]}
                                />
                                <CourseCard
                                    type={'featured'}
                                    course={null}
                                    // article={articlesFinal[2]}
                                />
                            </div>
                            <SubscribeCard />
                        </div>
                    </div>
                    <div className='py-6xl flex flex-col'>
                        <h2 className='text-40 pb-xl'>Free Courses</h2>
                        <div className='flex w-full justify-between sm:justify-center space-x-n'>
                            <CourseCard
                                type={'default'}
                                course={null}
                                // article={articlesFinal[0]}
                            />
                            <CourseCard
                                type={'default'}
                                course={null}
                                className='sm:hidden'
                                // article={articlesFinal[1]}
                            />
                            <CourseCard
                                type={'default'}
                                course={null}
                                className='lg:grid hidden'
                                // article={articlesFinal[2]}
                            />
                        </div>
                        <div>
                            <Button
                                icon={faArrowRight}
                                className={'mt-s flex-row-reverse !gap-x-4xs self-start text-blue sm:text-18 text-20'}
                            >
                                See all
                            </Button>
                        </div>
                    </div>
                    <hr className='' />
                </section>
                <section className={cn(styles.content, 'flex flex-col')}>
                    <AllWaysCard
                        alt={true}
                        className={{ wrapper: cn('w-full sm:!max-w-full !m-0') }}
                    />
                    <div className='pt-xxl pb-6xl flex flex-col'>
                        <h2 className='text-40 pb-xl'>Premium Courses</h2>
                        <div className='flex w-full justify-between sm:justify-center space-x-n'>
                            <CourseCard
                                type={'default'}
                                course={null}
                                // article={articlesFinal[0]}
                            />
                            <CourseCard
                                type={'default'}
                                course={null}
                                className='sm:hidden'
                                // article={articlesFinal[1]}
                            />
                            <CourseCard
                                type={'default'}
                                course={null}
                                className='lg:grid hidden'
                                // article={articlesFinal[2]}
                            />
                        </div>
                        <div>
                            <Button
                                icon={faArrowRight}
                                className={'mt-s flex-row-reverse !gap-x-4xs self-start text-blue sm:text-18 text-20'}
                            >
                                See all
                            </Button>
                        </div>
                    </div>
                    <hr className='' />
                </section>
                <section className={cn(styles.content, 'flex flex-col')}>
                    <div className='pt-6xl'>
                        <TernAcademyCard />
                    </div>
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
