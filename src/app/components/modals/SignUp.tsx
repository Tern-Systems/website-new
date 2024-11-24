import {FC, FormEvent} from "react";

import {ModalProps} from "@/app/context/Modal.context";

import {useForm} from "@/app/hooks/useForm";

import {Input} from "@/app/components/form/Input";
import {Button} from "@/app/components/form/Button";


type RegistrationForm = {
    email: string;
    password: string;
    passwordConfirm: string;
}

const FORM_DEFAULT: RegistrationForm = {email: '', password: '', passwordConfirm: ''};

interface SignUpModalBaseProps extends Pick<ModalProps, 'openModal'> {
    info: string;
}

const SignUpModalBase: FC<SignUpModalBaseProps> = (props: SignUpModalBaseProps) => {
    const {info, openModal} = props;

    const [formValue, setFormValue] = useForm<RegistrationForm>(FORM_DEFAULT);

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // TODO
    }

    return (
        <>
            <div className={'text-center w-[26.18rem]'}>
                <span>{info}</span>
                <span
                    className={'inline-block my-[1.25rem] w-[10.42rem] h-[9rem] bg-[url("../assets/images/insignia-logo.png")] bg-contain bg-no-repeat'}/>
            </div>
            <form
                className={'flex flex-col'}
                onSubmit={(event) => handleFormSubmit(event)}
            >
                <Input
                    labelText={'Please enter email to create your Tern account'}
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
                <Input
                    type={"password"}
                    id={'password-repeat'}
                    name={'password-repeat'}
                    placeholder={'Confirm Password'}
                    value={formValue.passwordConfirm}
                    onInput={(event) => setFormValue('passwordConfirm', event.currentTarget.value)}
                    required
                />
                <Button btnType={'submit'} className={'mt-[1.56rem]'}>Sign Up</Button>
            </form>
            <div>
                <span>
                    Already have an account?&nbsp;
                    <span
                        className={'text-[#21A1D3] cursor-pointer'}
                        onClick={() => openModal(()=>null)} // TODO Log In
                    >
                        Log In
                    </span>
                </span>
            </div>
        </>
    )
}

export {SignUpModalBase}