'use client';

import { FC, FormEvent } from 'react';
import cn from 'classnames';

import { CardLink, ResourceSectionData } from '@/app/types/layout';
import { Route } from '@/app/static';

import { useForm } from '@/app/hooks';

import { Content, H1, H2, H3, MainBackground, Section } from '@/app/ui/atoms';
import { ResourceCard } from '@/app/ui/organisms';
import { ResourcesSection } from '@/app/ui/templates';
import { Button, Input } from '@/app/ui/form';
import { PageLink } from '@/app/ui/layout';
import { MapEmbed } from './Map';

import styles from '@/app/common.module.css';

import OFFICE_GIRL_3 from '@/assets/images/office-girl-3.png';
import PNG_HIGHLIGHTEDTIPS from '@/assets/images/conference-girls.png';

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
    { Node: <PageLink href={Route.Support}>Support hub</PageLink> },
    { Node: <PageLink href={Route.Billing}>Billing resolution center</PageLink> },
];

const INPUT_PROPS = {
    wrapper: 'flex-col [&]:items-start gap-4xs text-18',
    label: 'font-[400]',
    className: 'h-6xl w-full px-xxs  bg-gray-d2 border-s border-gray-l0  text-primary',
};

const ContactsPage: FC = () => {
    const [formData, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        // TODO
    };

    return (
        <>
            <Section
                type={'full-screen'}
                background={{ image: OFFICE_GIRL_3, gradient: 'left' }}
                className={{ content: `mt-xs md:mt-xl lg:mt-6xl-1` }}
            >
                <H1 className={`sm:!text-64`}>Contact Tern</H1>
            </Section>
            <Content>
                <Section
                    className={{
                        content: cn(
                            'relative z-10 pt-7xl',
                            'grid  grid-cols-1 md:grid-cols-[2fr,1fr] lg:grid-cols-2',
                            'pb-5xl md:pb-6xl-1 lg:pb-6xl ',
                            'gap-3xl md:gap-6xl-1 lg:gap-7xl',
                        ),
                    }}
                >
                    <div>
                        <H3 className={'!text-48 font-[500]  sm:mb-xl mb-6xl-1'}>Get in Touch</H3>
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
                                    label={'text-12 leading-normal'}
                                    wrapper={'flex [&_div]:items-start'}
                                    className={'h-5xs w-5xs flex-shrink-0'}
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
                    <div
                        className={cn(
                            'h-full w-full',
                            'md:h-[60dvh] md:max-h-[43.5rem]',
                            'sm:h-[70dvh] sm:max-h-[29.75rem]',
                        )}
                    >
                        <MapEmbed />
                    </div>
                </Section>
                <Section
                    className={{
                        content: cn(
                            'grid gap-xl  grid-cols-1 lg:grid-cols-3  mb-3xl md:mb-6xl-1 lg:mb-6xl',
                            'text-24 sm:text-18',
                        ),
                    }}
                >
                    <div className='grid gap-3xs  md:gap-s  lg:grid-rows-[1fr,3fr]'>
                        <H3 className='font-thin !text-32 sm:text-24'>Email</H3>
                        <p>info@tern.ac</p>
                    </div>
                    <div className='grid gap-3xs  md:gap-s  lg:grid-rows-[1fr,3fr]'>
                        <H3 className='font-thin !text-32 sm:text-24'>Phone</H3>
                        <p>(973) 590-8753</p>
                    </div>
                    <div className='grid  gap-3xs md:gap-s'>
                        <H3 className='font-thin !text-32 sm:text-24'>Office</H3>
                        <address className='not-italic'>
                            <PageLink
                                external
                                href='https://maps.app.goo.gl/aq3baVuq5kX9JzEC6'
                            >
                                1120 Avenue of the Americas
                                <br />
                                New York, New York
                                <br />
                                10036-6700
                                <br />
                                United States
                            </PageLink>
                        </address>
                    </div>
                </Section>
                <Section>
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
                </Section>
                <ResourcesSection
                    data={RESOURCES}
                    className={'mt-6xl-1'}
                />
            </Content>
        </>
    );
};
export default ContactsPage;
