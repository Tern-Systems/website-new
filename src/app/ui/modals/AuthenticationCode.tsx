import React, {FC, FormEvent, ReactElement, useCallback, useEffect, useState} from "react";
import {ReactSVG} from "react-svg";

import {AuthService} from "@/app/services";

import {useForm} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {BaseModal, MessageModal} from "@/app/ui/modals";
import {Button, Input} from "@/app/ui/form";

import SVG_SAFE from '/public/images/safe.svg'


type FormData = { code: string };

const FORM_DEFAULT: FormData = {code: ''};


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
    const {phone, email, is2FA, isLogin, isDisabling = false, isPhoneEnabling = false} = props;

    const modalCtx = useModal();
    const userCtx = useUser();
    const [formValue, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const [warningMsg, setWarningMsg] = useState<string | null>(null);

    const handleSendNewCode = useCallback(async () => {
        try {
            if (is2FA)
                await AuthService.post2FASendOTP(email, phone);
            else
                await AuthService.postSendOTP(email);
            setWarningMsg(`OTP was sent to ${phone}`);
        } catch (error: unknown) {
            if (typeof error === 'string')
                modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }

        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        handleSendNewCode();
    }, [handleSendNewCode])

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!userCtx.userData)
            return;

        try {
            if (isLogin)
                await AuthService.postLoginVerifyOTP(formValue.code, email);
            else
                await AuthService.postVerifyOTP(formValue.code, email);

            if (isDisabling) {
                const {message} = await AuthService.post2FATurnOff(email);
                modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            } else if (isPhoneEnabling) {
                const {message} = await AuthService.post2FASavePhone(userCtx.userData.email, phone);
                modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            }

            await userCtx.fetchUserData();
        } catch (error: unknown) {
            if (typeof error === 'string')
                modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    }

    return (
        <BaseModal
            adaptSmScreen
            title={isDisabling ? 'Disable Authentication' : 'Account Authentication'}
            className={`place-self-center mx-auto relative bg-control-gray border-small border-control`}
            classNameContent={'max-w-[26rem] sm:px-[1.25rem] sm:max-w-[21rem] sm:place-self-center mt-[1.9rem]  sm:landscape:max-w-full  sm:landscape:w-full'}
        >
            <div className={'sm:landscape:flex sm:landscape:justify-between'}>
                <div className={'flex flex-col items-center mb-[1.875rem] text-center leading-[120%]'}>
                    <ReactSVG src={SVG_SAFE.src} className={'mb-[1.875rem] size-[9.9rem] sm:[&_path]:fill-gray'}/>
                </div>
                <div className={'sm:landscape:max-w-[21rem]'}>
                    <div
                        className={'flex flex-col items-center mb-[1.875rem] text-center leading-[120%]    sm:landscape:text-left'}>
                        <span>
                            {isDisabling
                                ? 'You are about to disable two-factor authentication for your account. To proceed, please confirm your identity by entering the authorization code sent to '
                                : 'Please confirm your account by entering the authorization code sent to '} &nbsp;
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
                            onChange={(event) => {
                                setFormValue('code')(event);
                                setWarningMsg(null);
                            }}
                            classNameWrapper={'flex-col [&]:items-start'}
                            className={'h-[1.875rem] w-full px-[0.73rem] bg-control-gray-l0 border-small b-control4 rounded-smallest'}
                            required
                        />
                        {warningMsg && <span className={'mt-[1rem] text-center'}>{warningMsg}</span>}
                        <Button className={`py-[0.37rem] mt-[--p-content] text-small font-bold rounded-full
                                    w-[9.38563rem] place-self-center border-small border-control-blue
                                    ${isDisabling ? 'border-control-red text-red' : 'border-control-blue'}`}
                        >
                            {isDisabling ? 'Disable' : 'Submit and Login'}
                        </Button>
                    </form>
                    <div className={'text-small mt-[2.51rem] sm:portrait:w-[14.75rem]'}>
                        <span>
                            It may take a minute to receive your code. Haven’t received it?&nbsp;
                            <span className={'font-bold cursor-pointer text-blue'} onClick={() => handleSendNewCode()}>Resend a new code.</span>
                        </span>
                    </div>
                </div>
            </div>
        </BaseModal>
    )
}


export {AuthenticationCode}