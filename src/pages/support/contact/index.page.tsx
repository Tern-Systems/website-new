'use client';

import { FC } from 'react';
import cn from 'classnames';

import MapEmbed from './Map';
import { useForm } from '@/app/hooks';

import { Button, Input } from '@/app/ui/form';
import { CardLink, ResourceSectionData } from '@/app/types/layout';
import { ResourceCard } from '@/app/ui/organisms';
import { ResourcesSection } from '@/app/ui/templates';
import { PageLink } from '@/app/ui/layout';
import { Route } from '@/app/static';

import styles from '@/app/common.module.css';

import OFFICE_GIRL_3 from '@/assets/images/office-girl-3.png';
import PNG_HIGHLIGHTEDTIPS from '@/assets/images/contact-card-highlighted-0.png';
import { MainBackground } from '@/app/ui/atoms';

type FormData = {
    isAllowedUpdate: boolean | undefined;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone: string;
    message: string;
};

const FORM_DEFAULT: FormData = {
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    message: '',
    isAllowedUpdate: false,
};

const HIGHLIGHTED_CARD: CardLink = {
    icon: PNG_HIGHLIGHTEDTIPS,
    title: 'Get help with tips from our experts',
    description: 'Our experts share how to best manage and operate your Tern products, services and accounts.',
    action: { title: 'Learn more', href: '' },
};

const RESOURCES: ResourceSectionData[] = [
    { Node: <PageLink href={Route.Community} /> },
    { Node: <PageLink href={Route.SupportHub}>Support hub</PageLink> },
    { Node: <PageLink href={Route.Billing}>Billing resolution center</PageLink> },
];

const INPUT_PROPS = {
    classNameWrapper: 'flex-col [&]:items-start gap-4xs text-18',
    classNameLabel: 'font-[400]   ',
    className: cn('h-6xl w-full px-xxs ', 'bg-gray-d2 border-s border-gray-l0', 'text-primary'),
};

const ContactsPage: FC = () => {
    const [formData, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO
    };

    return (
        <>
            <section className={cn(styles.section, styles.fullHeightSection, 'relative')}>
                {/* Used seperate component to render the background image instead of the direct image source */}
                <MainBackground url={OFFICE_GIRL_3.src} />
                <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-0 bg-center' />
                <div className={cn(styles.content, 'relative z-10 flex items-start justify-start h-full')}>
                    <div>
                        <h1
                            className={cn(
                                `w-min text-left leading-n`,
                                `mb-n text-96`,
                                `lg:x-[w-full,mt-6xl-1]`,
                                `md:x-[mt-xl,text-96]`,
                                `sm:x-[flex,mt-xs,text-64]`,
                            )}
                        >
                            Contact Tern
                        </h1>
                    </div>
                </div>
            </section>

            <div
                className={cn('relative z-10', 'bg-black bg-gradient-to-b from-blue from-0% to-black to-5% lg:to-10% ')}
            >
                <section
                    className={cn(
                        styles.content,
                        'relative z-10',
                        'flex flex-col lg:flex-row',
                        'pb-6xl pt-7xl',
                        'sm:pb-5xl',
                        'md:pb-6xl-1',
                        'gap-3xl md:gap-6xl-1 lg:gap-7xl',
                    )}
                >
                    <div className={cn('lg:w-1/2 md:w-[65%]')}>
                        <div className={cn('')}>
                            <h2 className={cn('mb-6xl-1 text-left text-48 font-[500]', 'sm:mb-xl')}>Get in Touch</h2>
                            <form
                                onSubmit={handleSubmit}
                                className='relative z-10 [&_*]:tracking-wide'
                            >
                                <div className='grid gap-n'>
                                    <div className='grid grid-cols-2 gap-n  sm:grid-cols-1'>
                                        <Input
                                            value={formData.firstName}
                                            onChange={setFormValue('firstName')}
                                            required
                                            {...INPUT_PROPS}
                                        >
                                            First Name*
                                        </Input>
                                        <Input
                                            value={formData.lastName}
                                            onChange={setFormValue('lastName')}
                                            required
                                            {...INPUT_PROPS}
                                        >
                                            Last Name*
                                        </Input>
                                    </div>
                                    <div className='grid grid-cols-1'>
                                        <Input
                                            value={formData.company}
                                            onChange={setFormValue('company')}
                                            {...INPUT_PROPS}
                                        >
                                            Company
                                        </Input>
                                    </div>
                                    <div className='grid grid-cols-2 gap-n  sm:grid-cols-1'>
                                        <Input
                                            type={'email'}
                                            value={formData.email}
                                            onChange={setFormValue('email')}
                                            {...INPUT_PROPS}
                                        >
                                            Email*
                                        </Input>
                                        <Input
                                            type={'phone'}
                                            value={formData.phone}
                                            onChange={setFormValue('phone')}
                                            {...INPUT_PROPS}
                                        >
                                            Phone
                                        </Input>
                                    </div>
                                    <div className='grid grid-cols-1'>
                                        <Input
                                            type={'textarea'}
                                            value={formData.message}
                                            onChange={setFormValue('message')}
                                            required
                                            {...INPUT_PROPS}
                                        >
                                            Message*
                                        </Input>
                                    </div>
                                    <Input
                                        type={'checkbox'}
                                        checked={formData.isAllowedUpdate}
                                        onChange={setFormValue('isAllowedUpdate')}
                                        classNameLabel={'text-12 leading-normal'}
                                        className={'border-gray-l0 bg-gray-d2'}
                                        classNameCheckbox={'h-5xs w-5xs flex-shrink-0'}
                                        classNameWrapper={'flex [&_div]:items-start'}
                                        isCustomCheckbox
                                    >
                                        May Tern provide you with personalized communications about Tern and select
                                        Tern-partner products, services, offers and events?
                                    </Input>
                                    <Button
                                        type={'submit'}
                                        className='border-control-gray-l0 max-w-[7.9375rem] border rounded-none bg-black px-6 py-3 text-21'
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className='lg:w-1/2  md:w-[65%] flex'>
                        <div
                            className={cn(
                                'h-full w-full',
                                'md:h-[60dvh] md:max-h-[43.5rem]',
                                'sm:h-[70dvh] sm:max-h-[29.75rem]',
                            )}
                        >
                            <MapEmbed />
                        </div>
                    </div>
                </section>

                <section
                    className={cn(
                        styles.content,
                        'relative z-10',
                        'grid grid-cols-1 gap-xl mb-3xl',
                        'md:x-[mb-6xl-1]',
                        'lg:x-[grid-cols-3,mb-6xl]',
                    )}
                >
                    <div className='grid gap-3xs  md:gap-s  lg:order-last'>
                        <h3 className='font-thin text-32 sm:text-24'>Office</h3>
                        <address className='not-italic leading-tight text-24 sm:text-18'>
                            1120 Avenue of the Americas
                            <br />
                            New York, New York
                            <br />
                            10036-6700
                            <br />
                            United States
                        </address>
                    </div>

                    <div className='grid gap-3xs  md:gap-s  lg:grid-rows-[1fr,3fr]'>
                        <h3 className='font-thin text-32 sm:text-24'>Email</h3>
                        <p className='text-24 sm:text-18'>info@tern.ac</p>
                    </div>

                    <div className='grid gap-3xs  md:gap-s  lg:grid-rows-[1fr,3fr]'>
                        <h3 className='font-thin text-32 sm:text-24'>Phone</h3>
                        <p className='text-24 sm:text-18'>(973) 590-8753</p>
                    </div>
                </section>

                <section className={cn(styles.content, 'relative z-10', 'mb-3xl md:mb-6xl-1 lg:mb-6xl')}>
                    <ResourceCard
                        type={'highlighted'}
                        icon={HIGHLIGHTED_CARD.icon}
                        title={HIGHLIGHTED_CARD.title}
                        action={HIGHLIGHTED_CARD.action}
                        className={{
                            wrapper: cn(
                                'text-black',
                                'lg:x-[!grid-cols-2,gap-x-0] lg:col-span-2',
                                'md:x-[!grid-cols-2,gap-x-0] md:[&]:x-[col-span-2,px-xl]',
                                'sm:x-[mx-auto,w-full]',
                            ),
                            image: '!size-full object-cover',
                            content: 'lg:pl-l  md:pl-l md:flex',
                            title: 'text-20  md:text-24  lg:text-27',
                            children: 'text-12  sm:text-10',
                            link: 'text-primary text-12 [&]:py-4xs md:x-[text-14,mt-auto,!py-4xs]  lg:x-[text-18,!py-xxs]',
                        }}
                    >
                        {HIGHLIGHTED_CARD.description}
                    </ResourceCard>
                </section>

                <section className='relative z-10'>
                    <ResourcesSection
                        data={RESOURCES}
                        className={'mb-[22.125rem] mt-6xl-1'}
                    />
                </section>

                <div className='absolute bottom-0 inset-0 bg-gradient-to-t from-blue to-transparent to-10% lg:to-[16%] z-0' />
            </div>
        </>
    );
};
export default ContactsPage;
