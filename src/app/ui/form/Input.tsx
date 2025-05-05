'use client';

import { FC, InputHTMLAttributes, MutableRefObject, ReactElement, RefObject, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ReactSVG } from 'react-svg';
import Image from 'next/image';
import cn from 'classnames';

import styles from '@/app/common.module.css';

import SVG_UPLOAD from '@/assets/images/icons/upload.svg';
import SVG_COLOR_PICKER_BORDER from '@/assets/images/color-picker-border.svg';
import SVG_EYE from '@/assets/images/icons/eye.svg';

type Icon = string | IconProp;

type InputProps = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;
interface Props extends Omit<InputProps, 'pattern' | 'type'> {
    type?: InputProps['type'] | 'expiration' | 'text-only';
    wrapper?: string;
    label?: string;
    classNameIcon?: string;
    icons?: Icon[];
    classNameIconSpan?: string;
}

const Input: FC<Props> = (props: Props) => {
    const { children, wrapper, label, className, classNameIcon, icons, classNameIconSpan, ...inputProps } = props;

    const inputRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

    switch (props.type) {
        case 'file':
            return (
                <label
                    htmlFor={props.id}
                    className={cn(
                        `relative flex w-full cursor-pointer items-center justify-center`,
                        wrapper,
                        styles.clickable,
                    )}
                >
                    <ReactSVG
                        src={SVG_UPLOAD.src}
                        className={`mr-5xs size-l ${classNameIcon}`}
                    />
                    {children ? (
                        <span className={cn(label, 'overflow-hidden overflow-ellipsis text-nowrap leading-n')}>
                            {children}
                        </span>
                    ) : null}
                    <input
                        {...inputProps}
                        className={cn(`absolute bottom-0 -z-10 h-1 w-1 hover:hidden`, className)}
                    />
                </label>
            );
        case 'color':
            return (
                <label
                    htmlFor={props.id}
                    className={cn(`flex cursor-pointer items-center justify-between`, wrapper)}
                >
                    {children ? <span className={cn(`capitalize`, label)}>{children}</span> : null}
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
            return props.hidden ? null : (
                <label
                    className={cn(
                        `relative flex cursor-pointer flex-col items-start gap-x-[min(1.7dvw,0.4rem)] text-left last-of-type:mb-0 `,
                        wrapper,
                    )}
                >
                    {children ? <span className={label}>{children}</span> : null}
                    <textarea
                        {...inputProps}
                        className={cn(`min-h-[9.25rem] p-xxs`, className)}
                    />
                </label>
            );
        default:
            const isPassword = props.type === 'password';
            const isCheckbox = props.type === 'checkbox';

            const inputIcons: Icon[] = isPassword ? [SVG_EYE] : (icons ?? []);
            const IconsSVGs: ReactElement[] = inputIcons.map((icon, idx) => {
                if (typeof icon === 'string') {
                    const alt = JSON.stringify(icon) + idx;
                    return (
                        <Image
                            key={alt}
                            src={icon}
                            alt={alt}
                            className={cn(`max-w-[min(6.4dvw,1.5rem)]`, classNameIcon)}
                        />
                    );
                } else {
                    return (
                        <FontAwesomeIcon
                            key={idx}
                            icon={icon}
                            className={cn(`max-w-[min(6.4dvw,1.5rem)]`, classNameIcon)}
                        />
                    );
                }
            });

            return props.hidden ? null : (
                <label
                    className={cn(
                        `relative flex cursor-pointer items-center gap-x-4xs-2 text-left last-of-type:mb-0`,
                        wrapper,
                    )}
                >
                    {children ? <span className={label}>{children}</span> : null}
                    <div className={cn(`relative flex items-center`, { ['w-full']: !isCheckbox })}>
                        {IconsSVGs ? (
                            <span
                                className={cn(
                                    'absolute right-0 flex gap-[min(0.6dvw,0.135rem)] pr-[min(3.5dvw,0.81rem)]',
                                    classNameIconSpan,
                                )}
                                onClick={() => {
                                    if (inputRef.current)
                                        inputRef.current.setAttribute(
                                            'type',
                                            ['text', 'password'][
                                                +(isPassword && inputRef.current?.type !== 'password')
                                            ],
                                        );
                                }}
                            >
                                {IconsSVGs}
                            </span>
                        ) : null}
                        <input
                            {...inputProps}
                            className={cn(
                                {
                                    [cn(
                                        inputProps.checked ? 'appearance-auto' : 'appearance-none',
                                        'min-w-5xs size-5xs mr-4xs',
                                        'border-s border-gray-l0 bg-gray-d2',
                                    )]: isCheckbox,
                                },
                                'pl-3xs',
                                className,
                            )}
                            ref={inputRef as RefObject<HTMLInputElement>}
                            onKeyDown={(event) => {
                                const check = props.type === 'text-only';
                                if (check && !/[a-z\s]/i.test(event.key) && event.key !== 'Backspace')
                                    event.preventDefault();
                            }}
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
                    </div>
                </label>
            );
    }
};

Input.displayName = Input.name;

export type { Props as InputProps };
export { Input };
