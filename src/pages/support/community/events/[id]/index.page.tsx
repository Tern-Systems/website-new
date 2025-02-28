import React, { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { EmailShareButton, FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import cn from 'classnames';

import { formatDate } from '@/app/utils';
import { BreadcrumbRoute } from '@/app/ui/atoms';

import { Button } from '@/app/ui/form';

import styles from '@/app/common.module.css';

import SVG_LINK from '/public/images/icons/link.svg';
import SVG_EMAIL from '/public/images/icons/email.svg';
import SVG_X from '/public/images/icons/x-twitter.svg';
import SVG_LINKEDIN from '/public/images/icons/linkedin.svg';
import SVG_FACEBOOK from '/public/images/icons/facebook.svg';

const SHARE_BTNS = [
    {
        icon: SVG_LINK,
        Element: (props: PropsWithChildren & { url: string }) => (
            <Button onClick={() => navigator?.clipboard?.writeText?.(props.url)}>{props.children}</Button>
        ),
    },
    { icon: SVG_EMAIL, Element: EmailShareButton },
    { icon: SVG_X, Element: TwitterShareButton },
    { icon: SVG_LINKEDIN, Element: LinkedinShareButton },
    { icon: SVG_FACEBOOK, Element: FacebookShareButton },
];

type Event = {
    // TODO: API Fetching
    title: string;
    date: string;
    tag: string;
    description: string;
};

const EVENTS_TEMPLATE: Event[] = [
    // TODO: API Fetching
    {
        title: 'Tern New Website Design Demonstration',
        date: '2025-02-25',
        tag: 'Webinar',
        description:
            'Join us for an exclusive webinar as we unveil the newly redesigned Tern website! This interactive session will showcase the enhanced features, streamlined navigation, and updated content that highlight Tern’s groundbreaking advancements in ternary computing.',
    },
];

const INFO_CN = 'border-t-s border-gray-l0 py-xxs px-4xs  md:p-xs  lg:x-[px-xs,py-n]';
const BUTTON_CN = 'flex justify-between items-center px-3xs py-xxs text-left text-section-xs lg:text-basic';

function EventPage() {
    const { id } = useParams() ?? ({} as { id: string });

    const [url, setURL] = useState<string | null>(null);
    const [event, setEvent] = useState<Event | null>(null);

    useEffect(() => {
        setEvent(EVENTS_TEMPLATE[0]); // TODO: API Fetching

        setURL(window.location.href);
    }, [id]);

    const ShareBtnsLi: ReactElement[] = SHARE_BTNS.map((btn, idx) => (
        <li
            key={btn.icon.src + idx}
            className={styles.clickable}
        >
            <btn.Element url={url ?? ''}>
                <Image
                    src={btn.icon}
                    alt={'social-link'}
                    className={'size-[1.6875rem]  md:size-[2.1875rem]  lg:size-[2.5rem]'}
                />
            </btn.Element>
        </li>
    ));

    return (
        <div
            className={cn(
                styles.section,
                styles.fullHeightSection,
                `bg-black bg-gradient-to-t from-blue to-black to-30% lg:to-40%`,
            )}
        >
            <div className={cn(styles.content, 'pt-n md:pt-[3.125rem] lg:pt-[3.125rem]')}>
                <BreadcrumbRoute className='mt-0' />
                <div className={'flex flex-col gap-x-xs mt-n md:mt-[3.125rem] lg:mt-[3.125rem]'}>
                    <div className={' w-full'}>
                        <h1 className={'leading-n  text-section md:text-section-xl lg:text-heading-l'}>
                            {event?.title}
                        </h1>
                    </div>
                    <div className={'contents lg:block'}>
                        <div className={cn(INFO_CN, 'mt-n md:mt-[3.125rem] lg:mt-[3.125rem]')}>
                            <span className={'text-section-xxs  md:text-section-xs  lg:text-basic'}>
                                {event?.date ? formatDate(new Date(event.date), 'long') : '-- date is not provided --'}
                            </span>
                        </div>
                        <div className={cn(INFO_CN, 'border-b-s')}>
                            <p>Share</p>
                            <ul className={'mt-xxs flex gap-x-3xs'}>{ShareBtnsLi}</ul>
                        </div>
                    </div>
                </div>

                <div
                    className={cn(
                        'grid grid-cols-1 ml-3xs gap-xs',
                        'md:x-[mx-xs,gap-y-n]  md:grid-cols-[1fr,12.5rem]',
                        'lg:x-[mx-xs,gap-y-n]  lg:grid-cols-[1fr,12.5rem]',
                    )}
                >
                    <div className='md:col-span-2 lg:col-span-2 mt-xs  md:mt-n  lg:mt-n'>
                        <span
                            className={cn(
                                'bg-[#979797] py-1 px-5xs text-black text-section-3xs',
                                'md:x-[py-1,px-[.375rem],text-[.6875rem]]',
                                'lg:x-[py-[.2813rem],px-2,text-section-xxs]',
                            )}
                        >
                            {event?.tag ?? 'Webinar'}
                        </span>
                    </div>
                    <div className=''>
                        <div className='leading-tight text-section-s  md:text-heading-s  lg:text-documentation'>
                            {event?.description ?? 'Event description is not provided'}
                        </div>
                    </div>

                    <div className='flex flex-col gap-y-[3.125rem] mt-n  md:mt-0  lg:mt-0  '>
                        <div className='flex flex-col gap-y-xxs  lg:gap-y-xs'>
                            <Button
                                className={`${BUTTON_CN} border bg-[#178AB7] border-[#178AB7] text-white max-w-[10.5625rem]`}
                                icon={'arrow'}
                                classNameIcon={'order-last [&_*]:fill-white size:[.5831rem] lg:size-[.75rem]'}
                                isIconFlippedY
                            >
                                Register Now
                            </Button>
                            <Button
                                className={`${BUTTON_CN} border bg-[#b3b3b3] border-gray-l0 text-[#444444] max-w-[11.875rem]`}
                                icon={'arrow'}
                                classNameIcon={'order-last size:[.625rem] lg:size-[.75rem]'}
                                isIconFlippedY
                            >
                                Add to Calendar
                            </Button>
                        </div>

                        <div className='flex flex-col gap-y-xs text-primary '>
                            <h6 className='leading-none font-bold text-documentation'>Contact</h6>
                            <span className='ml-4xs text-section-xs'>Andrew Lee</span>
                            <span className='ml-4xs text-section-xs'>andrewlee@tern.ac</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventPage;
