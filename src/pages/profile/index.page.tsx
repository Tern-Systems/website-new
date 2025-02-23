import React, { Dispatch, FC, ReactElement, SetStateAction, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Res } from '@/app/types/service';
import { UpdateUserData } from '@/app/services/user.service';
import { EditableProps } from '@/app/ui/form/Editable';
import { Breakpoint } from '@/app/hooks/useBreakpointCheck';

import { UserService } from '@/app/services';

import { useBreakpointCheck, useLoginCheck } from '@/app/hooks';
import { useModal, useUser } from '@/app/context';

import { Select } from '@/app/ui/form';
import { ScrollEnd } from '@/app/ui/misc';
import { MessageModal } from '@/app/ui/modals';

import { OFFBOARDING, OffboardingSection } from './sections/Offboarding';
import { APPS, AppsSection } from './sections/Apps';
import { ADDRESSES, AddressesSection } from './sections/Addresses';
import { COMPANY, CompanySection } from './sections/Company';
import { CONTACT, ContactSection } from './sections/Contact';
import { ACCOUNT, AccountSection } from './sections/Account';
import { AboutPrivacy } from './sections/AboutPrivacy';

import stylesCommon from '@/app/common.module.css';
import styles from './Profile.module.css';

interface SectionProps {
    update: (valueOrHandle: Partial<UpdateUserData> | (() => Promise<Res>)) => Promise<void>;
    setEditId: Dispatch<SetStateAction<string | null>>;
    editId: string | null;
}

const SECTIONS: string[] = [ACCOUNT, CONTACT, COMPANY, ADDRESSES, APPS, OFFBOARDING];

const SECTION_NAMES = ['Credentials', 'Contact', 'Organization', 'Addresses', 'Applications', 'Offboarding'];

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
    const isSmScreen = useBreakpointCheck() <= Breakpoint.sm;
    const isMdScreen = useBreakpointCheck() <= Breakpoint.md;

    const sectionsRef = useRef<HTMLDivElement>(null);
    const [activeSectionIdx, setActiveSectionIdx] = useState(0);
    const [editId, setEditId] = useState<string | null>('');

    useEffect(() => {
        const handleScroll = () => {
            SECTIONS.forEach((section, index) => {
                const elem = document.getElementById(section.toLowerCase().replace(/[^a-z0-9]/g, ''));
                if (elem && elem.getBoundingClientRect().top < 0.25 * window.innerHeight) setActiveSectionIdx(index);
            });
        };
        window.addEventListener('wheel', handleScroll);
        return () => window.removeEventListener('wheel', handleScroll);
    }, [isSmScreen]);

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

    const SectionsNav: ReactElement[] = SECTIONS.map((link, idx) => (
        <li
            key={link + idx}
            className={cn(`cursor-pointer pl-xs leading-[200%] sm:landscape:pl-xxs`, {
                [`before:bg-blue ${styles.line}`]: idx === activeSectionIdx,
            })}
        >
            <span
                onClick={() => {
                    setActiveSectionIdx(idx);
                    const id = '#' + link.toLowerCase().replace(/[^a-z0-9]/g, '');
                    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                }}
            >
                {SECTION_NAMES[idx]}
            </span>
        </li>
    ));

    return (
        <section
            className={cn(
                stylesCommon.section,
                stylesCommon.fullHeightSection,
                'bg-black',
                `bg-[radial-gradient(circle_at_50%_50%,var(--bg-blue),#000000)]`,
            )}
        >
            <div className={stylesCommon.content}>
                <div
                    className={cn(
                        `relative flex justify-center md:justify-center lg:justify-between `,
                        'pt-xs  md:pt-n  lg:pt-[6.25rem]',
                    )}
                >
                    {!isSmScreen && !isMdScreen && (
                        <aside
                            className={cn(
                                `sticky self-start text-nowrap text-left`,
                                `top-[min(25.3dvw,3.88rem)] hidden`,
                                `lg:x-[block] w-[16.25rem]`,
                            )}
                        >
                            <ul className={cn(styles.line, `flex flex-col text-section-s before:bg-white`)}>
                                {SectionsNav}
                            </ul>
                        </aside>
                    )}
                    <div
                        ref={sectionsRef}
                        className={cn(`relative flex flex-col gap-y-xxs  md:gap-y-xs  lg:gap-y-4xs`)}
                    >
                        {(isSmScreen || isMdScreen) && (
                            <Select
                                altIcon
                                options={Object.fromEntries(
                                    SECTIONS.map((section, index) => [index.toString(), section]),
                                )}
                                value={activeSectionIdx.toString()}
                                placeholder={'Select'}
                                onChangeCustom={(value) => {
                                    const idx = parseInt(value);
                                    setActiveSectionIdx(parseInt(value) || -1);
                                    const id = '#' + SECTIONS[idx].toLowerCase().split(' ').join('');
                                    document
                                        .querySelector(id)
                                        ?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                                }}
                                classNameWrapper={cn(
                                    `w-full mb-4xs`,
                                    `flex-col gap-y-xxs text-section-s`,
                                    `border-b [&]:border-gray-l0`,
                                )}
                                classNameLabel={'mr-auto'}
                                classNameSelected={'w-full '}
                                classNameChevron={'ml-auto'}
                                className={cn(
                                    `!border-0 !bg-gray-d2 [&]:h-[2.7681rem]  md:h-[3.3875rem]  sm:h-button-xl`,
                                    `px-xxs  md:px-xs `,
                                )}
                                classNameUl={`border border-gray-l0`}
                                classNameOption={cn(
                                    `h-[3.1375rem] sm:h-button-xl`,
                                    `[&]:x-[bg-gray,border-transparent,py-4xs]`,
                                    `hover:bg-[#979797]`,
                                    `text-section-s  md:text-section`,
                                    `px-xxs  md:px-xs`,
                                )}
                            />
                        )}

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
                        <ScrollEnd />
                    </div>
                </div>
            </div>
        </section>
    );
};

export type { SectionProps };
export { getSimpleToggleProps };
export default ProfilePage;
