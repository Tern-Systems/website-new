import {FC, FormEvent, ReactElement, useEffect, useState} from "react";
import axios from "axios";
import Image from "next/image";
import cn from "classnames";

import {SignUpData} from "@/app/services/auth.service";

import {AuthService} from "@/app/services";

import {useBreakpointCheck, useForm} from "@/app/hooks";
import {useFlow, useModal, useUser} from "@/app/context";

import {BaseModal, MessageModal, ResetPasswordModal} from "@/app/ui/modals";
import {Button, Input} from "@/app/ui/form";

import SVG_INSIGNIA from '/public/images/insignia-logo.png'


const INPUT_CN = `h-[1.875rem] w-full px-[0.73rem] bg-control-gray-l0 border-small b-control4 rounded-smallest
                    sm:text-primary placeholder:sm:text-primary`;


type FormData = SignUpData;
const FORM_DEFAULT: FormData = {email: '', password: '', passwordConfirm: ''};


interface Props {
    info?: string;
    registration?: boolean;
    onClose?: () => void;
    preventClose?: boolean;
}

const AuthModal: FC<Props> = (props: Props): ReactElement => {
    const {registration, info, onClose, preventClose} = props;

    const flowCtx = useFlow();
    const modalCtx = useModal();
    const userCtx = useUser();
    const isSmScreen = useBreakpointCheck() === 'sm';

    const [isLoginForm, setLoginFormState] = useState(!registration);
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
                await userCtx.fetchUserData(token);
                modalCtx.closeModal();
                flowCtx.next()?.();
            } else if (formValue.password !== formValue.passwordConfirm)
                setWarningMsg("Passwords don't match");
            else {
                await AuthService.postSignUp(formValue);
                modalCtx.openModal(<MessageModal>Successfully registered a new user</MessageModal>);
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
            preventClose={preventClose}
            title={isLoginForm ? 'Login to Tern Account' : 'Create Tern Account'}
            onClose={() => onClose?.()}
            classNameTitle={'justify-self-start text-heading   sm:[&]:mb-[--p-content-xs]   sm:landscape:ml-0 '}
            classNameContent={cn(
                'w-[30rem] items-start mx-auto place-items-center text-basic',
                'sm:x-[px-[--p-content-xs],py-[--p-content],w-full]',
                'sm:landscape:x-[max-w-[73rem],px-[--p-content-xxl]]'
            )}
        >
            <div className={'w-full'}>
                <div className={'flex flex-col items-center text-center'}>
                    <span>{info}</span>
                    <div className={isSmScreen ? 'hidden' : 'mb-[--p-content]'}>
                        <Image src={SVG_INSIGNIA} alt={'insignia'}
                               className={`my-[--p-content-xs] w-[10rem] h-[9rem]`}/>
                        {isLoginForm ? null : <span className={'font-oxygen text-header'}>Tern</span>}
                    </div>
                </div>
                <form onSubmit={handleFormSubmit}
                      className={'flex flex-col  sm:landscape:x-[flex-row,gap-x-[--p-content-3xl]]'}>
                    <fieldset
                        className={'flex flex-col gap-[--p-content-xxs] w-full  sm:landscape:x-[max-w-fit,min-w-[21rem]]'}>
                        <Input
                            placeholder={'Email'}
                            value={formValue.email}
                            onChange={setFormValue('email')}
                            classNameWrapper={'flex-col [&]:items-start gap-[--p-content-4xs]'}
                            className={INPUT_CN}
                            required
                        >
                            Please enter email to {!isLoginForm ? 'create your Tern account' : 'login'}
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
                        {warningMsg && <span className={'text-center'}>{warningMsg}</span>}
                        <span hidden={!isLoginForm}>
                            Forgot your password?&nbsp;
                            <Button
                                type={'button'}
                                className={'text-blue-l0'}
                                onClick={() => modalCtx.openModal(<ResetPasswordModal/>, {darkenBg: true})}
                            >
                                Reset
                            </Button>
                        </span>
                    </fieldset>
                    <div className={'flex flex-col items-center sm:landscape:w-full'}>
                        <Button
                            type={'submit'}
                            className={cn(
                                `place-self-center py-[--p-content-xxs] mt-[--p-content-s] w-[60%] rounded-full border-small border-control`,
                                `font-bold text-section-s`,
                                `sm:w-[90%]`,
                                isLoginForm
                                    ? (isSmScreen ? 'bg-control-blue text-primary  sm:landscape:mt-auto' : 'text-gray bg-control-white')
                                    : (isSmScreen ? 'border-b-small border-blue  sm:landscape:mt-[--p-content-xl]' : '')
                            )}
                        >
                            {!isLoginForm ? 'Sign Up' : 'Login'}
                        </Button>
                        <div className={'mt-[--p-content-s] text-center'}>
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