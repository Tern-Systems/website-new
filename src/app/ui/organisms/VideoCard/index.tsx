'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Course = {
  id: string;
  title: string;
  date: string;
  duration: string;
  thumbnail: string;
  tag: string;
};

type VideoCardProps = {
  course: Course;
  cardLink?: string; // 🆕 optional prop for linking the card
};

const VideoCard = ({ course, cardLink }: VideoCardProps) => {
  const content = (
    <div className="text-white">
      {/* Video Frame Box */}
      <div className="relative bg-black border border-neutral-900 overflow-hidden shadow-sm">
        {/* Tag */}
        <div className="absolute bg-neutral-800 text-xs px-2 py-1 z-10">
          {course.tag}
        </div>

        {/* Thumbnail */}
        <div className="relative">
          <Image
            src={course.thumbnail}
            alt={course.title}
            width={400}
            height={200}
            className="w-full h-48 object-cover"
          />

          {/* Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          {/* Duration */}
          <div className="absolute bottom-0 right-0 text-xs px-2 py-[2px] bg-[#333] text-white">
            {course.duration}
          </div>
        </div>
      </div>

      {/* Title + Date BELOW the video */}
      <div className="mt-3">
        <div className="text-sm font-medium leading-tight">{course.title}</div>
        <div className="text-xs text-neutral-400 mt-1">{course.date}</div>
      </div>
    </div>
  );

  return cardLink ? <Link href={cardLink}>{content}</Link> : content;
};

export { VideoCard };