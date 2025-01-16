import React, {
    ChangeEvent,
    Dispatch,
    FC,
    FormEvent,
    PropsWithChildren,
    ReactElement,
    SetStateAction,
    useEffect,
    useState
} from "react";
import {ReactSVG} from "react-svg";
import {v4} from "uuid";

import {KeysOfUnion, NonNullableKeys} from "@/app/types/utils";
import {INDUSTRY, IndustryKey, JOB_FUNCTION, JobFunctionKey, SUB_INDUSTRY, SubIndustryKey} from "@/app/static/company";
import {COUNTRY, SALUTATION, STATE_PROVINCE} from "@/app/static";

import {Address, Company, FullName, Phone, UserAddress, UserPhone} from "@/app/context/User.context";

import {copyObject} from "@/app/utils";
import {useForm} from "@/app/hooks";
import {useModal} from "@/app/context";

import {Button, Input, Select, Switch} from "@/app/ui/form";
import {RemoveProfilePictureModal} from "@/pages/profile/RemoveProfilePictureModal";

import SVG_PENCIL from "/public/images/icons/edit-line.svg";


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


const FA2_INPUT_CN = 'bg-control-gray-l0 py-[min(1.7dvw,0.35rem)] w-full rounded-smallest px-[min(16dvw,0.76rem)] border-small border-control-white';
const CHECKBOX_CN = {
    classNameWrapper: 'flex-row-reverse place-self-start',
    classNameLabel: 'text-small',
}


type EditableFormData =
    | { value: string | null }
    | { currentPassword: string; newPassword: string; passwordConfirm: string }
    | { file: File | null, fileName: string | null }
    | NonNullableKeys<UserPhone>
    | FullName
    | UserAddress
    | Company;

type Value =
    | { value: string; verify?: (formData: EditableFormData) => Promise<void>; }
    | { value: string | null }
    | { file: File | null, fileName: string | null }
    | { isEmailAdded: boolean; isPhoneAdded: boolean; suggestedPhone: string | null }
    | UserPhone
    | FullName
    | UserAddress
    | Company;

type DataBase = {
    className?: string;
    title?: string;
    onSave: (formData: EditableFormData) => Promise<void>;
    onSwitch?: (state: boolean) => Promise<void>;
    value: Value | null;
}


interface Props extends PropsWithChildren {
    type?: 'input' | 'select' | 'password' | '2FA' | 'phone' | 'name' | 'address' | 'image' | 'company';
    toggleType?: 'icon' | 'button',
    data: DataBase | DataBase & { options: Record<string, string> }

    setParentEditID?: Dispatch<SetStateAction<string | null>>;
    parentEditID?: string | null;

    toggleBlocked?: boolean;
    simpleSwitch?: boolean;
    keepChildrenOnEdit?: boolean;
    checkEmpty?: boolean;

    classNameToggle?: string;
    classNameWrapper?: string;
}

const Editable: FC<Props> = (props: Props) => {
    const {
        type, checkEmpty, toggleType, keepChildrenOnEdit, toggleBlocked,
        simpleSwitch, parentEditID, setParentEditID,
        classNameWrapper, classNameToggle, data, children
    } = props;

    const modalCtx = useModal();

    // State
    let defaultFormValue: EditableFormData;
    if (data.value === null)
        if (simpleSwitch)
            defaultFormValue = {value: false.toString()}
        else
            defaultFormValue = {currentPassword: '', newPassword: '', passwordConfirm: ''};
    else if ('fileName' in data.value) {
        defaultFormValue = {file: null, fileName: data.value.fileName};
    } else if ('business' in data.value) {
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

    const [editID, setEditID] = useState<string | null>(null);
    const [isEditState, setIsEditState] = useState<boolean>(
        data.value !== null
        && 'isEmailAdded' in data.value
        && data.value.isPhoneAdded
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [formData, _, setFormState] = useForm<EditableFormData>(defaultFormValue);
    const [waring, setWarning] = useState<string | null>(null);

    useEffect(() => {
        setIsEditState(parentEditID === editID);
    }, [parentEditID, editID])

    useEffect(() => {
        setEditID(v4())
    }, [])

    // handlers
    const toggleEditState = () => {
        setIsEditState(prevState => {
            console.log(defaultFormValue)
            if (prevState)
                setFormState(defaultFormValue);
            else
                setParentEditID?.(editID);
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
    const Hr = <hr className={'border-control-white-d0'}/>;

    const CancelBtn = (
        <Button
            type={"reset"}
            className={'bg-control-gray-l0 px-[--1drs] h-full rounded-full'}
            onClick={() => toggleEditState()}
        >
            Cancel
        </Button>

    );
    const ControlBtns = (
        <span
            className={`flex gap-x-[min(1dvw,0.75rem)] h-[--h-control] mt-[min(1.3dvw,0.95rem)] text-small font-bold`}>
            {CancelBtn}
            <Button
                type={'submit'}
                disabled={checkUpdateBtnDisabledState()}
                className={'bg-control-navy px-[--1drs] rounded-full disabled:bg-control-gray-l0 disabled:text-gray'}
            >
                Update
            </Button>
        </span>
    );

    const renderToggleBtn = () => {
        const isDisabled = toggleBlocked || isEditState;
        return (
            <Button
                disabled={isDisabled}
                onClick={() => {
                    if (simpleSwitch)
                        data.onSave(formData);
                    toggleEditState();
                }}
                onMouseEnter={(event) => !isDisabled && (event.currentTarget.innerText = 'Enable')}
                onMouseLeave={(event) => !isDisabled && (event.currentTarget.innerText = 'Disabled')}
                className={`text-note font-oxygen py-[0.3rem] px-[--s-dl-small] rounded-smallest1 box-content
                    ${parentEditID ? '!bg-[#0C545C] !text-[#ECF0F3] ' : ''}
                    ${!isDisabled ? 'hover:bg-control-blue hover:text-primary' : ''}
                    ${classNameToggle} ${isEditState ? '[&]:bg-control-blue' : '[&]:bg-control-white-d0 text-gray'}`}
            >
                {
                    parentEditID
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
                className={`cursor-pointer text-small flex gap-[0.4rem] items-center ${classNameToggle} place-self-end self-start
                            ${isEditState ? 'hidden' : ''}`}
            >
                <span className={'hidden lg:inline'}>Edit</span>
                <ReactSVG src={SVG_PENCIL.src} className={'[&_*]:w-[min(3.4dvw,0.8rem)] [&_path]:fill-primary'}/>
            </span>
        );

    // Styles
    const SELECT_CN = {
        classNameWrapper: 'flex-col gap-y-[min(1.3dvw,0.6rem)]',
        classNameLabel: `self-start text-small`,
        className: `${data?.className} rounded-smallest h-[min(3.4dvw,2rem)]`,
        classNameOption: `${data?.className} [&&]:rounded-none`,
    }
    const INPUT_CN = {
        className: data?.className,
        classNameWrapper: 'flex-col gap-y-[min(1.3dvw,0.6rem)] w-full',
        classNameLabel: `first-letter:capitalize place-self-start text-small`,
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
                            className={`cursor-pointer underline ml-[min(1.7dvw,0.8rem)] mt-[min(4.3dvw,1.5rem)] text-small`}
                        >
                            Verify
                        </span>
                    </span>
                    <span className={`block mt-[--1drs] text-section-xs ${waring ? '' : 'hidden'}`}>{waring}</span>
                    {ControlBtns}
                </>
            )
            break;
        case 'image':
            if (!('fileName' in formData) || !data.value || !('fileName' in data.value))
                break;
            Form = (
                <>
                    <Input
                        type={"file"}
                        accept={"image/*"}
                        onClick={(event) => {
                            if (event.currentTarget)
                                event.currentTarget.value = ''
                        }}
                        onChange={async (event) => {
                            if (!('target' in event) || !event.target.files)
                                return;
                            const file = Array.from(event.target?.files)?.[0];
                            if (file)
                                setFormState({file, fileName: file.name})
                        }}
                        classNameWrapper={data.className}
                        className={'w-fit'}
                        classNameIcon={'[&&_*]:size-[--p-content-3xs]  sm:[&_*]:size-[--p-content-4xs]'}
                    >
                        {(formData.fileName ?? data.value.fileName) || 'Upload media'}
                    </Input>
                    <span className={`block mt-[--1drs] text-section-xs ${waring ? '' : 'hidden'}`}>{waring}</span>
                    <span
                        className={`flex gap-x-[min(1dvw,0.75rem)] h-[--h-control] mt-[min(1.3dvw,0.95rem)] text-small font-bold`}>
                        {CancelBtn}
                        <Button
                            type={'button'}
                            disabled={!formData.fileName || formData.fileName !== data.value.fileName}
                            onClick={() => {
                                modalCtx.openModal(
                                    <RemoveProfilePictureModal onRemove={() => toggleEditState()}/>,
                                    {darkenBg: true}
                                )
                            }}
                            className={'px-[--1drs] rounded-full border-small border-red text-red disabled:x-[bg-control-gray-l0,border-none,text-gray]'}
                        >
                            Remove
                        </Button>
                        <Button
                            type={'submit'}
                            disabled={!formData.fileName || formData.fileName === data.value.fileName}
                            className={'px-[--1drs] bg-control-navy rounded-full disabled:x-[bg-control-gray-l0,border-none,text-gray]'}
                        >
                            Replace
                        </Button>
                    </span>
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
                    <span className={`block mt-[--1drs] ${waring ? '' : 'hidden'}`}>{waring}</span>
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
                    <ul className={'grid grid-cols-2 list-disc list-inside ml-[min(2dvw,1rem)] text-note'}>
                        <li>
                            <span className={'sm:hidden'}>Minimum of </span>9 characters
                        </li>
                        <li>
                            <span className={'hidden sm:inline'}>U</span><span className={'sm:hidden'}>One u</span>
                            ppercase letter
                        </li>
                        <li>
                            <span className={'hidden sm:inline'}>L</span><span className={'sm:hidden'}>One l</span>
                            owercase leter
                        </li>
                        <li>
                            <span className={'hidden sm:inline'}>N</span><span className={'sm:hidden'}>One n</span>
                            umber
                        </li>
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
                    <span className={waring ? 'text-section-xs' : 'hidden'}>{waring}</span>
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
                    <hr className={'border-control-white-d0'}/>
                    {/*<div className={'flex justify-between'}>*/}
                    {/*    <Editable*/}
                    {/*        toggleType={'button'}*/}
                    {/*        keepChildrenOnEdit*/}
                    {/*        isSimpleSwitch*/}
                    {/*        isToggleBlocked={data.value.isEmailAdded}*/}
                    {/*        data={{*/}
                    {/*            className: FA2_INPUT_CN,*/}
                    {/*            title: 'Add your Email as a two-factor authentication option',*/}
                    {/*            value: null,*/}
                    {/*            onSave: data.onSave*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        Email*/}
                    {/*    </Editable>*/}
                    {/*</div>*/}
                    <div className={'flex justify-between'}>
                        <Editable
                            toggleType={'button'}
                            keepChildrenOnEdit
                            checkEmpty
                            toggleBlocked={data.value.isPhoneAdded}
                            data={{
                                className: FA2_INPUT_CN,
                                title: 'Add your Phone as a two-factor authentication option',
                                value: formData,
                                onSave: data.onSave
                            }}
                        >
                            <span>Phone <span className={'sm:hidden'}>number</span></span>
                        </Editable>
                    </div>
                    <span className={waring ? 'block mt-[--1drs] text-section-xs ' : 'hidden'}>{waring}</span>
                </>
            );

            EditToggle = (
                <Switch
                    state={isEditState}
                    handleSwitch={async () => {
                        await data.onSwitch?.(isEditState)
                        if (
                            'value' in formData && data.value
                            && 'isEmailAdded' in data.value
                            && !data.value.isPhoneAdded
                        ) {
                            toggleEditState();
                        }
                    }}
                    className={'justify-self-end'}
                />
            );
            break;
        case 'phone':
            if (!('business' in formData))
                break;

            const requireOnChangePhone = (key: keyof UserPhone, subKey: KeysOfUnion<Phone>, isCheckBox?: boolean) => {
                return (event: ChangeEvent<HTMLInputElement>) => {
                    setWarning(null);
                    const value = isCheckBox ? event.currentTarget.checked : event.currentTarget.value;
                    setFormState((prevState) => {
                        if (!('business' in prevState))
                            return prevState;

                        const newState = {
                            ...prevState,
                            [key]: {...prevState[key], [subKey]: value}
                        };

                        // handle set-as-primary checkboxes
                        if (isCheckBox && 'business' in newState) {
                            let isAllDefault = false;
                            for (const stateKey in newState) {
                                // @ts-expect-error no error - the keys are checked above
                                newState[stateKey][subKey] = key === stateKey && value && newState[stateKey].number;
                                // @ts-expect-error no error - duplicate
                                isAllDefault = isAllDefault || newState[stateKey][subKey];
                            }

                            // Set primary automatically if no one is checked
                            if (!isAllDefault) {
                                for (const stateKey in newState) {
                                    // @ts-expect-error no error - the keys are checked above
                                    newState[stateKey].isPrimary = newState[stateKey].number;
                                    // @ts-expect-error no error - the keys are checked above
                                    if (newState[stateKey].isPrimary)
                                        break;
                                }
                            }
                        }

                        return newState;
                    });
                }
            }

            const renderPhoneFieldset = (field: keyof UserPhone, ext?: string) => {
                const InputField = (
                    <Input
                        type={'number'}
                        value={formData[field].number ?? ''}
                        maxLength={12}
                        onChange={requireOnChangePhone(field, 'number')}
                        {...INPUT_CN}
                    >
                        {field}
                    </Input>
                );

                const InputFieldFinal = ext !== undefined
                    ? (
                        <span className={'grid grid-cols-[2fr,1fr] gap-x-[--s-dl-smallest]'}>
                            {InputField}
                            <Input
                                type={'number'}
                                value={ext}
                                maxLength={4}
                                onChange={requireOnChangePhone(field, 'ext')}
                                {...INPUT_CN}
                            >
                                Ext
                            </Input>
                        </span>
                    )
                    : InputField;

                return (
                    <>
                        {InputFieldFinal}
                        <Input
                            type={'checkbox'}
                            checked={(formData[field]?.isPrimary && formData[field].number.length > 0) || false}
                            disabled={!formData[field].number}
                            onChange={requireOnChangePhone(field, 'isPrimary', true)}
                            {...CHECKBOX_CN}
                        >
                            Set as primary
                        </Input>
                    </>
                );
            }

            Form = (
                <>
                    <div className={'flex flex-col gap-y-[min(2dvw,0.81rem)]'}>
                        {renderPhoneFieldset('business', 'ext' in formData.business ? formData.business?.ext : '')}
                        {renderPhoneFieldset('mobile')}
                        {renderPhoneFieldset('personal')}
                        <span className={waring ? 'block first-letter:capitalize text-section-xs' : 'hidden'}>
                            {waring}
                        </span>
                    </div>
                    {ControlBtns}
                </>
            );
            break
        case 'name':
            if (!('initial' in formData))
                break;
            Form = (
                <div className={'flex flex-col gap-y-[--1dr]'}>
                    <Select
                        options={SALUTATION}
                        value={formData.salutation}
                        placeholder={'Select'}
                        onChangeCustom={(value) =>
                            setFormState(prevState => ({...prevState, salutation: value as keyof typeof SALUTATION}))}
                        {...SELECT_CN}
                        classNameWrapper={SELECT_CN.classNameWrapper + ' w-[43%]'}
                        required
                    >
                        Salutations
                    </Select>
                    <span className={'grid grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-x-[--s-dl-smallest]'}>
                        <Input
                            value={formData.firstName}
                            onChange={(event) => {
                                const firstname = event.currentTarget.value;
                                setFormState(prevState => ({...prevState, firstName: firstname}))
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
                            <span>Initial <span className={'sm:hidden'}>(optional)</span></span>
                        </Input>
                    </span>
                    <Input
                        value={formData.lastName}
                        onChange={(event) => {
                            const lastname = event.currentTarget.value;
                            setFormState(prevState => ({...prevState, lastName: lastname}))
                        }}
                        {...INPUT_CN}
                        required
                    >
                        Last Name
                    </Input>
                    <span className={waring ? 'block mt-[--1drs] text-section-xs' : 'hidden'}>{waring}</span>
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
                    return null;

                return (
                    // gap-x is not used for sm breakpoints
                    <>
                        <span className={`grid grid-cols-[repeat(2,minmax(0,1fr))] gap-x-[0.62rem] gap-y-[--1qdrs] mb-[--s-dl-smallest]
                                            ${isPersonal ? 'mt-[--1qdrs] bg-[#686868] p-[--s-small] rounded-small' : 'mt-[min(0.75dvw,0.94rem)]'}`}>
                            <span className={`flex col-span-2 capitalize text-small justify-between`}>
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
                                classNameWrapper={INPUT_CN.classNameWrapper + ' sm:col-span-2'}
                                required
                            >
                                Country / Region
                            </Select>
                            <Select
                                options={(STATE_PROVINCE?.[formData[key].country] ?? {})}
                                value={formData[key]?.state ?? ''}
                                placeholder={'Select'}
                                onChangeCustom={(value) => requireOnChangeAddress(key, 'state')(value)}
                                {...SELECT_CN}
                                classNameWrapper={INPUT_CN.classNameWrapper + ' sm:col-span-2'}
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
                            >
                                Street Address #2
                            </Input>
                            <Input
                                value={formData[key]?.city ?? ''}
                                onChange={requireOnChangeAddress(key, 'city')}
                                {...INPUT_CN}
                                classNameWrapper={INPUT_CN.classNameWrapper + ' sm:col-span-2'}
                                required
                            >
                                City / Locality
                            </Input>
                            <Input
                                value={formData[key]?.zip ?? ''}
                                onChange={requireOnChangeAddress(key, 'zip')}
                                {...INPUT_CN}
                                classNameWrapper={INPUT_CN.classNameWrapper + ' sm:col-span-2'}
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
                            className={`underline cursor-pointer text-small mt-[--1qdrs]
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
                    <span className={waring ? 'block mt-[--1drs] text-section-xs' : 'hidden'}>{waring}</span>
                    {ControlBtns}
                </>
            );
            break;
        case 'company':
            if (!('jobTitle' in formData))
                break;

            Form = (
                <div className={'flex flex-col gap-y-[--1qdrs]'}>
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

    const isFormShown = isEditState && Form && !simpleSwitch;
    if (keepChildrenOnEdit) {
        return (
            <div className={'w-full overflow-x-hidden overflow-ellipsis'}>
                <div
                    className={`flex justify-between ${isFormShown ? 'mb-[0.94rem]' : ''}`}>{children}{EditToggle}</div>
                {isFormShown ? Form : null}
            </div>
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

export type {Props as EditableProps, EditableFormData};
export {DEFAULT_ADDRESS};
export {Editable};