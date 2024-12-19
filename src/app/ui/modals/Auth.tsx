import {FC, FormEvent, ReactElement, useState} from "react";
import axios from "axios";
import Image from "next/image";

import {Phone, UserData} from "@/app/context/User.context";
import {SignUpData} from "@/app/services/auth.service";

import {AuthService, UserService} from "@/app/services";

import {useForm} from "@/app/hooks";
import {useFlow, useModal, useUser} from "@/app/context";

import {AuthenticationCode, BaseModal, MessageModal, ResetPasswordModal} from "@/app/ui/modals";
import {Button, Input} from "@/app/ui/form";

import SVG_INSIGNIA from '@/assets/images/insignia-logo.png'


type FormData = SignUpData;
const FORM_DEFAULT: FormData = {email: '', password: '', passwordConfirm: ''};


interface Props {
    info?: string;
    isLoginAction: boolean;
}

const AuthModal: FC<Props> = (props: Props): ReactElement => {
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
                const {payload: userData} = await UserService.getUser(token);

                if (!userData.verification.phone) {
                    const primaryPhone: Phone | null | undefined = Object.values(userData.phone).find((phone) => phone?.isPrimary);

                    if (primaryPhone) {
                        const AuthCodeModal = (
                            <AuthenticationCode
                                token={token}
                                email={userData.email}
                                phone={primaryPhone.number}
                            />
                        );
                        modalCtx.openModal(AuthCodeModal, {darkenBg: true});
                    } else
                        setWarningMsg('Error checking verified phone, please try to login again later');
                } else {
                    userCtx.setSession(userData as UserData, token); // TODO remove type casting
                    modalCtx.closeModal();
                    flowCtx.next()?.();
                }
            } else if (formValue.password !== formValue.passwordConfirm)
                setWarningMsg("Passwords don't match");
            else {
                await AuthService.postSignUp(formValue);
                modalCtx.closeModal();
                flowCtx.next()?.();
            }
        } catch (error: unknown) {
            let message: string = 'Unknown error';
            if (axios.isAxiosError(error))
                message = error.cause?.message ?? message;
            else if (typeof error === 'string')
                message = error;
            modalCtx.openModal(<MessageModal>{message}</MessageModal>);
        }
    }

    const Content = (
        <>
            <div className={'flex flex-col items-center w-[26rem] text-center'}>
                <span>{info}</span>
                <Image src={SVG_INSIGNIA} alt={'insignia'} className={'my-[1.25rem] w-[10rem] h-[9rem]'}/>
                {!isLoginForm ? <span className={'mb-[1.9rem] font-oxygen text-header'}>Tern</span> : null}
            </div>
            <form
                className={'flex flex-col'}
                onSubmit={handleFormSubmit}
            >
                <fieldset className={'flex flex-col gap-[0.95rem]'}>
                    <Input
                        placeholder={'Email'}
                        value={formValue.email}
                        onChange={setFormValue('email')}
                        classNameWrapper={'flex-col [&]:items-start gap-[0.625rem]'}
                        className={'h-[1.875rem] w-full px-[0.75rem] bg-control-gray-l0 border-small b-control4 rounded-smallest'}
                        required
                    >
                        Please enter credentials {!isLoginForm ? 'create' : 'login to'} your Tern account
                    </Input>
                    <Input
                        type={"password"}
                        placeholder={'Password'}
                        value={formValue.password}
                        onChange={setFormValue('password')}
                        className={'h-[1.875rem] w-full px-[0.73rem] bg-control-gray-l0 border-small b-control4 rounded-smallest'}
                        required
                    />
                    <Input
                        hidden={isLoginForm}
                        type={"password"}
                        placeholder={'Confirm Password'}
                        value={formValue.passwordConfirm}
                        onChange={setFormValue('passwordConfirm')}
                        className={'h-[1.875rem] w-full px-[0.73rem] bg-control-gray-l0 border-small b-control4 rounded-smallest'}
                        required={!isLoginForm}
                    />
                </fieldset>
                <span hidden={!isLoginForm} className={'mt-[0.62rem]'}>
                    Forgot your password?&nbsp;
                    <Button
                        className={'text-blueL0'}
                        onClick={() => modalCtx.openModal(<ResetPasswordModal/>, {darkenBg: true})}
                    >
                        Reset
                    </Button>
                </span>
                {warningMsg && <span className={'my-[0.63rem] text-center'}>{warningMsg}</span>}
                <Button className={`py-[0.92rem] mt-[1.56rem] text-content-small font-bold rounded-full
                                    w-[18.93rem] place-self-center border-small border-control
                                    ${isLoginForm ? 'text-gray bg-white' : ''}`}>
                    {!isLoginForm ? 'Sign Up' : 'Login'}
                </Button>
            </form>
            <div className={'mt-[1.55rem] text-center'}>
                <span>
                    {isLoginForm ? "Don't" : 'Already'} have an account?&nbsp;
                    <Button
                        className={'text-blueL0'}
                        onClick={() => setLoginFormState(prevState => !prevState)}
                    >
                      {isLoginForm ? 'Sign Up' : 'Login'}
                    </Button>
                </span>
            </div>
        </>
    );

    return <BaseModal title={isLoginForm ? 'Login to Account' : 'Create Account'}>{Content}</BaseModal>
}


export {AuthModal}