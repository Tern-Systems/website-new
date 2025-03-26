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
    classNameWrapper: 'flex-col [&]:items-start gap-4xs text-section-s',
    classNameLabel: 'font-[400]   ',
    className: cn('h-[3.125rem] w-full px-xxs ', 'bg-gray-d2 border-[.0313rem] border-gray-l0', 'text-primary'),
};

const ContactsPage: FC = () => {
    const [formData, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO
    };

    return (
        <>
            <section className={'flex justify-center w-full'}>
                <div
                    className={cn('h-dvh max-h-[62.5rem] w-full max-w-[120rem]', 'relative bg-cover bg-center')}
                    style={{
                        backgroundImage: `url(${OFFICE_GIRL_3.src})`,
                        position: 'relative',
                        backgroundSize: 'cover',
                        backgroundPosition: '50% top',
                    }}
                >
                    <div className={cn(styles.content, 'relative z-10 flex items-start justify-start')}>
                        <div>
                            <h1
                                className={cn(
                                    `w-min text-left leading-n`,
                                    `mb-n text-heading-4xl`,
                                    `lg:x-[w-full,mt-[6.25rem]]`,
                                    `md:x-[mt-xl,text-heading-4xl]`,
                                    `sm:x-[flex,mt-xs,text-[3.9375rem]]`,
                                )}
                            >
                                Contact Tern
                            </h1>
                        </div>
                    </div>
                    <div className='absolute inset-0 bg-gradient-to-r from-black via-black via-0% lg:via-5% to-transparent  sm:to-60%  md:to-40% lg:to-50% z-0' />
                    <div className='absolute inset-0 bg-gradient-to-l from-black from-0%   via-black via-0% lg:via-10%   to-transparent to-0% lg:to-20% z-1' />
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
                        'pb-[8.125rem] pt-[10.25rem]',
                        'sm:pb-[4.375rem]',
                        'md:pb-[6.875rem]',
                        'gap-[3.75rem] md:gap-[6.25rem] lg:gap-[9.875rem]',
                    )}
                >
                    <div className={cn('lg:w-1/2 md:w-[65%]')}>
                        <div className={cn('')}>
                            <h2 className={cn('mb-[6.25rem] text-left text-heading-xxl font-[500]', 'sm:mb-xl')}>
                                Get in Touch
                            </h2>
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
                                        classNameLabel={'text-section-xxs leading-normal'}
                                        className={'border-gray-l0 bg-gray-d2'}
                                        classNameCheckbox={'h-[.9375rem] w-[.9375rem] flex-shrink-0'}
                                        classNameWrapper={'flex [&_div]:items-start'}
                                        isCustomCheckbox
                                    >
                                        May Tern provide you with personalized communications about Tern and select
                                        Tern-partner products, services, offers and events?
                                    </Input>
                                    <Button
                                        type={'submit'}
                                        className='border-control-gray-l0 max-w-[7.9375rem] border bg-black px-6 py-3 text-heading-s'
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
                        'md:x-[mb-[6.25rem]]',
                        'lg:x-[grid-cols-3,mb-[7.5rem]]',
                    )}
                >
                    <div className='grid gap-3xs  md:gap-s  lg:order-last'>
                        <h3 className='font-thin text-section-xl sm:text-documentation'>Office</h3>
                        <address className='not-italic leading-tight text-documentation sm:text-section-s'>
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
                        <h3 className='font-thin text-section-xl sm:text-documentation'>Email</h3>
                        <p className='text-documentation sm:text-section-s'>info@tern.ac</p>
                    </div>

                    <div className='grid gap-3xs  md:gap-s  lg:grid-rows-[1fr,3fr]'>
                        <h3 className='font-thin text-section-xl sm:text-documentation'>Phone</h3>
                        <p className='text-documentation sm:text-section-s'>(973) 590-8753</p>
                    </div>
                </section>

                <section className={cn(styles.content, 'relative z-10', 'mb-3xl md:mb-[6.25rem] lg:mb-[7.5rem]')}>
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
                            title: 'text-[20px]  md:text-[24px]  lg:text-[27px]',
                            children: 'text-[12px]  sm:text-[10px]',
                            link: 'text-primary text-[12px] [&]:py-4xs md:x-[text-[14px],mt-auto,!py-4xs]  lg:x-[text-[18px],!py-xxs]',
                        }}
                    >
                        {HIGHLIGHTED_CARD.description}
                    </ResourceCard>
                </section>

                <section className='relative z-10'>
                    <ResourcesSection
                        data={RESOURCES}
                        className={'mb-[22.125rem] mt-[6.25rem]'}
                    />
                </section>

                <div className='absolute bottom-0 inset-0 bg-gradient-to-t from-blue to-transparent to-10% lg:to-[16%] z-0' />
            </div>
        </>
    );
};
export default ContactsPage;
