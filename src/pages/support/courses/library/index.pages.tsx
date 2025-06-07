'use client';

import { useEffect, useState } from 'react';

import { MediaCardType } from '@/app/types/blog';
import { CategoryFallback } from '@/app/static';

import { arrayToRecord } from '@/app/utils';

import { useModal } from '@/app/hooks';
import { LibraryTemplate } from '@/app/ui/templates';
import { MessageModal } from '@/app/ui/modals';
import { MediaCard } from '@/app/ui/organisms';
import { COURSE_TEMPLATE, COURSES_TEMPLATE } from '@/app/types/course';


interface Course extends MediaCardType {
  url?: string;
}

type CoursesFilter = { category: string; subject:string };
const DEFAULT_COURSE_FILTER: CoursesFilter = { category: '' ,subject:''};

const COURSE_CATEGORIES: Record<string, string> = arrayToRecord([
  CategoryFallback,
  'Free',
  'Premium',
  'Series',
  'New',
]);


const SUBJECT_CATEGORIES: Record<string, string> = arrayToRecord([
  CategoryFallback,
  'G25',
  'T271',
  'BTMC',
  'Tidal',
]);



export default function CoursesLibraryPage() {
  const modalCtx = useModal();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setCourses(COURSES_TEMPLATE);
      } catch (error: unknown) {
        const message =
          typeof error === 'string'
            ? error
            : 'Failed to load courses. Please try again later.';
        modalCtx.openModal(<MessageModal>{message}</MessageModal>);
      }
    }
    fetchCourses();
  }, [modalCtx]);

  return (
    <>
        <LibraryTemplate
        type={'Media'}
        heading={'All Courses'}
        items={courses}
        filterSetup={{
            default: DEFAULT_COURSE_FILTER,
            option: {
        category: { options: COURSE_CATEGORIES },
        subject:  { options: SUBJECT_CATEGORIES },
        },
            date: true,
        }}
        urlParamName={'category'}
        renderItem={(item) => (
            <MediaCard
                key={item.id}
                title={item.title}
                thumbnail={item.thumbnail}
                label={item.label}
                durationMs={item.durationMs}
                date={item.date}
                description={''} category={''} content={''} type={'video'} id={''}        
            />
        )}
        />
    </>
  );
}


