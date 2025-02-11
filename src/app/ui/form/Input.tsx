import React, {FC, InputHTMLAttributes, MutableRefObject, PropsWithChildren, ReactElement, useRef} from "react";
import Image from "next/image";
import {ReactSVG} from "react-svg";

import styles from '@/app/common.module.css'

import SVG_UPLOAD from "/public/images/icons/upload.svg";
import SVG_COLOR_PICKER_BORDER from "/public/images/color-picker-border.svg";
import SVG_EYE from "/public/images/icons/eye.svg";


interface Props extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, PropsWithChildren {
    classNameWrapper?: string;
    classNameLabel?: string;
    classNameIcon?: string;
    icons?: string[];
}

const Input: FC<Props> = (props: Props) => {
    const {
        children, classNameWrapper, classNameLabel, className, classNameIcon,
        icons, ...inputProps
    } = props;

    const inputRef: MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null> = useRef(null);

    switch (props.type) {
        case 'file' :
            return (
                <label
                    htmlFor={props.id}
                    className={`relative flex items-center justify-center w-full cursor-pointer ${classNameWrapper} ${styles.clickable}`}
                >
                    <ReactSVG
                        src={SVG_UPLOAD.src}
                        className={`[&_*]:size-[2rem] mr-5xs ${classNameIcon}`}
                    />
                    <span
                        hidden={!children}
                        className={classNameLabel + ' overflow-hidden text-nowrap overflow-ellipsis leading-n'}
                    >
                        {children}
                    </span>
                    <input
                        {...inputProps}
                        className={`absolute bottom-0 -z-10 h-1 w-1 hover:hidden ${className}`}
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
                        className={`relative inline-flex items-center justify-center size-[min(9.6dvw,2.25rem)] rounded-full`}>
                            <span
                                style={props.style}
                                className={`absolute inline-block size-[70%] rounded-full`}
                            />
                            <Image src={SVG_COLOR_PICKER_BORDER} alt={'color picker border'}/>
                            <input
                                {...inputProps}
                                className={`absolute bottom-1/2 -z-10 h-1 w-1 ${className}`}
                            />
                    </span>
                </label>
            );
        case 'code':
            if (!props.maxLength)
                return null;
            const code = props.value?.toString() ?? '';
            const Code: ReactElement[] =
                (code + ' '.repeat(props.maxLength - Math.min(code.length, props.maxLength)))
                    .split('')
                    .map((char, idx) => (
                        <span
                            key={char + idx}
                            className={`inline-block w-[min(8.3dvw,1.95rem)] border-b-s cursor-pointer -mb-[min(16dvw,0.375rem)]
                                        ${code.length === idx ? 'border-blue' : 'border-white-d0'}`}>
                            {char}
                        </span>
                    ));

            return (
                <label
                    htmlFor={props.id}
                    className={`relative`}
                >
                    <span
                        className={'flex gap-x-[min(4dvw,0.95rem)] font-oxygen text-[min(6.4dvw,1.5rem)] text-center justify-center h-[min(6.4dvw,1.5rem)]'}>
                        {Code}
                    </span>
                    <input
                        {...inputProps}
                        type={'number'}
                        className={'absolute w-1 h-1 -z-10 left-[30%]'}
                        onInput={(event) => {
                            if (event.currentTarget.maxLength > 0)
                                event.currentTarget.value = event.currentTarget.value.slice(0, event.currentTarget.maxLength);
                        }}
                    />
                </label>
            );
        case 'textarea':
            return (
                <label
                    className={`relative flex flex-col items-start last-of-type:mb-0 cursor-pointer text-left gap-x-[min(1.7dvw,0.4rem)]
                                ${classNameWrapper} ${props.hidden ? 'hidden' : ''}`}>
                    <span hidden={!children} className={classNameLabel}>{children}</span>
                    <textarea
                        {...inputProps}
                            className={`p-[--s-dl-small] min-h-[18.75rem] ${className}`}
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        />
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
                        className={`max-w-[min(6.4dvw,1.5rem)] ${classNameIcon}`}
                    />
                );
            });

            return (
                <label
                    className={`relative flex items-center last-of-type:mb-0 cursor-pointer text-left gap-x-[min(1.7dvw,0.4rem)]
                                ${classNameWrapper} ${props.hidden ? 'hidden' : ''}`}>
                    <span hidden={!children} className={classNameLabel}>{children}</span>
                    <div className={`relative flex items-center ${props.type === 'checkbox' ? '' : 'w-full'}`}>
                       <span
                           hidden={!IconsSVGs}
                           className={'absolute flex gap-[min(0.6dvw,0.135rem)] right-0 pr-[min(3.5dvw,0.81rem)]'}
                           onClick={() => {
                               if (inputRef.current)
                                    inputRef.current.setAttribute('type', ['text', 'password'][+(isPassword && inputRef.current?.type !== 'password')]);
                           }}
                       >
                            {IconsSVGs}
                        </span>
                        <input
                            {...inputProps}
                            className={className}
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            onInput={(event) => {
                                inputProps.onInput?.(event);
                                const {value} = event.currentTarget;

                                if (props.type === 'expiration') {
                                    if (value[value.length - 1] === '/')
                                        event.currentTarget.value = value.slice(0, -1);
                                    if (/\D/.test(value[value.length - 1]))
                                        event.currentTarget.value = value.slice(0, -1);
                                    else if (value.includes('/')) {
                                        if (value.indexOf('/') !== 2) {
                                            event.currentTarget.value = value.slice(0, value.indexOf('/')) + value.slice(value.indexOf('/') + 1);
                                            event.currentTarget.value = event.currentTarget.value.slice(0, 2) + '/' + event.currentTarget.value.slice(2);
                                        }
                                    } else if (value.length === 2)
                                        event.currentTarget.value = value + '/';
                                    else if (value.length === 3 && value[value.length - 1] !== '/')
                                        event.currentTarget.value = value.slice(0, -1) + '/';
                                }

                                if (value.length > event.currentTarget.maxLength && event.currentTarget.maxLength > 0)
                                    event.currentTarget.value = value.slice(0, event.currentTarget.maxLength);
                            }}
                        />
                    </div>
                </label>
            );
    }
}

export {Input};
