import React, {FC, InputHTMLAttributes, MutableRefObject, PropsWithChildren, ReactElement, useRef} from "react";
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
            return (
                <label
                    htmlFor={props.id}
                    className={`relative flex items-center justify-center cursor-pointer ${classNameWrapper}`}
                >
                    <Image src={SVG_UPLOAD} alt={'upload icon'} className={'inline size-[2rem]'}/>
                    <span hidden={!children} className={classNameLabel}>{children}</span>
                    <input
                        {...inputProps}
                        className={`absolute bottom-0 -z-10 h-1 w-1 ${className}`}
                    />
                </label>
            );
        case 'color':
            return (
                <label
                    htmlFor={props.id}
                    className={`flex items-center justify-between cursor-pointer ${classNameWrapper}`}
                >
                    <span hidden={!children} className={`capitalize ${classNameLabel}`}>{children}</span>
                    <span
                        className={`relative inline-flex items-center justify-center size-[2.25rem] rounded-full`}>
                            <span
                                style={props.style}
                                className={'absolute inline-block size-[70%] rounded-full'}
                            />
                            <Image src={SVG_COLOR_PICKER_BORDER} alt={'color picker border'}/>
                            <input
                                {...inputProps}
                                className={`absolute bottom-0 -z-10 h-1 w-1 ${className}`}
                            />
                    </span>
                </label>
            );
        default:
            const isPassword = props.type === 'password';

            const inputIcons: string[] = isPassword ? [SVG_EYE] : (icons ?? []);
            const IconsSVGs: ReactElement[] = inputIcons.map((icon) => {
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

            return (
                <label
                    className={`relative flex items-center last-of-type:mb-0 cursor-pointer text-left
                    ${classNameWrapper} ${props.hidden ? 'hidden' : ''}`}>
                    <span hidden={!children} className={classNameLabel}>{children}</span>
                    <div className={`relative flex items-center w-full`}>
                       <span
                           hidden={!IconsSVGs}
                           className={'absolute flex gap-[0.13rem] right-0 pr-[0.81rem]'}
                           onClick={() => {
                               if (inputRef.current)
                                   inputRef.current.type = ['text', 'password'][+(isPassword && inputRef.current?.type !== 'password')];
                           }}
                       >
                            {IconsSVGs}
                        </span>
                        <input
                            {...inputProps}
                            className={className}
                            ref={inputRef}
                            onInput={(event) => {
                                if (event.currentTarget.maxLength > 0)
                                    event.currentTarget.value = event.currentTarget.value.slice(0, event.currentTarget.maxLength);
                                inputProps.onInput?.(event);
                            }}
                        />
                    </div>
                </label>
            );
    }
}

export {Input}