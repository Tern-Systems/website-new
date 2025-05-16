'use client';

import { FC, PropsWithChildren, ReactElement, useState } from 'react';
import cn from 'classnames';

import { ResourceCard, ResourceCardProps } from '@/app/ui/organisms/ResourceCard';

type Tab = {
    name: string;
    content: Pick<ResourceCardProps, 'icon' | 'title' | 'action'> & {
        text: string;
    };
};

interface Props extends PropsWithChildren {
    title: string;
    description: string;
    tabs: Tab[];
    className?: {
        wrapper?: string;
        title?: string;
        description?: string;
        content?: string;
        tabContainer?: string;
        tabButton?: string;
        activeTab?: string;
    };
}

const Tabs: FC<Props> = (props: Props) => {
    const { title, description, tabs, className } = props;

    const [activeTab, setActiveTab] = useState(0);

    const TabsLi: ReactElement[] = tabs.map((tab: Tab, idx) => {
        const { text, ...cardProps } = tab.content;
        return (
            <li
                key={tab.name + idx}
                className={'contents'}
            >
                <ResourceCard
                    type={'highlighted'}
                    {...cardProps}
                    className={{
                        wrapper: '!p-0 !bg-white-d2 !gap-0  sm:!grid-cols-1 !grid-cols-2',
                        title: 'leading-l  !text-24 md:!text-36 lg:!text-40',
                        image: '!object-cover object-right  h-[25.5rem] md:h-[31.25rem] lg:h-[39.1875rem]',
                        content:
                            'row-start-1 !flex p-xxs gap-y-xxs  text-black   sm:row-start-2  md:p-n lg:p-xxl  md:gap-y-3xl lg:gap-y-5xl',
                        children: '!w-full tracking-wide  text-12 md:text-14 lg:text-16',
                        link: 'bg-transparent text-blue [&_path]:fill-blue p-0  sm:mt-xs !mt-auto  text-12 md:text-14 lg:text-16',
                    }}
                >
                    {text}
                </ResourceCard>
            </li>
        );
    });

    return (
        <section className={cn(className?.wrapper)}>
            <h3
                className={cn(
                    'mb-xs text-32 tracking-wide',
                    'md:mb-n md:text-48',
                    'lg:mb-l lg:text-64',
                    className?.title,
                )}
            >
                {title}
            </h3>
            <p className={cn('mb-n text-20 ', 'md:mb-xl md:text-27', 'lg:mb-4xl lg:text-32', className?.description)}>
                {description}
            </p>
            <div className={cn('relative mb-4xs', className?.tabContainer)}>
                <div className='flex gap-xxs z-0'>
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={cn(
                                'relative px-4xs-1 py-4xs text-16 font-bold',
                                className?.tabButton,
                                activeTab === index && cn(className?.activeTab),
                            )}
                        >
                            {tab.name}
                            {activeTab === index && (
                                <div className='absolute bottom-0 left-0 w-full h-[0.0625rem] bg-blue z-10' />
                            )}
                        </button>
                    ))}
                </div>
                <div className='absolute bottom-0 left-0 w-full h-[.0625rem] bg-gray-l0' />
            </div>
            <ul className={cn(className?.content)}>{TabsLi[activeTab]}</ul>
        </section>
    );
};

export type { Tab };
export { Tabs };
