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

const SignUpModal: FC<ModalProps> = (props: ModalProps) => {
    const [formValue, setFormValue] = useForm<RegistrationForm>(FORM_DEFAULT);

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // TODO
    }

    return (
        <div
            className={`p-[--py] w-[30.31rem] rounded-[0.5625rem] border-small border-control3 bg-control text-primary`}>
            <div className={'flex justify-between'}>
                <h1 className={'font-oxygen text-header font-bold'}>Create account</h1>
                <Button
                    btnType={'close'}
                    onClick={() => props.closeModal()}
                />
            </div>
            <hr className={'my-[1.25rem]'}/>
            <div className={'text-center'}>
                <span>You must have an ARCH subscription to save an AR code. Please create an account below to purchase a Plan.</span>
                <span
                    className={'inline-block my-[1.25rem] w-[10.42rem] h-[9rem] bg-[url("../assets/images/insignia-logo.png")] bg-contain'}/>
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
        </div>
    )
}

export {SignUpModal}