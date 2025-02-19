import React, { FC } from 'react';
import cn from 'classnames';

import { DEFAULT_ADDRESS, FormData, FormInit, FormType } from '@/app/ui/form/Editable';

import { COUNTRY, CountryKey, LANGUAGE, LanguageKey, REGEX, SALUTATION } from '@/app/static';

import { UserService } from '@/app/services';
import { Breakpoint } from '@/app/hooks/useBreakpointCheck';

import { UserData, useUser } from '@/app/context/User.context';

import { Collapsible } from '@/app/ui/misc';
import { Editable } from '@/app/ui/form';
import { PrimaryLabel } from '@/app/ui/atoms';
import { getSimpleToggleProps, SectionProps } from '../index.page';

import styles from '@/pages/profile/Profile.module.css';
import { useBreakpointCheck } from '@/app/hooks/useBreakpointCheck';

const CONTACT = 'Contact Information';

const ContactSection: FC<SectionProps> = (props: SectionProps) => {
    const { update, setEditId, editId } = props;

    const { userData } = useUser();

    const isSm = [Breakpoint.sm, Breakpoint.xs, Breakpoint.xxs, Breakpoint.x3s].includes(useBreakpointCheck());
    const isMd = useBreakpointCheck() === Breakpoint.md;

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
            <span
                className={`block ${idx !== 0 && 'mt-4xs'}`}
                key={type + idx}
            >
                <span className={'mb-5xs block text-section-3xs capitalize md:text-section-xs lg:text-section-xs'}>
                    {type}
                </span>
                <span className={`text-section-xxs md:text-basic lg:text-basic`}>
                    {phone.number + ('ext' in phone ? ' - ' + phone.ext : '')}
                </span>
                {!phone.isPrimary ? (
                    <span className={`mt-5xs flex justify-items-start`}>
                        {' '}
                        <PrimaryLabel />{' '}
                    </span>
                ) : null}
            </span>
        ) : null,
    );

    const title_CN = `[&&]:text-section-xs  [&&]:md:text-heading-s  [&&]:lg:text-heading-s`;
    const label_CN = `align-bottom [&&]:text-section-xxs  [&&]:md:text-section-s  [&&]:lg:text-section-s`;

    return (
        <Collapsible
            title={CONTACT}
            icon={'book'}
            className={`${styles.collapsible} [&&]:gap-y-xxs [&&]:md:gap-y-n [&&]:lg:gap-y-n`}
            classNameWrapper={`p-xxs rounded-s  md:p-s  lg:p-l`}
            classNameTitle={`text-section-s  md:text-heading  lg:text-heading`}
            classNameTitleIcon={`[&]:max-w-[1rem]  [&]:md:max-w-[1.8125rem]  [&]:lg:max-w-[1.8125rem]`}
            classNameHr={`border-gray-l0 scale-[102%]`}
        >
            <span className={`${styles.leftCol} ${styles.ellipsis} ${title_CN}`}>Name</span>
            <Editable
                key={'name-' + userData.name.firstName}
                type={'name'}
                classNameText={`text-section-xs`}
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
                <span className={`capitalize ${styles.midCol} ${styles.ellipsis} ${label_CN}`}>{fullName}</span>
            </Editable>

            <span className={`${styles.leftCol} ${styles.ellipsis} ${title_CN}`}>Display Name</span>
            {userData.username ? (
                <Editable
                    key={'username-' + userData.username}
                    classNameText={`text-section-xs`}
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
                    <span className={label_CN}>{userData.username}</span>
                </Editable>
            ) : (
                <>
                    <span>--</span>
                    <span>--</span>
                </>
            )}

            <span className={`${styles.leftCol} ${styles.ellipsis} ${title_CN}`}>Email Address</span>
            <span className={label_CN}>{userData.email}</span>

            <span className={`${styles.leftCol} ${styles.ellipsis} ${title_CN}`}>Phone Number</span>
            <Editable
                key={'phone-' + userData.phones}
                type={'phone'}
                classNameText={`text-section-xs`}
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

            <span className={`${styles.leftCol} ${styles.ellipsis} ${title_CN}`}>
                Country or Region <span className={isSm || isMd ? 'hidden' : 'block'}>of Residence</span>
            </span>
            <Editable
                key={'country-' + country}
                type={'select'}
                classNameText={`text-section-xs`}
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
                <span className={label_CN}>{country ?? '--'}</span>
            </Editable>

            <span className={`${styles.leftCol} ${styles.ellipsis} ${title_CN}`}>
                <span className={isSm || isMd ? 'hidden' : 'block'}>Preferred </span>Language
            </span>
            <Editable
                key={'language-' + language}
                type={'select'}
                classNameText={`text-section-xs`}
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
                <span className={label_CN}>{language ?? '--'}</span>
            </Editable>
        </Collapsible>
    );
};

export { ContactSection, CONTACT };
