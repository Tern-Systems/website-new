import React, { FC, ReactElement, useEffect, useState } from "react";

import { COUNTRY, INDUSTRY, JOB_FUNCTION, LANGUAGE, SALUTATION, STATE_PROVINCE, SUB_INDUSTRY } from "@/app/static";

import { AuthService } from "@/app/services";

import { formatDate } from "@/app/utils/data";
import { useLoginCheck } from "@/app/hooks";
import { useModal, useUser } from "@/app/context";

import { Collapsible } from "@/app/ui/misc";
import { Button, Editable, Input } from "@/app/ui/form";
import { DeleteAccountModal } from "./DeleteAccountModal";

import styles from './Profile.module.css';
import { AuthenticationCode } from "@/app/ui/modals";


const SECTIONS: string[] = [
    'Account Credentials',
    'Contact Information',
    'Company or Organization',
    'Addresses',
    'Third-Party Applications',
    'Offboarding',
]

const DATA_STORAGE: string[] = [
    'Google Drive',
    'Dropbox',
    'SharePoint',
]

const SOCIAL_MEDIA: string[] = [
    'Discord',
    'WhatsApp',
    'Instagram',
    'Stack Overflow',
    'GitHub',
    'X',
    'Reddit',
    'LinkedIn',
    'Facebook',
]

// Styles
const SINGLE_INPUT_CN = 'bg-control-gray-l0 py-[0.35rem] w-full rounded-smallest';
const COMMON_CN = 'px-[0.76rem] border-small border-control-white';
const SELECT_CN = '[&]:bg-control-gray-l0 [&]:py-[0.35rem]';
const ROUNDED_W_FULL_CN = 'rounded-smallest w-full';


const ProfilePage: FC = () => {
    const modalCtx = useModal();
    const { userData, token } = useUser();
    const isLoggedIn = useLoginCheck();

    const [activeSectionIdx, setActiveSectionIdx] = useState(0);
    const [isEditState, setEditState] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            SECTIONS.forEach((section, index) => {
                const elem = document.getElementById(section.toLowerCase().split(' ').join(''));
                if (!elem)
                    return;
                if (elem?.getBoundingClientRect().top < elem.offsetTop / window.innerHeight * 350)
                    setActiveSectionIdx(index);
            });
        }

        window.addEventListener('wheel', handleScroll);
        return () => {
            window.removeEventListener('wheel', handleScroll);
        }
    }, [])

    if (!userData || !isLoggedIn)
        return null;

    // Elements
    const Primary = (
        <span className={`col-start-2 bg-control-white-d0 rounded-smallest1 w-[4.15rem] py-[0.1rem] block
                          text-gray text-center text-note font-oxygen mt-[0.62rem]`}>
            Primary
        </span>
    );

    const SectionsNav: ReactElement[] = SECTIONS.map((link, idx) => (
        <li
            key={link + idx}
            className={`pl-[1.88rem] leading-[200%] cursor-pointer
                        ${idx === activeSectionIdx ? `before:bg-control-blue ${styles.line}` : ''}`}
        >
            <span
                onClick={() => {
                    setActiveSectionIdx(idx);
                    const id = '#' + link.toLowerCase().split(' ').join('');
                    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                }}
            >
                {link}
            </span>
        </li>
    ));

    // Third-Party Apps
    const renderConnectedApps = (apps: string[], userApps: { name: string; link: string }[]): ReactElement[] => {
        return apps.map((app, idx) => {
            const userApp = userApps.find(userApp => userApp.name === app);
            const isFound = userApp !== undefined;
            const text: string = `Connect${isFound ? 'ed' : ''}`;

            return (
                <span key={text + idx} className={'contents'}>
                    {isFound
                        ? <a href={userApp?.link} className={'capitalize col-start-2'}
                            target={'_blank'}>{userApp?.name}</a>
                        : <span className={'capitalize col-start-2'}>{app}</span>
                    }
                    <Button
                        icon={isFound ? 'mark-square' : 'plus-square'}
                        hovered={{ icon: isFound ? 'close-square' : null, text: isFound ? 'Disconnect' : '' }}
                        className={'col-start-3 flex-row-reverse place-self-end'}
                        onClick={() => {
                            // TODO
                        }}
                    >
                        {text}
                    </Button>
                </span>
            );
        })
    }

    // Contact
    const Phones = Object.entries(userData.phone).map(([type, phone], idx) =>
        phone
            ? (
                <span key={type + idx}>
                    <span className={'text-small block mb-[0.62rem] mt-[1rem] capitalize'}>{type}</span>
                    <span>{phone.number + ('ext' in phone ? ' - ' + phone.ext : '')}</span>
                    {phone.isPrimary ? Primary : null}
                </span>
            )
            : null
    );

    // Addresses
    const Addresses = Object.entries(userData.address).map(([type, address], idx) => {
        const addressInfo: ReactElement = address && address.state && address.country
            ? (
                <>
                    <span className={'w-[14.69rem] flex flex-col'}>
                        <span>{address.line1}</span>
                        <span>{address.line2}</span>
                        <span>{address.city} {STATE_PROVINCE[address.country][address.state]} {address.zip}</span>
                        <span>{COUNTRY[address.country]}</span>
                    </span>
                    {address.isPrimary ? Primary : null}
                </>
            )
            : <span>--</span>;

        return (
            <span key={type + idx} className={'col-start-2'}>
                <span className={'text-small mt-[0.76rem] mb-[0.2rem] capitalize block'}>
                    {type.slice(0, 'Address'.length + 1)} Address
                </span>
                {addressInfo}
            </span>
        )
    });

    // Company
    // @ts-expect-error wrong sub-industry key
    const subIndustry = SUB_INDUSTRY[userData.company.industry][userData.company.subIndustry];

    return (
        <div className={'flex mt-[3.88rem]'}>
            <aside className={'text-left ml-[14.89rem] text-nowrap sticky self-start top-[5.94rem]'}>
                <div className={'text-header font-bold mb-[1.56rem]'}>
                    <span>Sections</span>
                </div>
                <ul className={`flex flex-col text-content-small ${styles.line} before:bg-control-white`}>
                    {SectionsNav}
                </ul>
            </aside>
            <div className={'flex-grow flex flex-col gap-y-[0.62rem] ml-[10rem]'}>
                <Collapsible title={SECTIONS[0]} icon={'key'} className={'gap-y-[2.09rem]'}>
                    <span className={'col-start-1 text-content'}>Profile Picture</span>
                    <Input
                        type={'file'}
                        classNameWrapper={'bg-white text-gray w-[9.8125rem] font-bold rounded-smallest h-[1.43rem]'}
                    >
                        Upload Media
                    </Input>

                    <span className={'col-start-1 text-content'}>TernID</span>
                    <Editable
                        classNameWrapper={'w-[21.625rem]'}
                        classNameToggle={'col-start-3'}
                        data={{
                            className: `${SINGLE_INPUT_CN} ${COMMON_CN}`,
                            title: 'Update your TernID',
                            value: { value: userData.email },
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onSave: async (formData) => {
                            } //TODO
                        }}
                        setParentEditState={setEditState}
                        isToggleBlocked={isEditState}
                    >
                        <span>{userData.email}</span>
                    </Editable>

                    <span className={'col-start-1 text-content'}>Password</span>
                    <Editable
                        type={'password'}
                        classNameWrapper={'w-[21.625rem] gap-y-[0.94rem]'}
                        classNameToggle={'col-start-3'}
                        data={{
                            className: `${SINGLE_INPUT_CN} ${COMMON_CN}`,
                            title: 'Update password',
                            value: null,
                            onSave: async (formData) => {
                                if (!('passwordConfirm' in formData) || !token)
                                    return;

                                if (formData.passwordConfirm !== formData.newPassword)
                                    throw `Passwords don't match`
                                await AuthService.postResetPassword(token, formData.passwordConfirm);
                            }
                        }}
                        setParentEditState={setEditState}
                        isToggleBlocked={isEditState}
                    >
                        <span>
                            <span className={'block'}>•••••••••••••••</span>
                            <span className={'text-small'}>
                                Last updated {userData.passwordUpdateDate ? formatDate(new Date(userData.passwordUpdateDate)) : '--'}
                            </span>
                        </span>
                    </Editable>

                    <span className={'col-start-1 text-content'}>Security</span>
                    <Editable
                        type={'2FA'}
                        classNameWrapper={'w-[21.625rem] gap-y-[0.94rem]'}
                        classNameToggle={'col-start-3'}
                        data={{
                            value: {
                                isEmailAdded: userData.state2FA.email !== null,
                                isPhoneAdded: userData.state2FA.phone !== null,
                                suggestedPhone: userData.phone.personal?.number ?? null,
                            },
                            onSave: async (formData) => {
                                if (!('value' in formData))
                                    return;
                                Object.values(formData).forEach((number: string | null) => {
                                    if (number?.length && number.length < 10)
                                        throw `Number must contain 10 digits`
                                })
                                const AuthCodeModal = (
                                    <AuthenticationCode
                                        token={token || ''}
                                        email={userData.email}
                                        phone={formData.value || ''}
                                        isAddPhone={false}
                                    />
                                );
                                modalCtx.openModal(AuthCodeModal, { darkenBg: true });
                            },
                            onSwitch: async () => {
                                // TODO disable 2FA
                            }
                        }}
                    >
                        <span>Enable / disable your two-factor authentication</span>
                    </Editable>
                </Collapsible>
                <Collapsible title={SECTIONS[1]} icon={'book'} className={'gap-y-[1.95rem]'}>
                    <span className={'col-start-1 text-content'}>Name</span>
                    <Editable
                        type={'name'}
                        classNameWrapper={'w-[21.625rem]'}
                        classNameToggle={'col-start-3'}
                        data={{
                            className: `${SELECT_CN} ${COMMON_CN} ${ROUNDED_W_FULL_CN}`,
                            title: 'Update your TernID',
                            value: userData.name,
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onSave: async (formData) => {
                            } //TODO
                        }}
                        setParentEditState={setEditState}
                        isToggleBlocked={isEditState}
                    >
                        <span className={'capitalize'}>
                            {userData.name.salutation ? SALUTATION[userData.name.salutation] : '--'}&nbsp;
                            {userData.name.firstname} {userData.name.initial} {userData.name.lastname}
                        </span>
                    </Editable>

                    <span className={'col-start-1 text-content'}>Display Name (optional)</span>
                    {userData.displayName
                        ? (
                            <Editable
                                classNameWrapper={'w-[21.625rem]'}
                                classNameToggle={'col-start-3'}
                                data={{
                                    className: `${SINGLE_INPUT_CN} ${COMMON_CN}`,
                                    title: 'Update your TernID',
                                    value: { value: userData.displayName },
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    onSave: async (formData) => {
                                    } //TODO
                                }}
                                setParentEditState={setEditState}
                                isToggleBlocked={isEditState}
                            >
                                <span>{userData.displayName}</span>
                            </Editable>
                        )
                        : (
                            <>
                                <span>--</span>
                                <span>--</span>
                            </>
                        )
                    }

                    <span className={'col-start-1 text-content'}>Email Address</span>
                    <Editable
                        classNameWrapper={'w-[21.625rem]'}
                        classNameToggle={'col-start-3'}
                        data={{
                            className: `${SINGLE_INPUT_CN} ${COMMON_CN}`,
                            title: 'Update your TernID',
                            value: {
                                value: userData.email,
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                verify: async (formData) => {
                                } //TODO
                            },
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onSave: async (formData) => {
                            } //TODO
                        }}
                        setParentEditState={setEditState}
                        isToggleBlocked={isEditState}
                    >
                        <span>{userData.email}</span>
                    </Editable>

                    <span className={'col-start-1 text-content'}>Phone Number</span>
                    <Editable
                        type={'phone'}
                        classNameWrapper={'w-[21.625rem]'}
                        classNameToggle={'col-start-3'}
                        data={{
                            className: `${SINGLE_INPUT_CN} ${COMMON_CN}`,
                            value: userData.phone,
                            onSave: async (formData) => {
                                if (!('business' in formData))
                                    return;
                                Object.entries(formData).forEach(([type, number]) => {
                                    if (number.number !== '' && number.number.length < 10)
                                        throw type + ` number must contain 10 digits`
                                })
                            }
                        }}
                        setParentEditState={setEditState}
                        isToggleBlocked={isEditState}
                    >
                        <span>{Phones}</span>
                    </Editable>

                    <span className={'col-start-1 text-content'}>Country or Region of Residence</span>
                    <Editable
                        type={'select'}
                        classNameWrapper={'w-[21.625rem]'}
                        classNameToggle={'col-start-3'}
                        data={{
                            className: `${SELECT_CN} ${COMMON_CN}`,
                            title: 'Country / Region',
                            value: { value: 'US' },
                            options: COUNTRY,
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onSave: async (formData) => {
                            } //TODO
                        }}
                        setParentEditState={setEditState}
                        isToggleBlocked={isEditState}
                    >
                        <span>
                            {userData.address.personalAddress?.country ? COUNTRY[userData.address.personalAddress?.country] : '--'}
                        </span>
                    </Editable>

                    <span className={'col-start-1 text-content'}>Preferred Language</span>
                    <Editable
                        type={'select'}
                        classNameWrapper={'w-[21.625rem]'}
                        classNameToggle={'col-start-3'}
                        data={{
                            className: `${SELECT_CN} ${COMMON_CN}`,
                            title: 'Language',
                            value: { value: 'EN' },
                            options: LANGUAGE,
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onSave: async (formData) => {
                            } //TODO
                        }}
                        setParentEditState={setEditState}
                        isToggleBlocked={isEditState}
                    >
                        <span>{LANGUAGE[userData.preferredLanguage] ?? '--'}</span>
                    </Editable>
                </Collapsible>
                <Collapsible title={SECTIONS[2]} icon={'building'} className={'gap-y-[1.88rem]'}>
                    <span className={'col-start-1 text-content'}>Organizational Information</span>
                    <Editable
                        classNameWrapper={'w-[21.625rem]'}
                        classNameToggle={'col-start-3'}
                        data={{
                            className: `${SINGLE_INPUT_CN} ${COMMON_CN}`,
                            title: 'Update your TernID',
                            value: { value: userData.company?.name ?? '-' },
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onSave: async (formData) => {
                            } //TODO
                        }}
                        setParentEditState={setEditState}
                        isToggleBlocked={isEditState}
                    >
                        <span>{userData.company?.name ?? '--'}</span>
                    </Editable>

                    <span className={'col-start-1 text-content'}>Career Information</span>
                    <Editable
                        type={'company'}
                        classNameWrapper={'w-[21.625rem]'}
                        classNameToggle={'col-start-3'}
                        data={{
                            className: `${SELECT_CN} px-[0.76rem] border-small ${ROUNDED_W_FULL_CN}`,
                            title: 'Update your TernID',
                            value: userData.company,
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onSave: async (formData) => {
                            } //TODO
                        }}
                        setParentEditState={setEditState}
                        isToggleBlocked={isEditState}
                    >
                        {userData.company
                            ? (
                                <>
                                    <span className={'col-start-2 row-start-2'}>
                                        <span
                                            className={'col-start-2 text-small block mb-[0.2rem]'}>Job Title</span>
                                        <span>{userData.company.jobTitle}</span>
                                    </span>
                                    <span className={'mt-[1.25rem]'}>
                                        <span
                                            className={'col-start-2 text-small block mb-[0.2rem]'}>Job Function</span>
                                        <span>{JOB_FUNCTION[userData.company.jobFunction]}</span>
                                    </span>
                                    <span className={'mt-[1.25rem]'}>
                                        <span
                                            className={'col-start-2 text-small block mb-[0.2rem]'}>Industry</span>
                                        <span>{INDUSTRY[userData.company.industry]}</span>
                                    </span>
                                    <span className={'mt-[1.25rem]'}>
                                        <span
                                            className={'col-start-2 text-small block mb-[0.2rem]'}>Sub-Industry</span>
                                        <span>{subIndustry}</span>
                                    </span>
                                </>
                            )
                            : <>--</>
                        }
                    </Editable>
                </Collapsible>
                <Collapsible title={SECTIONS[3]} icon={'geo'} className={'[&]:items-start'}>
                    <span className={'col-start-1 text-content'}>Address Information</span>
                    <Editable
                        type={'address'}
                        classNameWrapper={'w-[21.625rem]'}
                        classNameToggle={'col-start-3'}
                        data={{
                            className: `${SELECT_CN} ${COMMON_CN} ${ROUNDED_W_FULL_CN}`,
                            title: 'Update your TernID',
                            value: userData.address,
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onSave: async (formData) => {
                            } //TODO
                        }}
                        setParentEditState={setEditState}
                        isToggleBlocked={isEditState}
                    >
                        <span>{Addresses}</span>
                    </Editable>
                </Collapsible>
                <Collapsible title={SECTIONS[4]} icon={'blocks'}>
                    <span className={'text-content'}>Domain</span>
                    {userData.personalDomain
                        ? (
                            <>
                                <a href={userData.personalDomain.link} target={'_blank'}>
                                    {userData.personalDomain.link}
                                </a>
                                <Button
                                    disabled={userData.personalDomain.isVerified}
                                    icon={userData.personalDomain.isVerified ? 'mark-flower' : 'plus-flower'}
                                    className={'col-start-3 flex-row-reverse place-self-end'}
                                >
                                    Verif{userData.personalDomain.isVerified ? 'ied' : 'y'}
                                </Button>
                            </>
                        )
                        : (
                            <>
                                <span>--</span>
                                <span>--</span>
                            </>
                        )
                    }
                    <span className={'mt-[1.88rem] text-content'}>Data Storage</span>
                    <span className={'col-start-2 text-small self-end'}>Applications</span>
                    {renderConnectedApps(DATA_STORAGE, userData.connectedApps.data)}

                    <span className={'mt-[1.88rem] text-content'}>Social Media</span>
                    <span className={'col-start-2 text-small self-end'}>Applications</span>
                    {renderConnectedApps(SOCIAL_MEDIA, userData.connectedApps.social)}
                </Collapsible>
                <Collapsible title={SECTIONS[5]}>
                    <span className={'text-content'}>Account Offboarding</span>
                    <span>Delete your account and data</span>
                    <Button
                        icon={'delete-square'}
                        className={'flex-row-reverse'}
                        onClick={() => modalCtx.openModal(<DeleteAccountModal userData={userData} />, { darkenBg: true })}
                    >
                        Delete
                    </Button>
                </Collapsible>
            </div>
        </div>
    )
}

export default ProfilePage;