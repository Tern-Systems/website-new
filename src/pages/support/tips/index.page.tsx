'use client';

import { useEffect, useState } from 'react';

import { ArrayOfLength } from '@/app/types/utils';
import { Tip } from '@/app/types/blog';
import { Route } from '@/app/static';

import { useModal } from '@/app/hooks';

import { Content, H1, H2, Section } from '@/app/ui/atoms';
import { CardsLibrary, InsideTernSection } from '@/app/ui/templates';
import { MessageModal } from '@/app/ui/modals';

import BACKGROUND from '@/assets/images/tips-bg-main.png';

// TODO remove templates
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

const TIPS_TEMPLATE: Tip[] = Array(83)
    .fill(null)
    .map((_, idx) => ({
        ...TIP_TEMPLATE,
        id: TIP_TEMPLATE.id + idx,
        durationMs: idx % 7 ? 492362 : undefined,
        tag: idx % 7 ? 'Popular' : idx % 5 ? 'Featured' : idx % 11 ? 'Videos' : 'Reads',
        type: idx % 7 ? 'video' : 'text',
    }));

// The items order is important
const TIP_TAGS: ArrayOfLength<string, 4> = ['Popular', 'Featured', 'Videos', 'Reads'];

function TipsPage() {
    const modalCtx = useModal();
    const [tips, setTips] = useState<Tip[] | null>(null);

    useEffect(() => {
        const fetchTips = async () => {
            try {
                setTips(TIPS_TEMPLATE);
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
                    tags={TIP_TAGS}
                />
                <InsideTernSection data={'alt0'} />
            </Content>
        </>
    );
}

export default TipsPage;
