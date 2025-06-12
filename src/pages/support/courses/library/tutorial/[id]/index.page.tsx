'use client';

import Link from 'next/link';

import { CONTACT_LINKS, Route } from '@/app/static';
import styles from '@/app/common.module.css';
import { CardCheckersSection } from '@/app/ui/templates';
import { Tip } from '@/app/types/blog';

import cn from 'classnames';

import { PageLink } from '@/app/ui/layout';
import { ResourceCards, ResourcesSection } from '@/app/ui/templates';

import { ResourceLink, ResourceSectionData } from '@/app/types/layout';
import { MediaCard } from '@/app/ui/organisms';

import { usePathname } from 'next/navigation';




const TIP_TEMPLATE: Tip = {
    title: 'Some title',
    description: 'Some useful description',
    category: 'Networking',
    content: 'Some tip ',
    thumbnail: '',
    id: '9uqhe45gf032j0',
    date: 264,
    label: 'Website',
    tag: 'Featured',
    type: 'text',
};

const TIPS_TEMPLATE: Tip[] = Array(813)
    .fill(null)
    .map((_, idx) => ({
        ...TIP_TEMPLATE,
        id: TIP_TEMPLATE.id + idx,
        durationMs: idx % 7 ? 492362 : undefined,
        tag: idx % 7 ? 'Popular' : idx % 5 ? 'Featured' : idx % 11 ? 'Videos' : 'Reads',
        type: idx % 7 ? 'video' : 'text',
    }));




const RESOURCES: ResourceSectionData[] = [
    { Node: <PageLink href={Route.Downloads} /> },
    { Node: <PageLink href={Route.Cases}></PageLink> },
    { Node: <PageLink href={Route.Support} /> },
];




function TrainingPage() {
    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-black via-[#002c40] to-[#004466] text-white font-sans">
            <div className="text-sm text-gray-400 px-8 pt-8 space-x-1 ml-36">
                <Link href="/support/courses" className="hover:underline text-blue-300">Courses</Link>
                <span>/</span>
                <Link href="/support/courses/library" className="hover:underline text-blue-300">Library</Link>
                <span>/</span>
                <Link href={usePathname() ?? '/'} className="hover:underline text-blue-300">Tidal Tutorial</Link>
            </div>
            <div className="px-8 pt-8">
                <h1 className="text-4xl font-light mb-4 ml-36">Tidal Tutorial Series</h1>

                <div className="relative  h-[450px]  bg-black ml-36 w-[1010px]">
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



                <div className="max-w-2xl mx-auto relative">
                    <h2 className="text-3xl font-light mb-4 -ml-44 ">Tidal – Getting Started</h2>
                    <div className="mt-3 w-full bg-gray px-4 py-3 shadow-md -ml-44 w-[1020px]">
                        <p className="text-xs text-gray-400 mb-1">November 17, 2025</p>
                        <p className="text-sm text-gray-200 leading-snug">
                            In this "Tidal – Getting Started"...
                            <span className="text-blue-400 underline cursor-pointer ml-1">See more</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="h-10" />
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4 -ml-44">Next in this series</h2>
                <div className="flex flex-row gap-4 justify-center">
                    {TIPS_TEMPLATE.slice(0, 4).map((tip) => (
                        <div className="min-w-[240px] max-w-[250px]">
                            <MediaCard key={tip.id} {...tip} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-10" />
            <CardCheckersSection type="regular" idx={2} />


            <div className="h-10" />

            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4 -ml-44">Recommended courses</h2>
                <div className="flex flex-row gap-4 justify-center">
                    {TIPS_TEMPLATE.slice(0, 4).map((tip) => (
                        <div className="min-w-[240px] max-w-[240px]">
                            <MediaCard key={tip.id} {...tip} />
                        </div>
                    ))}
                </div>
            </div>


            <CardCheckersSection type="default" idx={2} />
            <div className="h-10" />
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4 -ml-44">Recently Viewed</h2>
                <div className="flex flex-row gap-4 justify-center">
                    {TIPS_TEMPLATE.slice(0, 4).map((tip) => (
                        <div className="min-w-[240px] max-w-[240px]">
                            <MediaCard key={tip.id} {...tip} />
                        </div>
                    ))}
                </div>
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
