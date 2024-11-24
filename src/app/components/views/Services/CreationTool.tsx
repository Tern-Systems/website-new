import {FC, FormEvent} from "react";

import {ModalProps, useModal} from "@/app/context/Modal.context";
import {useForm} from "@/app/hooks/useForm";

import {SignUpModalBase} from "@/app/components/modals/SignUp";

import {Input} from "@/app/components/form/Input";
import {Button} from "@/app/components/form/Button";
import {useUser} from "@/app/context/User.context";
import {withBaseModal} from "@/app/hocs/withBaseModal";

type CreationToolForm = {
    name: string;
    moduleColor: string;
    backgroundColor: string;
}

const FORM_DEFAULT = {backgroundColor: '#fff', moduleColor: '#fff', name: ''}
const CREATION_TOOL_FORM_COLOR_PICKERS = ['module', 'background'];

const CreationToolView: FC = () => {
    const modalCtx = useModal();
    const userCtx = useUser();

    const [formValue, setFormValue] = useForm<CreationToolForm>(FORM_DEFAULT);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!userCtx.isLoggedIn) {
            const info = 'You must have an ARCH subscription to save an AR code. Please create an account below to purchase a Plan.';
            const SignUpModal: FC<ModalProps> = withBaseModal(
                <SignUpModalBase info={info} openModal={modalCtx.openModal}/>,
                'Create Account'
            );
            return modalCtx.openModal(SignUpModal);
        }

        const SuccessModal: FC = () => (
            <div
                className={`absolute right-[--px] bottom-[--py] flex items-start px-[0.62rem] py-[0.8rem] bg-control2 rounded-[0.375rem] max-w-[18.09rem] text-left`}
                onClick={() => modalCtx.closeModal(false)}
            >
                <span>
                    Your AR Code <span className={'font-bold'}>{formValue.name}</span>has been successfully saved
                </span>
                <div className={'size-[0.9375rem] bg-[url("../assets/images/icons/close.svg")] bg-contain'}/>
            </div>
        )

        // TODO
        modalCtx.openModal(SuccessModal, {isAbsolute: true});
    }

    const ColorPickers = CREATION_TOOL_FORM_COLOR_PICKERS.map((type, index) => {
        const key = `${type}Color` as keyof CreationToolForm;
        return (
            <Input
                labelText={type + 'Color'}
                key={type + index}
                type={'color'}
                id={`qr-${type}-color`}
                name={`qr-${type}-color`}
                value={formValue[key]}
                style={{backgroundColor: formValue[key]}}
                onChange={(event) => setFormValue(key, event.target.value)}
                required
            />
        )
    });

    return (
        <div
            className={'flex place-self-center my-auto p-[4.06rem] w-[69.65rem] bg-section border-small border-control2 rounded-small'}>
            <div className={'p-[0.91rem] mr-[7.7rem] size-[32.375rem] bg-section2 cursor-pointer'}>
                <div
                    className={'flex flex-grow h-full bg-[url("../assets/images/qr.png")] bg-contain bg-no-repeat bg-center'}/>
            </div>
            <form
                className={'flex flex-col justify-between w-[21rem]'}
                onSubmit={(event) => handleFormSubmit(event)}
            >
                <div>
                    <span className={'text-primary text-[3.75rem] font-oxygen font-bold'}>ARCH</span>
                </div>
                <Input
                    type={"text"}
                    id={'qr-name'}
                    name={'qr-name'}
                    placeholder={'Name'}
                    value={formValue.name}
                    onInput={(event) => setFormValue('name', event.currentTarget.value)}
                    required
                />
                <Input
                    labelText={'Upload Media'}
                    type={"file"}
                    id={'qr-file'}
                    name={'qr-file'}
                    required
                />
                {ColorPickers}
                <Button btnType={'submit'}>Save AR Code</Button>
            </form>
        </div>
    );
}

export default CreationToolView;
export type {CreationToolForm}