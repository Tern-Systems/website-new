import React, {FC, FormEvent, ReactElement, useState} from "react";
import Image from "next/image";

import {Breakpoint} from "@/app/hooks/useBreakpointCheck";
import {REGEX} from "@/app/static";

import {AuthService, SignUpData} from "@/app/services/auth.service";

import {useBreakpointCheck, useForm} from "@/app/hooks";
import {useModal} from "@/app/context";

import {BaseModal, MessageModal} from "@/app/ui/modals";
import {Button, Input} from "@/app/ui/form";

import SVG_INSIGNIA from '/public/images/insignia-logo.png'
import SVG_EYE from '/public/images/icons/eye.svg'


type FormData = Pick<SignUpData, 'email' | 'password' | 'passwordConfirm'>;

const FORM_DEFAULT: FormData = {email: '', password: '', passwordConfirm: ''};

interface Props {
    token?: string;
}

const ResetPasswordModal: FC<Props> = (props: Props): ReactElement => {
    const {token} = props;

    const modalCtx = useModal();
    const isSmScreen = useBreakpointCheck() <= Breakpoint.sm;

    const [warningMsg, setWarningMsg] = useState<string | null>(null);
    const [formValue, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const EmailSentModal: FC = () => (
            <BaseModal
                adaptBreakpoint={Breakpoint.sm}
                title={'Email Sent'}
                className={'w-[30rem] border-white border-s text-center'}
                classNameContent={`sm:px-[1.25rem] sm:mt-[1.9rem] sm:max-w-[21rem] sm:place-self-center sm:text-left
                                    sm:landscape:place-self-start`}
            >
                <Image src={SVG_INSIGNIA} alt={'insignia'}
                       className={`mb-[1.25rem] w-[10rem] h-[9rem] place-self-center ${isSmScreen ? 'hidden' : ''}`}/>
                <span>To reset your password, please click the link provided in the email sent to your registered email address.</span>
            </BaseModal>
        );

        try {
            if (!token) {
                if (!REGEX.email.test(formValue.email))
                    return setWarningMsg(`Entered email doesn't match the email format`);

                await AuthService.postForgotPassword(formValue.email);
                modalCtx.openModal(<EmailSentModal/>, {darkenBg: true});
            } else if (!REGEX.password.test(formValue.password))
                setWarningMsg(`Entered password doesn't meet the requirements`);
            else if (formValue.password !== formValue.passwordConfirm)
                setWarningMsg("Passwords don't match");
            else {
                const {message} = await AuthService.postResetPassword(token, formValue.passwordConfirm);
                modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            }
        } catch (error: unknown) {
            if (typeof error === 'string')
                modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    }

    const Controls = token
        ? (
            <>
                <Input
                    type={"password"}
                    name={'password'}
                    placeholder={'Password'}
                    value={formValue.password}
                    onChange={setFormValue('password')}
                    className={`h-[1.875rem] w-full px-[0.73rem] bg-gray-l0 border-s b-control4 rounded-xs 
                                text-primary placeholder:sm:text-primary`}
                    required
                />
                <Input
                    type={"password"}
                    name={'password-repeat'}
                    placeholder={'Confirm Password'}
                    value={formValue.passwordConfirm}
                    onChange={setFormValue('passwordConfirm')}
                    className={`h-[1.875rem] w-full px-[0.73rem] bg-gray-l0 border-s b-control4 rounded-xs 
                                text-primary placeholder:sm:text-primary`}
                    icons={[SVG_EYE]}
                    required={!!token}
                />
            </>
        )
        : (
            <Input
                name={'email'}
                placeholder={'Email'}
                value={formValue.email}
                onChange={setFormValue('email')}
                classNameWrapper={'flex-col [&]:items-start'}
                className={`h-[1.875rem] w-full px-[0.73rem] bg-gray-l0 border-s b-control4 rounded-xs 
                            text-primary placeholder:sm:text-primary`}
                required
            />
        );

    return (
        <BaseModal
            adaptBreakpoint={Breakpoint.sm}
            title={isSmScreen ? 'Tern' : ''}
            isSimple={!isSmScreen}
            className={`place-self-center mx-auto relative border-s border-control w-[30rem] lg:bg-gray
                        md:bg-gray sm:border-none`}
            classNameContent={`py-[1.5rem] pl-[1.7rem] pr-0     sm:px-[1.25rem] sm:max-w-[23rem] sm:place-self-center
                                sm:landscape:min-w-[21rem]`}
        >
            <div className={`flex flex-col items-center max-w-[26rem] ${isSmScreen ? 'hidden' : ''}`}>
                <Image src={SVG_INSIGNIA} alt={'insignia'} className={'my-[1.25rem] w-[10.42rem] h-[9rem]'}/>
                <span className={'mb-n font-oxygen text-heading'}>Tern</span>
            </div>
            <form
                className={'flex flex-col'}
                onSubmit={handleFormSubmit}
            >
                <fieldset className={'flex flex-col gap-[0.94rem]'}>
                    <legend className={'mb-[0.63rem]'}>
                        Please {token ? 'create your new password' : 'enter email to reset your password'}
                    </legend>
                    {Controls}
                </fieldset>
                {warningMsg && <span className={'my-[0.63rem] text-center'}>{warningMsg}</span>}
                <Button className={`py-[0.92rem] mt-[1.56rem] text-section-s font-bold rounded-full
                                    w-full max-s[18.93rem] place-self-center bg-white text-gray sm:w-[90%]`}>
                    Reset Password
                </Button>
            </form>
        </BaseModal>
    );
}


export {ResetPasswordModal}