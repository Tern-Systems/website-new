import React, {Dispatch, FC, ReactElement, SetStateAction, useEffect, useState,} from "react";
import cn from "classnames";

import {Res} from "@/app/types/service";
import {UserData} from "@/app/context/User.context";
import {LanguageKey} from "@/app/static/misc";
import {UpdateUserData} from "@/app/services/user.service";
import {DEFAULT_ADDRESS, EditableProps} from "@/app/ui/form/Editable";

import {
    COUNTRY,
    CountryKey,
    INDUSTRY,
    JOB_FUNCTION,
    LANGUAGE,
    SALUTATION,
    STATE_PROVINCE,
    SUB_INDUSTRY,
} from "@/app/static";

import {AuthService, UserService} from "@/app/services";

import {formatDate} from "@/app/utils/data";
import {useBreakpointCheck, useLoginCheck, useSaveOnLeave} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {Collapsible, ScrollEnd} from "@/app/ui/misc";
import {Button, Editable, Input} from "@/app/ui/form";
import {DeleteAccountModal} from "./DeleteAccountModal";

import {AuthenticationCode, MessageModal} from "@/app/ui/modals";

import styles from "./Profile.module.css";


const SECTIONS: string[] = [
    "Account Credentials",
    "Contact Information",
    "Company or Organization",
    "Addresses",
    "Third-Party Applications",
    "Offboarding",
];

// const DATA_STORAGE: string[] = ["Google Drive", "Dropbox", "SharePoint"];
//
// const SOCIAL_MEDIA: string[] = [
//     "Discord",
//     "WhatsApp",
//     "Instagram",
//     "Stack Overflow",
//     "GitHub",
//     "X",
//     "Reddit",
//     "LinkedIn",
//     "Facebook",
// ];

const getSimpleToggleProps = (
    setEditState?: Dispatch<SetStateAction<boolean>>,
    isEditState?: boolean
): Pick<
    EditableProps,
    | "classNameWrapper"
    | "classNameToggle"
    | "setParentEditState"
    | "isToggleBlocked"
> => ({
    classNameWrapper: "w-[min(100%,21.625rem)]",
    classNameToggle: "col-start-3",
    setParentEditState: setEditState,
    isToggleBlocked: isEditState,
});

const ProfilePage: FC = () => {
    const modalCtx = useModal();
    const {userData, token, fetchUserData} = useUser();
    const isLoggedIn = useLoginCheck();
    const isSmScreen = useBreakpointCheck() === 'sm';
    useSaveOnLeave();

    const [activeSectionIdx, setActiveSectionIdx] = useState(0);
    const [isEditState, setEditState] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            SECTIONS.forEach((section, index) => {
                const elem = document.getElementById(
                    section.toLowerCase().split(" ").join("")
                );
                if (
                    elem &&
                    elem.getBoundingClientRect().top <
                    (elem.offsetTop / window.innerHeight) * (isSmScreen ? 28 : 350)
                )
                    setActiveSectionIdx(index);
            });
        };
        window.addEventListener("wheel", handleScroll);
        return () => window.removeEventListener("wheel", handleScroll);
    }, [isSmScreen]);

    if (!userData || !isLoggedIn || !token) return null;


    const handleUpdate = async (valueOrHandle: Partial<UpdateUserData> | (() => Promise<Res>)) => {
        try {
            let responseMsg: string;
            if (typeof valueOrHandle === 'function') {
                const {message} = await valueOrHandle();
                responseMsg = message;
            } else {
                const newUserData = {...userData, photo: null, ...valueOrHandle};
                const {message} = await UserService.postUpdateUser(userData.email, newUserData);
                responseMsg = message;
            }

            modalCtx.openModal(<MessageModal>{responseMsg}</MessageModal>);
            await fetchUserData();
        } catch (error: unknown) {
            if (typeof error === 'string')
                modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    }

    // Elements
    const Primary = (
        <span
            className={cn(
                `col-start-2 bg-control-white-d0 rounded-smallest1 w-[4.15rem] py-[0.1rem] block`,
                `text-gray text-center text-section-xxs font-oxygen mt-[0.62rem]`
            )}
        >
            Primary
        </span>
    );

    const SectionsNav: ReactElement[] = SECTIONS.map((link, idx) => (
        <li
            key={link + idx}
            className={cn(
                `pl-[--2dr] leading-[200%] cursor-pointer
                sm:landscape:pl-[--1dr]`,
                {[`before:bg-control-blue ${styles.line}`]: idx === activeSectionIdx}
            )}
        >
            <span
                onClick={() => {
                    setActiveSectionIdx(idx);
                    const id = "#" + link.toLowerCase().split(" ").join("");
                    document
                        .querySelector(id)
                        ?.scrollIntoView({behavior: "smooth", inline: "center"});
                }}
            >
                {link}
            </span>
        </li>
    ));

    // Third-Party Apps
    // const renderConnectedApps = (
    //     apps: string[],
    //     userApps: { name: string; link: string }[]
    // ): ReactElement[] => {
    //     return apps.map((app, idx) => {
    //         const userApp = userApps.find((userApp) => userApp.name === app);
    //         const isFound = userApp !== undefined;
    //         const text = `Connect` + (isFound ? `ed` : ``);
    //         const icon: ButtonIcon = isFound ? "mark-square" : "plus-square";
    //
    //         return (
    //             <span key={app + idx} className={"contents"}>
    //                 {isFound
    //                     ? (
    //                         <a
    //                             href={userApp?.link}
    //                             className={`capitalize col-start-2 ${styles.midCol} ${styles.ellipsis}`}
    //                             target={"_blank"}
    //                         >
    //                             {app}
    //                         </a>
    //                     )
    //                     : <span className={`capitalize col-start-2 ${styles.midCol} ${styles.ellipsis}`}>{app}</span>
    //                 }
    //                 <Button
    //                     icon={icon}
    //                     hovered={{
    //                         icon: isFound ? "close-square" : icon,
    //                         text: isFound ? "" : "Disconnect",
    //                         className: isFound ? 'bg-red' : 'bg-blue',
    //                     }}
    //                     className={cn(`col-start-3 flex-row-reverse place-self-end text-section-xs font-bold`, styles.ellipsis)}
    //                     onClick={() => {
    //                         // TODO
    //                     }}
    //                 >
    //                    <span className={'sm:hidden'}>{text}</span>
    //                 </Button>
    //             </span>
    //         )
    //     });
    // };

    // Contact
    const Phones = Object.entries(userData.phones).map(([type, phone], idx) =>
        phone?.number
            ? (
                <span key={type + idx}>
                    <span className={"text-section-xs block mb-[0.62rem] mt-[1rem] capitalize"}>{type}</span>
                    <span>{phone.number + ("ext" in phone ? " - " + phone.ext : "")}</span>
                    <span>{phone.isPrimary ? Primary : null}</span>
                </span>
            )
            : null
    );

    // Addresses
    const Addresses: (ReactElement | null)[] = Object.entries(userData.address)
        .filter((address) => address[1])
        .map(([type, address], idx) => {
            if (!address || !address.state || !address.country)
                return null;
            const state = address ? STATE_PROVINCE?.[address.country]?.[address.state] : '';
            const addressInfo: ReactElement | null =
                (
                    <>
                        <span className={"w-full flex flex-col"}>
                            <span>{address.line1}</span>
                            <span>{address.line2}</span>
                            <span>{address.city} {state} {address.zip}</span>
                            <span>{COUNTRY[address.country]}</span>
                        </span>
                        {address.isPrimary ? Primary : null}
                    </>
                );

            return (
                <span key={type + idx} className={"col-start-2"}>
                    <span className={"text-section-xs mt-[0.76rem] mb-[0.2rem] capitalize block"}>
                        {type.slice(0, "Address".length + 1)} Address
                    </span>
                    {addressInfo}
                </span>
            );
        });

    // Company
    // @ts-expect-error wrong sub-industry key
    const subIndustry = SUB_INDUSTRY?.[userData.company.industry]?.[userData.company.subIndustry];

    return (
        <div className={cn(
            "flex",
            'lg:mt-[3.88rem]',
            `md:portrait:h-[calc(100%-2*var(--p-content-xs))] md:x-[mt-[--p-content-xs],px-[--p-content-xs],overflow-y-scroll]`,
            `sm:mt-0`,
            `sm:portrait:h-[calc(100%-2*var(--p-content-xxl))] sm:portrait:x-[mt-[--p-content-xxl],px-[--p-content-xs],overflow-y-scroll]`,
            `sm:landscape:h-[calc(100%-2*var(--p-content-xs))] sm:landscape:x-[mt-[--p-content-xs],px-[--p-content-xs],overflow-y-scroll]`,
        )}
        >
            <aside
                className={cn(
                    `sticky self-start text-left text-nowrap`,
                    `hidden top-[min(25.3dvw,3.88rem)] ml-[min(5.3dvw,15rem)]`,
                    `lg:block`,
                )}
            >
                <div
                    className={cn(
                        `font-bold`,
                        `mb-[--1hdrs] text-heading`,
                        `sm:landscape:text-heading-s`,
                    )}
                >
                    <span>Sections</span>
                </div>
                <ul
                    className={cn(styles.line,
                        `flex flex-col before:bg-control-white`,
                        `text-section`,
                        `sm:landscape:text-section-xs`,
                    )}
                >
                    {SectionsNav}
                </ul>
            </aside>
            <div
                className={cn(
                    `flex-grow flex flex-col gap-y-[--p-content-4xs]`,
                    `lg:ml-[10rem]`,
                    `sm:landscape:x-[grid,auto-rows-min,grid-cols-2,gap-[--p-content-5xs]] sm:landscape:[&>div]:place-self-start`,
                )}
            >
                <Collapsible
                    title={SECTIONS[0]}
                    icon={"key"}
                    className={styles.collapsible}
                >
                    <span className={styles.leftCol + " " + styles.ellipsis}>
                        Profile Picture
                    </span>
                    <Input
                        type={"file"}
                        onClick={(event) => {
                            if (event.currentTarget)
                                event.currentTarget.value = ''
                        }}
                        onChange={async (event) => {
                            if (!('target' in event) || !event.target.files)
                                throw 'No file has been uploaded';
                            const file = Array.from(event.target?.files)?.[0];
                            if (!file)
                                throw 'No file has been uploaded';
                            const newPhotoUserData: UpdateUserData = {...userData, photo: file};
                            await UserService.postUpdateUser(userData.email, newPhotoUserData);
                        }}
                        classNameWrapper={cn(
                            `px-[--p-content-xxs] [&]:w-fit rounded-full bg-control-white text-gray font-bold`,
                            `h-[1.43rem] text-section-xs`,
                            `sm:x-[h-[1.125rem],text-section-xxs]`,
                        )}
                        className={'w-fit'}
                        classNameIcon={'[&&_*]:size-[--p-content-xxs]  sm:[&_*]:size-[--p-content-4xs]'}
                    >
                        Upload Media
                    </Input>

                    <span className={styles.leftCol + " " + styles.ellipsis}>TernID</span>
                    <Editable
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        data={{
                            className: cn(styles.singleInput, styles.singleInputBase, styles.common),
                            title: "Update your TernID",
                            value: {value: userData.email},
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onSave: async (formData) => {
                                // TODO ternID
                                // if ("value" in formData)
                                // await handleUpdate('general',{ternId:formData.value});
                            },
                        }}
                    >
                        <span
                            className={styles.midCol + " " + styles.ellipsis}>{userData.ternID ?? userData.email}</span>
                    </Editable>

                    <span className={styles.leftCol + " " + styles.ellipsis}>Password</span>
                    <Editable
                        type={"password"}
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        classNameWrapper={getSimpleToggleProps(setEditState, isEditState).classNameWrapper + " gap-y-[--p-content-xxs]"}
                        data={{
                            className: cn(styles.singleInput, styles.singleInputBase, styles.common),
                            title: "Update password",
                            value: null,
                            onSave: async (formData) => {
                                await handleUpdate(async () => {
                                    if (!("passwordConfirm" in formData) || !userData)
                                        throw 'Wrong request setup';

                                    if (formData.passwordConfirm !== formData.newPassword)
                                        throw `Passwords don't match`;

                                    return await AuthService.postChangePassword(
                                        formData.currentPassword,
                                        formData.newPassword,
                                        formData.passwordConfirm,
                                        userData.email
                                    );
                                });
                            }
                        }}
                    >
                    <span className={styles.midCol + " " + styles.ellipsis}>
                        <span className={"block"}>•••••••••••••••</span>
                        <span className={"text-section-xs"}>
                            Last updated&nbsp;
                            {userData.passwordUpdateDate
                                ? formatDate(new Date(userData.passwordUpdateDate), "short")
                                : "--"}
                        </span>
                    </span>
                    </Editable>

                    <span className={styles.leftCol + " " + styles.ellipsis}>
                        Security
                    </span>
                    <Editable
                        type={"2FA"}
                        {...getSimpleToggleProps()}
                        classNameWrapper={getSimpleToggleProps().classNameWrapper + " gap-y-[--p-content-xxs]"}
                        data={{
                            value: {
                                isEmailAdded: !!userData.state2FA.email,
                                isPhoneAdded: !!userData.state2FA.phone,
                                suggestedPhone: userData.phones.personal?.number ?? null,
                            },
                            onSave: async (formData) => {
                                if (!("value" in formData) || !formData.value)
                                    throw 'Wrong request setup';

                                const phone = formData.value.trim();
                                const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format validation

                                if (!phoneRegex.test(phone))
                                    throw `Invalid phone number format. Please enter a valid number.`;


                                const numericPhone = phone.startsWith("+")
                                    ? phone.slice(1)
                                    : phone;
                                if (numericPhone.length < 10 || numericPhone.length > 15)
                                    throw `Phone number must contain 10 digits long.`;

                                modalCtx.openModal(
                                    <AuthenticationCode
                                        is2FA
                                        isPhoneEnabling
                                        token={token}
                                        phone={phone}
                                        email={userData.email || ""}
                                    />
                                );
                            },
                            onSwitch: async (state: boolean) => {
                                if (token && userData.state2FA?.phone) {
                                    modalCtx.openModal(
                                        <AuthenticationCode
                                            is2FA
                                            isDisabling={state}
                                            token={token}
                                            phone={userData.state2FA?.phone}
                                            email={userData.email}
                                        />
                                    );
                                }
                            }
                        }}
                    >
                        <span className={styles.midCol + " " + styles.ellipsis}>
                            Enable / disable your {isSmScreen ? '2FA' : 'two - factor authentication'}
                        </span>
                    </Editable>
                </Collapsible>

                <Collapsible
                    title={SECTIONS[1]}
                    icon={"book"}
                    className={styles.collapsible}
                >
                    <span className={styles.leftCol + " " + styles.ellipsis}>Name</span>
                    <Editable
                        type={"name"}
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        data={{
                            className: cn(styles.singleInputBase, styles.common, styles.roundedWFull),
                            value: {
                                firstName: userData.name.firstName ?? '',
                                lastName: userData.name.lastName ?? '',
                                salutation: userData.name.salutation ?? '',
                                initial: userData.name.initial ?? '',
                            },
                            onSave: async (formData) => {
                                if ("salutation" in formData)
                                    await handleUpdate({name: formData});
                            },
                        }}
                    >
                        <span className={`capitalize ${styles.midCol + " " + styles.ellipsis}`}>
                            {userData.name.salutation
                                ? SALUTATION[userData.name.salutation]
                                : "--"}
                            &nbsp;
                            {userData.name.firstName} {userData.name.initial} {userData.name.lastName}
                        </span>
                    </Editable>

                    <span className={styles.leftCol + " " + styles.ellipsis}>Display Name</span>
                    {userData.username ? (
                        <Editable
                            {...getSimpleToggleProps(setEditState, isEditState)}
                            data={{
                                className: cn(styles.singleInput, styles.singleInputBase, styles.common),
                                title: "Update your Display Name",
                                value: {value: userData.username},
                                onSave: async (formData) => {
                                    await handleUpdate(async () => {
                                        if (!('value' in formData) || !formData.value)
                                            throw 'Wrong request setup';
                                        return await UserService.postUpdateUserName(userData.email, formData.value);
                                    });
                                }
                            }}
                            setParentEditState={setEditState}
                            isToggleBlocked={isEditState}
                        >
                            <span>{userData.username}</span>
                        </Editable>
                    ) : (
                        <>
                            <span>--</span>
                            <span>--</span>
                        </>
                    )}

                    <span className={styles.leftCol + " " + styles.ellipsis}>Email Address</span>
                    <span>{userData.email}</span>

                    <span className={styles.leftCol + " " + styles.ellipsis}>Phone Number</span>
                    <Editable
                        type={"phone"}
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        data={{
                            className: cn(styles.singleInput, styles.singleInputBase, styles.common),
                            value: userData.phones,
                            onSave: async (formData) => {
                                if (!("mobile" in formData))
                                    throw 'Incorrect request setup';
                                const newPhones: UserData['phones'] = {...(userData?.phones ?? {}), ...formData}
                                await handleUpdate({phones: newPhones});
                            },
                        }}
                    >
                        <span>{Phones}</span>
                    </Editable>

                    <span className={styles.leftCol + " " + styles.ellipsis}>
                        Country or Region&nbsp;
                        <span className={'sm:hidden'}>of Residence</span>
                    </span>
                    <Editable
                        type={"select"}
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        data={{
                            className: `${styles.singleInputBase} ${styles.common}`,
                            title: "Country / Region",
                            value: {value: userData.address.personalAddress?.country ?? ''},
                            options: COUNTRY,
                            onSave: async (formData) => {
                                if (!("value" in formData) || !formData.value)
                                    throw 'Incorrect request setup';
                                const newAddress: UserData['address'] = {
                                    ...userData.address,
                                    personalAddress: {
                                        ...(userData?.address?.personalAddress ?? DEFAULT_ADDRESS),
                                        country: formData.value as CountryKey
                                    }
                                }
                                await handleUpdate({address: newAddress});
                            }
                        }}
                    >
                    <span>
                      {COUNTRY[userData.address.personalAddress?.country ?? userData.address.businessAddress?.country ?? ''] ?? "--"}
                    </span>
                    </Editable>

                    <span className={styles.leftCol + " " + styles.ellipsis}>
                        <span className={'sm:hidden'}>Preferred</span> Language
                    </span>
                    <Editable
                        type={"select"}
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        data={{
                            className: `${styles.singleInputBase} ${styles.common}`,
                            title: "Language",
                            value: {value: userData.language},
                            options: LANGUAGE,
                            onSave: async (formData) => {
                                if (!("value" in formData) || !formData.value)
                                    throw 'Incorrect request setup';
                                await handleUpdate({language: formData.value as LanguageKey});
                            },
                        }}
                    >
                        <span>{LANGUAGE[userData.language] ?? "--"}</span>
                    </Editable>
                </Collapsible>

                <Collapsible
                    title={SECTIONS[2]}
                    icon={"building"}
                    className={styles.collapsible}
                >
                    <span className={styles.leftCol + " " + styles.ellipsis}>
                        Organization<span className={'sm:hidden'}>al Information</span>
                    </span>
                    <Editable
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        data={{
                            className: cn(styles.singleInput, styles.singleInputBase, styles.common),
                            value: {value: userData.company?.name ?? ''},
                            onSave: async (formData) => {
                                if (!("value" in formData) || !formData.value)
                                    throw 'Incorrect request setup';
                                const newCompany: UserData['company'] = {
                                    ...(userData.company ?? {
                                        jobTitle: '',
                                        jobFunction: '',
                                        subIndustry: '',
                                        industry: ''
                                    }),
                                    name: formData.value,
                                }
                                await handleUpdate({company: newCompany});
                            },
                        }}
                    >
                        <span>{userData.company?.name ?? "--"}</span>
                    </Editable>

                    <span className={styles.leftCol + " " + styles.ellipsis}>
                        Career <span className={'sm:hidden'}>Information</span>
                    </span>
                    <Editable
                        type={"company"}
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        data={{
                            className: cn(styles.singleInput, styles.singleInputBase, `px-[0.76rem] border-small`, styles.roundedWFull),
                            value: userData.company,
                            onSave: async (formData) => {
                                if (!("industry" in formData))
                                    throw 'Incorrect request setup';
                                const newCompany: UserData['company'] = {
                                    ...formData,
                                    name: userData.company?.name ?? ''
                                }
                                await handleUpdate({company: newCompany});
                            },
                        }}
                    >
                        {userData.company
                            ? (
                                <div
                                    className={cn(
                                        'flex flex-col gap-y-[--p-content-xs]',
                                        '[&>span]:x-[col-start-2,flex,flex-col,gap-y-[--p-content-5xs],text-basic]',
                                        '[&>span>span]:text-section-xs',
                                    )}
                                >
                                    <span>
                                        <span>Job Title</span>
                                        <span>{userData.company.jobTitle}</span>
                                    </span>
                                    <span>
                                        <span>Job Function</span>
                                        <span>{JOB_FUNCTION[userData.company.jobFunction]}</span>
                                    </span>
                                    <span>
                                        <span>Industry</span>
                                        <span>{INDUSTRY[userData.company.industry]}</span>
                                    </span>
                                    <span>
                                        <span>Sub-Industry</span>
                                        <span>{subIndustry ?? '--'}</span>
                                    </span>
                                </div>
                            )
                            : <>--</>}
                    </Editable>
                </Collapsible>

                <Collapsible
                    title={SECTIONS[3]}
                    icon={"geo"}
                    className={"[&]:items-start"}
                >
                    <span className={styles.leftCol + " " + styles.ellipsis}>
                        Address <span className={'sm:hidden'}>Information</span>
                    </span>
                    <Editable
                        type={"address"}
                        {...getSimpleToggleProps(setEditState, isEditState)}
                        data={{
                            className: cn(styles.singleInputBase, styles.common, styles.roundedWFull),
                            value: userData.address,
                            onSave: async (formData) => {
                                if (!("personalAddress" in formData))
                                    throw 'Incorrect request setup';
                                const newAddress: UserData['address'] = {...userData.address, ...formData}
                                await handleUpdate({address: newAddress});
                            },
                        }}
                    >
                        <span>{Addresses}</span>
                    </Editable>
                </Collapsible>

                {/*<Collapsible title={SECTIONS[4]} icon={"blocks"}>*/}
                {/*    <span className={styles.leftCol + " " + styles.ellipsis}>Domain</span>*/}
                {/*    {userData.personalDomain*/}
                {/*        ? (*/}
                {/*            <>*/}
                {/*                <a href={userData.personalDomain.link} target={"_blank"}>*/}
                {/*                    {userData.personalDomain.link}*/}
                {/*                </a>*/}
                {/*            </>*/}
                {/*        )*/}
                {/*        : <span>--</span>*/}
                {/*    }*/}

                {/*    <Button*/}
                {/*        disabled={userData.personalDomain?.isVerified}*/}
                {/*        icon={*/}
                {/*            userData.personalDomain?.isVerified*/}
                {/*                ? "mark-flower"*/}
                {/*                : "plus-flower"*/}
                {/*        }*/}
                {/*        className={"col-start-3 flex-row-reverse place-self-end"}*/}
                {/*    >*/}
                {/*        <span className={'sm:hidden'}>Verif{userData.personalDomain?.isVerified ? "ied" : "y"}</span>*/}
                {/*    </Button>*/}

                {/*    <span className={`mt-[--p-content] ${styles.leftCol} ${styles.ellipsis}`}>*/}
                {/*        Data Storage*/}
                {/*    </span>*/}
                {/*    <span className={`col-start-2 text-section-xs self-end ${styles.ellipsis}`}>*/}
                {/*        Applications*/}
                {/*    </span>*/}
                {/*    {renderConnectedApps(DATA_STORAGE, userData.connectedApps.data)}*/}

                {/*    <span className={`mt-[--p-content] ${styles.leftCol} ${styles.ellipsis}`}>*/}
                {/*        Social Media*/}
                {/*    </span>*/}
                {/*    <span className={"col-start-2 text-section-xs self-end"}>*/}
                {/*        Applications*/}
                {/*    </span>*/}
                {/*    {renderConnectedApps(SOCIAL_MEDIA, userData.connectedApps.social)}*/}
                {/*</Collapsible>*/}

                <Collapsible title={SECTIONS[5]}>
                    <span className={styles.leftCol + " " + styles.ellipsis}>
                         <span className={'sm:hidden'}>Account</span> Offboarding
                    </span>
                    <span className={styles.midCol + " " + styles.ellipsis}>
                        Delete your account and data
                    </span>
                    <Button
                        icon={"delete-square"}
                        className={"flex-row-reverse [&]:place-content-end"}
                        onClick={() => modalCtx.openModal(<DeleteAccountModal userData={userData}/>, {darkenBg: true})}
                    >
                        <span className={'sm:hidden'}>Delete</span>
                    </Button>
                </Collapsible>
                <ScrollEnd/>
            </div>
        </div>
    );
};

export default ProfilePage;
