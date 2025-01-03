import React, {FC, FormEvent, ReactElement, useCallback, useEffect, useState} from "react";
import {ReactSVG} from "react-svg";
import axios from "axios";

// Commenting Out for Hasky Checker
import {UserData} from "@/app/context/User.context";
import {AuthService, UserService} from "@/app/services";

import {useForm} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {BaseModal, MessageModal} from "@/app/ui/modals";
import {Button, Input} from "@/app/ui/form";

import SVG_SAFE from '@/assets/images/safe.svg'


type FormData = { code: string };

const FORM_DEFAULT: FormData = {code: ''};

interface Props {
    token: string;
    phone: string;
    email: string;
    isDisabling?: boolean;
    isPhoneEnabling?: boolean;
}

const AuthenticationCode: FC<Props> = (props: Props): ReactElement => {
    const {token, phone, email, isDisabling = false, isPhoneEnabling = false} = props;

    const modalCtx = useModal();
    const userCtx = useUser();
    const [formValue, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const [warningMsg, setWarningMsg] = useState<string | null>(null);

    const handleSendNewCode = useCallback(async () => {
        try {

            await AuthService.postSendOTP(email);

        } catch (error: unknown) {
            console.log(error); // TODO remove after testing

            if (axios.isAxiosError(error)) {
                const errorMsg = error.response?.data?.msg || 'Something went wrong. Please try again later.';
                modalCtx.openModal(<MessageModal>{errorMsg}</MessageModal>);
            } else {
                modalCtx.openModal(<MessageModal>Unexpected error occurred. Please try again.</MessageModal>);
            }
        }

        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        handleSendNewCode();
    }, [handleSendNewCode])

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {

            const verifyRes = await AuthService.postVerifyOTP(formValue.code, email);

            if (verifyRes === true) {

                if (isDisabling) {

                    try {

                        const offRes = await AuthService.post2FATurnOff(email);

                        if (offRes === true) {
                            if (userCtx.userData) {
                                const updatedUserData = {
                                    ...userCtx.userData,
                                    state2FA: {
                                        email: null,
                                        phone: null
                                    }
                                };
                                userCtx.setSession(updatedUserData, token);
                                modalCtx.openModal(<MessageModal>Two-factor authentication has been disabled
                                    successfully</MessageModal>);
                            }
                        }

                    } catch (error: unknown) {

                        console.error("Error 2FA Turn off: ", error); // TODO remove after testing
                        modalCtx.openModal(<MessageModal>Failed to turn off 2FA. Please try again
                            later.</MessageModal>);
                    }

                } else {

                    if (isPhoneEnabling) {
                        if (userCtx.userData) {
                            const updatedUserData = {
                                ...userCtx.userData,
                                state2FA: {
                                    ...userCtx.userData.state2FA,
                                    phone: phone
                                }
                            };
                            userCtx.setSession(updatedUserData, userCtx?.token || '');
                            modalCtx.openModal(<MessageModal>Phone number successfully saved for 2FA.</MessageModal>);
                        }
                    }else{ 
                        const {payload: userData} = await UserService.getUser(token);
                        userCtx.setSession(userData as UserData, token); // TODO remove type casting
                        modalCtx.closeModal();
                    }
                    
                    

                }
            }

        } catch (error: unknown) {

            console.log('error', error); // TODO remove after testing

            if (axios.isAxiosError(error) && error.status === 400) {
                return setWarningMsg("Incorrect OTP. Please try again.")
            } else {
                modalCtx.openModal(<MessageModal>Unexpected error occurred. Please try again later.</MessageModal>);
            }
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
                        <Button className={`py-[0.37rem] mt-[1.88rem] text-small font-bold rounded-full
                                    w-[9.38563rem] place-self-center border-small border-control-blue
                                    ${isDisabling ? 'border-[#F42200] text-[#F42200]' : 'border-control-blue'}`}
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