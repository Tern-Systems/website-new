import {FC, FormEvent, ReactElement, useEffect, useState} from "react";
import axios from "axios";

import {AuthService, SignUpData} from "@/app/services/auth.service";
import {UserService} from "@/app/services/user.service";

import {useForm} from "@/app/hooks/useForm";

import {useModal} from "@/app/context/Modal.context";
import {useUser} from "@/app/context/User.context";

import {Input} from "@/app/components/form/Input";
import {Button} from "@/app/components/form/Button";


type FormData = SignUpData;

const FORM_DEFAULT: FormData = {email: '', password: '', passwordConfirm: ''};

interface AuthModalProps {
    info?: string;
    isLoginAction: boolean;
}

const AuthModal: FC<AuthModalProps> = (props: AuthModalProps): ReactElement => {
    const {isLoginAction, info} = props;

    const modalCtx = useModal();
    const userCtx = useUser();

    const [isLoginForm, setLoginFormState] = useState(isLoginAction);
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
            } else
                await AuthService.postSignUp(formValue);

            modalCtx.closeModal();
        } catch (error: unknown) {
            let message: string = 'Unknown error';
            if (axios.isAxiosError(error))
                message = error.cause?.message ?? message;
            else if (typeof error === 'string')
                message = error;
            modalCtx.openModal(message, {isSimple: true});
        }
    }

    useEffect(() => {
        const modalTitle = document.getElementById('modal-title');
        if (modalTitle)
            modalTitle.innerText = !isLoginForm ? 'Create Account' : 'Login to Account';
    }, [isLoginForm])

    const PasswordConfirm = isLoginForm
        ? null
        : (
            <Input
                type={"password"}
                id={'password-repeat'}
                name={'password-repeat'}
                placeholder={'Confirm Password'}
                value={formValue.passwordConfirm}
                onInput={(event) => setFormValue('passwordConfirm', event.currentTarget.value)}
                required
            />
        );

    return (
        <>
            <div className={'flex flex-col items-center w-[26.18rem]'}>
                <span>{info}</span>
                <span
                    className={'inline-block my-[1.25rem] w-[10.42rem] h-[9rem] bg-[url("../assets/images/insignia-logo.png")] bg-contain bg-no-repeat'}/>
                {isLoginForm ? <span className={'mb-[1.88rem] font-oxygen text-[1.6875rem]'}>Tern</span> : null}
            </div>
            <form
                className={'flex flex-col'}
                onSubmit={(event) => handleFormSubmit(event)}
            >
                <Input
                    labelText={`Please enter email to ${isLoginForm ? 'create' : 'log into'} your Tern account`}
                    type={"text"}
                    id={'email'}
                    name={'email'}
                    placeholder={'Email'}
                    value={formValue.email}
                    onInput={(event) => setFormValue('email', event.currentTarget.value)}
                    required
                />
                <Input
                    type={"password"}
                    id={'password'}
                    name={'password'}
                    placeholder={'Password'}
                    value={formValue.password}
                    onInput={(event) => setFormValue('password', event.currentTarget.value)}
                    required
                />
                {PasswordConfirm}
                <Button btnType={'submit'} className={'mt-[1.56rem]'}>
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
    )
}


export {AuthModal}