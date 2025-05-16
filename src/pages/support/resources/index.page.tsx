'use client';

import { Content, H1, H2, H3, H4, Section } from '@/app/ui/atoms';
import { CardCheckersSection, InsideTernSection } from '@/app/ui/templates';

import JPG_MAIN from '@/assets/images/resources-bg-main.jpg';

function ResourcesPage() {
    return (
        <>
            <Section
                type={'full-screen'}
                background={{ image: JPG_MAIN, gradient: 'left' }}
                className={{ content: 'py-6xl-1 md:py-xxl sm:py-xxl' }}
            >
                <H1 className={'!w-[70%] sm:!w-1/2  leading-l'}>All your resources in one place</H1>
                <H2 className={'w-[65%] md:w-[75%] sm:w-full  sm:!text-20'}>
                    Learn how to get the most out of Tern with downloads, tips, the support hub and our engaging
                    community.
                </H2>
            </Section>
            <Content>
                <Section
                    className={{ content: 'pt-3xl md:pt-6xl-1 lg:pt-6xl  mb-[5rem] md:mb-[6.25rem] lg:mb-[9.37rem]' }}
                >
                    <H3 type={'large'}>Prepare for your journey with Tern</H3>
                    <H4 className={'pt-3xl md:pt-3xl sm:pt-xxl  sm:!text-21'}>What tools do you need to succeed?</H4>
                </Section>
                <CardCheckersSection type={'alt'} />
                <InsideTernSection />
            </Content>
        </>
    );
}

export default ResourcesPage;
