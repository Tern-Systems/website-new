'use client';

import React, { ReactElement, useEffect, useState } from 'react';
import cn from 'classnames';

import { DeepPartial } from '@/app/types/utils';
import { Fallback, Route } from '@/app/static';
import { ResourceSectionData } from '@/app/types/layout';
import { Course, COURSE_TEMPLATE, COURSES_TEMPLATE } from '@/app/types/course';

import { BreadcrumbRoute, Content, H1, H3, Section } from '@/app/ui/atoms';
import { Carousel, MediaCard, Video } from '@/app/ui/organisms';
import { CardCheckersSection, ResourcesSection } from '@/app/ui/templates';
import { PageLink } from '@/app/ui/layout';
import { MessageModal } from '@/app/ui/modals';
import { useModal } from '@/app/hooks';
import { formatDate } from '@/app/utils';

import styles from '@/app/common.module.css';

const TEMPLATED_ADDITIONAL: AdditionalInfo = {
    nextSeries: COURSES_TEMPLATE,
    recommended: COURSES_TEMPLATE,
    recentlyViewed: COURSES_TEMPLATE,
};

type AdditionalInfo = DeepPartial<Record<'nextSeries' | 'recommended' | 'recentlyViewed', Course[]>>;

const DESCRIPTION_COLLAPSED_LENGTH = 45;

// TODO links
const RESOURCES: ResourceSectionData[] = [
    { Node: <PageLink href={''}>Credentials</PageLink> },
    { Node: <PageLink href={Route.Subscriptions} /> },
    { Node: <PageLink href={Route.GeneralFAQs} /> },
];

const renderCarouselSection = (title: string, cards: Course[] | undefined) => {
    const CardsLi: ReactElement[] | undefined = cards?.map((card, idx) => (
        <MediaCard
            key={title + idx}
            {...card}
        />
    ));

    return CardsLi ? (
        <Section className={{ section: 'mt-xxl md:mt-5xl lg:mt-6xl-1' }}>
            <Carousel altData={{ title, cards: CardsLi, altSpinner: 'top' }} />
        </Section>
    ) : null;
};

function CoursePage() {
    const modalCtx = useModal();

    const [descriptionExpanded, setDescriptionExpanded] = useState(false);
    const [course, setCourse] = useState<Course | null>(null);
    const [additional, setAdditional] = useState<AdditionalInfo | null>(null);

    useEffect(() => {
        // TOOD parse course
        // const courseStr = sessionStorage.getItem(StorageEnum.course);
        // if (courseStr)
        // setCourse(JSON.parse(courseStr));
        setCourse(COURSE_TEMPLATE);

        try {
            // TODO api call
            setAdditional(TEMPLATED_ADDITIONAL);
        } catch (err: unknown) {
            if (typeof err === 'string') modalCtx.openModal(<MessageModal>{err}</MessageModal>);
        }
    }, []);

    const toggleExpandDescription = () => setDescriptionExpanded((prevState) => !prevState);

    return (
        <Content type={'to-top'}>
            <Section>
                <BreadcrumbRoute leave={course?.subject} />
                <H1
                    type={'small'}
                    className={'mt-xxl'}
                >
                    {course?.subject}
                </H1>
                <div className={cn(styles.contentHighlight, 'sm:mt-xxs mt-n')}>
                    <Video
                        label={course?.label}
                        durationMs={course?.durationMs}
                        url={course?.content}
                        className={'w-full'}
                    />
                </div>
                <H3 className={'sm:mt-3xs-1 mt-xs  sm:text-18'}>{course?.title}</H3>
                <div className={'px-4xs bg-gray !leading-n  sm:mt-3xs-1 mt-xs  sm:py-4xs py-3xs'}>
                    <p>{course?.date ? formatDate(course?.date) : 'Date ' + Fallback}</p>
                    <p className={'sm:mt-4xs mt-xxs'}>
                        <span className={'text-12 md:text-14 lg:text-16'}>
                            {descriptionExpanded
                                ? course?.description
                                : course?.description?.slice(0, DESCRIPTION_COLLAPSED_LENGTH) + ' ... '}
                        </span>
                        <span
                            onClick={toggleExpandDescription}
                            className={cn('font-bold cursor-pointer', 'text-10 md:text-12 lg:text-14', {
                                ['block']: descriptionExpanded,
                            })}
                        >
                            See&nbsp;{descriptionExpanded ? 'less' : 'more'}
                        </span>
                    </p>
                </div>
            </Section>
            {renderCarouselSection('Next in this series', additional?.nextSeries)}
            <CardCheckersSection
                type={'regular'}
                idx={2}
                className={'sm:mt-xxl mt-5xl'}
            />
            {renderCarouselSection('Recommended courses', additional?.recommended)}
            <CardCheckersSection
                type={'default'}
                idx={2}
                className={'sm:mt-xxl mt-5xl'}
            />
            {renderCarouselSection('Recently viewed', additional?.recommended)}
            <ResourcesSection
                data={RESOURCES}
                className={'mt-6xl-1 lg:mt-7xl-1'}
            />
        </Content>
    );
}

export default CoursePage;
