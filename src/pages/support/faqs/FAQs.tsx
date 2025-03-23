'use client';

import { ReactElement } from 'react';
import cn from 'classnames';

import { FAQs } from '@/app/static';

import { getId } from '@/app/utils';

import { BreadcrumbRoute } from '@/app/ui/atoms';
import { SideNav } from '@/app/ui/organisms';

import styles from '@/app/common.module.css';

const FAQsContent = () => {
    const sectionIDs: string[] = [];

    const SectionsLi: ReactElement[] = FAQs.map((section, idx) => {
        const id = getId(section.heading);
        sectionIDs.push(id);

        const FAQsLi: ReactElement[] = section.faqs.map((faq, faqIdx) => (
            <li key={faq.question.slice(5) + idx + faqIdx}>
                <p className={'inline'}>{faq.question}</p>
                <p className={'leading-l  mt-n sm:mt-s  text-16 sm:text-14'}>{faq.answer}</p>
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

    return (
        <section className={cn(styles.section, styles.radialGradientBlueRight)}>
            <div className={cn(styles.content, 'pb-[7.87rem] md:pb-[8.66rem] lg:pb-[14.5rem]')}>
                <BreadcrumbRoute className={'hidden lg:block'} />
                <div className={'lg:grid  grid-cols-[min-content,1fr] gap-x-[6.37rem]  pt-xs md:pt-n lg:pt-4xl'}>
                    <aside className={cn(`lg:sticky top-[min(25.3dvw,3.88rem)] self-start text-nowrap text-left`)}>
                        <SideNav sectionIDs={sectionIDs} />
                    </aside>
                    <ul className={'flex flex-col  gap-y-xxl sm:gap-y-l  sm:mt-[4.5rem] md:mt-xxl'}>{SectionsLi}</ul>
                </div>
            </div>
        </section>
    );
};

export { FAQsContent };
