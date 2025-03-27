'use client';

import { FC, FormEvent, ReactElement, useEffect, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { DataTestID } from '@/__tests__/static';

import { Breakpoint, REGEX } from '@/app/static';

import { AuthService } from '@/app/services';

import { useFlow, useForm, useModal, useUser } from '@/app/hooks';

import { BaseModal, MessageModal, ResetPasswordModal } from '@/app/ui/modals';
import { Button, Input } from '@/app/ui/form';

import SVG_INSIGNIA from '@/assets/images/insignia-logo.png';

const TestID = DataTestID.modal.auth;

const INPUT_CN = `h-button-l w-full px-[0.73rem] bg-gray-l0 border-s b-control4 rounded-xs
                    sm:text-primary placeholder:sm:text-primary`;

type FormData = {
    email: string;
    password: string;
    passwordConfirm: string;
};

const FORM_DEFAULT: FormData = { email: '', password: '', passwordConfirm: '' };

interface Props {
    info?: string;
    registration?: boolean;
    onClose?: () => void;
    preventClose?: boolean;
}

const AuthModal: FC<Props> = (props: Props): ReactElement => {
    const { registration, info, onClose, preventClose } = props;

    const flowCtx = useFlow();
    const modalCtx = useModal();
    const userCtx = useUser();

    const [login, setLoginFormState] = useState(!registration);
    const [message, setMessage] = useState<string | null>(null);
    const [formValue, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    useEffect(() => {
        setMessage(null);
    }, [login]);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (login) {
                const { payload } = await AuthService.postLogin(formValue.email, formValue.password);
                await userCtx.setupSession(true, payload.token);
                modalCtx.closeModal();
            } else if (!REGEX.email.test(formValue.email)) setMessage(`Entered email doesn't match the email format`);
            else if (!REGEX.password.regex.test(formValue.password)) {
                setMessage(REGEX.password.message);
            } else if (formValue.password !== formValue.passwordConfirm) setMessage("Passwords don't match");
            else {
                const { message } = await AuthService.postSignup(formValue.email, formValue.password);
                modalCtx.openModal(<MessageModal data-testid={TestID.successModal}>{message}</MessageModal>);
            }
            flowCtx.next()?.();
        } catch (error: unknown) {
            if (typeof error === 'string') setMessage(error);
        }
    };

    return (
        <BaseModal
            data-testid={TestID.modal}
            adaptBreakpoint={Breakpoint.sm}
            preventClose={preventClose}
            title={login ? 'Login to Tern Account' : 'Create Tern Account'}
            onClose={() => onClose?.()}
            classNameTitle={'justify-self-start text-heading   sm:[&]:mb-xs   sm:landscape:ml-0 '}
            className={'sm:bg-white'}
            classNameContent={cn(
                'w-[30rem] items-start mx-auto place-items-center text-basic',
                '[&]:overflow-y-visible',
                'sm:[&]:x-[px-xs,py-n,w-full,overflow-y-scroll]',
                'sm:landscape:x-[max-w-[73rem],px-xxl]',
            )}
        >
            <div className={'w-full'}>
                <div className={'flex flex-col items-center text-center'}>
                    <span>{info}</span>
                    <div className={'mb-n sm:x-[hidden,mb-0]'}>
                        <Image
                            src={SVG_INSIGNIA}
                            alt={'insignia'}
                            className={`my-xs h-[9rem] w-[10rem]`}
                        />
                        {login ? null : <span className={' text-heading'}>Tern</span>}
                    </div>
                </div>
                <form
                    onSubmit={handleFormSubmit}
                    className={'flex flex-col sm:landscape:x-[flex-row,gap-x-4xl]'}
                >
                    <fieldset className={'flex w-full flex-col gap-xxs sm:landscape:x-[max-w-fit,min-w-[21rem]]'}>
                        <Input
                            data-testid={TestID.form.input.email}
                            name={TestID.form.input.email}
                            placeholder={'Email'}
                            value={formValue.email}
                            onChange={setFormValue('email')}
                            classNameWrapper={'flex-col [&]:items-start gap-4xs'}
                            className={INPUT_CN}
                            required
                        >
                            Please enter email to {!login ? 'create your Tern account' : 'login'}
                        </Input>
                        <Input
                            data-testid={TestID.form.input.password}
                            name={TestID.form.input.password}
                            type={'password'}
                            placeholder={'Password'}
                            value={formValue.password}
                            onChange={setFormValue('password')}
                            className={INPUT_CN}
                            required
                        />
                        {login ? null : (
                            <Input
                                data-testid={TestID.form.input.passwordConfirm}
                                name={TestID.form.input.passwordConfirm}
                                type={'password'}
                                placeholder={'Confirm Password'}
                                value={formValue.passwordConfirm}
                                onChange={setFormValue('passwordConfirm')}
                                className={INPUT_CN}
                                required={!login}
                            />
                        )}
                        {message && (
                            <span
                                data-testid={TestID.message}
                                className={'text-center'}
                            >
                                {message}
                            </span>
                        )}
                        {login ? (
                            <span>
                                Forgot your password?&nbsp;
                                <Button
                                    data-testid={TestID.resetLink}
                                    type={'button'}
                                    className={'text-blue-l0'}
                                    onClick={() => modalCtx.openModal(<ResetPasswordModal />, { darkenBg: true })}
                                >
                                    Reset
                                </Button>
                            </span>
                        ) : null}
                    </fieldset>
                    <div className={'flex flex-col items-center sm:landscape:w-full'}>
                        <Button
                            data-testid={TestID.form.submitButton}
                            type={'submit'}
                            className={cn(
                                `border-control mt-s w-[60%] place-self-center rounded-full border-s py-xxs`,
                                `text-section-s font-bold`,
                                `sm:w-[90%]`,
                                login
                                    ? 'bg-white text-gray sm:x-[bg-blue,text-primary] sm:landscape:mt-auto'
                                    : 'sm:x-[border-b-s,border-blue] sm:landscape:mt-xl',
                            )}
                        >
                            {!login ? 'Sign Up' : 'Login'}
                        </Button>
                        <div className={'mt-s text-center'}>
                            <span>
                                {login ? "Don't" : 'Already'} have an account?&nbsp;
                                <Button
                                    className={`text-blue-l0`}
                                    onClick={() => setLoginFormState((prevState) => !prevState)}
                                >
                                    {login ? 'Sign Up' : 'Login'}
                                </Button>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </BaseModal>
    );
};

export { AuthModal };
