import React, {FC, FormEvent, ReactElement, useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import Image from "next/image";

import {Route} from "@/app/static";

import {AuthService, SignUpData} from "@/app/services/auth.service";

import {useForm} from "@/app/hooks";
import {useModal} from "@/app/context";

import {BaseModal, MessageModal} from "@/app/ui/modals";
import {Button, Input} from "@/app/ui/form";

import SVG_INSIGNIA from '@/assets/images/insignia-logo.png'
import SVG_EYE from '@/assets/images/icons/eye.svg'


type FormData = Pick<SignUpData, 'email' | 'password' | 'passwordConfirm'>;

const FORM_DEFAULT: FormData = {email: '', password: '', passwordConfirm: ''};

interface Props {
    token?: string;
}

const ResetPasswordModal: FC<Props> = (props: Props): ReactElement => {
    const {token} = props;

    const modalCtx = useModal();
    const router = useRouter();

    const [warningMsg, setWarningMsg] = useState<string | null>(null);

    const [formValue, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const EmailSentModal: FC = () => (
            <BaseModal
                title={'Email Sent'}
                className={'w-[30rem] border-control-white border-small text-center'}
            >
                <Image src={SVG_INSIGNIA} alt={'insignia'}
                       className={'mb-[1.25rem] w-[10rem] h-[9rem] place-self-center'}/>
                <span>To reset your password, please click the link provided in the email sent to your registered email address.</span>
            </BaseModal>
        );

        try {
            if (!token) {
                await AuthService.postForgotPassword(formValue.email);
                modalCtx.openModal(<EmailSentModal/>, {darkenBg: true});
            } else if (formValue.password !== formValue.passwordConfirm)
                setWarningMsg("Passwords don't match");
            else {
                await AuthService.postResetPassword(token, formValue.passwordConfirm);
                router.replace(Route.Home);
                modalCtx.closeModal();
            }
        } catch (error: unknown) {
            let message: string = 'Unknown error';
            if (axios.isAxiosError(error))
                message = error.cause?.message ?? message;
            else if (typeof error === 'string')
                message = error;
            modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            router.replace(Route.Home);
        }
    }

    const Controls = token
        ? (
            <>
                <Input
                    type={"password"}
                    name={'password'}
                    placeholder={'Password'}
                    value={formValue.password}
                    onChange={setFormValue('password')}
                    className={'h-[1.875rem] w-full px-[0.73rem] bg-control-gray-l0 border-small b-control4 rounded-smallest'}
                    required
                />
                <Input
                    type={"password"}
                    name={'password-repeat'}
                    placeholder={'Confirm Password'}
                    value={formValue.passwordConfirm}
                    onChange={setFormValue('passwordConfirm')}
                    className={'h-[1.875rem] w-full px-[0.73rem] bg-control-gray-l0 border-small b-control4 rounded-smallest'}
                    icons={[SVG_EYE]}
                    required={!!token}
                />
            </>
        )
        : (
            <Input
                name={'email'}
                placeholder={'Email'}
                value={formValue.email}
                onChange={setFormValue('email')}
                classNameWrapper={'flex-col [&]:items-start'}
                className={'h-[1.875rem] w-full px-[0.73rem] bg-control-gray-l0 border-small b-control4 rounded-smallest'}
                required
            />
        );

    return (
        <BaseModal
            isSimple
            className={`place-self-center mx-auto relative [&]:bg-control-gray border-small border-control`}
            classNameContent={'py-[1.5rem] pl-[1.7rem] pr-0'}
        >
            <div className={'flex flex-col items-center w-[26.18rem]'}>
                <Image src={SVG_INSIGNIA} alt={'insignia'} className={'my-[1.25rem] w-[10.42rem] h-[9rem]'}/>
                <span className={'mb-[1.88rem] font-oxygen text-header'}>Tern</span>
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
                <Button className={`py-[0.92rem] mt-[1.56rem] text-content-small font-bold rounded-full
                                    w-[18.93rem] place-self-center bg-white text-gray`}>
                    Reset Password
                </Button>
            </form>
        </BaseModal>
    )
}


export {ResetPasswordModal}