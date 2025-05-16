'use client';

import { FC, FormEvent, ReactElement, useCallback, useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import { Breakpoint } from '@/app/static';

import { AuthService } from '@/app/services';

import { useForm } from '@/app/hooks';
import { useModal, useUser } from '@/app/hooks';

import { BaseModal, MessageModal } from '@/app/ui/modals';
import { Button, Input } from '@/app/ui/form';

import SVG_SAFE from '@/assets/images/safe.svg';

type FormData = { code: string };
export type { FormData as AuthCodeFormData };

const FORM_DEFAULT: FormData = { code: '' };

interface Props {
    token: string;
    phone: string;
    email: string;
    isDisabling?: boolean;
    isPhoneEnabling?: boolean;
    isEmailEnabling?: boolean;
    is2FA?: boolean;
    isLogin?: boolean;
    twoFAEmail: string;
    codeSent?: boolean;
}

const AuthenticationCode: FC<Props> = (props: Props): ReactElement => {
    const {
        phone,
        email,
        is2FA,
        isLogin,
        isDisabling = false,
        isPhoneEnabling = false,
        isEmailEnabling = false,
        twoFAEmail,
        codeSent = false,
    } = props;

    const modalCtx = useModal();
    const userCtx = useUser();
    const [formValue, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const [warningMsg, setWarningMsg] = useState<string | null>(null);

    const handleSendNewCode = useCallback(async () => {
        try {
            let twoFAEmail = props.twoFAEmail;
            if (!twoFAEmail) twoFAEmail = 'info@tern.ac';
            console.log('Sending new code...', email, twoFAEmail, phone);
            if (is2FA) await AuthService.post2FASendOTP(email, twoFAEmail, phone);
            else await AuthService.postSendOTP(email);
            setWarningMsg(`OTP was sent to phone and email`);
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    }, []);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            console.log('Verifying OTP:', formValue.code);

            // Verify the OTP
            if (isLogin) {
                await AuthService.postLoginVerifyOTP(formValue.code, email);
            } else if (is2FA) {
                await AuthService.postVerifyOTP(formValue.code, email);
            } else {
                await AuthService.postVerifyOTP(formValue.code, email);
            }

            // Only handle disabling 2FA as a separate case
            if (isDisabling) {
                const { message } = await AuthService.post2FATurnOff(email);
                modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            } else {
                modalCtx.openModal(<MessageModal>Authentication successful!</MessageModal>);
            }

            // Clear 2FA verification in progress state
            userCtx.set2FAVerificationInProgress(false);

            // Refresh user data
            await userCtx.setupSession();
            modalCtx.closeModal();
        } catch (error: unknown) {
            console.error('Error verifying OTP:', error);

            // Extract error message from different error formats
            let errorMessage = 'Unknown error occurred';
            if (typeof error === 'string') {
                errorMessage = error;
            } else if (error && typeof error === 'object') {
                const err = error as any;
                errorMessage =
                    err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to verify OTP';
            }

            console.log('Displaying error message:', errorMessage);
            setWarningMsg(errorMessage);

            // Don't close the modal on error - just show the error message
            // This allows the user to try again
        }
    };

    // Handle cancel button differently based on context
    const handleCancel = () => {
        if (isLogin) {
            // Only log out if canceling during login flow
            console.log('User cancelled 2FA verification during login, logging out');
            userCtx.removeSession();
        } else {
            // Just close the modal if canceling from profile settings
            console.log('User cancelled 2FA verification from profile, keeping session active');
            // Clear the 2FA in progress state but don't log out
            userCtx.set2FAVerificationInProgress(false);
        }
        modalCtx.closeModal();
    };

    useEffect(() => {
        if (!codeSent) {
            handleSendNewCode();
        }
    }, [handleSendNewCode, codeSent]);

    return (
        <BaseModal
            adaptBreakpoint={Breakpoint.sm}
            title={isDisabling ? 'Disable Authentication' : 'Account Authentication'}
            className={`border-control relative mx-auto place-self-center [&]:border-n bg-gray`}
            classNameContent={
                'max-w-[30rem] sm:px-xs sm:max-w-[21rem] sm:place-self-center mt-n  sm:landscape:max-w-full  sm:landscape:w-full'
            }
            classNameHr={`[&]:my-xxs`}
            onClose={handleCancel}
        >
            <div className={'sm:landscape:flex sm:landscape:justify-between'}>
                <div className={'mb-n flex flex-col items-center text-center leading-[120%]'}>
                    <ReactSVG
                        src={SVG_SAFE.src}
                        className={'size-[9.9rem] sm:[&_path]:fill-gray'}
                    />
                </div>
                <div className={'sm:landscape:max-w-[21rem]'}>
                    <div
                        className={
                            'px-n mb-n flex flex-col items-center text-center leading-[120%] sm:landscape:text-left'
                        }
                    >
                        <span>
                            {isDisabling
                                ? 'You are about to disable two-factor authentication for your account. To proceed, please confirm your identity by entering the authorization code sent to '
                                : 'Please confirm your account by entering the authorization code sent to '}
                            &nbsp;
                            <span className={'font-bond'}>***-***-{phone.slice(-4)}</span>.
                        </span>
                    </div>
                    <form
                        className={'flex flex-col'}
                        onSubmit={handleFormSubmit}
                    >
                        <Input
                            type={'code'}
                            name={'Code'}
                            placeholder={'Code'}
                            maxLength={6}
                            value={formValue.code}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setFormValue('code')(event);
                                setWarningMsg(null);
                            }}
                            wrapper={'flex-col [&]:items-start'}
                            className={'h-button-l w-full rounded-xs border-s bg-gray-l0 px-3xs'}
                            required
                        />
                        {warningMsg && <span className={'mt-xxs text-center text-red'}>{warningMsg}</span>}
                        <Button
                            className={`mt-n px-xs py-4xs-2 place-self-center border-s border-blue rounded-full text-16 font-bold ${isDisabling ? 'border-red text-red' : 'border-blue'}`}
                        >
                            {isDisabling ? 'Disable' : 'Submit and Login'}
                        </Button>
                    </form>
                    <div className={cn('mt-xl text-14 leading-n', 'w-[14.75rem] md:w-8/12 lg:w-8/12')}>
                        <span>
                            It may take a minute to receive your code. Haven&apos;t received it?&nbsp;
                            <span
                                className={'cursor-pointer font-bold text-blue'}
                                onClick={() => handleSendNewCode()}
                            >
                                Resend a new code.
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

AuthenticationCode.displayName = AuthenticationCode.name;

export { AuthenticationCode };
