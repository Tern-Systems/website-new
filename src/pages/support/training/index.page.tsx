'use client';

import Link from 'next/link';
import { VideoCard } from '@/app/ui/organisms/VideoCard';

import { PageLink } from '@/app/ui/layout';
import { ResourceCards, ResourcesSection } from '@/app/ui/templates';

import { ResourceLink, ResourceSectionData } from '@/app/types/layout';
import { Route } from '@/app/static';
import { DOCUMENTATION_LINKS } from '@/app/static/documentation';

import { Carousel } from '@/app/ui/organisms';
import shutterstock_2177147473  from  '@/assets/images/shutterstock_2177147473.png';


const courses = [
    {
        id: '1',
          title: 'TernKey Version 1.0.0 -beta tutorial',
          date: 'March 22, 2025',
          duration: '07:41',
          thumbnail: '/assets/images/resources-card-4.png',
          tag: 'Tutorial',
        },
        {
            id: '2',
              title: 'TernKey Version 1.0.0 -beta tutorial',
              date: 'March 22, 2025',
              duration: '07:41',
              thumbnail: '/assets/images/resources-card-4.png',
              tag: 'Tutorial',
            },
            {
                id: '3',
                  title: 'TernKey Version 1.0.0 -beta tutorial',
                  date: 'March 22, 2025',
                  duration: '07:41',
                  thumbnail: '/assets/images/resources-card-4.png',
                  tag: 'Tutorial',
                },
                {
                    id: '4',
                      title: 'TernKey Version 1.0.0 -beta tutorial',
                      date: 'March 22, 2025',
                      duration: '07:41',
                      thumbnail: '/assets/images/resources-card-4.png',
                      tag: 'Tutorial',
                    },
                    
                                          
];


const RESOURCES: ResourceSectionData[] = [
    { Node: <PageLink href={Route.Downloads} /> },
    { Node: <PageLink href={Route.Cases}></PageLink> },
    { Node: <PageLink href={Route.SupportHub} /> },
];




function TrainingPage() {
    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-black via-[#002c40] to-[#004466] text-white font-sans">
            <div className="text-sm text-gray-400 px-8 pt-8 space-x-1">
                <Link href="/courses" className="hover:underline text-blue-300">Courses</Link>
                <span>/</span>
                <Link href="/support" className="hover:underline text-blue-300">Library</Link>
                <span>/</span>
                <Link href="/tidal-tutorial" className="hover:underline text-blue-300">Tidal Tutorial</Link>
            </div>
            <div className="px-8 pt-8">
                <h1 className="text-4xl font-light mb-4">Tidal Tutorial Series</h1>

                <div className="relative w-full aspect-video bg-black overflow-hidden">
                    <div
                        className="absolute top-0 left-0 text-xs px-1 py-[2px]"
                        style={{
                            backgroundColor: '#B3B3B3',
                            color: '#111',
                            fontSize: '11px',
                            lineHeight: 'normal',
                        }}
                    >
                        Tidal
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center cursor-pointer">
                            <div
                                className="w-0 h-0"
                                style={{
                                    borderLeft: '12px solid black',
                                    borderTop: '8px solid transparent',
                                    borderBottom: '8px solid transparent',
                                }}
                            />
                        </div>
                    </div>

                    <div
                        className="absolute bottom-0 right-0 text-xs px-1 py-[2px]"
                        style={{
                            backgroundColor: '#B3B3B3',
                            color: '#111',
                            fontSize: '11px',
                            lineHeight: 'normal',
                        }}
                    >
                        07:41
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="text-3xl font-light mb-1">Tidal – Getting Started</h2>
                    <div className="mt-3 w-full bg-gray px-4 py-3 shadow-md">
                        <p className="text-xs text-gray-400 mb-1">November 17, 2025</p>
                        <p className="text-sm text-gray-200 leading-snug">
                            In this "Tidal – Getting Started"...
                            <span className="text-blue-400 underline cursor-pointer ml-1">See more</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="h-10" />
            <div className="px-6 pt-10">
                <Carousel
                   altData={{
                     title: 'Next in this series',
                     link: Route.Courses,
                     cards: courses.map(video => (
                       <li key={video.id} className="contents">
                         <VideoCard course={video} />
                       </li>
                     )),
                   }}
                   classNameUl="mx-0 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-3 w-full sm:w-fit"
                   cardsPerPageOverride={4}
                />
            </div>

            <div className="flex flex-col md:flex-row bg-black text-white mt-16 p-6 md:p-16 items-center justify-center">
                <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
                    <img
                        src="/assets/images/Girl on laptop 2.png"
                        alt="Professional Certification"
                        className="rounded-lg shadow-lg max-w-full h-auto"
                    />
                </div>
                <div className="w-full md:w-1/2 text-left">
                    <h2 className="text-3xl md:text-4xl font-light mb-4">Professional Certifications</h2>
                    <p className="text-gray-300 mb-6">
                        Verify your knowledge by earning the credentials you qualify for. We present an easy to navigate resource, making it easier for you to find the credentials and related learning material that matter most.
                    </p>
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                            <span className="text-teal-400 mr-2">✔</span> Get certified
                        </li>
                        <li className="flex items-center">
                            <span className="text-teal-400 mr-2">✔</span> Earn a badge
                        </li>
                        <li className="flex items-center">
                            <span className="text-teal-400 mr-2">✔</span> View your earned credentials
                        </li>
                    </ul>
                    <button className="bg-[#0da6c2] text-white px-6 py-2 hover:bg-[#0b90aa] transition">
                        Explore Tern Credentials →
                    </button>
                </div>
            </div>

            <div className="h-10" />

            <div className="px-8 pt-12">
            <Carousel
                   altData={{
                     title: 'Recommended courses',
                     link: Route.Courses,
                     cards: courses.map(video => (
                       <li key={video.id} className="contents">
                         <VideoCard course={video} />
                       </li>
                     )),
                   }}
                   classNameUl="mx-0 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-3 w-full sm:w-fit"
                   cardsPerPageOverride={4}
                />  
            </div>

            <div className="w-[93%] mx-auto mt-16 bg-[#d9d9d9] px-10 py-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-[40%]">
                    <img
                        src="/assets/images/shutterstock_2177147473.png"
                        alt="Professional Certification"
                        className=" shadow-lg max-w-full h-auto"
                    />
                    </div>
                    <div className="w-full md:w-[60%]">
                        <h2 className="text-lg md:text-xl font-normal text-black mb-4">
                            Stay Ahead with the Latest Tech News
                        </h2>
                        <p className="text-xs text-black mb-6 leading-relaxed max-w-md">
                            Weekly insights, research and expert views on AI, security, cloud and more in the All Ways Newsletter.
                        </p>
                        <div className="h-10" />
                        <button className="bg-[#009fd9] hover:bg-[#007fb1] text-white px-4 py-2 text-sm flex items-center">
                            Subscribe today <span className="ml-2">→</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="h-10" />
            <div className="px-8 pt-8">
            <Carousel
                   altData={{
                     title: 'Recently Viewed',
                     link: Route.Courses,
                     cards: courses.map(video => (
                       <li key={video.id} className="contents">
                         <VideoCard course={video} />
                       </li>
                     )),
                   }}
                   classNameUl="mx-0 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-3 w-full sm:w-fit"
                   cardsPerPageOverride={4}
                />
            </div>

            <div className="h-10" />
            <ResourcesSection
                            data={RESOURCES}
                            className={'mt-6xl-1'}
                        />
                                    <div className="h-10" />

        </div>



    );
}

export default TrainingPage;
