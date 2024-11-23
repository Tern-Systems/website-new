import {useState} from "react";

const useForm = <T extends object>(defaultValue: T): [T, (key: keyof T, value: string) => void] => {
    const [formValue, setFormValue] = useState<T>(defaultValue);

    const setFormValueHelper = (key: keyof T, value: string): void =>
        setFormValue(prevState => ({...prevState, [key]: value}));

    return [formValue, setFormValueHelper];
}

export {useForm}