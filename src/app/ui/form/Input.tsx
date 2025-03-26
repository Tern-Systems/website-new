'use client';

import { FC, InputHTMLAttributes, MutableRefObject, PropsWithChildren, ReactElement, useRef } from 'react';
import Image from 'next/image';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';

import styles from '@/app/common.module.css';

import SVG_UPLOAD from '@/assets/images/icons/upload.svg';
import SVG_COLOR_PICKER_BORDER from '@/assets/images/color-picker-border.svg';
import SVG_EYE from '@/assets/images/icons/eye.svg';

interface Props extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, PropsWithChildren {
    classNameWrapper?: string;
    classNameLabel?: string;
    classNameIcon?: string;
    icons?: string[];
    isCustomCheckbox?: boolean;
    classNameCheckbox?: string;
    classNameIconSpan?: string;
}

const Input: FC<Props> = (props: Props) => {
    const {
        children,
        classNameWrapper,
        classNameLabel,
        className,
        classNameIcon,
        icons,
        isCustomCheckbox,
        classNameCheckbox,
        classNameIconSpan,
        ...inputProps
    } = props;

    const inputRef: MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null> = useRef(null);

    switch (props.type) {
        case 'file':
            return (
                <label
                    htmlFor={props.id}
                    className={`relative flex w-full cursor-pointer items-center justify-center ${classNameWrapper} ${styles.clickable}`}
                >
                    <ReactSVG
                        src={SVG_UPLOAD.src}
                        className={`mr-5xs [&_*]:size-[2rem] ${classNameIcon}`}
                    />
                    <span
                        hidden={!children}
                        className={classNameLabel + ' overflow-hidden overflow-ellipsis text-nowrap leading-n'}
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
                    className={`flex cursor-pointer items-center justify-between ${classNameWrapper}`}
                >
                    <span
                        hidden={!children}
                        className={`capitalize ${classNameLabel}`}
                    >
                        {children}
                    </span>
                    <span
                        className={`relative inline-flex size-[min(9.6dvw,2.25rem)] items-center justify-center rounded-full`}
                    >
                        <span
                            style={props.style}
                            className={`absolute inline-block size-[70%] rounded-full`}
                        />
                        <Image
                            src={SVG_COLOR_PICKER_BORDER}
                            alt={'color picker border'}
                        />
                        <input
                            {...inputProps}
                            className={`absolute bottom-1/2 -z-10 h-1 w-1 ${className}`}
                        />
                    </span>
                </label>
            );
        case 'code':
            if (!props.maxLength) return null;
            const code = props.value?.toString() ?? '';
            const Code: ReactElement[] = (code + ' '.repeat(props.maxLength - Math.min(code.length, props.maxLength)))
                .split('')
                .map((char, idx) => (
                    <span
                        key={char + idx}
                        className={`-mb-[min(16dvw,0.375rem)] inline-block w-[min(8.3dvw,1.95rem)] cursor-pointer border-b-s ${code.length === idx ? 'border-blue' : 'border-white-d0'}`}
                    >
                        {char}
                    </span>
                ));

            return (
                <label
                    htmlFor={props.id}
                    className={`relative`}
                >
                    <span
                        className={
                            'flex h-[min(6.4dvw,1.5rem)] justify-center gap-x-[min(4dvw,0.95rem)] text-center text-[min(6.4dvw,1.5rem)]'
                        }
                    >
                        {Code}
                    </span>
                    <input
                        {...inputProps}
                        type={'number'}
                        className={'absolute left-[30%] -z-10 h-1 w-1'}
                        onInput={(event) => {
                            if (event.currentTarget.maxLength > 0)
                                event.currentTarget.value = event.currentTarget.value.slice(
                                    0,
                                    event.currentTarget.maxLength,
                                );
                        }}
                    />
                </label>
            );
        case 'textarea':
            return (
                <label
                    className={`relative flex cursor-pointer flex-col items-start gap-x-[min(1.7dvw,0.4rem)] text-left last-of-type:mb-0 ${classNameWrapper} ${props.hidden ? 'hidden' : ''}`}
                >
                    <span
                        hidden={!children}
                        className={classNameLabel}
                    >
                        {children}
                    </span>
                    <textarea
                        {...inputProps}
                        className={`min-h-[9.25rem] p-xxs ${className}`}
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    />
                </label>
            );
        default:
            const isPassword = props.type === 'password';
            const isCheckbox = props.type === 'checkbox';

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
                    className={`relative flex cursor-pointer items-center gap-x-[min(1.7dvw,0.4rem)] text-left last-of-type:mb-0 ${classNameWrapper} ${props.hidden ? 'hidden' : ''}`}
                >
                    <span
                        hidden={!children}
                        className={`${classNameLabel} ${isCustomCheckbox ? 'hidden' : ''}`}
                    >
                        {children}
                    </span>
                    <div className={`relative flex items-center ${isCheckbox ? '' : 'w-full'}`}>
                        <span
                            hidden={!IconsSVGs}
                            className={cn(
                                'absolute right-0 flex gap-[min(0.6dvw,0.135rem)] pr-[min(3.5dvw,0.81rem)]',
                                classNameIconSpan,
                            )}
                            onClick={() => {
                                if (inputRef.current)
                                    inputRef.current.setAttribute(
                                        'type',
                                        ['text', 'password'][+(isPassword && inputRef.current?.type !== 'password')],
                                    );
                            }}
                        >
                            {IconsSVGs}
                        </span>

                        <input
                            {...inputProps}
                            className={`${className} pl-3xs ${isCustomCheckbox ? 'peer hidden' : ''}`}
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            onInput={(event) => {
                                inputProps.onInput?.(event);
                                const { value } = event.currentTarget;

                                if (props.type === 'expiration') {
                                    if (value[value.length - 1] === '/') event.currentTarget.value = value.slice(0, -1);
                                    if (/\D/.test(value[value.length - 1]))
                                        event.currentTarget.value = value.slice(0, -1);
                                    else if (value.includes('/')) {
                                        if (value.indexOf('/') !== 2) {
                                            event.currentTarget.value =
                                                value.slice(0, value.indexOf('/')) +
                                                value.slice(value.indexOf('/') + 1);
                                            event.currentTarget.value =
                                                event.currentTarget.value.slice(0, 2) +
                                                '/' +
                                                event.currentTarget.value.slice(2);
                                        }
                                    } else if (value.length === 2) event.currentTarget.value = value + '/';
                                    else if (value.length === 3 && value[value.length - 1] !== '/')
                                        event.currentTarget.value = value.slice(0, -1) + '/';
                                }

                                if (value.length > event.currentTarget.maxLength && event.currentTarget.maxLength > 0)
                                    event.currentTarget.value = value.slice(0, event.currentTarget.maxLength);
                            }}
                        />
                        {isCustomCheckbox && (
                            <>
                                <div
                                    className={cn(
                                        `mr-4xs flex h-[.9375rem] w-[.9375rem] items-center justify-center border-[0.5px] border-gray-l0 bg-[#444444] text-section-xxs`,
                                        `peer-checked:bg-[#444444] peer-checked:text-primary peer-checked:before:text-primary peer-checked:before:content-['✔']`,
                                        classNameCheckbox,
                                    )}
                                />
                                <span
                                    hidden={!children}
                                    className={`${classNameLabel} ${isCustomCheckbox ? 'w-auto peer-checked:text-primary' : ''}`}
                                >
                                    {children}
                                </span>
                            </>
                        )}
                    </div>
                </label>
            );
    }
};

export { Input };
