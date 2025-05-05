import { DeepPartial } from '@/app/types/utils';
import { LibraryCardType } from '@/app/types/blog';
import { MISC_LINKS } from '@/app/static';

type Course = DeepPartial<LibraryCardType>;

// TODO remove templates
const COURSE_TEMPLATE: Course = {
    title: 'Some title',
    description: 'Some useful description about the course where something haooens',
    category: 'Individual',
    content: MISC_LINKS.TidalDemoEmbed,
    thumbnail: '',
    id: '9uqhe45gf032j0',
    date: 264,
    label: 'Website',
    durationMs: 39874,
    subject: 'BTMC',
    tag: 'Featured',
    type: 'text',
};

const COURSES_TEMPLATE: Course[] = Array(183)
    .fill(null)
    .map((_, idx) => ({
        ...COURSE_TEMPLATE,
        id: COURSE_TEMPLATE.id + idx,
        tag: !(idx % 7) ? 'Free' : !(idx % 5) ? 'Featured' : !(idx % 11) ? 'Popular' : 'Premium',
        type: idx % 3 ? 'video' : 'text',
    }));

export { COURSE_TEMPLATE, COURSES_TEMPLATE };
export type { Course };
