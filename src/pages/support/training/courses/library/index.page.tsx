import { LibraryTemplate } from '@/app/ui/templates';
import { Section, Content } from '@/app/ui/atoms';
import { MediaCard } from '@/app/ui/organisms';
import { Course, COURSES_TEMPLATE } from '@/app/types/course';

function CoursesLibraryPage() {
    return (
        <>
            <Section
                className={{
                    content: 'm-0 p-0 w-full'
                }}
            >
                <LibraryTemplate
                    heading="All Courses"
                    type="Media"
                    items={COURSES_TEMPLATE}
                    filterSetup={{
                        default: { category: '' },
                        option: { category: { options: { '': 'All' } } },
                        date: true
                    }}
                    renderItem={(item) => <MediaCard {...item} />}
                />
            </Section>
        </>
    )
}

export default CoursesLibraryPage;