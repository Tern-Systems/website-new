'use client';

import styles from '@/app/common.module.css';

import { useState } from 'react';
import cn from 'classnames';
import { Course } from '@/app/types/blog';

interface Props {
    course: Course | null;
    compactLines?: number;
    className?: string;
    classNameDate?: string;
    classNameDescription?: string;
}

const DescriptionBox = (props: Props) => {
    const COMPACT_LINES = 1;
    const {
        course,
        // compactLines,
        className,
        classNameDate,
        classNameDescription,
    } = props;
    const date = course?.date;
    const description = course?.description ?? '(No description)';

    const [expanded, setExpanded] = useState(false);

    return (
        <div className={cn(className, 'bg-[#444444] text-white p-4xs')}>
            <p
                className={cn(
                    'text-16 md:text-14 sm:text-12 mb-4xs',
                    !expanded && `line-clamp-${COMPACT_LINES}`,
                    classNameDate,
                )}
            >
                {date
                    ? new Date(date).toLocaleDateString('en-US', {
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
                    classNameDescription,
                )}
            >
                {description}
            </p>
            <button
                onClick={() => setExpanded((e) => !e)}
                className='font-bold text-14 md:text-12 sm:text-10 mt-2 hover:underline'
            >
                {expanded ? 'Show less' : 'Show more'}
            </button>
        </div>
    );
};

export { DescriptionBox };
