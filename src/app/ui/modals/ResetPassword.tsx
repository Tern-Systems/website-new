'use client';

import { FC, FormEvent, ReactElement, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { DataTestID } from '@/tests/static';

import { Breakpoint, REGEX } from '@/app/static';

import { AuthService } from '@/app/services/auth.service';

import { useBreakpointCheck, useForm, useModal } from '@/app/hooks';

import { AuthModal, BaseModal } from '@/app/ui/modals';
import { Button, Input } from '@/app/ui/form';

import SVG_INSIGNIA from '@/assets/images/insignia-logo.png';
import SVG_EYE from '@/assets/images/icons/eye.svg';

const TestID = DataTestID.modal.resetPassword;

type FormData = {
    email: string;
    password: string;
    passwordConfirm: string;
};

const FORM_DEFAULT: FormData = { email: '', password: '', passwordConfirm: '' };

const LOGIN_MODAL_OPEN_TIMEOUT = 3000;

interface Props {
    token?: string;
}

const ResetPasswordModal: FC<Props> = (props: Props): ReactElement => {
    const { token } = props;

    const modalCtx = useModal();
    const sm = useBreakpointCheck() <= Breakpoint.sm;

    const [message, setMessage] = useState<string | null>(null);
    const [formValue, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const EmailSentModal: FC = () => (
            <BaseModal
                data-testid={TestID.emailSent.modal}
                adaptBreakpoint={Breakpoint.sm}
                title={'Email Sent'}
                className={'w-[30rem] border-s border-white text-center'}
                classNameContent={`sm:px-xs sm:mt-n sm:max-w-[21rem] sm:place-self-center sm:text-left
                                    sm:landscape:place-self-start`}
            >
                <Image
                    src={SVG_INSIGNIA}
                    alt={'insignia'}
                    className={`mb-xs h-[9rem] w-[10rem] place-self-center sm:hidden`}
                />
                <span data-testid={TestID.emailSent.message}>
                    To reset your password, please click the link provided in the email sent to your registered email
                    address.
                </span>
            </BaseModal>
        );

        try {
            if (!token) {
                if (!REGEX.email.getRegex().test(formValue.email)) return setMessage(REGEX.email.message);
                await AuthService.postForgotPassword(formValue.email);
                modalCtx.openModal(<EmailSentModal />, { darkenBg: true });
            } else if (!REGEX.password.getRegex().test(formValue.password)) setMessage(REGEX.password.message);
            else if (formValue.password !== formValue.passwordConfirm) setMessage("Passwords don't match");
            else {
                const { message } = await AuthService.postResetPassword(token, formValue.passwordConfirm);
                setMessage(message);
                setTimeout(() => modalCtx.openModal(<AuthModal />, { darkenBg: true }), LOGIN_MODAL_OPEN_TIMEOUT);
            }
        } catch (err: unknown) {
            if (typeof err === 'string') setMessage(err);
        }
    };

    const Controls = token ? (
        <>
            <Input
                data-testid={TestID.form.input.password}
                name={TestID.form.input.password}
                type={'password'}
                placeholder={'Password'}
                value={formValue.password}
                onChange={setFormValue('password')}
                className={`b-control4 h-button-l w-full rounded-xs border-s bg-gray-l0 px-3xs text-primary placeholder:sm:text-primary`}
                required
            />
            <Input
                data-testid={TestID.form.input.passwordConfirm}
                name={TestID.form.input.passwordConfirm}
                type={'password'}
                placeholder={'Confirm Password'}
                value={formValue.passwordConfirm}
                onChange={setFormValue('passwordConfirm')}
                className={`b-control4 h-button-l w-full rounded-xs border-s bg-gray-l0 px-3xs text-primary placeholder:sm:text-primary`}
                icons={[SVG_EYE]}
                required={!!token}
            />
        </>
    ) : (
        <Input
            data-testid={TestID.form.input.email}
            name={TestID.form.input.email}
            placeholder={'Email'}
            value={formValue.email}
            onChange={setFormValue('email')}
            wrapper={'flex-col [&]:items-start'}
            className={`b-control4 h-button-l w-full rounded-xs border-s bg-gray-l0 px-3xs text-primary placeholder:sm:text-primary`}
            required
        />
    );

    return (
        <BaseModal
            data-testid={TestID.modal}
            adaptBreakpoint={Breakpoint.sm}
            title={sm ? 'Tern' : ''}
            simple={!sm}
            className={`border-control relative mx-auto w-[30rem] place-self-center border-s sm:border-none md:bg-gray lg:bg-gray`}
            classNameContent={`py-s pl-s pr-0     sm:px-xs sm:max-w-[23rem] sm:place-self-center
                                sm:landscape:min-w-[21rem]`}
        >
            <div className={`flex max-w-[26rem] flex-col items-center sm:hidden`}>
                <Image
                    src={SVG_INSIGNIA}
                    alt={'insignia'}
                    className={'my-xs h-[9rem] w-[10.42rem]'}
                />
                <span className={'mb-n text-27'}>Tern</span>
            </div>
            <form
                className={'flex flex-col'}
                onSubmit={handleFormSubmit}
            >
                <fieldset className={'flex flex-col gap-xxs'}>
                    <legend className={'mb-4xs'}>
                        Please {token ? 'create your new password' : 'enter email to reset your password'}
                    </legend>
                    {Controls}
                </fieldset>
                {message ? (
                    <span
                        data-testid={TestID.message}
                        className={'my-4xs text-center'}
                    >
                        {message}
                    </span>
                ) : null}
                <Button
                    data-testid={TestID.form.submitButton}
                    className={cn(
                        `mt-s rounded-full py-xxs text-18 font-bold`,
                        `w-full max-w-[18.93rem] place-self-center bg-white text-gray sm:w-[90%]`,
                    )}
                >
                    Reset Password
                </Button>
            </form>
        </BaseModal>
    );
};

ResetPasswordModal.displayName = ResetPasswordModal.name;

export { ResetPasswordModal };
