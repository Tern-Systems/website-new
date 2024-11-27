import {FC, InputHTMLAttributes, MutableRefObject, PropsWithChildren, ReactElement, useRef} from "react";
import Image from "next/image";

import SVG_UPLOAD from "@/assets/images/icons/upload.png";
import SVG_COLOR_PICKER_BORDER from "@/assets/images/color-picker-border.svg";
import SVG_EYE from "@/assets/images/icons/eye.svg";

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, PropsWithChildren {
    classNameWrapper?: string;
    classNameLabel?: string;
    icons?: string[];
}

const Input: FC<InputProps> = (props: InputProps) => {
    const {
        children, classNameWrapper, classNameLabel, className,
        icons, ...inputProps
    } = props;

    const inputRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

    switch (props.type) {
        case 'file' :
            const LabelFile = children ? <span className={classNameLabel}>{children}</span> : null;
            return (
                <label
                    htmlFor={props.id}
                    className={`relative flex items-center justify-center cursor-pointer ${classNameWrapper}`}
                >
                    <Image src={SVG_UPLOAD} alt={'upload icon'} className={'inline size-[2rem]'}/>
                    {LabelFile}
                    <input
                        {...inputProps}
                        className={`absolute w-0 ${className}`}
                    />
                </label>
            );
        case 'color':
            const LabelColor = children ?
                <span className={`capitalize ${classNameLabel}`}>{children}</span> : null;
            return (
                <label
                    htmlFor={props.id}
                    className={`flex items-center justify-between cursor-pointer ${classNameWrapper}`}
                >
                    {LabelColor}
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
                        className={`absolute w-0 ${className}`}
                    />
                </label>
            );
        default:
            const Label = children ?
                <span className={classNameLabel}>{children}</span> : null;

            const inputIcons: string[] = props.type === 'password' ? [SVG_EYE] : (icons ?? []);
            const IconsSVGs: ReactElement[] | undefined = inputIcons?.map((icon) => {
                const alt = JSON.stringify(icon);
                return (
                    <Image
                        key={alt}
                        src={icon}
                        alt={alt}
                        className={'max-w-[1.45rem]'}
                    />
                );
            });
            const Icons = IconsSVGs
                ? (
                    <span
                        className={'absolute flex gap-[0.13rem] right-[0.81rem]'}
                        onClick={() => {
                            if (inputRef.current)
                                inputRef.current.type = ['password', 'text'][+(inputRef.current?.type === 'password')];
                        }}
                    >
                        {IconsSVGs}
                    </span>
                )
                : null;

            return (
                <label
                    className={`relative flex gap-[0.44rem] items-center last-of-type:mb-0 cursor-pointer text-left
                                ${classNameWrapper}`}>
                    {Label}
                    <input
                        {...inputProps}
                        ref={inputRef}
                        className={className}
                    />
                    {Icons}
                </label>
            );
    }
}

export {Input}