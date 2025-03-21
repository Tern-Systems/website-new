import React, { ReactElement, useEffect, useState } from 'react';
import cn from 'classnames';

import { CardLink } from '@/app/types/layout';
import { Tip } from '@/app/types/blog';
import { ArticleCardType } from '@/app/ui/organisms/ArticleCard';
import { Route } from '@/app/static';

import { BlogService, TipsDTO } from '@/app/services/blog.service';

import { useModal } from '@/app/context';

import { MainBackground } from '@/app/ui/atoms';
import { ArticleCard, ResourceCard, Carousel } from '@/app/ui/organisms';
import { AllWaysCard, InsideTernSection } from '@/app/ui/templates';
import { MessageModal } from '@/app/ui/modals';

import styles from '@/app/common.module.css';

import PNG_BG_MAIN from '/public/images/tips-bg-main.png';
import PNG_MICROPROCESSOR from '/public/images/microprocessor.png';

// TOOD href
const HIGHLIGHTED_CARD: CardLink = {
    icon: PNG_MICROPROCESSOR,
    title: 'Keep up with Tomorrow, Today',
    description: 'Subscribe to the All Ways Newsletter for expert insights on the future of cutting-edge technology.',
    action: { title: 'Subscribe today', href: '' },
};

const UL_H_CN = ' mb-xs md:mb-n lg:mb-[2.75rem]  sm:x-[mx-auto,w-card]  sm:text-27 text-40';
const CAROUSEL_UL_CN = 'mx-0 min-h-[27.0625rem]  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  w-full sm:w-fit';

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
                className={'[&:not(:first-of-type)]:border-t-0'}
            />
        </li>
    ));

function TipsPage() {
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
            <section className={cn(styles.section, 'h-screen max-h-[21.625rem]')}>
                <MainBackground
                    url={PNG_BG_MAIN}
                    className={'translate-y-0 max-h-full'}
                />
                <div className={cn(styles.content, 'relative z-10 flex flex-col justify-between', 'py-xxl md:pb-4xl')}>
                    <h1 className={'text-[3.375rem] md:text-[4.5rem] lg;text-96'}>Tips</h1>
                    <h2 className={'w-full lg:w-2/3  leading-n  text-20 md:text-36 lg:text-36'}>
                        Learn how to manage your Tern products, services, and accounts like a professional
                    </h2>
                </div>
            </section>
            <section className={cn(styles.section, 'bg-gradient-to-b from-blue to-transparent to-10%')}>
                <div
                    className={cn(
                        styles.content,
                        'grid grid-rows-2',
                        'md:grid-cols-2 lg:grid-cols-[15fr,14fr,14fr]',
                        'sm:gap-y-xxl gap-n',
                        'pt-[6.5rem] md:pt-[5.81rem] lg:pt-6xl',
                    )}
                >
                    <div className={'row-span-2 flex flex-col'}>
                        <h4 className={UL_H_CN}>Most Popular</h4>
                        <ul className={'flex flex-col h-full'}>{CardsPopularLi}</ul>
                    </div>
                    <div className={'flex flex-col h-full  lg:col-span-2'}>
                        <Carousel
                            altData={{
                                title: 'Featured',
                                link: Route.TipsVideos,
                                cards: CardsFeaturedLi,
                                altSpinner: true,
                            }}
                            classNameUl={'flex-grow grid grid-rows-2 gap-0  grid-cols-1 lg:grid-cols-2'}
                        />
                    </div>
                    <ResourceCard
                        type={'highlighted'}
                        icon={HIGHLIGHTED_CARD.icon}
                        title={HIGHLIGHTED_CARD.title}
                        action={HIGHLIGHTED_CARD.action}
                        className={{
                            wrapper: 'text-black  lg:x-[!grid-cols-2,gap-x-0] lg:col-span-2  sm:x-[mx-auto,max-w-card]',
                            image: '!size-full object-cover',
                            content: 'lg:pl-l',
                            link: 'text-primary',
                        }}
                    >
                        {HIGHLIGHTED_CARD.description}
                    </ResourceCard>
                </div>
            </section>
            <section className={styles.section}>
                <div className={cn(styles.content, 'pt-xxl md:pt-3xl lg:pt-xl')}>
                    <Carousel
                        altData={{ title: 'Videos', link: Route.TipsVideos, cards: CardsVideosLi }}
                        classNameUl={CAROUSEL_UL_CN}
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
                        altData={{ title: 'Reading Material', link: Route.TipsReads, cards: CardsReadsLi }}
                        classNameUl={CAROUSEL_UL_CN}
                    />
                </div>
            </section>
            <InsideTernSection
                data={'alt0'}
                className={'bg-gradient-to-t from-blue to-transparent to-60%'}
                classNameContent={'pb-[25.3rem] md:pb-[26rem] lg:pb-[28rem]'}
            />
        </>
    );
}

export default TipsPage;
