import React, { FC } from 'react';
import cn from 'classnames';

import { DEFAULT_ADDRESS, FormData, FormInit, FormType } from '@/app/ui/form/Editable';

import { COUNTRY, CountryKey, LANGUAGE, LanguageKey, REGEX, SALUTATION } from '@/app/static';

import { UserService } from '@/app/services';

import { UserData, useUser } from '@/app/context/User.context';

import { Collapsible } from '@/app/ui/misc';
import { Editable } from '@/app/ui/form';
import { PrimaryLabel } from '@/app/ui/atoms';
import { getSimpleToggleProps, SectionProps } from '../index.page';

import styles from '@/pages/profile/Profile.module.css';

const CONTACT = 'Contact Information';

const ContactSection: FC<SectionProps> = (props: SectionProps) => {
    const { update, setEditId, editId } = props;

    const { userData } = useUser();

    if (!userData) return null;

    const salutation = SALUTATION[userData.name.salutation ?? ''] ?? '';
    const fullName =
        (salutation ? salutation + ' ' : '') +
        userData.name.firstName +
        ' ' +
        userData.name.initial +
        ' ' +
        userData.name.lastName;
    const country: string =
        COUNTRY[userData.address.personalAddress?.country ?? userData.address.businessAddress?.country ?? ''];
    const language: string = LANGUAGE[userData.language];

    const Phones = Object.entries(userData.phones).map(([type, phone], idx) =>
        phone?.number ? (
            <span key={type + idx}>
                <span className={'mb-[0.62rem] mt-[1rem] block text-section-xs capitalize'}>{type}</span>
                <span>{phone.number + ('ext' in phone ? ' - ' + phone.ext : '')}</span>
                <span>{phone.isPrimary ? <PrimaryLabel /> : null}</span>
            </span>
        ) : null,
    );

    return (
        <Collapsible
            title={CONTACT}
            icon={'book'}
            className={styles.collapsible}
        >
            <span className={styles.leftCol + ' ' + styles.ellipsis}>Name</span>
            <Editable
                key={'name-' + userData.name.firstName}
                type={'name'}
                {...getSimpleToggleProps(setEditId, editId)}
                initialize={function <T extends FormType>() {
                    return {
                        className: cn(styles.singleInputBase, styles.common, styles.roundedWFull),
                        value: {
                            firstName: userData.name.firstName ?? '',
                            lastName: userData.name.lastName ?? '',
                            salutation: userData.name.salutation ?? '',
                            initial: userData.name.initial ?? '',
                        } as FormInit<T>,
                        onSave: async (form) => {
                            if (!('salutation' in form)) throw 'Wrong request setup';
                            await update({ name: form });
                        },
                    };
                }}
            >
                <span className={`capitalize ${styles.midCol + ' ' + styles.ellipsis}`}>{fullName}</span>
            </Editable>

            <span className={styles.leftCol + ' ' + styles.ellipsis}>Display Name</span>
            {userData.username ? (
                <Editable
                    key={'username-' + userData.username}
                    {...getSimpleToggleProps(setEditId, editId)}
                    initialize={function <T extends FormType>() {
                        return {
                            className: cn(styles.singleInput, styles.singleInputBase, styles.common),
                            title: 'Update your Display Name',
                            value: { value: userData.username } as FormInit<T>,
                            onSave: async (form) => {
                                if (!('value' in form) || !form.value) throw 'Wrong request setup';
                                await update(
                                    async () => await UserService.postUpdateUserName(userData.email, form.value ?? ''),
                                );
                            },
                        };
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

            <span className={styles.leftCol + ' ' + styles.ellipsis}>Email Address</span>
            <span>{userData.email}</span>

            <span className={styles.leftCol + ' ' + styles.ellipsis}>Phone Number</span>
            <Editable
                key={'phone-' + userData.phones}
                type={'phone'}
                {...getSimpleToggleProps(setEditId, editId)}
                initialize={function <T extends FormType>() {
                    return {
                        className: cn(styles.singleInput, styles.singleInputBase, styles.common),
                        value: userData.phones as FormInit<T>,
                        onSave: async (form) => {
                            if (!('mobile' in form)) throw 'Incorrect request setup';

                            const invalid = Object.values(form as NonNullable<FormData<'phone'>>).some(
                                (phone) => phone.number && !REGEX.phone.test('+' + phone.number),
                            );
                            if (invalid) throw `Entered phone number(s) should be in the format '+1234567890'`;

                            const newPhones: UserData['phones'] = { ...(userData?.phones ?? {}), ...form };
                            await update({ phones: newPhones });
                        },
                    };
                }}
            >
                <span>{Phones.length ? Phones : '--'}</span>
            </Editable>

            <span className={styles.leftCol + ' ' + styles.ellipsis}>
                Country or Region <span className={'sm:hidden'}>of Residence</span>
            </span>
            <Editable
                key={'country-' + country}
                type={'select'}
                {...getSimpleToggleProps(setEditId, editId)}
                initialize={function <T extends FormType>() {
                    return {
                        className: `${styles.singleInputBase} ${styles.common}`,
                        title: 'Country / Region',
                        value: { value: userData.address.personalAddress?.country ?? '' } as FormInit<T>,
                        options: COUNTRY,
                        onSave: async (form) => {
                            if (!('value' in form) || !form.value) throw 'Incorrect request setup';
                            const newAddress: UserData['address'] = {
                                ...userData.address,
                                personalAddress: {
                                    ...(userData?.address?.personalAddress ?? DEFAULT_ADDRESS),
                                    country: form.value as CountryKey,
                                },
                            };
                            await update({ address: newAddress });
                        },
                    };
                }}
            >
                <span>{country ?? '--'}</span>
            </Editable>

            <span className={styles.leftCol + ' ' + styles.ellipsis}>
                <span className={'sm:hidden'}>Preferred</span> Language
            </span>
            <Editable
                key={'language-' + language}
                type={'select'}
                {...getSimpleToggleProps(setEditId, editId)}
                initialize={function <T extends FormType>() {
                    return {
                        className: `${styles.singleInputBase} ${styles.common}`,
                        title: 'Language',
                        value: { value: userData.language } as FormInit<T>,
                        options: LANGUAGE,
                        onSave: async (form) => {
                            if (!('value' in form) || !form.value) throw 'Incorrect request setup';
                            await update({ language: form.value as LanguageKey });
                        },
                    };
                }}
            >
                <span>{language ?? '--'}</span>
            </Editable>
        </Collapsible>
    );
};

export { ContactSection, CONTACT };
