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
    description: 'Our experts share how to best manage and operate your Tern products, services, and accounts.',
    action: { title: 'Learn more', href: '' },
};

const RESOURCES: ResourceSectionData[] = [
    { Node: <PageLink href={Route.Community} /> },
    { Node: <PageLink href={Route.SupportHub}>Support hub</PageLink> },
    { Node: <PageLink href={Route.Billing}>Billing resolution center</PageLink> },
];

const ContactsPage: FC = () => {
    const [formData, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <>
            {/* Fixed Banner */}
            <div
                className="fixed top-0 left-0 w-full h-screen bg-cover bg-center z-[-1]"
                style={{
                    backgroundImage: `url(${OFFICE_GIRL_3.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Scrollable Content */}
            <div className="relative z-10 mt-[100vh] p-10 bg-white">
                <h1 className="text-6xl font-bold mb-6">Contact Tern</h1>
                <p>All your contact details here...</p>
                
                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="grid gap-4">
                        <Input value={formData.firstName} onChange={setFormValue('firstName')} required>
                            First Name*
                        </Input>
                        <Input value={formData.lastName} onChange={setFormValue('lastName')} required>
                            Last Name*
                        </Input>
                        <Input value={formData.email} onChange={setFormValue('email')} type="email" required>
                            Email*
                        </Input>
                        <Input value={formData.phone} onChange={setFormValue('phone')} type="tel">
                            Phone
                        </Input>
                        <Input value={formData.message} onChange={setFormValue('message')} required type="textarea">
                            Message*
                        </Input>
                        <Button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md">Submit</Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ContactsPage;
