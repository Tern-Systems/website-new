import React, {FC, FormEvent, ReactElement, useCallback, useEffect, useState} from "react";
import axios from "axios";
import Image from "next/image";

import {useModal, useUser} from "@/app/context";
import {useForm} from "@/app/hooks/useForm";

import {BaseModal} from "@/app/components/modals";

import {Button, Input} from "@/app/components/form";

import {UserService} from "@/app/services/user.service";

import SVG_SAFE from '@/assets/images/safe.svg'

type FormData = { code: string };

const FORM_DEFAULT: FormData = {code: ''};

interface Props {
    token: string;
}

const AuthenticationCode: FC<Props> = (props: Props): ReactElement => {
    const {token} = props;

    const modalCtx = useModal();
    const userCtx = useUser();
    const [formValue, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const [warningMsg, setWarningMsg] = useState<string | null>(null);

    const handleSendNewCode = useCallback(async () => {
        // TODO
    }, [])

    useEffect(() => {
        if (userCtx.userData)
            handleSendNewCode();
    }, [userCtx.userData, handleSendNewCode])

    if (!userCtx.userData)
        return <></>

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!userCtx.userData)
            return;

        try {
            // TODO
            const isCodeCorrect = false;
            if (isCodeCorrect === false)
                return setWarningMsg("The code is not correct");

            const {payload: userBaseData} = await UserService.getUser(token);

            localStorage.setItem('tern-jwt', token);
            localStorage.setItem('tern-email', userBaseData.email);
            localStorage.setItem('tern-email-verified', userBaseData.isEmailVerified.toString());
            localStorage.setItem('tern-plan-purchased', userBaseData.isPurchased.toString());

            // TODO userCtx.save
            console.log(userBaseData)

            modalCtx.closeModal();
        } catch (error: unknown) {
            let message: string = 'Unknown error';
            if (axios.isAxiosError(error))
                message = error.cause?.message ?? message;
            else if (typeof error === 'string')
                message = error;
            modalCtx.openModal(<BaseModal isSimple className={'place-self-center mx-auto'}>{message}</BaseModal>);
        }
    }

    return (
        <BaseModal
            title={'Account Authentication'}
            className={`place-self-center mx-auto relative [&]:bg-control border-small border-control`}
        >
            <div className={'flex flex-col items-center w-[26.18rem] mb-[1.88rem] text-center leading-[120%]'}>
                <Image src={SVG_SAFE} alt={'safe'} className={'mb-[1.88rem] size-[9.905rem]'}/>
                <span>
                    Please confirm your account by entering the authorization code sent to&nbsp;
                    <span className={'font-bond'}>***-***-{userCtx.userData.telephone.slice(-4)}</span>.
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
                    onChange={(event)=> {
                        setFormValue('code')(event);
                        setWarningMsg(null);
                    }}
                    classNameWrapper={'flex-col [&]:items-start'}
                    className={'h-[1.875rem] w-full px-[0.73rem] bg-control2 border-small b-control4 placeholder:text-primary rounded-[0.375rem]'}
                    required
                />
                {warningMsg && <span className={'mt-[1rem] text-center'}>{warningMsg}</span>}
                <Button className={`py-[0.37rem] mt-[1.88rem] text-[0.875rem] font-bold rounded-full
                                    w-[9.38563rem] place-self-center border-small border-control6`}>
                    Submit and Login
                </Button>
            </form>
            <div className={'text-[0.75rem] mt-[2.51rem] w-[14.75rem]'}>
                <span>
                    It may take a minute to receive your code. Haven’t received it?&nbsp;
                    <span className={'font-bold cursor-pointer text-blue'} onClick={() => handleSendNewCode()}>Resend a new code.</span>
                </span>
            </div>
        </BaseModal>
    )
}


export {AuthenticationCode}