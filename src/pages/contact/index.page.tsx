import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import cn from "classnames";

import styles from '@/app/common.module.css';

import OFFICE_GIRL_3 from '/public/images/office-girl-3.png'

const ContactsPage: FC = () => {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // TODO
    };

    const InputField = ({
        field,
        label,
        type = 'text',
        placeholder = '',
        required = false,
        value,
        onChange,
    }: {
        field: string;
        label: string;
        type?: string;
        placeholder?: string;
        required?: boolean;
        value: string;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    }) => (
        <div key={field} className="text-[2.5rem] md:text-[2.25rem]  sm:text-[2rem]">
            <label htmlFor={field} className="block mb-[--p-content-xs]  md:mb-[18px]  sm:mb-[--p-content-xxs]">
                {label}{required ? '*' : ''}
            </label>
            <input
                type={type}
                id={field}
                name={field}
                value={value}
                placeholder={placeholder || label}
                onChange={onChange}
                required={required}
                className={cn('bg-control-gray-l0 border border-control-white w-full px-[--p-content-xs] outline-none focus:ring-2 focus:ring-blue-500',
                    'text-primary ',
                    'md:x-[text-[2rem],px-[--p-content-xs]]',
                    'sm:x-[text-[1.6875rem],px-[--p-content-3xs]]',
                )}
            />
        </div>
    );

    const MapEmbed = () => (
        <iframe
            className="w-full h-full shadow-md"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24175.062720483192!2d-74.01397335601076!3d40.75538323555057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258ffbda86021%3A0xb007bfa8c91c72a5!2s1120%20Avenue%20of%20the%20Americas%2C%20New%20York%2C%20NY%2010036%2C%20USA!5e0!3m2!1sen!2sph!4v1712345678901&z=12"
            allowFullScreen
            loading="lazy"
        ></iframe>
    );

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
            <div className={'relative z-10'}>
                <section className={cn(styles.section, styles.fullHeightSection)}>
                    <div className={cn(styles.content, 'flex justify-start items-start')}>
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

                <section
                    className={cn(styles.textGlow, styles.section, 'relative',
                        'bg-gradient-to-b from-[--bg-control-blue] from-5% via-black via-30%',
                        'x-[pt-[8.75rem],pb-[12.5rem]]',
                        'sm:x-[pt-[4.375rem],pb-48]',
                        'md:x-[pt-[7.5rem],pb-[16.25rem]]',
                    )}
                >

                    <div className={cn(styles.content)}>
                        <h2 className={'font-oxygen font-bold text-[4rem] text-left mb-[6.25rem]  md:text-[3rem]  sm:text-[2.5rem]'}>
                            Get in Touch
                        </h2>
                        <form onSubmit={handleSubmit} className="relative z-10">
                            <div className="grid gap-16 md:gap-12 sm:gap-10">
                                <div className="grid grid-cols-2 gap-8 md:gap-5 sm:gap-10 sm:grid-cols-1">
                                    <InputField field="firstName" label="First Name" required value={formData.firstName} onChange={handleChange} />
                                    <InputField field="lastName" label="Last Name" required value={formData.lastName} onChange={handleChange} />
                                </div>
                                <div className="grid grid-cols-1 gap-16 md:gap-12 sm:gap-10">
                                    <InputField field="company" label="Company" value={formData.company} onChange={handleChange} />
                                </div>
                                <div className="grid grid-cols-2 gap-8 md:gap-5 sm:gap-10 sm:grid-cols-1">
                                    <InputField field="email" label="Email" type="email" required value={formData.email} onChange={handleChange} />
                                    <InputField field="phone" label="Phone" type="tel" value={formData.phone} onChange={handleChange} />
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="text-[2.5rem] md:text-[2.25rem]  sm:text-[2rem]">
                                        <label htmlFor="message" className="block mb-[--p-content-xs]  md:mb-[1.125rem]  sm:mb-[--p-content-xxs]">Message*</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className={cn('bg-control-gray-l0 border border-control-white text-[2.25rem] min-h-[25rem] w-full p-[--p-content-xs] text-primary  outline-none focus:ring-2 focus:ring-blue-500',
                                                'md:x-[text-[2rem],p-[--p-content-xs]]',
                                                'sm:x-[text-[1.6875rem],p-[--p-content-3xs]]'
                                            )}
                                        ></textarea>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-black max-w-[7.9375rem] border border-control-gray-l0  px-6 py-3 text-[1.3125rem] hover:bg-blue-700 transition text">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 z-0 h-[25%] bg-gradient-to-t from-[--bg-control-blue] from-5% to-transparent to-95% md:h-[60%]  sm:h-[60%]" />
                </section>

                <section className={cn(styles.section,
                    'pb-64 md:pb-60 sm:pb-28',
                    'lg:x-[h-dvh,max-h-[65rem]]',
                    'bg-gradient-to-b from-[--bg-control-blue] from-5% to-black to-95% ',
                )}
                >
                    <div className={cn(styles.content, 'justify-center flex flex-col lg:flex-row gap-12')}>
                        <div className="lg:x-[w-1/2,h-full] hidden lg:block">
                            <MapEmbed />
                        </div>
                        <div className="flex flex-col gap-24  lg:justify-center  md:gap-16  sm:gap-12">
                            <div className="grid gap-3  sm:gap-2">
                                <h3 className="text-[3rem] font-[400] sm:text-[2.25rem]">Office</h3>
                                <address className="text-[2.25rem]  sm:text-[1.5rem] not-italic leading-tight">
                                    1120 Avenue of the Americas<br />
                                    New York, New York<br />
                                    10036-6700<br />
                                    United States
                                </address>
                            </div>
                            <div className="lg:hidden md:h-[50vh] sm:h-[50vh]">
                                <MapEmbed />
                            </div>
                            <div className="grid gap-3   sm:gap-2">
                                <h3 className="text-[3rem] font-[400] sm:text-[2.25rem]">Email</h3>
                                <p className="text-[2.25rem]  sm:text-[1.5rem]">info@tern.ac</p>
                            </div>
                            <div className="grid gap-3   sm:gap-2">
                                <h3 className="text-[3rem] font-[400] sm:text-[2.25rem]">Phone</h3>
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
