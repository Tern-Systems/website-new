import React, { FC, FormEvent, ReactElement, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { Breakpoint } from '@/app/hooks/useBreakpointCheck';
import { REGEX } from '@/app/static';

import { AuthService, SignUpData } from '@/app/services/auth.service';

import { useBreakpointCheck, useForm } from '@/app/hooks';
import { useModal } from '@/app/context';

import { BaseModal, MessageModal } from '@/app/ui/modals';
import { Button, Input } from '@/app/ui/form';

import SVG_INSIGNIA from '@/assets/images/insignia-logo.png';
import SVG_EYE from '@/assets/images/icons/eye.svg';

type FormData = Pick<SignUpData, 'email' | 'password' | 'passwordConfirm'>;

const FORM_DEFAULT: FormData = { email: '', password: '', passwordConfirm: '' };

interface Props {
    token?: string;
}

const ResetPasswordModal: FC<Props> = (props: Props): ReactElement => {
    const { token } = props;

    const modalCtx = useModal();
    const isSm = useBreakpointCheck() <= Breakpoint.sm;

    const [warningMsg, setWarningMsg] = useState<string | null>(null);
    const [formValue, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const EmailSentModal: FC = () => (
            <BaseModal
                adaptBreakpoint={Breakpoint.sm}
                title={'Email Sent'}
                className={'w-[30rem] border-s border-white text-center'}
                classNameContent={`sm:px-[1.25rem] sm:mt-[1.9rem] sm:max-w-[21rem] sm:place-self-center sm:text-left
                                    sm:landscape:place-self-start`}
            >
                <Image
                    src={SVG_INSIGNIA}
                    alt={'insignia'}
                    className={`mb-[1.25rem] h-[9rem] w-[10rem] place-self-center sm:hidden`}
                />
                <span>
                    To reset your password, please click the link provided in the email sent to your registered email
                    address.
                </span>
            </BaseModal>
        );

        try {
            if (!token) {
                if (!REGEX.email.test(formValue.email))
                    return setWarningMsg(`Entered email doesn't match the email format`);

                await AuthService.postForgotPassword(formValue.email);
                modalCtx.openModal(<EmailSentModal />, { darkenBg: true });
            } else if (!REGEX.password.test(formValue.password))
                setWarningMsg(`Entered password doesn't meet the requirements`);
            else if (formValue.password !== formValue.passwordConfirm) setWarningMsg("Passwords don't match");
            else {
                const { message } = await AuthService.postResetPassword(token, formValue.passwordConfirm);
                modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            }
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    };

    const Controls = token ? (
        <>
            <Input
                type={'password'}
                name={'password'}
                placeholder={'Password'}
                value={formValue.password}
                onChange={setFormValue('password')}
                className={`b-control4 h-button-l w-full rounded-xs border-s bg-gray-l0 px-[0.73rem] text-primary placeholder:sm:text-primary`}
                required
            />
            <Input
                type={'password'}
                name={'password-repeat'}
                placeholder={'Confirm Password'}
                value={formValue.passwordConfirm}
                onChange={setFormValue('passwordConfirm')}
                className={`b-control4 h-button-l w-full rounded-xs border-s bg-gray-l0 px-[0.73rem] text-primary placeholder:sm:text-primary`}
                icons={[SVG_EYE]}
                required={!!token}
            />
        </>
    ) : (
        <Input
            name={'email'}
            placeholder={'Email'}
            value={formValue.email}
            onChange={setFormValue('email')}
            classNameWrapper={'flex-col [&]:items-start'}
            className={`b-control4 h-button-l w-full rounded-xs border-s bg-gray-l0 px-[0.73rem] text-primary placeholder:sm:text-primary`}
            required
        />
    );

    return (
        <BaseModal
            adaptBreakpoint={Breakpoint.sm}
            title={isSm ? 'Tern' : ''}
            isSimple={!isSm}
            className={`border-control relative mx-auto w-[30rem] place-self-center border-s sm:border-none md:bg-gray lg:bg-gray`}
            classNameContent={`py-[1.5rem] pl-[1.7rem] pr-0     sm:px-[1.25rem] sm:max-w-[23rem] sm:place-self-center
                                sm:landscape:min-w-[21rem]`}
        >
            <div className={`flex max-w-[26rem] flex-col items-center sm:hidden`}>
                <Image
                    src={SVG_INSIGNIA}
                    alt={'insignia'}
                    className={'my-[1.25rem] h-[9rem] w-[10.42rem]'}
                />
                <span className={'mb-n text-heading'}>Tern</span>
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
                <Button
                    className={cn(
                        `mt-[1.56rem] rounded-full py-[0.92rem] text-section-s font-bold`,
                        `w-full max-w-[18.93rem] place-self-center bg-white text-gray sm:w-[90%]`,
                    )}
                >
                    Reset Password
                </Button>
            </form>
        </BaseModal>
    );
};

export { ResetPasswordModal };
