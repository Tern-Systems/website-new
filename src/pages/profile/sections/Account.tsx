'use client';

import cn from 'classnames';

import { Breakpoint } from '@/app/static';
import { FormInit, FormType } from '@/app/ui/form/Editable';
import { SectionProps } from '../index.page';

import { REGEX } from '@/app/static';

import { AuthService } from '@/app/services';

import { useBreakpointCheck, useModal, useUser } from '@/app/hooks';

import { formatDate, getId } from '@/app/utils';
import { getSimpleToggleProps } from '../getSimpleToggleProps';

import { Collapsible } from '@/app/ui/organisms';
import { Editable } from '@/app/ui/form';
import { AuthenticationCode } from '@/app/ui/modals';

import styles from '@/pages/profile/Profile.module.css';

const ACCOUNT = 'Account Credentials';

function AccountSection(props: SectionProps) {
    const { update, setEditId, editId } = props;

    const { userData, token } = useUser();
    const modalCtx = useModal();
    const sm = [Breakpoint.sm, Breakpoint.xs, Breakpoint.xxs, Breakpoint.x3s].includes(useBreakpointCheck());

    if (!userData || !token) return null;

    const title_CN = `[&&]:text-14  [&&]:md:text-21  [&&]:lg:text-21`;
    const label_CN = `align-bottom [&&]:text-12  [&&]:md:text-18  [&&]:lg:text-18`;

    return (
        <Collapsible
            title={ACCOUNT}
            icon={'key'}
            className={`${styles.collapsible} [&&]:gap-y-xxs [&&]:md:gap-y-n [&&]:lg:gap-y-n`}
            classNameWrapper={`p-xxs rounded-s  md:p-s  lg:p-l`}
            classNameTitle={`text-18  md:text-27  lg:text-27`}
            classNameTitleIcon={`[&]:max-w-5xs  [&]:md:max-w-n  [&]:lg:max-w-n`}
            classNameHr={`border-gray-l0`}
        >
            <span className={`${styles.leftCol} ${styles.ellipsis} ${title_CN}`}>TernID</span>
            <Editable
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
                        title: 'Update your TernID',
                        value: { value: userData.email } as FormInit<T>,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        onSave: async () => {
                            // TODO ternID
                            // if ("value" in form)
                            // await handleUpdate('general',{ternId:form.value});
                        },
                    };
                }}
            >
                <span className={`${styles.midCol} ${styles.ellipsis} ${label_CN}`}>
                    {userData.ternID ?? userData.email}
                </span>
            </Editable>

            <span className={`${styles.leftCol} ${styles.ellipsis} ${title_CN}`}>Password</span>
            <Editable
                type={'password'}
                classNameToggleText={`text-14`}
                {...getSimpleToggleProps(setEditId, editId)}
                classNameWrapper={getSimpleToggleProps(setEditId, editId).classNameWrapper + ' gap-y-3xs'}
                initialize={function () {
                    return {
                        className: cn(
                            styles.singleInput,
                            styles.singleInputBase,
                            styles.common,
                            `[&&]:text-12  [&&]:md:text-14  [&&]:lg:text-16`,
                        ),
                        title: 'Update password',
                        value: null,
                        onSave: async (form) => {
                            if (!('passwordConfirm' in form) || !userData) throw 'Wrong request setup';

                            if (form.passwordConfirm !== form.newPassword) throw `Passwords don't match`;
                            if (!REGEX.password.test(form.newPassword))
                                throw `Entered password doesn't meet the requirements`;

                            await update(async () => {
                                return await AuthService.postChangePassword(
                                    form.currentPassword,
                                    form.newPassword,
                                    form.passwordConfirm,
                                    userData.email,
                                );
                            });
                        },
                    };
                }}
            >
                <span className={`${styles.midCol} ${styles.ellipsis} ${label_CN}`}>
                    <span className={'block text-12 tracking-widest'}>•••••••••••••••</span>
                    <span className={'text-10 md:text-14 lg:text-14'}>
                        Last updated&nbsp;
                        {userData.passwordUpdateDate
                            ? formatDate(new Date(userData.passwordUpdateDate), 'short')
                            : '--'}
                    </span>
                </span>
            </Editable>

            <span className={`${styles.leftCol} ${styles.ellipsis} ${title_CN}`}>Security</span>
            <Editable
                type={'2FA'}
                classNameToggleText={`text-14`}
                {...getSimpleToggleProps()}
                classNameWrapper={getSimpleToggleProps().classNameWrapper + ' gap-y-xxs'}
                initialize={function <T extends FormType>() {
                    return {
                        value: {
                            isEmailAdded: !!userData.state2FA.email,
                            isPhoneAdded: !!userData.state2FA.phone,
                            suggestedPhone: userData.phones.personal?.number ?? null,
                        } as FormInit<T>,
                        onSave: async (form) => {
                            if (!('value' in form) || !form.value) throw 'Wrong request setup';

                            const phone = form.value.trim();
                            if (!REGEX.phone.test(phone))
                                throw `Entered phone number should be in the format '+1234567890'`;

                            const numericPhone = phone.startsWith('+') ? phone.slice(1) : phone;
                            if (numericPhone.length < 10 || numericPhone.length > 15)
                                throw `Phone number must contain 10 digits long.`;

                            modalCtx.openModal(
                                <AuthenticationCode
                                    is2FA
                                    isPhoneEnabling
                                    token={token}
                                    phone={phone}
                                    email={userData.email || ''}
                                />,
                            );
                        },
                        onSwitch: async (state: boolean) => {
                            if (userData.state2FA?.phone) {
                                modalCtx.openModal(
                                    <AuthenticationCode
                                        is2FA
                                        isDisabling={state}
                                        token={token}
                                        phone={userData.state2FA?.phone}
                                        email={userData.email}
                                    />,
                                );
                            }
                        },
                    };
                }}
            >
                <span className={`${styles.midCol} ${styles.ellipsis} [&&]:text-12 [&&]:md:text-16 [&&]:lg:text-16`} >
                    Enable / disable your {sm ? '2FA' : 'two-factor authentication'}
                </span>
            </Editable>
        </Collapsible>
    );
}

AccountSection.ID = getId(ACCOUNT);

export { AccountSection };
