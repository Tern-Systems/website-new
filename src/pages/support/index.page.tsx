'use client';

import { useState } from 'react';
import { VideoCard } from '@/app/ui/organisms/VideoCard';

const ITEMS_PER_PAGE = 24;

const mockCourses = Array.from({ length: 100 }).map((_, i) => ({
  id: `course-${i}`,
  title: 'TernKey version 1.0.0 – beta Tutorial',
  date: 'Mar 22, 2025',
  duration: '07:41',
  tag: 'BTMC',
  thumbnail: '/images/sample-course.png',
}));

export default function SupportPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(mockCourses.length / ITEMS_PER_PAGE);

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCourses = mockCourses.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <main className="bg-black min-h-screen text-white px-6 py-8">
      <div className="text-sm text-neutral-500 mb-4">Courses / Library</div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-5xl font-bold">All Courses</h1>
      </div>

      <div className="w-full mb-8">
        <input
          type="text"
          className="w-full bg-neutral-800 text-white px-4 py-2 placeholder-neutral-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-4 gap-y-8 mb-12">
        {currentCourses.map((course) => (
          <VideoCard key={course.id} course={course} />
        ))}
      </div>

      <div className="flex justify-start items-center gap-0 mt-4">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
    disabled={currentPage === 1}
    className="px-4 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-none border border-neutral-600 disabled:opacity-50"
  >
    &laquo;
  </button>

  {Array.from({ length: totalPages }).map((_, i) => (
    <button
      key={i}
      onClick={() => setCurrentPage(i + 1)}
      className={`px-4 py-3 border border-neutral-600 rounded-none ${
        currentPage === i + 1
          ? 'bg-cyan-600 text-white'
          : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-700'
      }`}
    >
      {i + 1}
    </button>
  ))}

  <button
    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
    disabled={currentPage === totalPages}
    className="px-4 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-none border border-neutral-600 disabled:opacity-50"
  >
    &raquo;
  </button>
</div>
    </main>
  );
}
