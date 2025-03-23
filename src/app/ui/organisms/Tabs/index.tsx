<<<<<<< HEAD
'use client';

import { FC, PropsWithChildren, useState } from 'react';
import cn from 'classnames';

interface Tab {
    name: string;
    content: React.ReactNode;
}

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

    return (
        <section className={cn(className?.wrapper)}>
            <h3
                className={cn(
                    'mb-xs text-section-xl tracking-wide',
                    'md:mb-n md:text-heading-xxl',
                    'lg:mb-l lg:text-heading-3xl',
                    className?.title,
                )}
            >
                {title}
            </h3>
            <p
                className={cn(
                    'mb-n text-section ',
                    'md:mb-xl md:text-heading',
                    'lg:mb-4xl lg:text-section-xl',
                    className?.description,
                )}
            >
                {description}
            </p>
            <div className={cn('relative mb-4xs', className?.tabContainer)}>
                <div className='flex gap-xxs z-0'>
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={cn(
                                'relative px-[.4375rem] py-4xs text-basic font-bold',
                                className?.tabButton,
                                activeTab === index && cn(className?.activeTab),
                            )}
                        >
                            {tab.name}
                            {activeTab === index && (
                                <div className='absolute bottom-0 left-0 w-full h-[.0625rem] bg-[#178AB7] z-10' />
                            )}
                        </button>
                    ))}
                </div>
                <div className='absolute bottom-0 left-0 w-full h-[.0625rem] bg-gray-l0' />
            </div>
            <div className={cn(className?.content)}>{tabs[activeTab].content}</div>
        </section>
    );
};
export { Tabs };
=======
import React, { FC, PropsWithChildren, useState } from 'react';
import cn from 'classnames';

interface Tab {
    name: string;
    content: React.ReactNode;
}

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
                                'relative px-[0.4375rem] py-4xs text-16 font-bold',
                                className?.tabButton,
                                activeTab === index && cn(className?.activeTab),
                            )}
                        >
                            {tab.name}
                            {activeTab === index && (
                                <div className='absolute bottom-0 left-0 w-full h-[0.0625rem] bg-[#178AB7] z-10' />
                            )}
                        </button>
                    ))}
                </div>
                <div className='absolute bottom-0 left-0 w-full h-[0.0625rem] bg-gray-l0' />
            </div>
            <div className={cn(className?.content)}>{tabs[activeTab].content}</div>
        </section>
    );
};
export { Tabs };
>>>>>>> 7e394fdc (init find add/reused text size, color)
