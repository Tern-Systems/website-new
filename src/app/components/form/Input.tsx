import {FC, InputHTMLAttributes} from "react";
import Image from "next/image";
import SVG_UPLOAD from "@/assets/images/icons/upload.png";
import SVG_COLOR_PICKER_BORDER from "@/assets/images/color-picker-border.svg";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    labelText?: string
}

const Input: FC<InputProps> = (props: InputProps) => {
    const {labelText, className, ...inputProps} = props;

    switch (props.type) {
        case 'file' :
            return (
                <label
                    htmlFor={props.id}
                    className={`relative py-[0.6rem] rounded-full bg-white text-black text-[1.3125rem] font-bold cursor-pointer ${className}`}
                >
                    <Image src={SVG_UPLOAD} alt={'upload icon'} className={'inline size-[2rem]'}/>
                    <span>{labelText}</span>
                    <input
                        {...inputProps}
                        className={'absolute -z-10 left-0'}
                    />
                </label>
            );
        case 'color':
            return (
                <label
                    htmlFor={props.id}
                    className={`flex items-center justify-between cursor-pointer ${className}`}
                >
                    <span className={'text-[1.875rem] capitalize'}>{labelText}</span>
                    <span
                        className={`relative inline-flex items-center justify-center size-[2.25rem] rounded-full`}>
                            <span
                                style={props.style}
                                className={'absolute inline-block size-[70%] rounded-full'}
                            />
                                <Image src={SVG_COLOR_PICKER_BORDER} alt={'color picker border'}/>
                            </span>
                    <input
                        {...inputProps}
                        className={'hidden'}
                    />
                </label>
            );
        default:
            return (
                <label
                    htmlFor={props.id}
                    className={`flex flex-col mb-[0.94rem] last-of-type:mb-0 justify-between cursor-pointer ${className}`}
                >
                    {labelText ? <span className={'text-primary capitalize mb-[0.63rem]'}>{labelText}</span> : null}
                    <input
                        {...inputProps}
                        className={`rounded-[0.375rem] w-full h-[1.875rem] pl-[0.74rem] bg-control2 placeholder:text-white
                                border-small border-control3 ${props.className}`}
                    />
                </label>
            );
    }
}

export {Input}