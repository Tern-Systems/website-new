import {FC, FormEvent, ReactElement, useState} from "react";
import axios from "axios";
import Image from "next/image";

import {AuthService, SignUpData} from "@/app/services/auth.service";
import {UserService} from "@/app/services/user.service";

import {useForm} from "@/app/hooks/useForm";
import {useFlow, useModal, useUser} from "@/app/context";

import {BaseModal, ResetPasswordModal} from "@/app/components/modals";

import {Button, Input} from "@/app/components/form";

import SVG_INSIGNIA from '@/assets/images/insignia-logo.png'


type FormData = SignUpData;

const FORM_DEFAULT: FormData = {email: '', password: '', passwordConfirm: ''};

interface AuthModalProps {
    info?: string;
    isLoginAction: boolean;
}

const AuthModal: FC<AuthModalProps> = (props: AuthModalProps): ReactElement => {
    const {isLoginAction, info} = props;

    const flowCtx = useFlow();
    const modalCtx = useModal();
    const userCtx = useUser();

    const [isLoginForm, setLoginFormState] = useState(isLoginAction);
    const [warningMsg, setWarningMsg] = useState<string | null>(null);
    const [formValue, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (isLoginForm) {
                const {payload: token} = await AuthService.postLogIn(formValue);
                const {payload: userBaseData} = await UserService.getUser(token);

                localStorage.setItem('tern-jwt', token);
                localStorage.setItem('tern-email', userBaseData.email);
                localStorage.setItem('tern-email-verified', userBaseData.isEmailVerified.toString());
                localStorage.setItem('tern-plan-purchased', userBaseData.isPurchased.toString());

                // TODO userCtx.save
                console.log(userBaseData)
            } else if (formValue.password !== formValue.passwordConfirm)
                setWarningMsg("Passwords don't match");
            else {
                await AuthService.postSignUp(formValue);
                modalCtx.closeModal();
                flowCtx.next();
            }
        } catch (error: unknown) {
            let message: string = 'Unknown error';
            if (axios.isAxiosError(error))
                message = error.cause?.message ?? message;
            else if (typeof error === 'string')
                message = error;
            modalCtx.openModal(<BaseModal isSimple className={'place-self-center mx-auto'}>{message}</BaseModal>);
        }
    }

    const Content = (
        <>
            <div className={'flex flex-col items-center w-[26.18rem]'}>
                <span>{info}</span>
                <Image src={SVG_INSIGNIA} alt={'insignia'} className={'my-[1.25rem] w-[10.42rem] h-[9rem]'}/>
                {isLoginForm ? <span className={'mb-[1.88rem] font-oxygen text-[1.6875rem]'}>Tern</span> : null}
            </div>
            <form
                className={'flex flex-col'}
                onSubmit={handleFormSubmit}
            >
                <fieldset className={'flex flex-col gap-[0.94rem]'}>
                    <Input
                        placeholder={'Email'}
                        value={formValue.email}
                        onChange={setFormValue('email')}
                        classNameWrapper={'flex-col [&]:items-start gap-[0.63rem]'}
                        className={'h-[1.875rem] w-full px-[0.73rem] bg-control2 border-small b-control4 placeholder:text-primary rounded-[0.375rem]'}
                        required
                    >
                        Please enter email to {isLoginForm ? 'create' : 'log into'} your Tern account
                    </Input>
                    <Input
                        type={"password"}
                        placeholder={'Password'}
                        value={formValue.password}
                        onChange={setFormValue('password')}
                        className={'h-[1.875rem] w-full px-[0.73rem] bg-control2 border-small b-control4 placeholder:text-primary rounded-[0.375rem]'}
                        required
                    />
                    <Input
                        hidden={!isLoginForm}
                        type={"password"}
                        placeholder={'Confirm Password'}
                        value={formValue.passwordConfirm}
                        onChange={setFormValue('passwordConfirm')}
                        className={'h-[1.875rem] w-full px-[0.73rem] bg-control2 border-small b-control4 placeholder:text-primary rounded-[0.375rem]'}
                        required={!isLoginForm}
                    />
                </fieldset>
                <span hidden={!isLoginForm} className={'mt-[0.62rem]'}>
                    Forgot your password?&nbsp;
                        <span
                            className={'text-[#21A1D3] cursor-pointer'}
                            onClick={() => modalCtx.openModal(<ResetPasswordModal/>)}
                        >
                        Reset
                    </span>
                </span>
                {warningMsg && <span className={'my-[0.63rem] text-center'}>{warningMsg}</span>}
                <Button className={`py-[0.92rem] mt-[1.56rem] text-[1.125rem] font-bold rounded-full
                                    w-[18.93rem] place-self-center border-small border-control 
                                    ${isLoginForm ? 'text-form bg-white' : 'text-primary'}`}>
                    {!isLoginForm ? 'Sign Up' : 'Log In'}
                </Button>
            </form>
            <div className={'mt-[1.55rem]'}>
                <span>
                    {isLoginForm ? "Don't" : 'Already'} have an account?&nbsp;
                    <span
                        className={'text-[#21A1D3] cursor-pointer'}
                        onClick={() => setLoginFormState(prevState => !prevState)}
                    >
                      {isLoginForm ? 'Sign Up' : 'Log In'}
                    </span>
                </span>
            </div>
        </>
    );

    return <BaseModal title={isLoginForm ? 'Login to Account' : 'Create Account'}>{Content}</BaseModal>
}


export {AuthModal}