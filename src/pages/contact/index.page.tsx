import React, { FC } from "react";
import cn from "classnames";

import MapEmbed from "./Map";
import { useForm } from "@/app/hooks";

import { Button, Input } from "@/app/ui/form";

import styles from '@/app/common.module.css';

import OFFICE_GIRL_3 from '/public/images/office-girl-3.png'

type FormData = {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone: string;
    message: string;
}

const FORM_DEFAULT: FormData = {
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    message: '',
}

const INPUT_PROPS = {
    classNameWrapper: 'flex-col [&]:items-start gap-[.8125rem]  md:gap-[1rem]  lg:gap-[1.125rem]',
    classNameLabel: 'font-[400] text-[1.5rem]  md:text-[1.6875rem]  lg:text-[1.875rem]',
    className: cn('h-[2.5rem] w-full px-[--s-dl-small] bg-control-gray-l0 border-small border-control-white',
        'text-primary text-[1.25rem]',
        'md:x-[text-[1.375rem],h-[3rem]]  lg:x-[text-[1.5rem],h-[3.4375rem]] '
    ),
}


const ContactsPage: FC = () => {

    const [formData, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // TODO
    };



    return (
        <>
            <div
                style={{
                    backgroundImage: `url("${OFFICE_GIRL_3.src}")`,
                }}
                className={cn(
                    'absolute top-0 left-0',
                    'bg-black bg-center bg-no-repeat bg-cover',
                    'w-full h-screen',
                )}
            />

            <section className={cn(styles.section, styles.fullHeightSection)}>
                <div className={cn(styles.content, 'relative flex justify-start items-start')}>
                    <div>
                        <h1
                            className={cn(styles.textGlow,
                                `w-min font-oxygen font-bold text-left leading-[1.2]`,
                                `mb-[--p-content] text-[6rem]`,
                                `lg:x-[w-full,mt-[6.25rem]]`,
                                `md:x-[mt-[--p-content-xl],text-[6rem]]`,
                                `sm:x-[flex,mt-[--p-content-xs],text-[3.9375rem]]`,
                            )}
                        >
                            Contact Tern
                        </h1>
                    </div>
                </div>
            </section>
            <div className={'relative'}>
                <section
                    className={cn(styles.textGlow, styles.section, 'relative z-10',
                        'bg-black bg-gradient-to-b from-[--bg-control-blue] from-5% via-black via-30%',
                        'pt-[8.75rem] pb-[12.5rem]',
                        'sm:x-[pt-[4.375rem],pb-48]',
                        'md:x-[pt-[7.5rem],pb-[16.25rem]]',
                    )}
                >

                    <div className={cn(styles.content)}>
                        <h2 className={'font-oxygen font-bold text-[4rem] text-left mb-[6.25rem]  md:text-[3rem]  sm:text-[2.5rem]'}>
                            Get in Touch
                        </h2>
                        <form onSubmit={handleSubmit} className="relative z-10">
                            <div className="grid gap-16  md:gap-12  sm:gap-10">
                                <div className="grid grid-cols-2 gap-8  md:gap-5  sm:x-[gap-10,grid-cols-1]">
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
                                <div className="grid grid-cols-1 gap-16  md:gap-12  sm:gap-10">
                                    <Input
                                        value={formData.company}
                                        onChange={setFormValue('company')}
                                        {...INPUT_PROPS}
                                    >
                                        Company
                                    </Input>
                                </div>
                                <div className="grid grid-cols-2 gap-8  md:gap-5  sm:x-[gap-10,grid-cols-1]">
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
                                <div className="grid grid-cols-1 gap-4">
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
                                    className="bg-black max-w-[7.9375rem] border border-control-gray-l0 px-6 py-3 text-[1.3125rem]"
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 z-0 h-[23%] bg-gradient-to-t from-[--bg-control-blue] from-5% to-transparent to-95%  md:h-[30%]"/>
                </section>

                <section className={cn(styles.section,
                    'pb-64  md:pb-60  sm:pb-28',
                    'lg:x-[h-dvh,max-h-[65rem]]',
                    'relative z-10',
                    'bg-gradient-to-b from-[--bg-control-blue]  via-[--bg-control-blue]  to-black ',
                )}
                >
                    <div className={cn(styles.content, 'justify-center flex flex-col  lg:flex-row gap-12')}>
                        <div className="lg:x-[w-1/2,h-full] hidden lg:block">
                            <MapEmbed />
                        </div>
                        <div className="flex flex-col gap-24  lg:justify-center  md:gap-16  sm:gap-12">
                            <div className="grid gap-3  sm:gap-2">
                                <h3 className="text-[3rem] font-[400]  sm:text-[2.25rem]">Office</h3>
                                <address className="text-[2.25rem]  sm:text-[1.5rem] not-italic leading-tight">
                                    1120 Avenue of the Americas<br />
                                    New York, New York<br />
                                    10036-6700<br />
                                    United States
                                </address>
                            </div>
                            <div className="lg:hidden  md:h-[70vh]  sm:h-[60vh]">
                                <MapEmbed />
                            </div>
                            <div className="grid gap-3   sm:gap-2">
                                <h3 className="text-[3rem] font-[400]  sm:text-[2.25rem]">Email</h3>
                                <p className="text-[2.25rem]  sm:text-[1.5rem]">info@tern.ac</p>
                            </div>
                            <div className="grid gap-3  sm:gap-2">
                                <h3 className="text-[3rem] font-[400]  sm:text-[2.25rem]">Phone</h3>
                                <p className="text-[2.25rem]  sm:text-[1.5rem]">(973) 590-8753</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
export default ContactsPage;
