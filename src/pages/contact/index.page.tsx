import React, { FC } from 'react';
import cn from 'classnames';

import MapEmbed from './Map';
import { useForm } from '@/app/hooks';

import { Button, Input } from '@/app/ui/form';

import styles from '@/app/common.module.css';

import OFFICE_GIRL_3 from '/public/images/office-girl-3.png';

type FormData = {
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
};

const INPUT_PROPS = {
    classNameWrapper: 'flex-col [&]:items-start gap-[.8125rem]  md:gap-[1rem]  lg:gap-[1.125rem]',
    classNameLabel: 'font-[400] text-[1.5rem]  md:text-[1.6875rem]  lg:text-[1.875rem]',
    className: cn(
        'h-[2.5rem] w-full px-[--s-dl-small] bg-control-gray-l0 border-small border-control-white',
        'text-primary text-[1.25rem]',
        'md:x-[text-[1.375rem],h-[3rem]]  lg:x-[text-[1.5rem],h-[3.4375rem]] ',
    ),
};

const ContactsPage: FC = () => {
    const [formData, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO
    };

    return (
        <>
            <div
                style={{
                    backgroundImage: `url("${OFFICE_GIRL_3.src}")`,
                }}
                className={cn('absolute left-0 top-0', 'bg-black bg-cover bg-center bg-no-repeat', 'h-screen w-full')}
            />
            <div className={'relative z-10'}>
                <section className={cn(styles.section, styles.fullHeightSection)}>
                    <div className={cn(styles.content, 'flex items-start justify-start')}>
                        <div>
                            <h1
                                className={cn(
                                    styles.textGlow,
                                    `w-min text-left font-oxygen font-bold leading-n`,
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
                </section>

                <section
                    className={cn(
                        styles.textGlow,
                        styles.section,
                        'relative z-10',
                        'bg-black bg-gradient-to-b from-[--bg-control-blue] from-5% via-black via-30%',
                        'pb-[12.5rem] pt-6xl',
                        'sm:x-[pt-[4.375rem],pb-48]',
                        'md:x-[pt-[7.5rem],pb-[16.25rem]]',
                    )}
                >
                    <div className={cn(styles.content)}>
                        <h2
                            className={
                                'mb-[6.25rem] text-left font-oxygen text-heading-3xl font-bold sm:text-[2.5rem] md:text-[3rem]'
                            }
                        >
                            Get in Touch
                        </h2>
                        <form
                            onSubmit={handleSubmit}
                            className='relative z-10'
                        >
                            <div className='grid gap-16 sm:gap-10 md:gap-12'>
                                <div className='grid grid-cols-2 gap-8 sm:x-[gap-10,grid-cols-1] md:gap-5'>
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
                                <div className='grid grid-cols-1 gap-16 sm:gap-10 md:gap-12'>
                                    <Input
                                        value={formData.company}
                                        onChange={setFormValue('company')}
                                        {...INPUT_PROPS}
                                    >
                                        Company
                                    </Input>
                                </div>
                                <div className='grid grid-cols-2 gap-8 sm:x-[gap-10,grid-cols-1] md:gap-5'>
                                    <Input
                                        type={'email'}
                                        value={formData.email}
                                        onChange={setFormValue('email')}
                                        required
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
                                <div className='grid grid-cols-1 gap-4'>
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
                                <Button
                                    type={'submit'}
                                    className='border-control-gray-l0 max-w-[7.9375rem] border bg-black px-6 py-3 text-heading-s'
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div className='absolute inset-x-0 bottom-0 z-0 h-[23%] bg-gradient-to-t from-[--bg-control-blue] from-5% to-transparent to-95% md:h-[30%]' />
                </section>

                <section
                    className={cn(
                        styles.section,
                        'pb-64 sm:pb-28 md:pb-60',
                        'lg:x-[h-dvh,max-h-[65rem]]',
                        'relative z-10',
                        'bg-gradient-to-b from-[--bg-control-blue] via-[--bg-control-blue] to-black',
                    )}
                >
                    <div className={cn(styles.content, 'flex flex-col justify-center gap-12 lg:flex-row')}>
                        <div className='hidden lg:block lg:x-[w-1/2,h-full]'>
                            <MapEmbed />
                        </div>
                        <div className='flex flex-col gap-24 sm:gap-12 md:gap-16 lg:justify-center'>
                            <div className='grid gap-3 sm:gap-2'>
                                <h3 className='text-[3rem] font-thin sm:text-heading-l'>Office</h3>
                                <address className='text-heading-l not-italic leading-tight sm:text-documentation'>
                                    1120 Avenue of the Americas
                                    <br />
                                    New York, New York
                                    <br />
                                    10036-6700
                                    <br />
                                    United States
                                </address>
                            </div>
                            <div className='sm:h-[60vh] md:h-[70vh] lg:hidden'>
                                <MapEmbed />
                            </div>
                            <div className='grid gap-3 sm:gap-2'>
                                <h3 className='text-[3rem] font-thin sm:text-heading-l'>Email</h3>
                                <p className='text-heading-l sm:text-documentation'>info@tern.ac</p>
                            </div>
                            <div className='grid gap-3 sm:gap-2'>
                                <h3 className='text-[3rem] font-thin sm:text-heading-l'>Phone</h3>
                                <p className='text-heading-l sm:text-documentation'>(973) 590-8753</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};
export default ContactsPage;
