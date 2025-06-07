// app/ui/organisms/Vidcarousel.tsx
'use client';

import { FC, useState, useEffect } from 'react';
import { MediaCard } from '@/app/ui/organisms/MediaCard';
import { COURSES_TEMPLATE } from '@/app/types/course';
import { Button } from '@/app/ui/form';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

import { useBreakpointCheck } from '@/app/hooks';
import { Breakpoint } from '@/app/static';

interface VidcarouselProps {
  /** Title to display above the carousel */
  title?: string;
}

export const Vidcarousel: FC<VidcarouselProps> = ({ title = 'Recently Viewed' }) => {
  const allVideos = COURSES_TEMPLATE.slice(0, 16);
  const [page, setPage] = useState(0);

  const bp = useBreakpointCheck();
  let itemsPerPage = bp >= Breakpoint.lg ? 4
                    : bp >= Breakpoint.md ? 3
                    : 1;

  const totalPages = Math.ceil(allVideos.length / itemsPerPage);
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages - 1));
  }, [totalPages]);

  const startIdx     = page * itemsPerPage;
  const currentBatch = allVideos.slice(startIdx, startIdx + itemsPerPage);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div className="mx-auto my-[100px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[22px] font-light text-gray-800">{title}</h2>
        <div className="flex space-x-2">
          <Button
            icon={faCaretLeft}
            onClick={prev}
            disabled={page === 0}
            className="size-7xl flex border-s border-inherit disabled:border-gray-l0 disabled:text-gray"
          />
          <Button
            icon={faCaretRight}
            onClick={next}
            disabled={page >= totalPages - 1}
            className="size-7xl flex border-s border-inherit disabled:border-gray-l0 disabled:text-gray"
          />
        </div>
      </div>

      {/* Responsive grid for cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentBatch.map((course) => (
          <MediaCard
                key={course.id}
                id={course.id!}
                title={course.title!}
                thumbnail={course.thumbnail!}
                label={course.label!}
                durationMs={course.durationMs!}
                date={course.date!} description={''} category={''} content={''} type={'video'}          />
        ))}
      </div>
    </div>
  );
};

Vidcarousel.displayName = Vidcarousel.name;
