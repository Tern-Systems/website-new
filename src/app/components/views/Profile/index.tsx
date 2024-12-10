import React, {FC, ReactElement, useState} from "react";

import {Address, Phone, useModal, useUser} from "@/app/context";

import {formatDate} from "@/app/utils/data";

import {Collapsible} from "@/app/components/Collapsible";

import {Button, Editable, EditableTypeEnum, Input} from "@/app/components/form";

import {DeleteAccountModal} from "./DeleteAccountModal";

import styles from './Profile.module.css';


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


const ProfileView: FC = () => {
    const modalCtx = useModal();
    const {userData} = useUser();

    const [activeSectionIdx, setActiveSectionIdx] = useState(0);

    if (!userData)
        return <></>;

    // Elements
    const Primary = (
        <span className={`col-start-2 bg-[#D9D9D9] rounded-[0.25rem] w-[4.15rem] py-[0.1rem] block
                          text-form text-center text-[0.75rem] font-oxygen mt-[0.62rem]`}>
            Primary
        </span>
    );

    const SectionsNav: ReactElement[] = SECTIONS.map((link, index) => (
        <li
            key={link + index}
            className={`pl-[1.88rem] leading-[200%] cursor-pointer
                        ${index === activeSectionIdx ? `before:bg-control3 ${styles.line}` : ''}`}
        >
                <span
                    onClick={() => {
                        setActiveSectionIdx(index);
                        const id = '#' + link.toLowerCase().split(' ').join('');
                        document.querySelector(id)?.scrollIntoView({behavior: 'smooth', inline: 'center'});
                    }}
                >
                    {link}
                </span>
        </li>
    ));

    // Third-Party Apps
    const renderConnectedApps = (apps: string[], userApps: string[] | undefined): ReactElement[] => {
        return apps.map((app) => {
            const isConnected: boolean | undefined = userApps?.includes(app);
            return (
                <>
                    <span className={'capitalize col-start-2'}>{app}</span>
                    {isConnected === undefined
                        ? <span>--</span>
                        : (
                            <Button
                                icon={isConnected ? 'mark-square' : 'plus-square'}
                                className={'col-start-3 flex-row-reverse place-self-end'}
                                disabled={isConnected}
                            >
                                Connect{isConnected ? 'ed' : ''}
                            </Button>
                        )
                    }
                </>
            );
        })
    }

    // Contact
    const Phones = userData.phones.map((phone: Phone, index) => (
        <span key={phone.type + index} className={'col-start-2'}>
            <span className={'text-[0.875rem] block mb-[0.62rem] mt-[1rem] capitalize'}>{phone.type}</span>
            <span>{phone.number + (phone.ext ? ' - ' + phone.ext : '')}</span>
            {phone.isPrimary ? Primary : null}
        </span>
    ));

    // Addresses
    const Addresses = userData.addresses.map((address: Address, index) => {
        const addressFull = address.line1
            + ' ' + address.line2
            + ' ' + address.cityZipState
            + ' ' + address.country;
        return (
            <span key={address.type + index} className={'col-start-3'}>
                <span className={'text-[0.875rem] mt-[0.76rem] capitalize block'}>{address.type} Address</span>
                <span className={'inline-block w-[14.69rem]'}>{addressFull}</span>
                {address.isPrimary ? Primary : null}
            </span>
        )
    });
    const personalAddress = userData.addresses.find((address) => address.type === 'personal');

    return (
        <div className={'flex mt-[3.88rem]'}>
            <aside className={'text-left ml-[14.89rem] text-nowrap fixed'}>
                <div className={'text-[1.69rem] font-bold mb-[1.56rem]'}>
                    <span>Sections</span>
                </div>
                <ul className={`flex flex-col text-[1.125rem] ${styles.line} before:bg-control4`}>
                    {SectionsNav}
                </ul>
            </aside>
            <div className={'flex-grow flex flex-col gap-y-[0.62rem] ml-[42.81rem]'}>
                <Collapsible title={SECTIONS[0]} icon={'key'} className={'gap-y-[2.09rem]'}>
                    <span className={'col-start-1 text-[1.31rem]'}>Profile Picture</span>
                    <Input
                        type={'file'}
                        classNameWrapper={'bg-white text-form w-[9.8125rem] font-bold rounded-[0.375rem] h-[1.43rem]'}
                    >
                        Upload Media
                    </Input>

                    <span className={'col-start-1 text-[1.31rem]'}>TernID</span>
                    <Editable
                        classNameWrapper={'w-[21.625rem]'}
                        classNameToggle={'col-start-3'}
                        data={{
                            className: 'bg-control2 py-[0.35rem] w-full rounded-[0.375rem] px-[0.76rem] border-small border-control4',
                            title: 'Update your TernID',
                            values: [userData.email],
                            onSave: async (values) => {
                            } //TODO
                        }}
                    >
                        <span className={'col-start-2'}>{userData.email}</span>
                    </Editable>

                    <span className={'col-start-1 text-[1.31rem]'}>Password</span>
                    <Editable
                        type={EditableTypeEnum.PASSWORD}
                        classNameWrapper={'w-[21.625rem] gap-y-[0.94rem]'}
                        classNameToggle={'col-start-3'}
                        data={{
                            className: 'bg-control2 py-[0.35rem] w-full rounded-[0.375rem] px-[0.76rem] border-small border-control4',
                            title: 'Update password',
                            onSave: async (values) => {
                                if (values[1] !== values[2])
                                    throw `Passwords don't match`
                            } //TODO
                        }}
                    >
                        <span>
                            <span className={'block'}>•••••••••••••••</span>
                            <span className={'text-[0.875rem]'}>
                                Last updated {userData.passwordUpdateDate ? formatDate(new Date(userData.passwordUpdateDate)) : '--'}
                            </span>
                        </span>
                    </Editable>

                    <span className={'col-start-1 text-[1.31rem]'}>Security</span>
                    <Editable
                        type={EditableTypeEnum.FA2}
                        classNameWrapper={'w-[21.625rem] gap-y-[0.94rem]'}
                        classNameToggle={'col-start-3'}
                        data={{
                            onSave: async () => {
                            },
                            values: userData.state2FA
                                ? [
                                    (userData.state2FA.email !== null || userData.state2FA.phone !== null).toString(), // If 2FA is enabled
                                    userData.state2FA.email,
                                    userData.state2FA.phone,
                                ]
                                : []
                        }}
                    >
                        <span>Enable / disable your two-factor authentication</span>
                    </Editable>
                </Collapsible>
                <Collapsible title={SECTIONS[1]} icon={'book'} className={'gap-y-[1.95rem]'}>
                    <span className={'col-start-1 text-[1.31rem]'}>Name</span>
                    <span className={'col-start-2'}>{userData.name}</span>
                    {/*<Editable*/}
                    {/*    icon={'pencil-square'}*/}
                    {/*    classNameValue={'col-start-3'}*/}
                    {/*    customEdit={() => {*/}
                    {/*    }}*/}
                    {/*/>*/}

                    <span className={'col-start-1 text-[1.31rem]'}>Name</span>
                    <span className={'col-start-2'}>{userData.displayName}</span>
                    {/*<Editable*/}
                    {/*    icon={'pencil-square'}*/}
                    {/*    classNameValue={'col-start-3'}*/}
                    {/*    customEdit={() => {*/}
                    {/*    }}*/}
                    {/*/>*/}

                    <span className={'col-start-1 text-[1.31rem]'}>Email Address</span>
                    <span className={'col-start-2'}>{userData.email}</span>
                    {/*<Editable*/}
                    {/*    icon={'pencil-square'}*/}
                    {/*    classNameValue={'col-start-3'}*/}
                    {/*    customEdit={() => {*/}
                    {/*    }}*/}
                    {/*/>*/}

                    <span className={'col-start-1 text-[1.31rem]'}>Phone Number</span>
                    <span>{Phones}</span>
                    {/*<Editable*/}
                    {/*    icon={'pencil-square'}*/}
                    {/*    classNameValue={'col-start-3'}*/}
                    {/*    customEdit={() => {*/}
                    {/*    }}*/}
                    {/*/>*/}

                    <span className={'col-start-1 text-[1.31rem]'}>Country or Region of Residence</span>
                    <span className={'col-start-2'}>{personalAddress?.country}</span>
                    {/*<Editable*/}
                    {/*    icon={'pencil-square'}*/}
                    {/*    classNameValue={'col-start-3'}*/}
                    {/*    customEdit={() => {*/}
                    {/*    }}*/}
                    {/*/>*/}

                    <span className={'col-start-1 text-[1.31rem]'}>Name</span>
                    <span className={'col-start-2'}>{userData.name}</span>
                    {/*<Editable*/}
                    {/*    icon={'pencil-square'}*/}
                    {/*    classNameValue={'col-start-3'}*/}
                    {/*    customEdit={() => {*/}
                    {/*    }}*/}
                    {/*/>*/}
                </Collapsible>
                <Collapsible title={SECTIONS[2]} icon={'building'} className={'gap-y-[1.88rem]'}>
                    <span className={'col-start-1 text-[1.31rem]'}>Organizational Information</span>
                    <span className={'col-start-2'}>{userData.company.name}</span>
                    {/*<Editable*/}
                    {/*    icon={'pencil-square'}*/}
                    {/*    classNameValue={'col-start-3'}*/}
                    {/*    customEdit={() => {*/}
                    {/*    }}*/}
                    {/*/>*/}

                    <span className={'col-start-1 text-[1.31rem]'}>Career Information</span>
                    {/*<Editable*/}
                    {/*    icon={'pencil-square'}*/}
                    {/*    classNameValue={'col-start-3'}*/}
                    {/*    customEdit={() => {*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <span className={'col-start-2 row-start-2'}>
                        <span className={'col-start-2 text-[0.875rem] block mb-[0.62rem]'}>Job Title</span>
                        <span>{userData.company.jobTitle}</span>
                    </span>
                    <span className={'col-start-2'}>
                        <span className={'col-start-2 text-[0.875rem] block mb-[0.62rem]'}>Job Function</span>
                        <span>{userData.company.jobFunction}</span>
                    </span>
                    <span className={'col-start-2'}>
                        <span className={'col-start-2 text-[0.875rem] block mb-[0.62rem]'}>Industry</span>
                        <span>{userData.company.industry}</span>
                    </span>
                    <span className={'col-start-2'}>
                        <span className={'col-start-2 text-[0.875rem] block mb-[0.62rem]'}>Sub-Industry</span>
                        <span>{userData.company.subIndustry}</span>
                    </span>
                </Collapsible>
                <Collapsible title={SECTIONS[3]} icon={'geo'} className={'[&]:items-start'}>
                    <span className={'col-start-1 text-[1.31rem]'}>Address Information</span>
                    <span>{Addresses}</span>
                    {/*<Editable*/}
                    {/*    classNameValue={'col-start-3'}*/}
                    {/*    customEdit={() => {*/}
                    {/*    }}*/}
                    {/*/>*/}
                </Collapsible>
                <Collapsible title={SECTIONS[4]} icon={'blocks'}>
                    <span className={'text-[1.31rem]'}>Domain</span>
                    {userData.personalDomain
                        ? (
                            <>
                                <span>{userData.personalDomain.link}</span>
                                <Button
                                    icon={userData.personalDomain.isVerified ? 'mark-square' : 'plus-flower'}
                                    className={'col-start-3 flex-row-reverse place-self-end'}
                                    disabled={userData.personalDomain.isVerified}
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
                    <span className={'mt-[1.88rem] text-[1.31rem]'}>Data Storage</span>
                    <span className={'col-start-2 text-[0.875rem] self-end'}>Applications</span>
                    {renderConnectedApps(DATA_STORAGE, userData.connectedDataStorage)}

                    <span className={'mt-[1.88rem] text-[1.31rem]'}>Social Media</span>
                    <span className={'col-start-2 text-[0.875rem] self-end'}>Applications</span>
                    {renderConnectedApps(SOCIAL_MEDIA, userData.connectedSocialMedia)}
                </Collapsible>
                <Collapsible title={SECTIONS[5]}>
                    <span className={'text-[1.31rem]'}>Account Offboarding</span>
                    <span>Delete your account and data</span>
                    <Button
                        icon={'delete-square'}
                        className={'flex-row-reverse'}
                        onClick={() => modalCtx.openModal(<DeleteAccountModal userData={userData}/>)}
                    >
                        Delete
                    </Button>
                </Collapsible>
            </div>
        </div>
    )
}

export {ProfileView}