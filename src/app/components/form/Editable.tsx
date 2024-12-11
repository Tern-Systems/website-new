import React, {ChangeEvent, FC, PropsWithChildren, ReactElement, useState} from "react";
import Image from "next/image";

import {Phone} from "@/app/context";

import {useForm} from "@/app/hooks/useForm";
import {Button, Input, Select, Switch} from "@/app/components/form";

import SVG_PENCIL from "@/assets/images/icons/edit-line.svg";


type PhoneData = { business: Phone | null; mobile: Phone | null; personal: Phone | null };
type FormData =
    | { value: string }
    | { currentPassword: string; newPassword: string; passwordConfirm: string }
    | { [P in keyof PhoneData]: NonNullable<PhoneData[P]> };

type Value =
    | { value: string; verify?: (formData: FormData) => Promise<void>; }
    | { options: Record<string, string>; value: string }
    | { isEmailAdded: boolean; isPhoneAdded: boolean; suggestedPhone: string | null }
    | PhoneData;

interface Props extends PropsWithChildren {
    type?: 'input' | 'select' | 'password' | '2FA' | 'phone';
    toggleType?: 'icon' | 'button',
    data: {
        className?: string;
        title?: string;
        value?: Value;
        onSave: (formData: FormData) => Promise<void>;
    };

    isToggleBlocked?: boolean;
    isSimpleSwitch?: boolean;
    keepChildrenOnEdit?: boolean;
    checkEmpty?: boolean;

    classNameToggle?: string;
    classNameWrapper?: string;
}

const Editable: FC<Props> = (props: Props) => {
    const {
        type, checkEmpty, toggleType, keepChildrenOnEdit, isSimpleSwitch, isToggleBlocked
        , classNameWrapper, classNameToggle, data, children
    } = props;

    // State
    let defaultFormValue: FormData;
    if (data.value === undefined)
        defaultFormValue = {currentPassword: '', newPassword: '', passwordConfirm: ''};
    else if ('value' in data.value)
        defaultFormValue = {value: data.value.value};
    else if ('business' in data.value) {
        const defaultPhone: Phone = {number: '', isPrimary: false}
        defaultFormValue = {
            business: data.value.business ?? {...defaultPhone, ext: ''},
            personal: data.value.personal ?? defaultPhone,
            mobile: data.value.mobile ?? defaultPhone,
        };
    } else
        defaultFormValue = {value: data.value.suggestedPhone ?? ''};

    const [isEditState, setEditState] = useState<boolean>(
        data.value !== undefined
        && 'isEmailAdded' in data.value
        && (data.value.isEmailAdded || data.value.isPhoneAdded)
    );
    const [formData, _, setFormState] = useForm<FormData>(defaultFormValue);
    const [waring, setWarning] = useState<string | null>(null);

    // handlers
    const toggleEditState = () => {
        setEditState(prevState => {
            if (prevState)
                setFormState(defaultFormValue);
            return !prevState;
        });
    }

    const handleUpdateClick = async () => {
        try {
            await data?.onSave(formData);
            toggleEditState();
        } catch (error: unknown) {
            if (typeof error === 'string')
                setWarning(error);
        }
    }

    // Elements
    const Hr = <hr className={'border-control3'}/>;

    const ControlBtns = (
        <span className={'block mt-[0.94rem] text-[0.875rem] font-bold'}>
            <Button
                className={'bg-control2 px-[1rem] h-[1.43rem] rounded-full mr-[0.75rem]'}
                onClick={() => toggleEditState()}
            >
                Cancel
            </Button>
            <Button
                disabled={
                    checkEmpty
                        ? Object.values(formData).some((value) => value?.length === 0)
                        : Object.entries(formData).every(([key, value]) =>
                            data.value?.[key as keyof typeof data.value] === null
                                ? JSON.stringify(defaultFormValue?.[key as keyof typeof defaultFormValue]) === JSON.stringify(value)
                                : JSON.stringify(data.value?.[key as keyof typeof data.value]) === JSON.stringify(value) && value
                        )
                }

                onClick={() => handleUpdateClick()}
                className={'bg-[#00397F] px-[1rem] h-[1.43rem] rounded-full disabled:bg-control2 disabled:text-form'}
            >
                Update
            </Button>
        </span>
    );

    const renderToggleBtn = () => {
        const isDisabled = isToggleBlocked || isEditState;

        return (
            <Button
                disabled={isDisabled}
                onClick={() => {
                    if (isSimpleSwitch)
                        data.onSave(formData);
                    toggleEditState();
                }}
                onMouseEnter={(event) => !isDisabled && (event.currentTarget.innerText = 'Enable')}
                onMouseLeave={(event) => !isDisabled && (event.currentTarget.innerText = 'Disabled')}
                className={`text-[0.75rem] font-oxygen py-[0.3rem] w-[4.26rem] rounded-[0.25rem] bg-[#0C545C] leading-none 
                            ${isDisabled ? '' : 'hover:bg-control3 hover:text-primary'}
                            ${classNameToggle} ${isEditState ? '[&]:bg-control3' : '[&]:bg-[#D9D9D9] text-form'}`}
            >
                {
                    isToggleBlocked
                        ? 'Enabled'
                        : isEditState
                            ? 'Enable'
                            : 'Disabled'
                }
            </Button>
        );
    }

    let EditToggle: ReactElement = toggleType === 'button'
        ? renderToggleBtn()
        : (
            <span
                onClick={() => toggleEditState()}
                className={`cursor-pointer font-neo text-[0.875rem] flex gap-[0.39rem] items-center ${classNameToggle}
                            ${isEditState ? 'hidden' : ''}`}
            >
                <span>Edit</span>
                <Image src={SVG_PENCIL} alt={'edit'} className={'size-[0.8125rem] brightness-[300%]'}/>
            </span>
        )
    ;

    // Form controls
    let Form: ReactElement | null = null;
    switch (type) {
        default:
        case 'input':
            if (!('value' in formData))
                break;

            Form = (
                <>
                    <span className={'flex items-center'}>
                        <Input
                            value={formData.value}
                            onChange={(event) => {
                                setWarning(null);
                                setFormState({value: event.currentTarget.value});
                            }}
                            className={data?.className}
                            classNameWrapper={'flex-col gap-y-[0.62rem] w-full'}
                            classNameLabel={'place-self-start text-[0.875rem]'}
                        >
                            {data?.title}
                        </Input>
                        <span
                            hidden={!data.value || !('verify' in data.value) || data.value.verify === undefined}
                            onClick={() => data.value && 'verify' in data.value && data.value.verify?.(formData)}
                            className={'cursor-pointer underline ml-[0.81rem] mt-[1.5rem]'}
                        >
                            Verify
                        </span>
                    </span>
                    <span hidden={!waring} className={'block mt-[1rem]'}>{waring}</span>
                    {ControlBtns}
                </>
            )
            break;
        case 'select':
            if (!('value' in formData) || !data.value || !('options' in data.value))
                break;
            Form = (
                <>
                    <Select
                        options={data.value.options}
                        value={formData.value}
                        placeholder={'Select'}
                        onChangeCustom={(value) => {
                            setWarning(null);
                            setFormState({value})
                        }}
                        classNameWrapper={'flex-col gap-y-[0.62rem]'}
                        classNameLabel={'self-start text-[0.875rem]'}
                        classNameOption={`${data?.className}`}
                        className={`${data?.className} rounded-[0.375rem]`}
                        // className={`px-[0.62rem] py-[0.8rem] bg-white border-small rounded-[0.375rem] border-control3 mb-[0.94rem]`}
                        required
                    >
                        {data?.title}
                    </Select>
                    {ControlBtns}
                </>
            )
            break;
        case 'password':
            if (typeof formData !== 'object' || !('currentPassword' in formData))
                break;
            Form = (
                <>
                    <Input
                        type={'password'}
                        value={formData.currentPassword}
                        onChange={(event) => {
                            setWarning(null);
                            const currentPassword = event.currentTarget.value;
                            setFormState(prevState => ({...prevState, currentPassword}))
                        }}
                        className={data?.className}
                        classNameWrapper={'flex-col gap-y-[0.62rem]'}
                        classNameLabel={'place-self-start text-[0.875rem]'}

                    >
                        Current Password
                    </Input>
                    {Hr}
                    <Input
                        type={'password'}
                        value={formData.newPassword}
                        onChange={(event) => {
                            setWarning(null);
                            const newPassword = event.currentTarget.value;
                            setFormState(prevState => ({...prevState, newPassword}))
                        }}
                        className={data?.className}
                        classNameWrapper={'flex-col gap-y-[0.62rem]'}
                        classNameLabel={'place-self-start text-[0.875rem]'}
                    >
                        New Password
                    </Input>
                    <ul className={'grid grid-cols-2 list-disc ml-[2rem] text-[0.75rem]'}>
                        <li>Minimum of 9 characters</li>
                        <li>One uppercase letter</li>
                        <li>One lowercase letter</li>
                        <li>One number</li>
                    </ul>
                    <Input
                        type={'password'}
                        value={formData.passwordConfirm}
                        onChange={(event) => {
                            setWarning(null);
                            const passwordConfirm = event.currentTarget.value;
                            setFormState(prevState => ({...prevState, passwordConfirm}))
                        }}
                        className={data?.className}
                        classNameWrapper={'flex-col gap-y-[0.62rem] mt-[0.31rem]'}
                        classNameLabel={'place-self-start text-[0.875rem]'}
                    >
                        Confirm New Password
                    </Input>
                    <span hidden={!waring}>{waring}</span>
                    {ControlBtns}
                </>
            );
            break;
        case '2FA':
            if (!('value' in formData) || !data.value || !('isEmailAdded' in data.value))
                break;
            Form = (
                <>
                    {children}
                    <hr className={'border-control3'}/>
                    <div className={'flex justify-between'}>
                        <Editable
                            toggleType={'button'}
                            keepChildrenOnEdit
                            isSimpleSwitch
                            data={{
                                className: 'bg-control2 py-[0.35rem] w-full rounded-[0.375rem] px-[0.76rem] border-small border-control4',
                                title: 'Add your Email as a two-factor authentication option',
                                onSave: data.onSave
                            }}
                        >
                            Email
                        </Editable>
                    </div>
                    <div className={'flex justify-between'}>
                        <Editable
                            toggleType={'button'}
                            keepChildrenOnEdit
                            checkEmpty
                            data={{
                                className: 'bg-control2 py-[0.35rem] w-full rounded-[0.375rem] px-[0.76rem] border-small border-control4',
                                title: 'Add your Phone as a two-factor authentication option',
                                value: data.value.isPhoneAdded ? {value: ''} : formData,
                                onSave: data.onSave
                            }}
                        >
                            Phone Number
                        </Editable>
                    </div>
                </>
            );
            EditToggle = (
                <Switch
                    state={isEditState}
                    handleSwitch={() => toggleEditState()}
                />
            );
            break;
        case 'phone':
            if (!('business' in formData))
                break;

            const requireOnChange = (key: keyof PhoneData, subKey: string, isCheckBox?: boolean) => {
                return (event: ChangeEvent<HTMLInputElement>) => {
                    setWarning(null);
                    const value = isCheckBox ? event.currentTarget.checked : event.currentTarget.value;
                    setFormState((prevState) => 'business' in prevState
                        ? ({
                            ...prevState,
                            [key]: {...prevState[key], [subKey]: value}
                        })
                        : prevState
                    );
                }
            }

            Form = (
                <>
                    <span className={'grid grid-cols-[3fr,1fr] gap-x-[0.62rem]'}>
                        <Input
                            type={'number'}
                            value={formData.business?.number ?? ''}
                            maxLength={10}
                            onChange={requireOnChange('business', 'number')}
                            className={data?.className}
                            classNameWrapper={'flex-col gap-y-[0.62rem] w-full'}
                            classNameLabel={'place-self-start text-[0.875rem]'}
                        >
                            Business
                        </Input>
                        <Input
                            type={'number'}
                            value={'ext' in formData.business ? formData.business?.ext : ''}
                            maxLength={4}
                            onChange={requireOnChange('business', 'ext')}
                            className={data?.className}
                            classNameWrapper={'flex-col gap-y-[0.62rem] w-full'}
                            classNameLabel={'place-self-start text-[0.875rem]'}
                        >
                            Ext
                        </Input>
                    </span>
                    <Input
                        type={'checkbox'}
                        checked={formData.business?.isPrimary ?? false}
                        onChange={requireOnChange('business', 'isPrimary', true)}
                        classNameWrapper={'flex-row-reverse place-self-start mt-[0.81rem]'}
                        classNameLabel={'text-[0.875rem]'}
                    >
                        Set as primary
                    </Input>
                    <Input
                        type={'number'}
                        value={formData.mobile?.number ?? ''}
                        maxLength={10}
                        onChange={requireOnChange('mobile', 'number')}
                        className={data?.className}
                        classNameWrapper={'flex-col gap-y-[0.62rem] w-full mt-[1.13rem]'}
                        classNameLabel={'place-self-start text-[0.875rem]'}
                    >
                        Mobile
                    </Input>
                    <Input
                        type={'checkbox'}
                        checked={formData.mobile?.isPrimary ?? false}
                        onChange={requireOnChange('mobile', 'isPrimary', true)}
                        classNameWrapper={'flex-row-reverse place-self-start mt-[0.81rem]'}
                        classNameLabel={'text-[0.875rem]'}
                    >
                        Set as primary
                    </Input>
                    <Input
                        type={'number'}
                        value={formData.personal?.number ?? ''}
                        maxLength={10}
                        onChange={requireOnChange('personal', 'number')}
                        className={data?.className}
                        classNameWrapper={'flex-col gap-y-[0.62rem] w-full mt-[1.13rem]'}
                        classNameLabel={'place-self-start text-[0.875rem]'}
                    >
                        Personal
                    </Input>
                    <Input
                        type={'checkbox'}
                        checked={formData.personal?.isPrimary ?? false}
                        onChange={requireOnChange('personal', 'isPrimary', true)}
                        classNameWrapper={'flex-row-reverse place-self-start mt-[0.81rem]'}
                        classNameLabel={'text-[0.875rem]'}
                    >
                        Set as primary
                    </Input>
                    <span hidden={!waring} className={'first-letter:capitalize mt-[1rem]'}>{waring}</span>
                    {ControlBtns}
                </>
            );
            break
    }

    const isFormShown = isEditState && Form && !isSimpleSwitch;

    if (keepChildrenOnEdit) {
        return (
            <div className={'w-full'}>
                <div
                    className={`flex justify-between ${isFormShown ? 'mb-[0.94rem]' : ''}`}>{children}{EditToggle}</div>
                {isFormShown ? Form : null}
            </div>
        );
    } else {
        return (
            <>
                <div className={`${classNameWrapper} flex flex-col`}>
                    {isFormShown ? Form : children}
                </div>
                {isEditState && Form && type !== '2FA' ? null : EditToggle}
            </>
        )
    }
}

export {Editable}