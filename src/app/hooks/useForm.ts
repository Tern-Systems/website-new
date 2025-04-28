'use client';

import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

type FormElement = Pick<HTMLInputElement, 'type' | 'value'> & Partial<Pick<HTMLInputElement, 'checked'>>;
type SetFunction<T extends object> = (
    key: keyof T,
    value?: string,
) => <E extends FormElement>(event: ChangeEvent<E> | string) => void;

const useForm = <T extends object>(
    defaultValue: T,
    onChange?: () => void,
): [T, SetFunction<T>, Dispatch<SetStateAction<T>>] => {
    const [formValue, setFormValue] = useState<T>(defaultValue);

    const setFormValueHelper = (key: keyof T, value?: string) => {
        if (value !== undefined) setFormValue((prevState) => ({ ...prevState, [key]: value }));

        return <E extends FormElement>(event: ChangeEvent<E> | string) => {
            const value =
                typeof event === 'string'
                    ? event
                    : event.target[event.target.type === 'checkbox' ? 'checked' : 'value'];
            setFormValue((prevState) => ({ ...prevState, [key]: value }));
            onChange?.();
        };
    };

    return [formValue, setFormValueHelper, setFormValue];
};

export { useForm };
