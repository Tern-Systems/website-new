'use client';

import cn from 'classnames';

import { MainBackground } from '@/app/ui/atoms';
import { CardCheckersSection, InsideTernSection } from '@/app/ui/templates';

import styles from '@/app/common.module.css';

import JPG_MAIN from '@/assets/images/resources-bg-main.jpg';

function ResourcesPage() {
    return (
        <div className={'pb-[5rem] md:pb-[12rem] bg-black'}>
            <section
                className={cn(styles.section, styles.fullHeightSection, styles.contentGradientBlackLeft, 'relative')}
            >
                <MainBackground
                    url={JPG_MAIN}
                    className={styles.sectionInsetShadowBlack}
                />
                <div
                    className={cn(
                        styles.content,
                        'relative z-10 flex flex-col justify-between  py-6xl-1 md:py-xxl sm:py-xxl',
                    )}
                >
                    <h1 className={'text-96 sm:text-40  w-[70%] sm:w-1/2  leading-l'}>
                        All your resources in one place
                    </h1>
                    <h2 className={'leading-l  w-[65%] md:w-[75%] sm:w-full  text-32 md:text-24 sm:text-20'}>
                        Learn how to get the most out of Tern with downloads, tips, the support hub and our engaging
                        community.
                    </h2>
                </div>
            </section>
            <section className={cn(styles.section, 'bg-transparent')}>
                <div
                    className={cn(
                        'h-full w-full absolute left-0 top-0 z-10 bg-gradient-to-b from-blue to-transparent to-[40%] lg:to-[55%]',
                    )}
                />
                <div className={cn(styles.content, 'pt-3xl md:pt-6xl-1 lg:pt-6xl ')}>
                    <h3 className={'text-40 md:text-27 sm:text-24'}>Prepare for your journey with Tern</h3>
                    <h4 className={'pt-3xl md:pt-3xl sm:pt-xxl  text-32 md:text-24 sm:text-21'}>
                        What tools do you need to succeed?
                    </h4>
                </div>
            </section>
            <CardCheckersSection type={'alt'} />
            <InsideTernSection />
            <div
                className={cn(
                    'h-full w-full absolute left-0 top-0 z-0 bg-gradient-to-t from-blue to-transparent to-5%',
                )}
            />
        </div>
    );
}

export default ResourcesPage;
