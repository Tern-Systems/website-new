import React, { FC, ReactElement } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { SectionCard } from '@/app/types/layout';

import { Button } from '@/app/ui/form';

import styles from '@/app/common.module.css';

import { MEDIA_LINKS, MISC_LINKS } from '@/app/static';

import SVG_OFFICE_GIRL_1 from '/public/images/office-girl-2.png';
import SVG_OFFICE_GIRL_2 from '/public/images/office-girl-1.png';
import { faArrowRight, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

import PNG_INSIDE_TERN_GIRL from '/public/images/inside-tern-girl.png';
import PNG_ACCOLADES from '/public/images/resources-card-5.png';

import SVG_CITY_WAY from '/public/images/city-glowing-way.jpg';
import SVG_OFFICE_PEOPLE from '/public/images/office-people.png';

type Data = 'default' | 'alt0' | 'alt1';

const DATA: Record<Data, SectionCard[]> = {
    default: [
        {
            title: 'Tern Careers',
            description: 'Become a ternster',
            action: 'Explore Jobs',
            href: MISC_LINKS.Careers,
            icon: SVG_OFFICE_GIRL_1,
            btnIcon: faArrowRight,
            btnIconCN: 'rotate-180',
        },
        {
            title: 'Tern Academy',
            description: 'Explore Learning Opportunities',
            action: 'Start Learning',
            href: MEDIA_LINKS.YouTube.href,
            icon: SVG_OFFICE_GIRL_2,
            btnIcon: faArrowUpRightFromSquare,
        },
    ],
    alt0: [
        {
            title: 'Tern Community',
            description: 'Foster Meaningful Connections',
            action: 'Find Community',
            href: MEDIA_LINKS.YouTube.href,
            icon: PNG_ACCOLADES,
            btnIcon: faArrowRight,
            btnIconCN: 'rotate-180',
        },
        {
            title: 'Tern Credentials',
            description: 'Earn Impressive Accolades',
            action: 'Start Earning',
            href: MISC_LINKS.Events,
            icon: PNG_INSIDE_TERN_GIRL,
            btnIcon: faArrowUpRightFromSquare,
        },
    ],
    alt1: [
        {
            title: 'Your Tern',
            description: 'Be Our Next Guest',
            action: 'Join the Podcast',
            href: MEDIA_LINKS.YouTube.href,
            icon: SVG_CITY_WAY,
            btnIcon: faArrowRight,
            btnIconCN: 'rotate-180',
        },
        {
            title: 'Tern Events',
            description: 'Discover Events Near You',
            action: 'Attend',
            href: MISC_LINKS.Events,
            icon: SVG_OFFICE_PEOPLE,
            btnIcon: faArrowUpRightFromSquare,
        },
    ],
};

interface Props {
    data?: keyof typeof DATA;
    className?: string;
    classNameContent?: string;
    classNameCompanyLi?: string;
}

const InsideTernSection: FC<Props> = (props: Props) => {
    const { data, className, classNameContent, classNameCompanyLi } = props;

    const CompanyLi: ReactElement[] = DATA[data ?? 'default'].map((entry, idx) => (
        <li
            key={entry.title + idx}
            className={'flex w-full flex-col gap-y-3xs text-left'}
        >
            <h4 className={'text-[0.9375rem] sm:text-section-3xs'}>{entry.title}</h4>
            <p className={'mt-xxs'}>{entry.description}</p>
            <div className={'relative mt-3xs h-full w-full justify-end'}>
                <div className={'absolute inset-0 hidden  md:block'} />
                <Image
                    src={entry.icon}
                    alt={entry.icon.src}
                    className={'h-full w-full object-cover'}
                />
            </div>
            <Button
                icon={entry.btnIcon}
                onClick={() => window.open(entry.href, '_blank')}
                className={'mt-s flex-row-reverse !gap-x-4xs self-start text-blue'}
            >
                {entry.action}
            </Button>
        </li>
    ));

    return (
        <section className={cn(styles.section, className)}>
            <div
                className={cn(
                    styles.content,
                    'text-section  pt-[6.25rem] md:pt-[5rem]  pb-xxl lg:pb-[9.44rem]  sm:max-w-card',
                    classNameContent,
                )}
            >
                <h2 className={'text-left text-heading-xl font-bold '}>Inside Tern</h2>
                <ul
                    className={cn(
                        'mt-[3.75rem] grid grid-cols-1 gap-xxl',
                        'lg:x-[grid-cols-2,gap-3xl]',
                        classNameCompanyLi,
                    )}
                >
                    {CompanyLi}
                </ul>
            </div>
        </section>
    );
};

export { InsideTernSection };
