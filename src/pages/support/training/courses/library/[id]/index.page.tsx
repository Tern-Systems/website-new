import { Section, Content } from '@/app/ui/atoms';
import { Video } from '@/app/ui/organisms';
import { ResourcesSection } from '@/app/ui/templates';
import { Route } from '@/app/static';
import { PageLink } from '@/app/ui/layout';
import { ResourceSectionData } from '@/app/types/layout';
import { Carousel, ResourceCard } from '@/app/ui/organisms';
import cn from 'classnames';
import { MISC_LINKS } from '@/app/static';
import styles from '@/app/common.module.css';
import { useRef } from 'react';
import PNG_CARD_DEFAULT_3 from '@/assets/images/resource-card-default-3.png';
import { COURSES_TEMPLATE } from '@/app/types/course';
import { MediaCard } from '@/app/ui/organisms';
import { H1, H2, H3 } from '@/app/ui/atoms';
import { useParams } from 'next/navigation';
import { BreadcrumbRoute } from '@/app/ui/atoms';
import { VideoDescription } from '@/app/ui/organisms';
import RESOURCE_CARD_REG_3 from '@/assets/images/resource-card-regular-3.png';

const RESOURCES: ResourceSectionData[] = [
    { Node: <PageLink href={Route.ProfessionalCertifications} /> },
    { Node: <PageLink href={Route.Subscriptions} /> },
    { Node: <PageLink href={Route.TrainingFAQs} /> },
];
const courseCards = COURSES_TEMPLATE.map((course) => (
    <MediaCard key={course.id} {...course} />
));


function CoursePage() {
    const params = useParams();
    const courseId = params?.id;
    const videoRef = useRef(null);
    const currCourse = COURSES_TEMPLATE.find(c => c.id === courseId);

    return (
        <>
            <Section
                type="full-screen"
                className={{
                    content: cn(styles.contentHighlight),
                }}
            >
                <BreadcrumbRoute length={3} leave={currCourse?.title}/>
                <H2 className="py-xl">{currCourse?.title} Series</H2>
                <Video
                    ref={videoRef}
                    url={currCourse?.content}
                    className={'size-full'}
                />
                <div className="my-xs">
                    <H3 className="mb-xs">{currCourse?.title}</H3>
                    <VideoDescription
                        date={currCourse?.date}
                        description={currCourse?.description}
                    />
                </div>
            </Section>
            <Section>
                {courseCards.length ? (
                    <Carousel
                        altData={{
                            title: 'Next in this series',
                            cards: courseCards
                        }}
                        rowsCount={1}
                        classNameArrow="md:block"
                    />) : 
                    (<span>No courses found</span>)
                }
            </Section>
            <Section>
                <ResourceCard
                    type={'default'}
                    icon={RESOURCE_CARD_REG_3}
                    title={'Professional Certifications'}
                    action={{
                        title: 'Explore Tern credentials',
                        href: Route.Support
                    }}
                    bullets={['Get certified', 'Earn a badge', 'View your earned credentials']}
                    className={{
                        wrapper: cn(
                            'text-white my-20',
                            'lg:x-[!grid-cols-2,gap-x-0] lg:col-span-2',
                            'md:x-[!grid-cols-2,gap-x-0] md:[&]:x-[col-span-2,px-xl]',
                            'sm:x-[mx-auto,w-full]',
                        ),
                        image: '!size-full object-cover',
                        content: 'lg:pl-l  md:pl-l md:flex',
                        title: 'text-20  md:text-24  lg:text-27',
                        children: 'text-14  sm:text-12',
                        link: 'text-primary text-12 [&]:py-4xs md:x-[text-14,mt-auto,!py-4xs]  lg:x-[text-18,!py-xxs]',
                    }}
                >
                    Verify your knowledge by earning the credentials you qualify for. We present an easy to navigate resource, making it easier for you to find the credentials and related learning material that matter most.
                </ResourceCard>
            </Section>
            <Section>
                {courseCards.length ? (
                    <Carousel
                        altData={{
                            title: 'Recently Viewed',
                            cards: courseCards
                        }}
                        rowsCount={1}
                        classNameArrow="md:block"
                    />) : 
                    (<span>No courses found</span>)}
            </Section>
            <Section>
                <ResourceCard
                    type={'highlighted'}
                    icon={PNG_CARD_DEFAULT_3}
                    title={'Stay ahead with the latest tech news'}
                    action={{
                        title: 'Subscribe today',
                        href: Route.AllWays
                    }}
                    className={{
                        wrapper: cn(
                            'text-black my-20',
                            'lg:x-[!grid-cols-2,gap-x-0] lg:col-span-2',
                            'md:x-[!grid-cols-2,gap-x-0] md:[&]:x-[col-span-2,px-xl]',
                            'sm:x-[mx-auto,w-full]',
                        ),
                        image: '!size-full object-cover',
                        content: 'lg:pl-l  md:pl-l md:flex',
                        title: 'text-20  md:text-24  lg:text-27',
                        children: 'text-14  sm:text-12',
                        link: 'text-primary text-12 [&]:py-4xs md:x-[text-14,mt-auto,!py-4xs]  lg:x-[text-18,!py-xxs]',
                    }}
                >
                    Weekly insights, research and expert views on AI, security, cloud and more in the All Ways Newsletter.
                </ResourceCard>
            </Section>
            <ResourcesSection data={RESOURCES} className="my-20">Additional resources</ResourcesSection>
        </>
    );
}

export default CoursePage;