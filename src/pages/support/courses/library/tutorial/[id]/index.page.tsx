'use client';

import '@/app/globals.css';

import{Route } from '@/app/static';

import {ResourceSectionData } from '@/app/types/layout';
import { ResourceCard } from '@/app/ui/organisms';
import {BreadcrumbRoute, Content, Section} from '@/app/ui/atoms'
import { PageLink } from '@/app/ui/layout';
import { ResourcesSection } from '@/app/ui/templates';

import {CardCheckersSection} from '@/app/ui/templates';
import { VideoOverlay } from '@/app/ui/organisms/VideoOverlay';

import { Vidcarousel } from './Vidcarousel';
import { ExpandableText } from './ExpandableText';

import Course_png from '@/assets/images/Course_lib.jpg';


const RESOURCES: ResourceSectionData[] = [
    { Node: <PageLink href={Route.Credentials} /> },
    { Node: <PageLink href={Route.Subscriptions} /> },
    { Node: <PageLink href={Route.TrainingFAQs} /> },
];


// 1) The long, *full* “Tidal – Getting Started” paragraph (when expanded)
const description = `
In this “Tidal – Getting Started” tutorial video, viewers are introduced to Tidal, the world’s first 
ternary software stack by Tern, designed for exploring ternary computing. The video guides users through 
downloading and installing the Tidal beta version (available March 10, 2025), navigating the interface, 
creating a project, writing basic ternary code, and simulating programs. It highlights hands-on learning 
with practical examples, explains ternary logic differences from binary, and covers community collaboration 
features. By the end, users will understand Tidal’s basics and be ready to experiment with ternary programming.
`.trim();



function CoursesPage(){
    
    return (
        <Content>
            <div className={'pb-6xl'}>
            <Section>
                <BreadcrumbRoute />
                <h1 className={'text-[40px] leading-7 font-weight-500 mt-[50px] '}>Tidal Tutorial Series</h1>
                <div className={'relative w-full h-[202px] md:h-[466px] lg:h-[686px] bg-black'}>
                    <VideoOverlay
                        label="Tidal"
                        durationMs={401000}
                    />
                </div>
                <h3 className={'mt-[20px] text-[32px] leading-5'}>Tidal - Getting Started</h3>
                <div className="h-[66px] bg-[#444444] text-[14px] font-extralight space-y-3 p-2 mt-2">
                    <p className="leading-[20px]">November 17,2025</p>
                    <ExpandableText text={description} initialWords={6} />
                </div>
                
            </Section>
            <Section>
                <Vidcarousel title="Next in the series"/>
            </Section>    
            
            
            <CardCheckersSection type={'regular'} idx={2}/>
            
            <Section>
                    <Vidcarousel title="Recommended Courses"/>
                    <ResourceCard
                        type={'highlighted'}
                        icon={Course_png}
                        title={'Get help with tips from our experts'}
                        action={{ title: 'Learn more', href: '' }}
                    >
                        Our experts share how to best manage and operate your Tern products, services and accounts.
                    </ResourceCard>
                    <Vidcarousel title="Recently Viewed "/>
            </Section>
            
            <ResourcesSection
                data={RESOURCES}
                className={'mt-6xl-1'}
            />
        </div>
        </Content>
    );
}
export default CoursesPage;