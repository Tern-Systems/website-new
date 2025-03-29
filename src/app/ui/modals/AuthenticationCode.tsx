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
    is2FA?: boolean;
    isLogin?: boolean;
}

const AuthenticationCode: FC<Props> = (props: Props): ReactElement => {
    const { phone, email, is2FA, isLogin, isDisabling = false, isPhoneEnabling = false } = props;

    const modalCtx = useModal();
    const userCtx = useUser();
    const [formValue, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const [warningMsg, setWarningMsg] = useState<string | null>(null);

    const handleSendNewCode = useCallback(async () => {
        try {
            if (is2FA) await AuthService.post2FASendOTP(email, phone);
            else await AuthService.postSendOTP(email);
            setWarningMsg(`OTP was sent to ${phone}`);
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    }, []);

    useEffect(() => {
        handleSendNewCode();
    }, [handleSendNewCode]);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!userCtx.userData) return;

        try {
            if (isLogin) await AuthService.postLoginVerifyOTP(formValue.code, email);
            else await AuthService.postVerifyOTP(formValue.code, email);

            if (isDisabling) {
                const { message } = await AuthService.post2FATurnOff(email);
                modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            } else if (isPhoneEnabling) {
                const { message } = await AuthService.post2FASavePhone(userCtx.userData.email, phone);
                modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            }

            await userCtx.setupSession();
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    };

    return (
        <BaseModal
            adaptBreakpoint={Breakpoint.sm}
            title={isDisabling ? 'Disable Authentication' : 'Account Authentication'}
            className={`border-control relative mx-auto place-self-center [&]:border-n bg-gray`}
            classNameContent={
                'max-w-[30rem] sm:px-xs sm:max-w-[21rem] sm:place-self-center mt-n  sm:landscape:max-w-full  sm:landscape:w-full'
            }
            classNameHr={`[&]:my-xxs`}
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
                            classNameWrapper={'flex-col [&]:items-start'}
                            className={'h-button-l w-full rounded-xs border-s bg-gray-l0 px-3xs'}
                            required
                        />
                        {warningMsg && <span className={'mt-xxs text-center'}>{warningMsg}</span>}
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
