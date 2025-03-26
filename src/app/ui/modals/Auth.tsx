'use client';

import { FC, FormEvent, ReactElement, useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import cn from 'classnames';

import { Breakpoint } from '@/app/static';
import { REGEX } from '@/app/static';

import { AuthService } from '@/app/services';

import { useForm } from '@/app/hooks';
import { useFlow, useModal, useUser } from '@/app/hooks';

import { BaseModal, MessageModal, ResetPasswordModal } from '@/app/ui/modals';
import { Button, Input } from '@/app/ui/form';

import SVG_INSIGNIA from '@/assets/images/insignia-logo.png';

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

    const [isLoginForm, setLoginFormState] = useState(!registration);
    const [warningMsg, setWarningMsg] = useState<string | null>(null);
    const [formValue, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    useEffect(() => {
        setWarningMsg(null);
    }, [isLoginForm]);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (isLoginForm) {
                const { payload } = await AuthService.postLogin(formValue.email, formValue.password);
                await userCtx.setupSession(true, payload.token);
                modalCtx.closeModal();
            } else if (!REGEX.email.test(formValue.email))
                setWarningMsg(`Entered email doesn't match the email format`);
            else if (!REGEX.password.test(formValue.password)) {
                setWarningMsg(
                    `Entered password should consist of minimum 9 characters, one uppercase letter, one lowercase letter and one number`,
                );
            } else if (formValue.password !== formValue.passwordConfirm) setWarningMsg("Passwords don't match");
            else {
                const { message } = await AuthService.postSignup(formValue.email, formValue.password);
                modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            }
            flowCtx.next()?.();
        } catch (error: unknown) {
            let message: string = 'Unknown error';
            if (axios.isAxiosError(error)) message = error.cause?.message ?? message;
            else if (typeof error === 'string') message = error;
            modalCtx.openModal(<MessageModal>{message}</MessageModal>);
        }
    };

    return (
        <BaseModal
            adaptBreakpoint={Breakpoint.sm}
            preventClose={preventClose}
            title={isLoginForm ? 'Login to Tern Account' : 'Create Tern Account'}
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
                        {isLoginForm ? null : <span className={' text-heading'}>Tern</span>}
                    </div>
                </div>
                <form
                    onSubmit={handleFormSubmit}
                    className={'flex flex-col sm:landscape:x-[flex-row,gap-x-4xl]'}
                >
                    <fieldset className={'flex w-full flex-col gap-xxs sm:landscape:x-[max-w-fit,min-w-[21rem]]'}>
                        <Input
                            placeholder={'Email'}
                            value={formValue.email}
                            onChange={setFormValue('email')}
                            classNameWrapper={'flex-col [&]:items-start gap-4xs'}
                            className={INPUT_CN}
                            required
                        >
                            Please enter email to {!isLoginForm ? 'create your Tern account' : 'login'}
                        </Input>
                        <Input
                            type={'password'}
                            placeholder={'Password'}
                            value={formValue.password}
                            onChange={setFormValue('password')}
                            className={INPUT_CN}
                            required
                        />
                        <Input
                            hidden={isLoginForm}
                            type={'password'}
                            placeholder={'Confirm Password'}
                            value={formValue.passwordConfirm}
                            onChange={setFormValue('passwordConfirm')}
                            className={INPUT_CN}
                            required={!isLoginForm}
                        />
                        {warningMsg && <span className={'text-center'}>{warningMsg}</span>}
                        <span hidden={!isLoginForm}>
                            Forgot your password?&nbsp;
                            <Button
                                type={'button'}
                                className={'text-blue-l0'}
                                onClick={() => modalCtx.openModal(<ResetPasswordModal />, { darkenBg: true })}
                            >
                                Reset
                            </Button>
                        </span>
                    </fieldset>
                    <div className={'flex flex-col items-center sm:landscape:w-full'}>
                        <Button
                            type={'submit'}
                            className={cn(
                                `border-control mt-s w-[60%] place-self-center rounded-full border-s py-xxs`,
                                `text-section-s font-bold`,
                                `sm:w-[90%]`,
                                isLoginForm
                                    ? 'bg-white text-gray sm:x-[bg-blue,text-primary] sm:landscape:mt-auto'
                                    : 'sm:x-[border-b-s,border-blue] sm:landscape:mt-xl',
                            )}
                        >
                            {!isLoginForm ? 'Sign Up' : 'Login'}
                        </Button>
                        <div className={'mt-s text-center'}>
                            <span>
                                {isLoginForm ? "Don't" : 'Already'} have an account?&nbsp;
                                <Button
                                    className={`text-blue-l0`}
                                    onClick={() => setLoginFormState((prevState) => !prevState)}
                                >
                                    {isLoginForm ? 'Sign Up' : 'Login'}
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
