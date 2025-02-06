import React, {FC} from "react";
import cn from "classnames";

import {COUNTRY, CountryKey, LANGUAGE, LanguageKey, REGEX, SALUTATION} from "@/app/static";
import {DEFAULT_ADDRESS} from "@/app/ui/form/Editable";

import {UserService} from "@/app/services";

import {UserData, useUser} from "@/app/context/User.context";

import {Collapsible} from "@/app/ui/misc";
import {Editable} from "@/app/ui/form";
import {PrimaryLabel} from "@/app/ui/atoms";
import {getSimpleToggleProps, SectionProps} from "../index.page";

import styles from "@/pages/profile/Profile.module.css";


const CONTACT = 'Contact Information';


const ContactSection: FC<SectionProps> = (props: SectionProps) => {
    const {update, setEditId, editId} = props;

    const {userData} = useUser();

    if (!userData)
        return null;


    const Phones = Object.entries(userData.phones)
        .map(([type, phone], idx) =>
            phone?.number
                ? (
                    <span key={type + idx}>
                        <span className={"text-section-xs block mb-[0.62rem] mt-[1rem] capitalize"}>{type}</span>
                        <span>{phone.number + ("ext" in phone ? " - " + phone.ext : "")}</span>
                        <span>{phone.isPrimary ? <PrimaryLabel/> : null}</span>
                    </span>
                )
                : null
        )


    return (
        <Collapsible
            title={CONTACT}
            icon={"book"}
            className={styles.collapsible}
        >
            <span className={styles.leftCol + " " + styles.ellipsis}>Name</span>
            <Editable
                type={"name"}
                {...getSimpleToggleProps(setEditId, editId)}
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
                            await update({name: formData});
                    },
                }}
            >
                        <span className={`capitalize ${styles.midCol + " " + styles.ellipsis}`}>
                            {SALUTATION[userData.name.salutation ?? ''] || "--"}
                            &nbsp;
                            {userData.name.firstName} {userData.name.initial} {userData.name.lastName}
                        </span>
            </Editable>

            <span className={styles.leftCol + " " + styles.ellipsis}>Display Name</span>
            {userData.username ? (
                <Editable
                    {...getSimpleToggleProps(setEditId, editId)}
                    data={{
                        className: cn(styles.singleInput, styles.singleInputBase, styles.common),
                        title: "Update your Display Name",
                        value: {value: userData.username},
                        onSave: async (formData) => {
                            if (!('value' in formData) || !formData.value)
                                throw 'Wrong request setup';
                            await update(async () =>
                                await UserService.postUpdateUserName(userData.email, formData.value ?? '')
                            );
                        }
                    }}
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
                {...getSimpleToggleProps(setEditId, editId)}
                data={{
                    className: cn(styles.singleInput, styles.singleInputBase, styles.common),
                    value: userData.phones,
                    onSave: async (formData) => {
                        if (!("mobile" in formData))
                            throw 'Incorrect request setup';

                        if (Object.values(formData).some(phone => phone.number && !REGEX.phone.test('+' + phone.number)))
                            throw `Entered phone number(s) should be in the format '+1234567890'`;

                        const newPhones: UserData['phones'] = {...(userData?.phones ?? {}), ...formData}
                        await update({phones: newPhones});
                    },
                }}
            >
                <span>{Phones.length ? Phones : '--'}</span>
            </Editable>

            <span className={styles.leftCol + " " + styles.ellipsis}>
                        Country or Region&nbsp;
                <span className={'sm:hidden'}>of Residence</span>
                    </span>
            <Editable
                type={"select"}
                {...getSimpleToggleProps(setEditId, editId)}
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
                        await update({address: newAddress});
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
                {...getSimpleToggleProps(setEditId, editId)}
                data={{
                    className: `${styles.singleInputBase} ${styles.common}`,
                    title: "Language",
                    value: {value: userData.language},
                    options: LANGUAGE,
                    onSave: async (formData) => {
                        if (!("value" in formData) || !formData.value)
                            throw 'Incorrect request setup';
                        await update({language: formData.value as LanguageKey});
                    },
                }}
            >
                <span>{LANGUAGE[userData.language] ?? "--"}</span>
            </Editable>
        </Collapsible>
    );
}


export {ContactSection, CONTACT};
