'use client';

import cn from 'classnames';

import { Breakpoint } from '@/app/static';
import { UserData } from '@/app/contexts/user.context';
import { FormData, FormInit, FormType } from '@/app/ui/form/Editable';
import { SectionProps } from '../index.page';
import { DEFAULT_ADDRESS, COUNTRY, CountryKey, LANGUAGE, LanguageKey, REGEX, SALUTATION } from '@/app/static';

import { UserService } from '@/app/services';

import { getId } from '@/app/utils';
import { getSimpleToggleProps } from '../getSimpleToggleProps';
import { useBreakpointCheck, useUser } from '@/app/hooks';

import { Collapsible } from '@/app/ui/organisms';
import { Editable } from '@/app/ui/form';
import { PrimaryLabel } from '@/app/ui/atoms';

import styles from '@/pages/profile/Profile.module.css';

const CONTACT = 'Contact Information';

function ContactSection(props: SectionProps) {
    const { update, setEditId, editId } = props;

    const { userData } = useUser();

    const sm = [Breakpoint.sm, Breakpoint.xs, Breakpoint.xxs, Breakpoint.x3s].includes(useBreakpointCheck());
    const md = useBreakpointCheck() === Breakpoint.md;

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

    const formatPhoneForDisplay = (number: string | undefined): string => {
        if (!number) return '';

        return number.replace(/^\+/, '');
    };

    const phoneKey = Object.entries(userData.phones)
        .map(([type, phone]) => {
            const extension = type === 'business' ? (phone as any)?.extension || '' : '';
            return `${type}:${phone?.number || ''}:${phone?.isPrimary ? 'primary' : ''}:${extension}`;
        })
        .join('-');

    const Phones = Object.entries(userData.phones).map(([type, phone], idx) =>
        phone?.number ? (
            <span
                className={`block ${idx !== 0 && 'mt-4xs'}`}
                key={type + idx}
            >
                <span className={'mb-5xs block text-10 capitalize md:text-14 lg:text-14'}>{type}</span>
                <span className={`text-12 md:text-16 lg:text-16`}>
                    {phone.number +
                        (type === 'business' && (phone as any).extension ? ` - ${(phone as any).extension}` : '')}
                </span>
                {!phone.isPrimary ? (
                    <span className={`mt-5xs flex justify-items-start`}>
                        &nbsp;
                        <PrimaryLabel />
                        &nbsp;
                    </span>
                ) : null}
            </span>
        ) : null,
    );

    const title_CN = `[&&]:text-14  [&&]:md:text-21  [&&]:lg:text-21`;
    const label_CN = `align-bottom [&&]:text-12  [&&]:md:text-18  [&&]:lg:text-18`;

    return (
        <Collapsible
            title={CONTACT}
            icon={'book'}
            className={`${styles.collapsible} [&&]:gap-y-xxs [&&]:md:gap-y-n [&&]:lg:gap-y-n`}
            wrapper={`p-xxs rounded-s  md:p-s  lg:p-l`}
            classNameTitle={`text-18  md:text-27  lg:text-27`}
            classNameTitleIcon={`[&]:max-w-5xs  [&]:md:max-w-n  [&]:lg:max-w-n`}
            classNameHr={`border-gray-l0`}
        >
            <span className={`${styles.leftCol} ${styles.ellipsis} ${title_CN}`}>Name</span>
            <Editable
                key={'name-' + userData.name.firstName}
                type={'name'}
                classNameToggleText={`text-14`}
                {...getSimpleToggleProps(setEditId, editId)}
                initialize={function <T extends FormType>() {
                    return {
                        className: cn(
                            styles.singleInputBase,
                            styles.common,
                            styles.roundedWFull,
                            `[&&]:text-12  [&&]:md:text-14  [&&]:lg:text-16`,
                        ),
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
                    classNameToggleText={`text-14`}
                    {...getSimpleToggleProps(setEditId, editId)}
                    initialize={function <T extends FormType>() {
                        return {
                            className: cn(
                                styles.singleInput,
                                styles.singleInputBase,
                                styles.common,
                                `[&&]:text-12  [&&]:md:text-14  [&&]:lg:text-16`,
                            ),
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
                key={'phone-' + phoneKey}
                type={'phone'}
                classNameToggleText={`text-14`}
                {...getSimpleToggleProps(setEditId, editId)}
                initialize={function <T extends FormType>() {
                    const businessExtension = (userData.phones.business as any)?.extension || '';

                    const phonesWithExtension = {
                        mobile: userData.phones.mobile
                            ? {
                                  ...userData.phones.mobile,
                                  number: formatPhoneForDisplay(userData.phones.mobile.number),
                              }
                            : null,
                        business: userData.phones.business
                            ? {
                                  ...userData.phones.business,
                                  number: formatPhoneForDisplay(userData.phones.business.number),

                                  ext: businessExtension,
                              }
                            : null,
                        personal: userData.phones.personal
                            ? {
                                  ...userData.phones.personal,
                                  number: formatPhoneForDisplay(userData.phones.personal.number),
                              }
                            : null,
                    };

                    return {
                        className: cn(
                            styles.singleInput,
                            styles.singleInputBase,
                            styles.common,
                            `[&&]:text-12  [&&]:md:text-14  [&&]:lg:text-16`,
                        ),

                        value: phonesWithExtension as FormInit<T>,
                        onSave: async (form) => {
                            if (!('mobile' in form)) throw 'Incorrect request setup';

                            const processedForm = JSON.parse(JSON.stringify(form));

                            const phoneTypes = ['mobile', 'business', 'personal'] as const;
                            for (const type of phoneTypes) {
                                if (processedForm[type]?.number) {
                                    let digits = processedForm[type].number.replace(/\D/g, '');

                                    if (digits.length === 10) {
                                        digits = '1' + digits;
                                    }

                                    processedForm[type].number = '+' + digits;
                                }
                            }

                            if (processedForm.business?.extension) {
                                const extensionValue = processedForm.business.extension || '';
                                processedForm.business.extension = extensionValue;
                            }

                            await update({ phones: processedForm });
                        },
                    };
                }}
            >
                <span>{Phones.length ? Phones : '--'}</span>
            </Editable>

            <span className={`${styles.leftCol} ${styles.ellipsis} ${title_CN}`}>
                Country or Region <span className={sm || md ? 'hidden' : 'block'}>of Residence</span>
            </span>
            <Editable
                key={'country-' + country}
                type={'select'}
                classNameToggleText={`text-14`}
                {...getSimpleToggleProps(setEditId, editId)}
                initialize={function <T extends FormType>() {
                    return {
                        className: `${styles.singleInputBase} ${styles.common} [&&]:text-12  [&&]:md:text-14  [&&]:lg:text-16`,
                        title: 'Country / Region',
                        value: {
                            value: userData.address.personalAddress?.country ?? '',
                        } as FormInit<T>,
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
                <span className={sm || md ? 'hidden' : 'block'}>Preferred </span>
                Language
            </span>
            <Editable
                key={'language-' + language}
                type={'select'}
                classNameToggleText={`text-14`}
                {...getSimpleToggleProps(setEditId, editId)}
                initialize={function <T extends FormType>() {
                    return {
                        className: `${styles.singleInputBase} ${styles.common} [&&]:text-12  [&&]:md:text-14  [&&]:lg:text-16`,
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
}

ContactSection.ID = getId(CONTACT);

export { ContactSection };
