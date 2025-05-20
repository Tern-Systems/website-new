'use client';

import { ReactElement, useEffect, useState } from 'react';
import cn from 'classnames';

import { CardLink } from '@/app/types/layout';
import { Tip } from '@/app/types/blog';
import { ArticleCardType } from '@/app/ui/organisms/ArticleCard';
import { Route } from '@/app/static';

import { BlogService, TipsDTO } from '@/app/services/blog.service';

import { useModal } from '@/app/hooks';

import { MainBackground } from '@/app/ui/atoms';
import { ArticleCard, ResourceCard, Carousel } from '@/app/ui/organisms';
import { AllWaysCard, InsideTernSection } from '@/app/ui/templates';
import { TernAcademy } from '@/app/ui/templates/Sections/TernAcademy';
import { MessageModal } from '@/app/ui/modals';
import Link from 'next/link';

import styles from '@/app/common.module.css';

import PNG_BG_MAIN from '@/assets/images/Abstract.png';
import PNG_MICROPROCESSOR from '@/assets/images/microprocessor.png';

const HIGHLIGHTED_CARD: CardLink = {
    icon: PNG_MICROPROCESSOR,
    title: 'Keep up with Tomorrow, Today',
    description: 'Subscribe to the All Ways Newsletter for expert insights on the future of cutting-edge technology.',
    action: { title: 'Subscribe today', href: '' },
};

const UL_H_CN = ' mb-xs md:mb-n lg:mb-xxl  sm:x-[mx-auto,w-card]  sm:text-27 text-40';
const CAROUSEL_UL_CN = 'mx-0 min-h-[27.0625rem]  sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3  w-full sm:w-fit';

const renderTips = (type: ArticleCardType, tips: Tip[] = []) =>
    tips.map((tip) => (
        <li
            key={tip.id}
            className={'contents'}
        >
            <ArticleCard
                type={type}
                article={tip}
                altLink={tip.type === 'video' ? 'watch' : undefined}
                className={'[&:not(:first-of-type)]:border-t-0 w-full'}
            />
        </li>
    ));

function CoursesPage() {
    const modalCtx = useModal();

    const [tips, setTips] = useState<TipsDTO | null>(null);

    useEffect(() => {
        const fetchTips = async () => {
            try {
                const { payload } = await BlogService.getTips();
                setTips(payload);
            } catch (error: unknown) {
                if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        };
        fetchTips();
    }, []);

    const CardsPopularLi: ReactElement[] = renderTips('alt-vertical', tips?.popular);
    const CardsFeaturedLi: ReactElement[] = renderTips('alt', tips?.featured);
    const CardsVideosLi: ReactElement[] = renderTips('default', tips?.videos);
    const CardsReadsLi: ReactElement[] = renderTips('default', tips?.reads);

    return (
        <>
        
        <nav className="bg-black text-white text-xs uppercase tracking-wide">
  <div className="max-w-screen-xl mx-auto px-4 flex space-x-6 h-10 items-center border-b border-neutral-800">
    <a href="#" className="text-neutral-400 hover:text-white transition-colors">Tern Academy</a>
    <a href="/support/courses" className="text-neutral-400 hover:text-white transition-colors">Courses</a>
    <a href="#" className="text-neutral-400 hover:text-white transition-colors">Credentials</a>
    <a href="#" className="text-neutral-400 hover:text-white transition-colors">Subscriptions</a>
    <a href="#" className="text-neutral-400 hover:text-white transition-colors">FAQs</a>
  </div>
</nav>
            <section className={cn(styles.section, 'h-screen max-h-[21.625rem]')}>
                <MainBackground
                    url={PNG_BG_MAIN}
                    className={'translate-y-0 max-h-full'}
                />
                
                <div className={cn(styles.content, 'relative z-10 flex flex-col justify-between', 'py-xxl md:pb-4xl')}>
                    <h1 className={'text-64 md:text-80 lg:text-96'}>Courses</h1>
                    <h2 className={'w-full lg:w-2/3  leading-n  text-20 md:text-36 lg:text-36'}>
                        Expect the unexpected, learn the unknown
                    </h2>
                </div>
            </section>
            <section className={cn(styles.section, 'bg-gradient-to-b from-blue to-transparent to-10%')}>
                <div
                    className={cn(
                        styles.content,
                        'grid',
                        'grid-cols-1 md:grid-cols-[1fr_2fr]',
                        'gap-n',
                        'pt-6xl-1 md:pt-6xl-1 lg:pt-6xl'
                    )}
                >
                    {/* LEFT: Most Popular */}
                    <div className="flex flex-col h-full">
                        <h4 className={UL_H_CN}>Most Popular</h4>
                        <ul className="flex flex-col h-full">{CardsPopularLi}</ul>
                    </div>

                    {/* RIGHT: Featured with 4 cards */}
                    <div className="flex flex-col h-[48rem]"> {/* set a fixed or relative height */}
                        <h4 className={UL_H_CN}>Featured</h4>

                        <div className="flex flex-col flex-grow">
                            {/* Featured Cards Grid */}
                            <ul className="grid grid-cols-2 grid-rows-2 flex-grow 
          border-t border-l border-white 
          [&>li]:border-r [&>li]:border-b [&>li]:border-white 
          [&>li:nth-child(2n)]:border-r-0 
          [&>li:nth-child(n+3)]:border-b-0 
          [&>li]:min-h-[10rem] [&>li]:sm:min-h-[12rem]">
                                {CardsFeaturedLi}
                            </ul>

                            {/* Resource Card */}
                            <div className="flex-shrink-0 mt-4 h-[12rem]">
     <ResourceCard
                            type={'highlighted'}
                            icon={HIGHLIGHTED_CARD.icon}
                            title={HIGHLIGHTED_CARD.title}
                            action={HIGHLIGHTED_CARD.action}
                            className={{
                                wrapper: 'flex flex-row lg:flex-row flex-col items-stretch  bg-white text-black overflow-hidden  shadow-md',
        image: 'w-3/4 h-full object-cover',
        content: 'w-1/3 px-6 py-4 flex flex-col justify-center',
        link: 'text-primary mt-4',
                            }}
                        >
                            {HIGHLIGHTED_CARD.description}
                        </ResourceCard>
</div>
                        </div>
                    </div>
                </div>
            </section>
            <section className={styles.section}>
                <div className={cn(styles.content, 'pt-xxl md:pt-3xl lg:pt-xl')}>
                    <Carousel
                        altData={{ title: 'Free Courses', link: Route.TipsReads, cards: CardsReadsLi }}
                        classNameUl={CAROUSEL_UL_CN}
                        cardsPerPageOverride={3}
                    />
                </div>
            </section>
            <section className={styles.section}>
                <div className={cn(styles.content, 'pt-xxl md:pt-3xl lg:pt-xl')}>
                    <AllWaysCard alt />
                </div>
            </section>
            <section className={styles.section}>
                <div className={cn(styles.content, 'pt-xxl md:pt-3xl lg:pt-xl')}>
                    <Carousel
                        altData={{ title: 'Premium Courses', link: Route.TipsReads, cards: CardsReadsLi }}
                        classNameUl={CAROUSEL_UL_CN}
                        cardsPerPageOverride={3}

                    />
                </div>
            </section>
            <section className={styles.section}>
                <div className={cn(styles.content, 'pt-xxl md:pt-3xl lg:pt-xl')}>
                    <TernAcademy alt />
                </div>
            </section>
            <InsideTernSection
    data="alt0"
    className={cn('bg-gradient-to-t from-blue to-transparent to-60%')}
    classNameContent="pb-[25.3rem] md:pb-[26rem] lg:pb-[28rem] max-w-[90rem] mx-auto"
    classNameCompanyLi="grid-cols-1 md:grid-cols-2 gap-[40rem] [&>li]:w-full [&>li]:md:min-w-[36rem]"
/>
        </>
    );
}

export default CoursesPage;
