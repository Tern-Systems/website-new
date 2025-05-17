'use client';

import { FC, ReactElement } from 'react';
import { StaticImageData } from 'next/image';
import cn from 'classnames';

import { H3, Section } from '@/app/ui/atoms';
import { Insignia } from '@/app/ui/organisms';
import { PageLink } from '@/app/ui/layout';

import DARK from '@/assets/images/book-cover-dark.png';
import LIGHT from '@/assets/images/book-cover-light.png';
import BLUE from '@/assets/images/book-cover-blue.png';
import NAVY from '@/assets/images/book-cover-navy.png';

interface Props {
    type?: 'light' | 'blue' | 'dark' | 'navy';
    title: string;
    Description: ReactElement;
    link: {
        title: string;
        href: string;
    };
    className?: string;
}

const BookCoverSection: FC<Props> = (props: Props) => {
    const { type, title, Description, link, className } = props;

    let image: StaticImageData;
    let descriptionCN = 'text-primary';
    switch (type) {
        default:
        case 'dark':
            image = DARK;
            break;
        case 'blue':
            image = BLUE;
            break;
        case 'light':
            image = LIGHT;
            descriptionCN = 'text-black';
            break;
        case 'navy':
            image = NAVY;
            break;
    }

    const renderDescription = (className: string) => (
        <div className={className}>
            <p className={cn('!leading-n  mt-l lg:mt-l  sm:text-primary  md:text-18 lg:text-21', descriptionCN)}>
                {Description}
            </p>
            <PageLink
                href={link.href}
                icon={'arrow-right-long'}
                className={cn(
                    'flex-row-reverse px-xxs py-3xs w-fit bg-blue text-16',
                    'mt-[2.63rem] md:mt-xxl lg:mt-[3.56rem]',
                    'text-14 lg:text-16',
                )}
                iconClassName={cn('ml-[4.69rem]  size-6xs [&_*]size-6xs')}
            >
                {link.title}
            </PageLink>
        </div>
    );

    return (
        <Section className={{ section: className }}>
            <div
                style={{ backgroundImage: `url("${image.src}")` }}
                className={cn(
                    'grid w-full bg-cover',
                    'grid-cols-2 md:grid-cols-[17rem,1fr] lg:grid-cols-[23.312rem,1fr]',
                    'sm:pb-[9rem] md:pb-[5.12rem] py-xl lg:py-[6.5rem]',
                    'sm:pl-xs pl-[2.69rem]',
                    'pr-[3.5rem] md:pr-[7.5rem] lg:pr-[11.5rem]',
                    'h-[26.062rem] md:h-[60.25rem] lg:h-[88.625rem]',
                    { 'h-[43.81rem]': type === 'blue' },
                )}
            >
                <div className={'mt-auto'}>
                    <H3
                        type={'large'}
                        className={cn('sm:!text-27 md:!text-32', descriptionCN)}
                    >
                        {title}
                    </H3>
                    {renderDescription('sm:hidden')}
                </div>
                <Insignia className={cn('ml-auto  [&&_*]:!h-7xl md:[&&_*]:!h-8xl lg:[&&_*]:!h-12xl')} />
            </div>
            {renderDescription('sm:block hidden')}
        </Section>
    );
};

BookCoverSection.displayName = BookCoverSection.name;

export { BookCoverSection };
