import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import cn from 'classnames';

import { Res } from '@/app/types/service';
import { UpdateUserData } from '@/app/services/user.service';
import { EditableProps } from '@/app/ui/form/Editable';

import { UserService } from '@/app/services';

import { useLoginCheck } from '@/app/hooks';
import { useModal, useUser } from '@/app/context';
import { SideNav } from '@/app/ui/organisms';
import { MessageModal } from '@/app/ui/modals';

import { OFFBOARDING_ID, OffboardingSection } from './sections/Offboarding';
import { APPS_ID, AppsSection } from './sections/Apps';
import { ADDRESSES_ID, AddressesSection } from './sections/Addresses';
import { COMPANY_ID, CompanySection } from './sections/Company';
import { CONTACT_ID, ContactSection } from './sections/Contact';
import { ACCOUNT_ID, AccountSection } from './sections/Account';
import { AboutPrivacy } from './sections/AboutPrivacy';

import styles from '@/app/common.module.css';

interface SectionProps {
    update: (valueOrHandle: Partial<UpdateUserData> | (() => Promise<Res>)) => Promise<void>;
    setEditId: Dispatch<SetStateAction<string | null>>;
    editId: string | null;
}

const SECTION_IDS: string[] = [ACCOUNT_ID, CONTACT_ID, COMPANY_ID, ADDRESSES_ID, APPS_ID, OFFBOARDING_ID];

const SECTIONS: Record<string, string> = {
    [ACCOUNT_ID]: 'Credentials',
    [CONTACT_ID]: 'Contact',
    [COMPANY_ID]: 'Organization',
    [ADDRESSES_ID]: 'Addresses',
    [APPS_ID]: 'Applications',
    [OFFBOARDING_ID]: 'Offboarding',
};

const getSimpleToggleProps = (
    setEditId?: Dispatch<SetStateAction<string | null>>,
    isEditState?: string | null,
): Pick<EditableProps, 'classNameWrapper' | 'classNameToggle' | 'setParentEditId' | 'parentEditId'> => ({
    classNameWrapper: 'w-[min(100%,21.625rem)]',
    classNameToggle: 'col-start-3',
    setParentEditId: setEditId,
    parentEditId: isEditState,
});

const ProfilePage: FC = () => {
    const modalCtx = useModal();
    const { userData, token, fetchUserData } = useUser();
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
            await fetchUserData(false);
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
                <div className={`lg:flex  pt-xs md:pt-n lg:pt-[6.25rem]  justify-center lg:justify-between`}>
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
export { getSimpleToggleProps };
export default ProfilePage;
