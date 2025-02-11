import { FC, FormEvent, ReactElement, useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import cn from 'classnames';

import { SignUpData } from '@/app/services/auth.service';
import { Breakpoint } from '@/app/hooks/useBreakpointCheck';
import { REGEX } from '@/app/static';

import { AuthService } from '@/app/services';

import { useBreakpointCheck, useForm } from '@/app/hooks';
import { useFlow, useModal, useUser } from '@/app/context';

import { BaseModal, MessageModal, ResetPasswordModal } from '@/app/ui/modals';
import { Button, Input } from '@/app/ui/form';

import SVG_INSIGNIA from '/public/images/insignia-logo.png';


const INPUT_CN = `h-[1.875rem] w-full px-[0.73rem] bg-gray-l0 border-s b-control4 rounded-xs
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
    const isSmScreen = useBreakpointCheck() <= Breakpoint.sm;

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
                await userCtx.fetchUserData(true, token);
                modalCtx.closeModal();
            } else if (!REGEX.password.test(formValue.password))
                setWarningMsg(`Entered email doesn't match the email format`);
            else if (!REGEX.password.test(formValue.password))
                setWarningMsg(`Entered password doesn't meet the requirements`);
            else if (formValue.password !== formValue.passwordConfirm)
                setWarningMsg("Passwords don't match");
            else {
                const {message} = await AuthService.postSignUp(formValue);
                modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            }
            flowCtx.next()?.();
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
            adaptBreakpoint={Breakpoint.sm}
            preventClose={preventClose}
            title={isLoginForm ? 'Login to Tern Account' : 'Create Tern Account'}
            onClose={() => onClose?.()}
            classNameTitle={'justify-self-start text-heading   sm:[&]:mb-xs   sm:landscape:ml-0 '}
            classNameContent={cn(
                'w-[30rem] items-start mx-auto place-items-center text-basic',
                '[&]:overflow-y-visible',
                'sm:[&]:x-[px-xs,py-n,w-full,overflow-y-scroll]',
                'sm:landscape:x-[max-w-[73rem],px-xxl]'
            )}
        >
            <div className={'w-full'}>
                <div className={'flex flex-col items-center text-center'}>
                    <span>{info}</span>
                    <div className={isSmScreen ? 'hidden' : 'mb-n'}>
                        <Image src={SVG_INSIGNIA} alt={'insignia'}
                               className={`my-xs w-[10rem] h-[9rem]`}/>
                        {isLoginForm ? null : <span className={'text-heading'}>Tern</span>}
                    </div>
                </div>
                <form onSubmit={handleFormSubmit}
                      className={'flex flex-col  sm:landscape:x-[flex-row,gap-x-3xl]'}>
                    <fieldset
                        className={'flex flex-col gap-xxs w-full  sm:landscape:x-[max-w-fit,min-w-[21rem]]'}>
                        <Input
                            placeholder={'Email'}
                            value={formValue.email}
                            onChange={setFormValue('email')}
                            classNameWrapper={'flex-col [&]:items-start gap-4xs'}
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
                                `place-self-center py-xxs mt-s w-[60%] rounded-full border-s border-control`,
                                `font-bold text-section-s`,
                                `sm:w-[90%]`,
                                isLoginForm
                                    ? (isSmScreen ? 'bg-blue text-primary  sm:landscape:mt-auto' : 'text-gray bg-white')
                                    : (isSmScreen ? 'border-b-s border-blue  sm:landscape:mt-xl' : '')
                            )}
                        >
                            {!isLoginForm ? 'Sign Up' : 'Login'}
                        </Button>
                        <div className={'mt-s text-center'}>
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