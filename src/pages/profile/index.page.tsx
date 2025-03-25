'use client';

import { Dispatch, FC, SetStateAction, useState } from 'react';
import cn from 'classnames';

import { Res } from '@/app/types/service';
import { UpdateUserData } from '@/app/services/user.service';

import { UserService } from '@/app/services';

import { useLoginCheck, useModal, useUser } from '@/app/hooks';
import { SideNav } from '@/app/ui/organisms';
import { MessageModal } from '@/app/ui/modals';

import {
    AboutPrivacy,
    AccountSection,
    AddressesSection,
    AppsSection,
    CompanySection,
    ContactSection,
    OffboardingSection,
} from './sections';

import styles from '@/app/common.module.css';

interface SectionProps {
    update: (valueOrHandle: Partial<UpdateUserData> | (() => Promise<Res>)) => Promise<void>;
    setEditId: Dispatch<SetStateAction<string | null>>;
    editId: string | null;
}

const SECTIONS: Record<string, string> = {
    [AppsSection.ID]: 'Credentials',
    [AddressesSection.ID]: 'Contact',
    [CompanySection.ID]: 'Organization',
    [ContactSection.ID]: 'Addresses',
    [AccountSection.ID]: 'Applications',
    [OffboardingSection.ID]: 'Offboarding',
};
const SECTION_IDS: string[] = Object.keys(SECTIONS);

const ProfilePage: FC = () => {
    const modalCtx = useModal();
    const { userData, token, setupSession } = useUser();
    const isLoggedIn = useLoginCheck();

    const [editId, setEditId] = useState<string | null>('');

    if (!userData || !isLoggedIn || !token) return null;

    const handleUpdate = async (valueOrHandle: Partial<UpdateUserData> | (() => Promise<Res>)) => {
        try {
            let responseMsg: string;
            if (typeof valueOrHandle === 'function') {
                const { message } = await valueOrHandle();
                responseMsg = message;
            } else {
                const newUserData = { ...userData, photo: null, ...valueOrHandle };
                const { message } = await UserService.postUpdateUser(userData.email, newUserData);
                responseMsg = message;
            }
            modalCtx.openModal(<MessageModal>{responseMsg}</MessageModal>);
            await setupSession(false);
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    };

    return (
        <section
            className={cn(
                styles.section,
                styles.fullHeightSection,
                'bg-black',
                `bg-[radial-gradient(circle_at_50%_50%,var(--bg-blue),#000000)]`,
            )}
        >
            <div className={styles.content}>
                <div className={`lg:flex  pt-xs md:pt-n lg:pt-6xl-1  justify-center lg:justify-between`}>
                    <aside
                        className={cn(
                            `lg:sticky self-start text-nowrap text-left`,
                            `top-[min(25.3dvw,3.88rem)]`,
                            `w-full lg:w-fit`,
                        )}
                    >
                        <SideNav
                            sectionIDs={SECTION_IDS}
                            sectionNames={SECTIONS}
                        />
                    </aside>
                    <div className={cn(`relative flex flex-col gap-y-xxs  md:gap-y-xs  lg:gap-y-4xs`)}>
                        <AccountSection
                            setEditId={setEditId}
                            editId={editId}
                            update={handleUpdate}
                        />
                        <ContactSection
                            setEditId={setEditId}
                            editId={editId}
                            update={handleUpdate}
                        />
                        <CompanySection
                            setEditId={setEditId}
                            editId={editId}
                            update={handleUpdate}
                        />
                        <AddressesSection
                            setEditId={setEditId}
                            editId={editId}
                            update={handleUpdate}
                        />
                        <AppsSection />
                        <OffboardingSection />
                        <AboutPrivacy />
                    </div>
                </div>
            </div>
        </section>
    );
};

export type { SectionProps };
export default ProfilePage;
