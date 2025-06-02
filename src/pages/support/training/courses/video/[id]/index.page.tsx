'use client';

import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import cn from 'classnames';

import { Course } from '@/app/types/blog';
import { Route } from '@/app/static';

import { useModal } from '@/app/hooks';

import { ArticleCard, Carousel, ResourceCard } from '@/app/ui/organisms';

import styles from '@/app/common.module.css';

import JPG_GIRL_LAPTOP from '@/assets/images/girl-on-laptop-2.jpg';
import JPG_PEOPLE_WALKING from '@/assets/images/people-walking.jpg';
import { BreadcrumbRoute } from '@/app/ui/atoms';
import { CourseService } from '@/app/services/course.service';
import { MessageModal } from '@/app/ui/modals';
import { PageLink } from '@/app/ui/layout';
import { CardLink, ResourceSectionData } from '@/app/types/layout';
import { ResourcesSection } from '@/app/ui/templates';

const HIGHLIGHTED_CARD: CardLink = {
    icon: JPG_PEOPLE_WALKING,
    title: 'Stay Ahead with the Latest Tech News',
    description:
        'Weekly insights, research and expert views on AI, security, cloud and more in the All Ways Newsletter.',
    action: { title: 'Subscribe Today', href: '' },
};

const RESOURCES: ResourceSectionData[] = [
    { Node: <PageLink href={''}>Credentials</PageLink> },
    { Node: <PageLink href={''}>Subscriptions</PageLink> },
    { Node: <PageLink href={''}>FAQs</PageLink> },
];

function VideoPage() {
    const COMPACT_LINES = 1;

    const modalCtx = useModal();

    const { id } = useParams() ?? ({} as { id: string });

    const [course, setCourse] = useState<Course | null>(null);
    const [cards, setCards] = useState<Course[]>([]);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const courseStr: string | null = localStorage.getItem('course');
        if (courseStr) {
            const course: Course = JSON.parse(courseStr);
            setCourse(course);
        }

        const cardsJson = localStorage.getItem('course-cards');

        if (cardsJson) {
            setCards(JSON.parse(cardsJson));
        } else {
            CourseService.getCourses()
                .then(({ payload }) => setCards(payload.next))
                .catch((error: unknown) => {
                    if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
                });
        }
    }, [id]);

    const CardsLi: ReactElement[] = cards
        .filter((card) => card.id !== course?.id)
        .map((course, idx) => (
            <li
                key={course?.id ?? 'card-' + idx}
                className={'contents'}
            >
                <ArticleCard
                    article={course}
                    type='compact'
                />
            </li>
        ));

    return (
        <>
            <div className='absolute bottom-0 left-0 right-0 h-[100px] lg:h-[140px] bg-gradient-to-t from-blue to-transparent -z-5 pointer-events-none' />
            <div className='absolute left-0 right-0 top-0 bottom-[70%] sm:bottom-[87%] bg-[radial-gradient(circle,#178ab7_0%,transparent_45%)] pointer-events-none -z-10' />
            <div className='relative'>
                <div className={styles.content}>
                    <BreadcrumbRoute />
                </div>
                <div className={cn(styles.content, 'pt-xl')}>
                    <div className='col-span-2 flex flex-col w-full h-fit'>
                        <h1 className='leading-n text-40 sm:text-24 mb-xxs'>{course?.series} Series</h1>
                        <div className='contents'>
                            <ArticleCard
                                type='compact'
                                article={course}
                                hideTitle={true}
                            />
                        </div>
                        <div className='text-32 md:text-27 sm:text-18 pt-xs sm:pt-3xs'>{course?.title}</div>
                        <div className={cn('my-4xs bg-[#444444] text-white p-4xs')}>
                            <p
                                className={cn(
                                    'text-16 md:text-14 sm:text-12 mb-4xs',
                                    !expanded && `line-clamp-${COMPACT_LINES}`,
                                )}
                            >
                                {course?.date
                                    ? new Date(course?.date).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                      })
                                    : 'Date TBD'}
                            </p>
                            <p
                                className={cn(
                                    'text-14 md:text-12 sm:text-10',
                                    !expanded && `line-clamp-${COMPACT_LINES}`,
                                )}
                            >
                                {course?.description}
                            </p>
                            <button
                                onClick={() => setExpanded((e) => !e)}
                                className='font-bold text-14 md:text-12 sm:text-10 mt-2 hover:underline'
                            >
                                {expanded ? 'Show less' : 'Show more'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <section className={cn(styles.content, 'mt-xl')}>
                <Carousel
                    altData={{
                        title: 'Next in series',
                        link: Route.CourseVideo,
                        cards: CardsLi,
                    }}
                    className='w-full !border-none'
                    classNameTitle='!mx-0 w-full !max-w-full'
                    classNameUl='grid-cols-4 md:grid-cols-3 sm:grid-cols-1 sm:grid-rows-2 w-full mx-0'
                    cardsPerPage={{
                        default: 4,
                        md: 3,
                        sm: 2,
                    }}
                    type={true}
                />
            </section>
            <div className={cn(styles.content)}>
                <section className={cn('mt-xl flex flex-col bg-black lg:flex-row justify-center items-center gap-xl')}>
                    <div className='lg:hidden w-full'>
                        <h2 className='md:text-27 sm:text-21'>Professional Certifications</h2>
                    </div>
                    <div className='flex w-full justify-center'>
                        <Image
                            src={JPG_GIRL_LAPTOP}
                            alt='Professional Certification'
                            className='max-w-full'
                        />
                    </div>
                    <div className='w-full text-left space-y-xs'>
                        <h2 className='text-32 lg:visible md:hidden sm:hidden'>Professional Certifications</h2>
                        <p className='leading-n text-16'>
                            Verify your knowledge by earning the credentials you qualify for. We present an easy to
                            navigate resource, making it easier for you to find the credentials and related learning
                            material that matter most.
                        </p>
                        <ul className='space-y-4'>
                            <li className='flex gap-x-4xs'>
                                <span className='text-blue'>✔</span> Get certified
                            </li>
                            <li className='flex gap-x-4xs'>
                                <span className='text-blue'>✔</span> Earn a badge
                            </li>
                            <li className='flex gap-x-4xs'>
                                <span className='text-blue'>✔</span> View your earned credentials
                            </li>
                        </ul>
                        <PageLink
                            href={''} // TODO
                            icon={'arrow-right-long'}
                            className={cn(
                                'flex-row-reverse justify-between px-xxs py-3xs w-full bg-blue',
                                'text-14 lg:text-16',
                                'h-fit !w-fit',
                            )}
                            iconClassName={cn('sm:size-6xs sm:[&_*]size-6xs size-3xs', 'ml-xl')}
                        >
                            Explore Tern Credentials
                        </PageLink>
                    </div>
                </section>
            </div>
            <section className={cn(styles.content, 'mt-xl')}>
                <Carousel
                    altData={{
                        title: 'Recommended courses',
                        link: Route.CourseVideo,
                        cards: CardsLi,
                    }}
                    className='w-full !border-none'
                    classNameTitle='!mx-0 w-full !max-w-full'
                    classNameUl='grid-cols-4 md:grid-cols-3 sm:grid-cols-1 sm:grid-rows-2 w-full mx-0'
                    cardsPerPage={{
                        default: 4,
                        md: 3,
                        sm: 2,
                    }}
                    type={true}
                />
            </section>
            <section className={cn(styles.content, 'mt-xl')}>
                <ResourceCard
                    type={'highlighted'}
                    icon={HIGHLIGHTED_CARD.icon}
                    title={HIGHLIGHTED_CARD.title}
                    action={HIGHLIGHTED_CARD.action}
                    className={{
                        wrapper: cn(
                            'text-black',
                            'lg:x-[!grid-cols-2,gap-x-0] lg:col-span-2',
                            'md:x-[!grid-cols-2,gap-x-0] md:[&]:x-[col-span-2,px-xl]',
                            'sm:x-[mx-auto,w-full]',
                        ),
                        image: '!size-full object-cover',
                        content: 'lg:pl-l md:pl-l md:flex',
                        title: 'text-20  md:text-24  lg:text-27',
                        link: 'text-primary md:mt-auto',
                    }}
                >
                    {HIGHLIGHTED_CARD.description}
                </ResourceCard>
            </section>
            <section className={cn(styles.content, 'mt-xl')}>
                <Carousel
                    altData={{
                        title: 'Recently viewed',
                        link: Route.CourseVideo,
                        cards: CardsLi,
                    }}
                    className='w-full !border-none'
                    classNameTitle='!mx-0 w-full !max-w-full'
                    classNameUl='grid-cols-4 md:grid-cols-3 sm:grid-cols-1 sm:grid-rows-2 w-full mx-0'
                    cardsPerPage={{
                        default: 4,
                        md: 3,
                        sm: 2,
                    }}
                    type={true}
                />
            </section>
            <section className='relative z-10'>
                <ResourcesSection
                    data={RESOURCES}
                    className={'mb-[22.125rem] my-6xl-1'}
                />
            </section>
        </>
    );
}

export default VideoPage;
