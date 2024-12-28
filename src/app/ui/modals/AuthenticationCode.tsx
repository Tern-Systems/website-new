import React, { FC, FormEvent, ReactElement, useCallback, useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import axios from "axios";

// Commenting Out for Hasky Checker
// import { UserData } from "@/app/context/User.context";
// import { AuthService, UserService } from "@/app/services";

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
    isDisabling?: boolean;
}

const AuthenticationCode: FC<Props> = (props: Props): ReactElement => {
    const { token, phone, email, isDisabling = false } = props;

    const modalCtx = useModal();
    const userCtx = useUser();
    const [formValue, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const [warningMsg, setWarningMsg] = useState<string | null>(null);

    const handleSendNewCode = useCallback(async () => {
        try {
            // Maksym's API call
            // await AuthService.postSendOTP(email);

            // Direct API call
            await axios({
                method: "POST",
                url: `${process.env.NEXT_PUBLIC_API}send-otp`,
                data: {
                    userEmail: email,
                },
                withCredentials: true,
            })
                // TODO remove after testing
                .then(response => {
                    console.log('OTP sent successfully:', response.data);
                })

        } catch (error: unknown) {
            // TODO remove after testing
            console.log(error);

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

            // Maksym's API call
            // await AuthService.postVerifyOTP(formValue.code, email);
            // const { payload: userData } = await UserService.getUser(token);

            const response = await axios({
                method: "POST",
                url: `${process.env.NEXT_PUBLIC_API}2FA-verify-otp`,
                data: {
                    userEmail: email,
                    otp: formValue.code
                },
                withCredentials: true,
            })

            console.log(response.data);

            if (response.data.success === true) {
                if (isDisabling) {

                    try {
                        const offResponse = await axios({
                            method: "POST",
                            url: `${process.env.NEXT_PUBLIC_API}2FA-turn-off`,
                            data: {
                                userEmail: email
                            },
                            withCredentials: true,
                        })

                        if (offResponse.data.success === true) {
                            if (userCtx.userData) {
                                const updatedUserData = {
                                    ...userCtx.userData,
                                    state2FA: {
                                        email: null,
                                        phone: null
                                    }
                                };
                                userCtx.setSession(updatedUserData, token);
                                modalCtx.openModal(<MessageModal>Two-factor authentication has been disabled successfully</MessageModal>);
                            }
                        }

                    } catch (error: unknown) {
                        // TODO remove after testing
                        console.error("Error 2FA Turn off: ", error);
                        modalCtx.openModal(<MessageModal>Failed to turn off 2FA. Please try again later.</MessageModal>);
                    }

                } else {
                    // Maksym's API call
                    // await AuthService.post2FAOff();
                    // userCtx.setSession(userData as UserData, token); // TODO remove type casting
                    modalCtx.closeModal();
                }
            }

        } catch (error: unknown) {
            // TODO remove after testing
            console.log(error);

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
            classNameContent={'max-w-[26rem] sm:max-w-[21rem] sm:place-self-center mt-[1.9rem]'}
        >
            <div className={'flex flex-col items-center mb-[1.875rem] text-center leading-[120%]'}>
                <ReactSVG src={SVG_SAFE.src} className={'mb-[1.875rem] size-[9.9rem] sm:[&_path]:fill-gray'} />
                <span>
                    {
                        isDisabling
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
                                    ${isDisabling
                        ? 'border-[#F42200] text-[#F42200]'
                        : 'border-control-blue'}`}>
                    {isDisabling ? 'Disable' : 'Submit and Login'}
                </Button>
            </form>
            <div className={'text-note mt-[2.51rem] w-[14.75rem]'}>
                <span>
                    It may take a minute to receive your code. Haven’t received it?&nbsp;
                    <span className={'font-bold cursor-pointer text-blue'} onClick={() => handleSendNewCode()}>Resend a new code.</span>
                </span>
            </div>
        </BaseModal>
    )
}


export { AuthenticationCode }