'use client';

import { useEffect, useState } from 'react';

import { Route } from '@/app/static';

import { BlogService, CardsLibDTO } from '@/app/services/blog.service';

import { useModal } from '@/app/hooks';

import { Content, H1, H2, Section } from '@/app/ui/atoms';
import { CardsLibrary, InsideTernSection } from '@/app/ui/templates';
import { MessageModal } from '@/app/ui/modals';

import BACKGROUND from '@/assets/images/tips-bg-main.png';

function TipsPage() {
    const modalCtx = useModal();
    const [tips, setTips] = useState<CardsLibDTO | null>(null);

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

    return (
        <>
            <Section
                type={'short'}
                background={{ image: BACKGROUND, gradient: 'left' }}
                className={{ content: 'sm:pb-[2.81rem] md:pb-[3.81rem] py-xxl' }}
            >
                <H1
                    type={'large'}
                    className={'sm:text-54'}
                >
                    Tips
                </H1>
                <H2 type={'large'}>
                    Learn how to manage your Tern products, services, and accounts like a professional
                </H2>
            </Section>
            <Content>
                <CardsLibrary
                    section={{
                        preHref: Route.TipsVideos,
                        first: { title: 'Videos', href: Route.TipsVideos },
                        second: { title: 'Reading Material', href: Route.TipsReads },
                    }}
                    cards={tips}
                />
                <InsideTernSection data={'alt0'} />
            </Content>
        </>
    );
}

export default TipsPage;
