import React, {
    ChangeEvent,
    Dispatch,
    FC,
    FormEvent,
    PropsWithChildren,
    ReactElement,
    SetStateAction,
    useState
} from "react";
import Image from "next/image";

import {NonNullableKeys} from "@/app/types/utils";
import {INDUSTRY, IndustryKey, JOB_FUNCTION, JobFunctionKey, SUB_INDUSTRY, SubIndustryKey} from "@/app/static/company";
import {COUNTRY, SALUTATION, STATE_PROVINCE} from "@/app/static";

import {Address, FullName, Phone, UserAddress, UserPhone, Company} from "@/app/context/User.context";

import {copyObject} from "@/app/utils";
import {useForm} from "@/app/hooks";

import {Button, Input, Select, Switch} from "@/app/ui/form";

import SVG_PENCIL from "@/assets/images/icons/edit-line.svg";


const DEFAULT_PHONE: Phone = {number: '', isPrimary: false};
const DEFAULT_ADDRESS: Address = {
    line1: '',
    line2: '',
    city: '',
    zip: '',
    state: '',
    isPrimary: false,
    country: '',
}


type FormData =
    | { value: string | null }
    | { currentPassword: string; newPassword: string; passwordConfirm: string }
    | NonNullableKeys<UserPhone>
    | FullName
    | UserAddress
    | Company;

type Value =
    | { value: string; verify?: (formData: FormData) => Promise<void>; }
    | { value: string | null }
    | { isEmailAdded: boolean; isPhoneAdded: boolean; suggestedPhone: string | null }
    | UserPhone
    | FullName
    | UserAddress
    | Company;

type DataBase = {
    className?: string;
    title?: string;
    onSave: (formData: FormData) => Promise<void>;
    value: Value | null;
}

interface Props extends PropsWithChildren {
    type?: 'input' | 'select' | 'password' | '2FA' | 'phone' | 'name' | 'address' | 'company';
    toggleType?: 'icon' | 'button',
    data: DataBase | DataBase & { options: Record<string, string> }

    setParentEditState?: Dispatch<SetStateAction<boolean>>;

    isToggleBlocked?: boolean;
    isSimpleSwitch?: boolean;
    keepChildrenOnEdit?: boolean;
    checkEmpty?: boolean;

    classNameToggle?: string;
    classNameWrapper?: string;
}

const Editable: FC<Props> = (props: Props) => {
    const {
        type, checkEmpty, toggleType, keepChildrenOnEdit,
        isSimpleSwitch, isToggleBlocked, setParentEditState
        , classNameWrapper, classNameToggle, data, children
    } = props;


    // State
    let defaultFormValue: FormData;
    if (data.value === null)
        if (isSimpleSwitch)
            defaultFormValue = {value: 'false'}
        else
            defaultFormValue = {currentPassword: '', newPassword: '', passwordConfirm: ''};
    else if ('business' in data.value) {
        defaultFormValue = {
            business: data.value.business ? copyObject(data.value.business) : {...DEFAULT_PHONE, ext: ''},
            personal: data.value.personal ? copyObject(data.value.personal) : DEFAULT_PHONE,
            mobile: data.value.mobile ? copyObject(data.value.mobile) : DEFAULT_PHONE,
        };
    } else if ('isEmailAdded' in data.value)
        defaultFormValue = {value: data.value.suggestedPhone ?? ''};
    else if ('personalAddress' in data.value) {
        defaultFormValue = copyObject({
            ...data.value,
            businessAddress: data.value.businessAddress ? data.value.businessAddress : DEFAULT_ADDRESS
        });
    } else
        defaultFormValue = copyObject(data.value);

    const [isEditState, setEditState] = useState<boolean>(
        data.value !== null
        && 'isEmailAdded' in data.value
        && (data.value.isEmailAdded || data.value.isPhoneAdded)
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [formData, _, setFormState] = useForm<FormData>(defaultFormValue);
    const [waring, setWarning] = useState<string | null>(null);

    // handlers
    const toggleEditState = () => {
        setEditState(prevState => {
            if (prevState)
                setFormState(defaultFormValue);
            setParentEditState?.(!prevState);
            return !prevState;
        });
    }

    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            await data?.onSave(formData);
            toggleEditState();
        } catch (error: unknown) {
            if (typeof error === 'string')
                setWarning(error);
        }
    }

    const checkUpdateBtnDisabledState = () => {
        if (checkEmpty)
            return Object.values(formData).some((value) => value?.length === 0);
        return Object.entries(formData).every(([key, value]) => {
            const dataValue = data.value?.[key as keyof typeof data.value];
            return dataValue === null || dataValue === undefined || dataValue === ''
                ? JSON.stringify(defaultFormValue?.[key as keyof typeof defaultFormValue]) === JSON.stringify(value)
                : JSON.stringify(dataValue) === JSON.stringify(value) && value !== ''
        })
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
                type={'submit'}
                disabled={checkUpdateBtnDisabledState()}
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
                onClick={() => !isToggleBlocked && toggleEditState()}
                className={`cursor-pointer font-neo text-[0.875rem] flex gap-[0.39rem] items-center ${classNameToggle}
                            ${isEditState ? 'hidden' : ''}`}
            >
                <span>Edit</span>
                <Image src={SVG_PENCIL} alt={'edit'} className={'size-[0.8125rem] brightness-[300%]'}/>
            </span>
        );

    // Styles
    const CHECKBOX_CN = {
        classNameWrapper: 'flex-row-reverse place-self-start',
        classNameLabel: 'text-[0.875rem]',
    }
    const SELECT_CN = {
        classNameWrapper: 'flex-col gap-y-[0.62rem]',
        classNameLabel: 'self-start text-[0.875rem]',
        className: `${data?.className} rounded-[0.375rem]`,
        classNameOption: `${data?.className} rounded-none`,
    }
    const INPUT_CN = {
        className: data?.className,
        classNameWrapper: 'flex-col gap-y-[0.62rem] w-full',
        classNameLabel: 'place-self-start text-[0.875rem]',
    }

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
                            value={formData.value ?? ''}
                            onChange={(event) => {
                                setWarning(null);
                                setFormState({value: event.currentTarget.value});
                            }}
                            {...INPUT_CN}
                            required
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
                    <span className={`block mt-[1rem] ${waring ? '' : 'hidden'}`}>{waring}</span>
                    {ControlBtns}
                </>
            )
            break;
        case 'select':
            if (!('value' in formData) || !('options' in data))
                break;
            Form = (
                <>
                    <Select
                        options={data.options}
                        value={formData.value ?? ''}
                        placeholder={'Select'}
                        onChangeCustom={(value) => setFormState({value})}
                        {...SELECT_CN}
                        classNameOption={data?.className}
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
                        {...INPUT_CN}
                        required
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
                        {...INPUT_CN}
                        required
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
                        {...INPUT_CN}
                        required
                    >
                        Confirm New Password
                    </Input>
                    <span className={waring ? '' : 'hidden'}>{waring}</span>
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
                                value: null,
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

            const requireOnChangePhone = (key: keyof UserPhone, subKey: string, isCheckBox?: boolean) => {
                return (event: ChangeEvent<HTMLInputElement>) => {
                    setWarning(null);
                    const value = isCheckBox ? event.currentTarget.checked : event.currentTarget.value;
                    setFormState((prevState) => 'business' in prevState
                        ? ({...prevState, [key]: {...prevState[key], [subKey]: value}})
                        : prevState
                    );
                }
            }

            Form = (
                <div className={'flex flex-col gap-y-[0.81rem]'}>
                    <span className={'grid grid-cols-[2fr,1fr] gap-x-[0.62rem]'}>
                        <Input
                            type={'number'}
                            value={formData.business?.number ?? ''}
                            maxLength={10}
                            onChange={requireOnChangePhone('business', 'number')}
                            {...INPUT_CN}
                            required
                        >
                            Business
                        </Input>
                        <Input
                            type={'number'}
                            value={'ext' in formData.business ? formData.business?.ext : ''}
                            maxLength={4}
                            onChange={requireOnChangePhone('business', 'ext')}
                            {...INPUT_CN}
                            required
                        >
                            Ext
                        </Input>
                    </span>
                    <Input
                        type={'checkbox'}
                        checked={formData.business?.isPrimary ?? false}
                        onChange={requireOnChangePhone('business', 'isPrimary', true)}
                        {...CHECKBOX_CN}
                        required
                    >
                        Set as primary
                    </Input>
                    <Input
                        type={'number'}
                        value={formData.mobile?.number ?? ''}
                        maxLength={10}
                        onChange={requireOnChangePhone('mobile', 'number')}
                        {...INPUT_CN}
                        required
                    >
                        Mobile
                    </Input>
                    <Input
                        type={'checkbox'}
                        checked={formData.mobile?.isPrimary ?? false}
                        onChange={requireOnChangePhone('mobile', 'isPrimary', true)}
                        {...CHECKBOX_CN}
                        required
                    >
                        Set as primary
                    </Input>
                    <Input
                        type={'number'}
                        value={formData.personal?.number ?? ''}
                        maxLength={10}
                        onChange={requireOnChangePhone('personal', 'number')}
                        {...INPUT_CN}
                        required
                    >
                        Personal
                    </Input>
                    <Input
                        type={'checkbox'}
                        checked={formData.personal?.isPrimary ?? false}
                        onChange={requireOnChangePhone('personal', 'isPrimary', true)}
                        {...CHECKBOX_CN}
                        required
                    >
                        Set as primary
                    </Input>
                    <span className={`first-letter:capitalize mt-[1rem] ${waring ? '' : 'hidden'}`}>{waring}</span>
                    {ControlBtns}
                </div>
            );
            break
        case 'name':
            if (!('initial' in formData) || !('options' in data))
                break;
            Form = (
                <div className={'flex flex-col gap-y-[0.94rem]'}>
                    <Select
                        options={SALUTATION}
                        value={formData.salutation}
                        placeholder={'Select'}
                        onChangeCustom={(value) =>
                            setFormState(prevState => ({...prevState, salutation: value as keyof typeof SALUTATION}))}
                        {...SELECT_CN}
                        required
                    >
                        Salutations
                    </Select>
                    <span className={'grid grid-cols-[2fr,1fr] gap-x-[0.62rem]'}>
                        <Input
                            value={formData.firstname}
                            onChange={(event) => {
                                const firstname = event.currentTarget.value;
                                setFormState(prevState => ({...prevState, firstname}))
                            }}
                            {...INPUT_CN}
                            required
                        >
                            First Name
                        </Input>
                        <Input
                            value={formData.initial}
                            onChange={(event) => {
                                const initial = event.currentTarget.value;
                                setFormState(prevState => ({...prevState, initial}))
                            }}
                            {...INPUT_CN}
                        >
                            Initial (optional)
                        </Input>
                    </span>
                    <Input
                        value={formData.lastname}
                        onChange={(event) => {
                            const lastname = event.currentTarget.value;
                            setFormState(prevState => ({...prevState, lastname}))
                        }}
                        {...INPUT_CN}
                        required
                    >
                        Last Name
                    </Input>
                    {ControlBtns}
                </div>
            );
            break;
        case 'address':
            if (!('businessAddress' in formData))
                break;

            const requireOnChangeAddress = (key: keyof UserAddress, subKey: keyof Address, isCheckBox?: boolean) => {
                return (value: ChangeEvent<HTMLInputElement> | string) => {
                    setWarning(null);
                    const formValue = typeof value === 'string'
                        ? value
                        : isCheckBox
                            ? value.currentTarget.checked
                            : value.currentTarget.value;
                    setFormState((prevState) => 'businessAddress' in prevState
                        ? ({...prevState, [key]: {...prevState[key], [subKey]: formValue}})
                        : prevState
                    );
                }
            }

            const renderAddressForm = (key: keyof UserAddress) => {
                const isPersonal = key === 'personalAddress';
                if (!formData[key])
                    return <></>;

                return (
                    <>
                        <span className={`grid grid-cols-[repeat(2,minmax(0,1fr))] gap-x-[0.62rem] gap-y-[1.25rem] mb-[0.62rem]
                                            ${isPersonal ? 'mt-[1.25rem] bg-[#686868] p-[0.81rem] rounded-[0.5625rem]' : 'mt-[0.94rem]'}`}>
                            <span className={'flex col-span-2 capitalize text-[0.875rem] justify-between'}>
                                <span>{key.slice(0, 'Address'.length + 1)} Address</span>
                                <span
                                    onClick={() =>
                                        setFormState(prevState => ({...prevState, personalAddress: null}))}
                                    className={isPersonal ? 'underline cursor-pointer' : 'hidden'}
                                >
                                    Delete
                                </span>
                            </span>
                            <Select
                                options={COUNTRY}
                                value={formData[key].country ?? ''}
                                placeholder={'Select'}
                                onChangeCustom={(value) => requireOnChangeAddress(key, 'country')(value)}
                                {...SELECT_CN}
                                required
                            >
                                Country / Region
                            </Select>
                            <Select
                                options={STATE_PROVINCE[formData[key].country]}
                                value={formData[key]?.state ?? ''}
                                placeholder={'Select'}
                                onChangeCustom={(value) => requireOnChangeAddress(key, 'state')(value)}
                                {...SELECT_CN}
                                required
                            >
                                State / Province
                            </Select>
                            <Input
                                value={formData[key]?.line1 ?? ''}
                                onChange={requireOnChangeAddress(key, 'line1')}
                                {...INPUT_CN}
                                classNameWrapper={INPUT_CN.classNameWrapper + ' col-span-2'}
                                required
                            >
                                Street Address #1
                            </Input>
                            <Input
                                value={formData[key]?.line2 ?? ''}
                                onChange={requireOnChangeAddress(key, 'line2')}
                                {...INPUT_CN}
                                classNameWrapper={INPUT_CN.classNameWrapper + ' col-span-2'}
                                required
                            >
                                Street Address #2
                            </Input>
                            <Input
                                value={formData[key]?.city ?? ''}
                                onChange={requireOnChangeAddress(key, 'city')}
                                {...INPUT_CN}
                                required
                            >
                                City / Locality
                            </Input>
                            <Input
                                value={formData[key]?.zip ?? ''}
                                onChange={requireOnChangeAddress(key, 'zip')}
                                {...INPUT_CN}
                                required
                            >
                                Postal / ZIP Code
                            </Input>
                        </span>
                        <Input
                            type={'checkbox'}
                            checked={formData[key]?.isPrimary ?? false}
                            onChange={requireOnChangeAddress(key, 'isPrimary', true)}
                            {...CHECKBOX_CN}
                        >
                            Set as primary
                        </Input>
                        <span
                            onClick={() =>
                                setFormState(prevState => ({...prevState, personalAddress: DEFAULT_ADDRESS}))}
                            className={`underline cursor-pointer text-[0.875rem] mt-[1.25rem]
                                        ${isPersonal || formData.personalAddress !== null ? 'hidden' : ''}`}
                        >
                            Add a Personal Address
                        </span>
                    </>
                )
            }
            Form = (
                <>
                    {renderAddressForm('businessAddress')}
                    {formData.personalAddress ? renderAddressForm('personalAddress') : null}
                    {ControlBtns}
                </>
            );
            break;
        case 'company':
            if (!('jobTitle' in formData))
                break;

            Form = (
                <div className={'flex flex-col gap-y-[1.25rem]'}>
                    <Input
                        value={formData.jobTitle ?? ''}
                        onChange={(event) => {
                            const jobTitle = event.currentTarget.value;
                            setFormState(prevState => ({...prevState, jobTitle}));
                        }}
                        {...INPUT_CN}
                        classNameWrapper={INPUT_CN.classNameWrapper + ' col-span-2'}
                        required
                    >
                        Job Title
                    </Input>
                    <Select
                        options={JOB_FUNCTION}
                        value={formData.jobFunction ?? ''}
                        placeholder={'Select'}
                        onChangeCustom={(value) =>
                            setFormState(prevState => ({...prevState, jobFunction: value as JobFunctionKey}))}
                        {...SELECT_CN}
                        required
                    >
                        Job Function
                    </Select>
                    <Select
                        options={INDUSTRY}
                        value={formData.industry ?? ''}
                        placeholder={'Select'}
                        onChangeCustom={(value) =>
                            setFormState(prevState => ({...prevState, industry: value as IndustryKey}))}
                        {...SELECT_CN}
                        required
                    >
                        Industry
                    </Select>
                    <Select
                        options={SUB_INDUSTRY[formData.industry]}
                        value={formData.subIndustry ?? ''}
                        placeholder={'Select'}
                        onChangeCustom={(value) =>
                            setFormState(prevState => ({...prevState, subIndustry: value as SubIndustryKey}))}
                        {...SELECT_CN}
                        required
                    >
                        Industry
                    </Select>
                    {ControlBtns}
                </div>
            );
            break;
    }

    const isFormShown = isEditState && Form && !isSimpleSwitch;

    if (keepChildrenOnEdit) {
        return (
            <form onSubmit={handleFormSubmit} className={'w-full'}>
                <div
                    className={`flex justify-between ${isFormShown ? 'mb-[0.94rem]' : ''}`}>{children}{EditToggle}</div>
                {isFormShown ? Form : null}
            </form>
        );
    } else {
        return (
            <>
                <form onSubmit={handleFormSubmit} className={`${classNameWrapper} flex flex-col`}>
                    {isFormShown ? Form : children}
                </form>
                {isEditState && Form && type !== '2FA' ? null : EditToggle}
            </>
        )
    }
}

export {
    Editable
}