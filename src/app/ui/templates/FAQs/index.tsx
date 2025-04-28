'use client';

import { ReactElement } from 'react';
import cn from 'classnames';

import { arrayToRecord, getId } from '@/app/utils';

import { BreadcrumbRoute } from '@/app/ui/atoms';
import { SideNav } from '@/app/ui/organisms';

import styles from '@/app/common.module.css';

interface FAQ {
    question: string;
    answer: string | ReactElement;
}

interface FAQSection {
    heading: string;
    faqs: FAQ[];
}

const FAQsContent = ({ faqsData }: { faqsData: FAQSection[] }) => {
    const sections: string[] = [];

    const SectionsLi: ReactElement[] = faqsData.map((section, idx) => {
        const id = getId(section.heading);
        sections.push(id);

        const FAQsLi: ReactElement[] = section.faqs.map((faq, faqIdx) => (
            <li key={faq.question.slice(0, 5) + idx + faqIdx}>
                <p className={'inline'}>{faq.question}</p>
                {typeof faq.answer === 'string' ? (
                    <p className={'leading-l mt-n sm:mt-s text-16 sm:text-14'}>{faq.answer}</p>
                ) : (
                    faq.answer
                )}
            </li>
        ));

        return (
            <li
                key={section.heading + idx}
                id={id}
            >
                <h3 className={'text-40 sm:text-36'}>{section.heading}</h3>
                <ol
                    className={cn(
                        'list-decimal list-inside flex flex-col',
                        'gap-y-xl sm:gap-y-n',
                        'mt-xxl sm:mt-l',
                        'text-27 sm:text-24',
                    )}
                >
                    {FAQsLi}
                </ol>
            </li>
        );
    });

    const section: Record<string, string> = arrayToRecord(sections);

    return (
        <div className='min-h-screen relative text-white'>
            <div
                className={cn(
                    'absolute h-full w-full top-0 left-0 bottom-0 -z-10',
                    'bg-gradient-to-r from-black via-[#0c3847] to-[#178ab7]',
                    'opacity-95',
                )}
            />
            <div
                className={cn(
                    'absolute h-full w-full top-0 left-0 bottom-0 -z-5',
                    'bg-gradient-to-b from-black via-transparent to-transparent',
                    'opacity-40',
                )}
            />

            <div className='relative z-10 w-full h-full'>
                <div className={cn(styles.content, 'pb-6xl md:pb-7xl lg:pb-[14.5rem]')}>
                    <BreadcrumbRoute className={'hidden lg:block mb-6'} />
                    <div className={'lg:grid grid-cols-[min-content,1fr] gap-x-6xl-1 pt-xs md:pt-n lg:pt-4xl'}>
                        <aside className={cn(`lg:sticky top-[min(25.3dvw,3.88rem)] self-start text-nowrap text-left`)}>
                            <SideNav section={section} />
                        </aside>
                        <ul className={'flex flex-col gap-y-xxl sm:gap-y-l sm:mt-5xl md:mt-xxl'}>{SectionsLi}</ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQsContent;
