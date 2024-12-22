import React, { FC, FormEvent, ReactElement, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

import { UserData } from "@/app/context/User.context";

import { AuthService, UserService } from "@/app/services";

import { useForm } from "@/app/hooks";
import { useModal, useUser } from "@/app/context";

import { BaseModal, MessageModal } from "@/app/ui/modals";
import { Button, Input } from "@/app/ui/form";

import SVG_SAFE from '@/assets/images/safe.svg'


type FormData = { code: string };

const FORM_DEFAULT: FormData = { code: '' };

interface Props {
    token: string;
    phone: string;
    email: string;
    isAddPhone: boolean; // This field will be true when add phone
}

const AuthenticationCode: FC<Props> = (props: Props): ReactElement => {
    const { token, phone, email, isAddPhone } = props;

    const modalCtx = useModal();
    const userCtx = useUser();
    const [formValue, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const [warningMsg, setWarningMsg] = useState<string | null>(null);

    const handleSendCode = useCallback(async () => {
        try {
            if (!isAddPhone) { // if false, send new code to email
                await AuthService.postLoginSendOTP(email);
            } else { // if true, send new code to phone
                await AuthService.postSendOTP(email, phone);
            }
        } catch (error: unknown) {
            let message: string = 'Unknown error';
            if (axios.isAxiosError(error) && error.status === 401)
                return setWarningMsg("The code is not correct");
            else if (typeof error === 'string')
                message = error;
            modalCtx.openModal(<MessageModal>{message}</MessageModal>);
        }
    }, [email, phone])

    useEffect(() => {
        handleSendCode();
    }, [handleSendCode])

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            if (!isAddPhone) {
                await AuthService.postLoginVerifyOTP(formValue.code, email);
            } else {
                await AuthService.postVerifyOTP(formValue.code, email);
            }
            const { payload: userData } = await UserService.getUser(token);
            userCtx.setSession(userData as UserData, token); // TODO remove type casting
            modalCtx.closeModal();
            if (isAddPhone)
                modalCtx.openModal(<MessageModal>The phone number<b>`****-****-${phone.slice(-4)}`</b> has successfully been added to your account</MessageModal>);
        } catch (error: unknown) {
            let message: string = 'Unknown error';
            if (axios.isAxiosError(error) && error.status === 401)
                return setWarningMsg("The code is not correct");
            else if (typeof error === 'string')
                message = error;
            modalCtx.openModal(<MessageModal>{message}</MessageModal>);
        }
    }

    return (
        <BaseModal
            title={'Account Authentication'}
            className={`place-self-center mx-auto relative [&]:bg-control-gray border-small border-control`}
        >
            <div className={'flex flex-col items-center w-[26rem] mb-[1.875rem] text-center leading-[120%]'}>
                <Image src={SVG_SAFE} alt={'safe'} className={'mb-[1.875rem] size-[9.9rem]'} />
                <span>
                    Please confirm your account by entering the authorization code sent to&nbsp;
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
                <Button className={`py-[0.37rem] mt-[1.88rem] text-small font-bold rounded-full
                                    w-[9.38563rem] place-self-center border-small border-control-blue`}>
                    Submit and Login
                </Button>
            </form>
            <div className={'text-note mt-[2.51rem] w-[14.75rem]'}>
                <span>
                    It may take a minute to receive your code. Haven’t received it?&nbsp;
                    <span className={'font-bold cursor-pointer text-blue'} onClick={() => handleSendCode()}>Resend a new code.</span>
                </span>
            </div>
        </BaseModal>
    )
}


export { AuthenticationCode }