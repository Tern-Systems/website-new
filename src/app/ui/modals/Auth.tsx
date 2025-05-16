'use client';

import { FC, FormEvent, ReactElement, useEffect, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import { DataTestID } from '@/tests/static';

import { Breakpoint, REGEX } from '@/app/static';

import { AuthService } from '@/app/services';

import { useFlow, useForm, useModal, useUser } from '@/app/hooks';

import { BaseModal, MessageModal, ResetPasswordModal } from '@/app/ui/modals';
import { AuthenticationCode } from '@/app/ui/modals/AuthenticationCode';
import { Button, Input } from '@/app/ui/form';

import SVG_INSIGNIA from '@/assets/images/insignia-logo.png';

const TestID = DataTestID.modal.auth;

const INPUT_CN = `h-button-l w-full px-3xs bg-gray-l0 border-s b-control4 rounded-xs
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
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMessage(null);
    }, [login]);

    // Separate function to handle 2FA after login
    const fetchUserDataWith2FA = async (token: string) => {
        try {
            // Setup session to get user data
            const userData = await userCtx.setupSession(true, token);

            if (!userData) {
                console.log('No user data returned, login failed');
                setMessage('Login failed');
                return;
            }

            console.log('Checking 2FA status:', {
                twoFA: userData.twoFA,
                state2FA: userData.state2FA,
            });

            // If 2FA is not enabled, just close modal and proceed
            if (!userData.twoFA) {
                console.log('No 2FA, completing login flow');
                modalCtx.closeModal();
                flowCtx.next()?.();
                return;
            }

            // Check if we have a phone number for 2FA
            if (!userData.state2FA?.phone) {
                console.log('2FA enabled but no phone number');
                return modalCtx.openModal(
                    <MessageModal>
                        You have 2FA enabled, but phone number isn&apos;t found - can&apos;t send an OTP code
                    </MessageModal>,
                );
            }

            console.log('2FA enabled, sending OTP and showing verification modal');

            // Send OTP
            await AuthService.post2FASendOTP(
                userData.email,
                userData.state2FA?.email || 'info@tern.ac',
                userData.state2FA?.phone,
            );

            // Set 2FA in progress flag and save data to session storage
            userCtx.set2FAVerificationInProgress(true, {
                email: userData.email,
                phone: userData.state2FA?.phone,
                twoFAEmail: userData.state2FA?.email || '',
            });

            // Show verification modal
            modalCtx.openModal(
                <AuthenticationCode
                    isLogin
                    token={token}
                    email={userData.email}
                    phone={userData.state2FA?.phone}
                    twoFAEmail={userData.state2FA?.email || ''}
                    is2FA
                    codeSent={true}
                />,
            );
        } catch (error) {
            console.error('Error in 2FA flow:', error);
            if (typeof error === 'string') {
                modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            } else {
                modalCtx.openModal(<MessageModal>Error checking 2FA status</MessageModal>);
            }
        }
    };

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            if (login) {
                try {
                    console.log('Attempting login for:', formValue.email);
                    const { payload } = await AuthService.postLogin(formValue.email, formValue.password);
                    console.log('Login successful, token received');

                    // Call our function to handle 2FA
                    await fetchUserDataWith2FA(payload.token);
                } catch (error) {
                    console.error('Login error:', error);
                    if (typeof error === 'string') setMessage(error);
                    else setMessage('Login failed');
                }
            } else if (!REGEX.email.getRegex().test(formValue.email))
                setMessage(`Entered email doesn't match the email format`);
            else if (!REGEX.password.getRegex().test(formValue.password)) {
                setMessage(REGEX.password.message);
            } else if (formValue.password !== formValue.passwordConfirm) setMessage("Passwords don't match");
            else {
                const { message } = await AuthService.postSignup(formValue.email, formValue.password);
                modalCtx.openModal(<MessageModal data-testid={TestID.successModal}>{message}</MessageModal>);
            }

            const next = flowCtx.next();

            if (next && !login) next();
            else if (!login) setLoginFormState(true);
        } catch (error: unknown) {
            if (typeof error === 'string') setMessage(error);
            console.error('Form submission error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BaseModal
            data-testid={TestID.modal}
            adaptBreakpoint={Breakpoint.sm}
            preventClose={preventClose}
            title={login ? 'Login to Account' : 'Create Account'}
            onClose={() => onClose?.()}
            classNameTitle={'w-full flex-1 justify-self-start text-27 sm:[&]:mb-xs sm:landscape:ml-0 '}
            className={'sm:bg-white w-[30rem] flex flex-col !rounded-lg'}
            classNameContent={cn(
                'w-full items-center place-items-center text-16',
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
                            className={`mb-xxs h-[9rem] w-[10rem]`}
                        />
                        <span className={'text-27'}>Tern</span>
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
                            wrapper={'flex-col [&]:items-start gap-4xs'}
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
                                    onClick={() =>
                                        modalCtx.openModal(<ResetPasswordModal />, {
                                            darkenBg: true,
                                        })
                                    }
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
                            disabled={isLoading}
                            className={cn(
                                `border-control mt-s w-[75%] place-self-center rounded-full border-s py-xxs`,
                                `text-18 font-bold`,
                                `sm:w-[90%]`,
                                isLoading ? 'opacity-70 cursor-not-allowed' : '',
                                login
                                    ? 'bg-white text-gray sm:x-[bg-blue,text-primary] sm:landscape:mt-auto'
                                    : 'sm:x-[border-b-s,border-blue] sm:landscape:mt-xl',
                            )}
                        >
                            {isLoading ? (login ? 'Logging in...' : 'Signing up...') : !login ? 'Sign Up' : 'Login'}
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

AuthModal.displayName = AuthModal.name;

export { AuthModal };
