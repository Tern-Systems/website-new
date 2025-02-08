import React, {FC} from "react";
import cn from "classnames";

import {FormInit, FormType} from "@/app/ui/form/Editable";
import {UpdateUserData} from "@/app/services/user.service";

import {REGEX} from "@/app/static";

import {AuthService, UserService} from "@/app/services";

import {formatDate} from "@/app/utils";
import {useBreakpointCheck} from "@/app/hooks";
import {useUser} from "@/app/context/User.context";
import {useModal} from "@/app/context";

import {Collapsible} from "@/app/ui/misc";
import {Button, Editable} from "@/app/ui/form";
import {AuthenticationCode} from "@/app/ui/modals";
import {getSimpleToggleProps, SectionProps} from "../index.page";

import styles from "@/pages/profile/Profile.module.css";


const ACCOUNT = 'Account Credentials';


const AccountSection: FC<SectionProps> = (props: SectionProps) => {
    const {update, setEditId, editId} = props;

    const {userData, token} = useUser();
    const modalCtx = useModal();
    const isSm = useBreakpointCheck() === 'sm';

    if (!userData || !token)
        return null;

    const userPhoto = userData.photo?.split('?').shift()?.split('_')?.pop() ?? '';

    return (
        <Collapsible
            title={ACCOUNT}
            icon={"key"}
            className={styles.collapsible}
        >
            <span className={styles.leftCol + " " + styles.ellipsis}>
                Profile Picture
            </span>
            <Editable
                type={'image'}
                {...getSimpleToggleProps(setEditId, editId)}
                initialize={function <T extends FormType>() {
                    return {
                        className: styles.photoInput,
                        value: {fileName: userPhoto, file: null} as FormInit<T>,
                        onSave: async (form) => {
                            if (!('fileName' in form))
                                throw 'Wrong request setup';
                            await update(async () => {
                                const newPhotoUserData: UpdateUserData = {...userData, photo: form.file};
                                return await UserService.postUpdateUser(userData.email, newPhotoUserData)
                            });
                        },
                    }
                }}
            >
                <Button
                    disabled
                    icon={'upload'}
                    className={styles.photoInput}
                    classNameIcon={`[&&_*]:size-[--p-content-3xs]  sm:[&_*]:size-[--p-content-4xs]`}
                >
                    {userPhoto || 'Upload media'}
                </Button>
            </Editable>

            <span className={styles.leftCol + " " + styles.ellipsis}>TernID</span>
            <Editable
                {...getSimpleToggleProps(setEditId, editId)}
                initialize={function <T extends FormType>() {
                    return {
                        className: cn(styles.singleInput, styles.singleInputBase, styles.common),
                        title: "Update your TernID",
                        value: {value: userData.email} as FormInit<T>,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        onSave: async (form) => {
                            // TODO ternID
                            // if ("value" in form)
                            // await handleUpdate('general',{ternId:form.value});
                        },
                    }
                }}
            >
                <span className={styles.midCol + " " + styles.ellipsis}>
                    {userData.ternID ?? userData.email}
                </span>
            </Editable>

            <span className={styles.leftCol + " " + styles.ellipsis}>Password</span>
            <Editable
                type={"password"}
                {...getSimpleToggleProps(setEditId, editId)}
                classNameWrapper={getSimpleToggleProps(setEditId, editId).classNameWrapper + " gap-y-[--p-content-xxs]"}
                initialize={function () {
                    return {
                        className: cn(styles.singleInput, styles.singleInputBase, styles.common),
                        title: "Update password",
                        value: null,
                        onSave: async (form) => {
                            if (!("passwordConfirm" in form) || !userData)
                                throw 'Wrong request setup';

                            if (form.passwordConfirm !== form.newPassword)
                                throw `Passwords don't match`;
                            if (!REGEX.password.test(form.newPassword))
                                throw `Entered password doesn't meet the requirements`;

                            await update(async () => {
                                return await AuthService.postChangePassword(
                                    form.currentPassword,
                                    form.newPassword,
                                    form.passwordConfirm,
                                    userData.email
                                );
                            });
                        }
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
                initialize={function <T extends FormType>() {
                    return {
                        value: {
                            isEmailAdded: !!userData.state2FA.email,
                            isPhoneAdded: !!userData.state2FA.phone,
                            suggestedPhone: userData.phones.personal?.number ?? null,
                        } as FormInit<T>,
                        onSave: async (form) => {
                            if (!("value" in form) || !form.value)
                                throw 'Wrong request setup';

                            const phone = form.value.trim();
                            if (!REGEX.phone.test(phone))
                                throw `Entered phone number should be in the format '+1234567890'`;

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
                            if (userData.state2FA?.phone) {
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
                    }
                }}
            >
                <span className={styles.midCol + " [&&]:text-basic " + styles.ellipsis}>
                    Enable / disable your {isSm ? '2FA' : 'two-factor authentication'}
                </span>
            </Editable>
        </Collapsible>
    );
}


export {AccountSection, ACCOUNT};
