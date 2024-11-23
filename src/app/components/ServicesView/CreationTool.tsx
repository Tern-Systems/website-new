import {FC, FormEvent, ReactElement, useState} from "react";
import Image from "next/image";

import SVG_COLOR_PICKER_BORDER from "@/assets/images/color-picker-border.svg";
import SVG_UPLOAD from "@/assets/images/icons/upload.png";
import SVG_CLOSE from "@/assets/images/icons/close.svg";

type CreationToolForm = {
    name: string;
    moduleColor: string;
    backgroundColor: string;
}

const CREATION_TOOL_FORM_COLOR_PICKERS = ['module', 'background'];

interface CreationToolProps {
    arLogo: ReactElement;

}

const CreationTool: FC<CreationToolProps> = (props: CreationToolProps) => {
    const {arLogo} = props;

    const [isQRSaved, setQRSavedState] = useState(false);
    const [formValue, setFormValue] = useState<CreationToolForm>({
        backgroundColor: '#fff',
        moduleColor: ' #fff',
        name: ''
    });

    const setFormValueHelper = (key: keyof CreationToolForm, value: string) =>
        setFormValue(prevState => ({...prevState, [key]: value}));

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // TODO
        setQRSavedState(true);
    }

    const ColorPickers = CREATION_TOOL_FORM_COLOR_PICKERS.map((type, index) => {
        const key = `${type}Color` as keyof CreationToolForm;
        return (
            <label
                key={type + index}
                htmlFor={`qr-${type}-color`}
                className={'flex items-center justify-between cursor-pointer'}
            >
                <span className={'text-[1.875rem] capitalize'}>{type} Color</span>
                <span
                    className={`relative inline-flex items-center justify-center size-[2.25rem] rounded-full`}>
                                <span
                                    style={{backgroundColor: formValue[key]}}
                                    className={'absolute inline-block size-[70%] rounded-full'}
                                />
                                    <Image src={SVG_COLOR_PICKER_BORDER} alt={'color picker border'}/>
                            </span>
                <input
                    type={'color'}
                    id={`qr-${type}-color`}
                    name={`qr-${type}-color`}
                    value={formValue[key]}
                    onChange={(event) => setFormValueHelper(key, event.target.value)}
                    className={'hidden'}
                    required
                />
            </label>
        )
    });

    return (
        <>
            <div
                className={`absolute right-[--px] bottom-[--py] flex items-start px-[0.62rem] py-[0.8rem] bg-control2 rounded-[0.375rem] max-w-[18.09rem] text-left ${isQRSaved ? '' : 'hidden'}`}>
                <span>Your AR Code <span
                    className={'font-bold'}>{formValue.name}</span> has been successfully saved</span>
                <Image
                    src={SVG_CLOSE}
                    alt={'close icon'}
                    className={'cursor-pointer'}
                    onClick={() => setQRSavedState(false)}
                />
            </div>
            <div className={'flex p-[4.06rem] bg-section border-small border-control2 rounded-small'}>
                <div className={'p-[0.91rem] mr-[7.7rem] size-[32.375rem] bg-section2 cursor-pointer'}>
                    <div
                        className={'flex flex-grow h-full bg-[url("../assets/images/qr.png")] bg-contain bg-no-repeat bg-center'}/>
                </div>
                <form
                    className={'flex flex-col justify-between w-[21rem]'}
                    onSubmit={(event) => handleFormSubmit(event)}
                >
                    {arLogo}
                    <input
                        type={"text"}
                        id={'qr-name'}
                        name={'qr-name'}
                        placeholder={'Name'}
                        value={formValue.name}
                        onInput={(event) => setFormValueHelper('name', event.currentTarget.value)}
                        className={'rounded-[0.375rem] h-[1.875rem] pl-[0.74rem] bg-control2 placeholder:text-white border-small border-control3'}
                        required
                    />
                    <label
                        htmlFor={'qr-file'}
                        className={'relative py-[0.6rem] rounded-full bg-white text-black text-[1.3125rem] font-bold cursor-pointer'}
                    >
                        <Image src={SVG_UPLOAD} alt={'upload icon'} className={'inline size-[2rem]'}/>
                        <span>Upload Media</span>
                        <input
                            type={"file"}
                            id={'qr-file'}
                            name={'qr-file'}
                            className={'absolute -z-10 left-0'}
                            required
                        />
                    </label>
                    {ColorPickers}
                    <button
                        type={'submit'}
                        className={'border-small border-control3 rounded-full p-[0.5rem] text-[1.3125rem]'}
                    >
                        Save AR Code
                    </button>
                </form>
            </div>
        </>
    );
}

export default CreationTool;
export type {CreationToolForm}