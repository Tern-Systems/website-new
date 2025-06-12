'use client';

import { useEffect, useState } from 'react';

import { Tip } from '@/app/types/blog';
import { CategoryFallback } from '@/app/static';

import { arrayToRecord } from '@/app/utils';

import { useModal } from '@/app/hooks';
import { LibraryTemplate } from '@/app/ui/templates';
import { MessageModal } from '@/app/ui/modals';
import { MediaCard } from '@/app/ui/organisms';

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

const TIPS_TEMPLATE: Tip[] = Array(813)
    .fill(null)
    .map((_, idx) => ({
        ...TIP_TEMPLATE,
        id: TIP_TEMPLATE.id + idx,
        durationMs: idx % 7 ? 492362 : undefined,
        tag: idx % 7 ? 'Popular' : idx % 5 ? 'Featured' : idx % 11 ? 'Videos' : 'Reads',
        type: idx % 7 ? 'video' : 'text',
    }));

type TipsFilter = { category: string };

const DEFAULT_FILTER: TipsFilter = { category: '' };

const CATEGORY: Record<string, string> = arrayToRecord([CategoryFallback, 'Networking', 'Video', '']);

function CoursesLibraryPage() {
    const modalCtx = useModal();

    const [tips, setTips] = useState<Tip[]>([]);

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

    // Elements
    return (
        <LibraryTemplate
            type={'Media'}
            heading={'All Course'}
            items={tips}
            filterSetup={{
                default: DEFAULT_FILTER,
                option: { category: { options: CATEGORY } },
                date: true,
            }}
            urlParamName={'category'}
            renderItem={(item) => <MediaCard {...item} />}
        />
    );
}

export default CoursesLibraryPage;
