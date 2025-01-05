import {FC, FormEvent, ReactElement, useEffect, useState} from "react";
import axios from "axios";
import Image from "next/image";
import {SignUpData} from "@/app/services/auth.service";

import {AuthService, UserService} from "@/app/services";

import {useBreakpointCheck, useForm} from "@/app/hooks";
import {useFlow, useModal, useUser} from "@/app/context";

import {BaseModal, MessageModal, ResetPasswordModal} from "@/app/ui/modals";
import {Button, Input} from "@/app/ui/form";

import SVG_INSIGNIA from '@/assets/images/insignia-logo.png'


const INPUT_CN = `h-[1.875rem] w-full px-[0.73rem] bg-control-gray-l0 border-small b-control4 rounded-smallest
                    sm:text-primary placeholder:sm:text-primary`;


type FormData = SignUpData;
const FORM_DEFAULT: FormData = {email: '', password: '', passwordConfirm: ''};


interface Props {
    info?: string;
    isLoginAction?: boolean;
}

const AuthModal: FC<Props> = (props: Props): ReactElement => {
    const {isLoginAction, info} = props;

    const flowCtx = useFlow();
    const modalCtx = useModal();
    const userCtx = useUser();
    const isSmScreen = useBreakpointCheck();

    const [isLoginForm, setLoginFormState] = useState(isLoginAction);
    const [warningMsg, setWarningMsg] = useState<string | null>(null);
    const [formValue, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    useEffect(() => {
        setWarningMsg(null)
    }, [isLoginForm]);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (isLoginForm) {
                const {payload: token} = await AuthService.postLogIn(formValue);
                const {payload: userData} = await UserService.getUser(token);

                userCtx.setSession(userData, token);
                modalCtx.closeModal();
                flowCtx.next()?.();
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

    return (
        <BaseModal
            adaptSmScreen
            title={isLoginForm ? 'Login to Tern Account' : 'Create Tern Account'}
            classNameContent={'w-[26rem]    sm:p-[1.25rem] sm:max-w-[21rem] sm:place-self-center    sm:landscape:w-full sm:landscape:max-w-full'}
        >
            <div>
                <div className={'flex flex-col items-center text-center'}>
                    <span>{info}</span>
                    <div className={isSmScreen ? 'hidden' : 'mb-[1.9rem]'}>
                        <Image src={SVG_INSIGNIA} alt={'insignia'} className={`my-[1.25rem] w-[10rem] h-[9rem]`}/>
                        {isLoginForm ? null : <span className={'font-oxygen text-header'}>Tern</span>}
                    </div>
                </div>
                <form onSubmit={handleFormSubmit}
                      className={'flex flex-col     sm:landscape:flex-row sm:landscape:justify-between'}>
                    <fieldset
                        className={'flex flex-col     gap-[0.95rem] w-full    sm:landscape:max-w-fit sm:landscape:min-w-[21rem]'}>
                        <Input
                            placeholder={'Email'}
                            value={formValue.email}
                            onChange={setFormValue('email')}
                            classNameWrapper={'flex-col [&]:items-start gap-[0.625rem]'}
                            className={INPUT_CN}
                            required
                        >
                            Please enter credentials to {!isLoginForm ? 'create your Tern account' : 'login'}
                        </Input>
                        <Input
                            type={"password"}
                            placeholder={'Password'}
                            value={formValue.password}
                            onChange={setFormValue('password')}
                            className={INPUT_CN}
                            required
                        />
                        <Input
                            hidden={isLoginForm}
                            type={"password"}
                            placeholder={'Confirm Password'}
                            value={formValue.passwordConfirm}
                            onChange={setFormValue('passwordConfirm')}
                            className={INPUT_CN}
                            required={!isLoginForm}
                        />
                        <span hidden={!isLoginForm} className={'mt-[0.62rem]'}>
                            Forgot your password?&nbsp;
                            <Button
                                className={'text-blue-l0'}
                                onClick={() => modalCtx.openModal(<ResetPasswordModal/>, {darkenBg: true})}
                            >
                                Reset
                            </Button>
                        </span>
                        {warningMsg && <span className={'my-[0.63rem] text-center'}>{warningMsg}</span>}
                    </fieldset>
                    <div className={'flex flex-col  items-center    sm:landscape:w-[21rem]'}>
                        <Button type={'submit'}
                                className={`place-self-center   py-[0.92rem] mt-[1.56rem] w-full    rounded-full border-small border-control
                                            font-bold text-content-small
                                            sm:w-[90%]
                            ${isLoginForm
                                    ? (isSmScreen ? 'bg-control-blue text-primary' : 'text-gray bg-control-white')
                                    : (isSmScreen ? 'border-b-small border-blue' : '')}`}
                        >
                            {!isLoginForm ? 'Sign Up' : 'Login'}
                        </Button>
                        <div className={'mt-[1.55rem] text-center'}>
                            <span>
                                {isLoginForm ? "Don't" : 'Already'} have an account?&nbsp;
                                <Button
                                    className={`text-blue-l0`}
                                    onClick={() => setLoginFormState(prevState => !prevState)}
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
}


export {AuthModal}