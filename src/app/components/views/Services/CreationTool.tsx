import {FC, FormEvent} from "react";

import {useModal} from "@/app/context/Modal.context";
import {useForm} from "@/app/hooks/useForm";

import {AuthModal} from "@/app/components/modals/Auth";

import {Input} from "@/app/components/form/Input";
import {Button} from "@/app/components/form/Button";
import {useUser} from "@/app/context/User.context";

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
            return modalCtx.openModal(<AuthModal info={info} isLoginAction={false}/>);
        }

        const SuccessModal = () => (
            <span>
                Your AR Code <span className={'font-bold'}>{formValue.name}</span>has been successfully saved
            </span>
        )

        // TODO
        modalCtx.openModal(<SuccessModal/>);
    }

    const ColorPickers = CREATION_TOOL_FORM_COLOR_PICKERS.map((type, index) => {
        const key = `${type}Color` as keyof CreationToolForm;
        return (
            <Input
                key={type + index}
                type={'color'}
                value={formValue[key]}
                style={{backgroundColor: formValue[key]}}
                onChange={setFormValue(key)}
                required
            >
                {type} Color
            </Input>
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
                    name={'qr-name'}
                    placeholder={'Name'}
                    value={formValue.name}
                    onChange={setFormValue('name')}
                    className={`px-[0.68rem] h-[2.3125rem] w-full text-[1.6875rem] placeholder:text-primary bg-control2
                                border-small border-control4 rounded-[0.375rem]`}
                    required
                />
                <Input
                    type={"file"}
                    name={'qr-file'}
                    classNameWrapper={'h-[3.125rem] font-bold text-[1.3125rem] text-black bg-white rounded-full'}
                    required
                >
                    Upload Media
                </Input>
                {ColorPickers}
                <Button className={'px-[4.34rem] h-[3.125rem] text-[1.3125rem] font-bold border-small border-control5 rounded-full'}>
                    Save AR Code
                </Button>
            </form>
        </div>
    );
}

export {CreationToolView};
export type {CreationToolForm}