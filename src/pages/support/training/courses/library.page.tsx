'use client';

import { ReactElement, useEffect, useState } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import Image from 'next/image';

import { Route } from '@/app/static';
import { BlogService, CoursesDTO } from '@/app/services/blog.service';
import { Course } from '@/app/types/blog';
import { useModal } from '@/app/hooks';

import { ArticleCard } from '@/app/ui/organisms';
import { MessageModal } from '@/app/ui/modals';
import { PageLink } from '@/app/ui/layout';

import styles from '@/app/common.module.css';
import CodeExample from '@/assets/images/emulator-sample.png';

function CoursesLibraryPage() {
    const modalCtx = useModal();
    const [courses, setCourses] = useState<CoursesDTO | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState('all');
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [uniqueCourses, setUniqueCourses] = useState<Course[]>([]);
    const [itemsPerPage] = useState(16);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { payload } = await BlogService.getCourses();
                setCourses(payload);

                const { payload: allCourses } = await BlogService.getAllCourses();

                const uniqueIds = new Set();
                const uniqueCoursesArray = allCourses.filter((course) => {
                    if (uniqueIds.has(course.id)) return false;
                    uniqueIds.add(course.id);
                    return true;
                });

                setUniqueCourses(uniqueCoursesArray);
            } catch (error: unknown) {
                if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        };
        fetchCourses();
    }, [modalCtx]);

    useEffect(() => {
        if (!courses) return;

        const allCoursesArray = [
            ...(courses?.mostPopular || []),
            ...(courses?.featured || []),
            ...(courses?.videos || []),
            ...(courses?.reading || []),
        ];

        const uniqueIds = new Set();
        const uniqueCoursesArray = allCoursesArray.filter((course) => {
            if (uniqueIds.has(course.id)) return false;
            uniqueIds.add(course.id);
            return true;
        });

        setUniqueCourses(uniqueCoursesArray);
    }, [courses]);

    useEffect(() => {
        if (uniqueCourses.length === 0) return;

        let results = uniqueCourses;
        if (activeFilter !== 'all') {
            results = results.filter((course) => course.type === activeFilter);
        }

        if (searchTerm.trim()) {
            const lowerSearchTerm = searchTerm.toLowerCase().trim();
            results = results.filter(
                (course) =>
                    course.title.toLowerCase().includes(lowerSearchTerm) ||
                    course.description?.toLowerCase().includes(lowerSearchTerm) ||
                    course.content?.toLowerCase().includes(lowerSearchTerm),
            );
        }

        setFilteredCourses(results);
        setCurrentPage(1);
    }, [uniqueCourses, activeFilter, searchTerm]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const getCourseDuration = (course: Course) => {
        const minutes = Math.floor(Math.random() * 10) + 1;
        const seconds = Math.floor(Math.random() * 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatDate = (timestamp: number = Date.now()) => {
        const date = new Date(timestamp);
        const month = date.toLocaleString('default', { month: 'short' });
        return `${month} ${date.getDate()}, ${date.getFullYear()}`;
    };

    const totalPages = Math.max(1, Math.ceil(filteredCourses.length / itemsPerPage));
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    const handleCourseClick = (course: Course) => {
        if (course.type === 'video') {
            // For videos, open in a new window/tab
            window.open(course.url || `/support/training/courses/watch/${course.id}`, '_blank', 'noopener,noreferrer');
        } else {
            // For other content types, navigate within the same window
            window.location.href = `/support/training/courses/${course.id}`;
        }
    };

    const customCourseCards = currentItems.map((course) => (
        <div
            key={course.id}
            className='mb-6'
            onClick={() => handleCourseClick(course)}
        >
            <div className='relative group cursor-pointer'>
                <div className='bg-[#091A2A] rounded-md overflow-hidden relative'>
                    <div className='relative aspect-video'>
                        {course.poster ? (
                            <Image
                                src={course.poster}
                                alt={course.title}
                                layout='fill'
                                objectFit='cover'
                                className='opacity-90'
                            />
                        ) : course.type === 'video' ? (
                            // Use CodeExample for video thumbnails when no poster is available
                            <Image
                                src={CodeExample}
                                alt={course.title}
                                layout='fill'
                                objectFit='cover'
                                className='opacity-90'
                            />
                        ) : (
                            // Use gradient background for non-video content when no poster is available
                            <div className='w-full h-full bg-gradient-to-br from-[#0D2645] to-[#091A2A] flex items-center justify-center p-4'>
                                <div className='text-white text-center text-sm font-medium'>
                                    {course.title || 'Ternary Course Tutorial'}
                                </div>
                            </div>
                        )}
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
                                <div className='w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-0.5'></div>
                            </div>
                        </div>
                    </div>

                    <div className='absolute top-2 left-2 bg-[#1E3A5F] text-xs py-0.5 px-2 rounded text-white'>
                        {course.type.toUpperCase()}
                    </div>

                    <div className='absolute bottom-2 right-2 bg-black/70 text-xs py-0.5 px-2 rounded text-white'>
                        {getCourseDuration(course)}
                    </div>
                </div>

                <h3 className='text-sm mt-2 text-white font-normal'>
                    {course.title || 'Ternary version 1.0.0 - beta Tutorial'}
                </h3>
                <p className='text-xs text-gray-400 mt-1'>{formatDate(course.date)}</p>
            </div>
        </div>
    ));

    return (
        <div className='bg-black min-h-screen pb-20 relative'>
            <div className='container mx-auto px-4 py-4'>
                <div className='text-sm text-gray-400'>
                    <Link
                        href={Route.Courses}
                        className='hover:text-white'
                    >
                        Courses
                    </Link>
                    <span className='mx-2'>/</span>
                    <span className='text-white'>Library</span>
                </div>
            </div>

            <div className='container mx-auto px-4'>
                <h1 className='text-3xl font-normal text-white mb-6'>All Courses</h1>

                <div className='mb-6'>
                    <div className='relative'>
                        <input
                            type='text'
                            placeholder='Search...'
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className='w-full bg-[#0D0D0D] border border-[#333] rounded-md py-2 px-4 pr-10 text-white'
                        />
                        <button className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                            <svg
                                width='20'
                                height='20'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z'
                                    fill='white'
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className='flex mb-6'>
                    <button
                        className={`mr-3 text-xs px-3 py-1 rounded ${activeFilter === 'all' ? 'text-white border border-[#333]' : 'text-gray-400'}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`mr-3 text-xs px-3 py-1 rounded ${activeFilter === 'video' ? 'text-white border border-[#333]' : 'text-gray-400'}`}
                        onClick={() => setActiveFilter('video')}
                    >
                        Videos
                    </button>
                    <button
                        className={`mr-3 text-xs px-3 py-1 rounded ${activeFilter === 'article' ? 'text-white border border-[#333]' : 'text-gray-400'}`}
                        onClick={() => setActiveFilter('article')}
                    >
                        Articles
                    </button>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {currentItems.length > 0 ? (
                        customCourseCards
                    ) : (
                        <div className='col-span-full text-center py-10 text-gray-400'>
                            {searchTerm
                                ? `No courses found matching "${searchTerm}"`
                                : 'No courses found for the selected filter.'}
                        </div>
                    )}
                </div>

                {filteredCourses.length > 0 && (
                    <div className='flex items-center justify-end mt-12 mb-4'>
                        <Link
                            href='#'
                            className='text-[#3B99FC] text-sm mr-4 hover:underline'
                        >
                            See All
                        </Link>

                        <div className='flex'>
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className='h-10 w-10 border border-gray-700 flex items-center justify-center mr-1'
                            >
                                <svg
                                    width='24'
                                    height='24'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                >
                                    <path
                                        d='M15 18L9 12L15 6'
                                        stroke='white'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </svg>
                            </button>

                            <div className='flex items-center text-white'>
                                <div className='h-10 w-10 border border-gray-700 flex items-center justify-center'>
                                    {currentPage}
                                </div>
                                <span className='mx-1'>/</span>
                                <div className='h-10 w-10 border border-gray-700 flex items-center justify-center'>
                                    {totalPages}
                                </div>
                            </div>

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className='h-10 w-10 border border-gray-700 flex items-center justify-center ml-1'
                            >
                                <svg
                                    width='24'
                                    height='24'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                >
                                    <path
                                        d='M9 6L15 12L9 18'
                                        stroke='white'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className='absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-blue to-transparent z-0' />
        </div>
    );
}

export default CoursesLibraryPage;
