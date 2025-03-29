'use client';

import {
    ChangeEvent,
    Dispatch,
    FC,
    FormEvent,
    PropsWithChildren,
    ReactElement,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { ReactSVG } from 'react-svg';
import cn from 'classnames';
import { isEqual } from 'lodash';
import { v4 } from 'uuid';

import { KeysOfUnion, NonNullableKeys } from '@/app/types/utils';
import {
    COUNTRY,
    DEFAULT_ADDRESS,
    DEFAULT_PHONE,
    INDUSTRY,
    IndustryKey,
    JOB_FUNCTION,
    JobFunctionKey,
    SALUTATION,
    SalutationKey,
    STATE_PROVINCE,
    SUB_INDUSTRY,
    SubIndustryKey,
} from '@/app/static';

import { Address, Company, FullName, Phone, UserAddress, UserPhone } from '@/app/contexts/user.context';

import { copyObject } from '@/app/utils';
import { useModal, useSaveOnLeave } from '@/app/hooks';

import { Button, Input, Select, Switch } from '@/app/ui/form';
import { RemoveProfilePictureModal } from '@/pages/profile/RemoveProfilePictureModal';

import SVG_PENCIL from '@/assets/images/icons/edit-line.svg';

const FA2_INPUT_CN =
    'bg-gray-l0 py-[min(1.7dvw,0.35rem)] w-full rounded-xs px-[min(16dvw,0.76rem)] border-s border-white';
const CHECKBOX_CN = {
    classNameWrapper: 'flex-row-reverse place-self-start',
    classNameLabel: 'text-12  md:text-14  lg:text-16',
};

type FormType = 'input' | 'select' | 'password' | '2FA' | 'phone' | 'name' | 'address' | 'image' | 'company';

type FormData<T extends FormType> =
    | null
    | (T extends 'password'
          ? { currentPassword: string; newPassword: string; passwordConfirm: string }
          : T extends 'image'
            ? { file: File | null; fileName: string | null }
            : T extends 'phone'
              ? NonNullableKeys<UserPhone>
              : T extends 'name'
                ? FullName
                : T extends 'address'
                  ? UserAddress
                  : T extends 'company'
                    ? Company
                    : { value: string | null });

type FormInit<T extends FormType> =
    | null
    | (T extends 'image'
          ? { file: File | null; fileName: string | null }
          : T extends '2FA'
            ? { isEmailAdded: boolean; isPhoneAdded: boolean; suggestedPhone: string | null }
            : T extends 'phone'
              ? UserPhone
              : T extends 'name'
                ? FullName
                : T extends 'address'
                  ? UserAddress
                  : T extends 'company'
                    ? Company
                    : { value: string | null; verify?: (formData: FormData<'input'>) => Promise<void> });

type DataBase<T extends FormType> = {
    className?: string;
    title?: string;
    onSave: <T extends FormType>(formData: NonNullable<FormData<T>>) => Promise<void>;
    onSwitch?: (state: boolean) => Promise<void>;
    value: FormInit<T>;
};

interface Props extends PropsWithChildren {
    type?: FormType;
    toggleType?: 'icon' | 'button';
    initialize: <T extends FormType>() => DataBase<T> | (DataBase<T> & { options: Record<string, string> });

    setParentEditId?: Dispatch<SetStateAction<string | null>>;
    parentEditId?: string | null;

    toggleBlocked?: boolean;
    simpleSwitch?: boolean;
    keepChildrenOnEdit?: boolean;

    classNameToggle?: string;
    classNameToggleText?: string;
    classNameWrapper?: string;
}

const Editable: FC<Props> = (props: Props) => {
    const {
        type = 'input',
        toggleType,
        keepChildrenOnEdit,
        toggleBlocked,
        simpleSwitch,
        parentEditId,
        setParentEditId,
        classNameWrapper,
        classNameToggle,
        classNameToggleText,
        initialize,
        children,
    } = props;

    const initial = initialize<typeof type>();
    const { value: initValue } = initial;

    // State
    const [editId] = useState<string>(v4());
    const [editState, setEditState] = useState<boolean>(
        initValue !== null && 'isPhoneAdded' in initValue && initValue.isPhoneAdded,
    );

    const modalCtx = useModal();

    const [waring, setWarning] = useState<string | null>(null);

    const [form, setForm] = useState<FormData<typeof type>>(null);
    const setInitFormState = <T extends FormType>(state: FormData<T>, initVal?: FormInit<FormType>) =>
        setForm({ ...state, ...copyObject(initVal ?? {}) } as FormData<T>);

    const formRef = useRef<HTMLFormElement | null>(null);
    const submitRef = useRef<HTMLButtonElement | null>(null);

    const toggleEditState = () => {
        if (parentEditId === editId) {
            resetForm();
            setParentEditId?.(null);
        } else {
            setParentEditId?.(editId);
            setPreventState(true);
        }
    };

    const submitForm = useCallback(async () => {
        if (!formRef.current || !submitRef.current || !form) return false;

        try {
            if (!formRef.current.checkValidity()) {
                submitRef.current.click();
                return false;
            }

            await initial?.onSave(form);
            toggleEditState();
            return true;
        } catch (error: unknown) {
            if (typeof error === 'string') setWarning(error);
            return false;
        }
    }, [submitRef.current]);

    const checkPreventUpdate = () => isEqual(form, initValue);

    const setPreventState = useSaveOnLeave({
        editId,
        parentEditId,
        onSave: submitForm,
        onDontSave: toggleEditState,
        checkSave: checkPreventUpdate,
    });

    const resetForm = useCallback(() => {
        switch (type) {
            default:
            case 'input':
                if (simpleSwitch) setInitFormState({ value: false.toString() });
                else setInitFormState<'input'>({ value: '' }, initValue);
                break;
            case 'select':
                setInitFormState<'select'>({ value: '' }, initValue);
                break;
            case 'address':
                setInitFormState<'address'>(
                    { businessAddress: DEFAULT_ADDRESS, personalAddress: DEFAULT_ADDRESS },
                    initValue,
                );
                break;
            case 'name':
                setInitFormState<'name'>({ initial: '', firstName: '', lastName: '', salutation: '' }, initValue);
                break;
            case 'phone':
                setInitFormState<'phone'>(
                    { mobile: DEFAULT_PHONE, personal: DEFAULT_PHONE, business: DEFAULT_PHONE },
                    initValue,
                );
                break;
            case 'password':
                setInitFormState<'password'>({ currentPassword: '', newPassword: '', passwordConfirm: '' }, initValue);
                break;
            case 'image':
                setInitFormState<'image'>({ file: null, fileName: '' }, initValue);
                break;
            case 'company':
                setInitFormState<'company'>(
                    { name: '', jobTitle: '', jobFunction: '', industry: '', subIndustry: '' },
                    initValue,
                );
                break;
            case '2FA':
                break;
        }
    }, []);

    useEffect(() => {
        setEditState(parentEditId === editId);
    }, [parentEditId, editId]);

    useEffect(() => {
        resetForm();
    }, []);

    // handlers
    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault();
        await submitForm();
    };

    // Elements
    const Hr = <hr className={'border-white-d0'} />;

    const CancelBtn = (
        <Button
            type={'reset'}
            className={'h-full rounded-full bg-gray-l0 px-xxs text-12  md:text-14'}
            onClick={() => toggleEditState()}
        >
            Cancel
        </Button>
    );
    const ControlBtns: FC = () => (
        <span
            className={`flex h-button-n mt-[min(1.3dvw,0.95rem)] gap-x-[min(1dvw,0.75rem)] text-12 font-bold  md:text-14`}
        >
            {CancelBtn}
            <Button
                ref={submitRef}
                type={'submit'}
                disabled={checkPreventUpdate()}
                className={'rounded-full bg-navy px-xxs disabled:bg-gray-l0 disabled:text-gray'}
            >
                Update
            </Button>
        </span>
    );

    const renderToggle = () => {
        const isDisabled = toggleBlocked || editState;
        return (
            <Button
                disabled={isDisabled}
                onClick={async () => {
                    if (simpleSwitch && form) await initial.onSave(form);
                    toggleEditState();
                }}
                onMouseEnter={(event) => !isDisabled && (event.currentTarget.innerText = 'Enable')}
                onMouseLeave={(event) => !isDisabled && (event.currentTarget.innerText = 'Disabled')}
                className={`box-content rounded-xxs px-3xs py-5xs text-16 ${parentEditId ? '!bg-green !text-primary' : ''} ${!isDisabled ? 'hover:bg-blue hover:text-primary' : ''} ${classNameToggle} ${editState ? '[&]:bg-blue' : 'text-gray [&]:bg-white-d0'}`}
            >
                {parentEditId ? 'Enabled' : editState ? 'Enable' : 'Disabled'}
            </Button>
        );
    };

    let EditToggle: ReactElement =
        toggleType === 'button' ? (
            renderToggle()
        ) : (
            <span
                onClick={() => toggleEditState()}
                className={`flex cursor-pointer items-center gap-4xs-2 text-20 ${classNameToggle} place-self-end self-start ${editState ? 'hidden' : ''}`}
            >
                <span className={`hidden lg:inline ${classNameToggleText}`}>Edit</span>
                <ReactSVG
                    src={SVG_PENCIL.src}
                    className={'w-[min(3.4dvw,0.8rem)] [&_path]:fill-primary'}
                />
            </span>
        );

    // Styles
    const SELECT_CN = {
        classNameWrapper: `flex-col gap-y-4xs`,
        classNameLabel: `self-start text-12  md:text-14  lg:text-16`,
        className: `${initial?.className} px-3xs py-5xs [&]:bg-gray-l0`,
        classNameOption: `${initial?.className} [&&]:rounded-none`,
        classNameSelected: `w-full `,
        classNameChevron: `ml-auto`,
    };
    const INPUT_CN = {
        className: `${initial?.className}`,
        classNameWrapper: 'flex-col gap-y-4xs w-full text-12  md:text-14  lg:text-16',
        classNameLabel: `first-letter:capitalize place-self-start text-12  md:text-14  lg:text-16`,
    };

    // Form controls
    let Form: ReactElement | null = null;
    switch (type) {
        default:
        case 'input':
            if (!form || !('value' in form)) break;
            Form = (
                <>
                    <span className={'flex items-center'}>
                        <Input
                            value={form.value ?? ''}
                            onChange={(event) => {
                                setWarning(null);
                                setForm({ value: event.currentTarget.value });
                            }}
                            {...INPUT_CN}
                            required
                        >
                            {initial?.title}
                        </Input>
                        <span
                            hidden={!initValue || !('verify' in initValue) || initValue.verify === undefined}
                            onClick={() => initValue && 'verify' in initValue && initValue.verify?.(form)}
                            className={`ml-[min(1.7dvw,0.8rem)] mt-[min(4.3dvw,1.5rem)] cursor-pointer text-20 underline`}
                        >
                            Verify
                        </span>
                    </span>
                    <span className={`mt-xxs block text-14 ${waring ? '' : 'hidden'}`}>{waring}</span>
                    <ControlBtns />
                </>
            );
            break;
        case 'image':
            if (!form || !('fileName' in form) || !initValue || !('fileName' in initValue)) break;
            Form = (
                <>
                    <Input
                        type={'file'}
                        accept={'image/*'}
                        onClick={(event) => {
                            if (event.currentTarget) event.currentTarget.value = '';
                        }}
                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                            if (!('target' in event) || !event.target.files) return;
                            const file = Array.from(event.target?.files)?.[0];
                            if (file) setForm({ file, fileName: file.name });
                        }}
                        classNameWrapper={initial.className}
                        className={'w-fit'}
                        classNameIcon={'[&&_*]:size-3xs  sm:size-4xs'}
                    >
                        {(form.fileName ?? initValue.fileName) || 'Upload media'}
                    </Input>
                    <span className={`mt-xxs block text-14 ${waring ? '' : 'hidden'}`}>{waring}</span>
                    <span
                        className={`flex h-button-n mt-[min(1.3dvw,0.95rem)] gap-x-[min(1dvw,0.75rem)] text-20 font-bold`}
                    >
                        {CancelBtn}
                        <Button
                            type={'button'}
                            disabled={!form.fileName || form.fileName !== initValue.fileName}
                            onClick={() => {
                                modalCtx.openModal(<RemoveProfilePictureModal onRemove={() => toggleEditState()} />, {
                                    darkenBg: true,
                                });
                            }}
                            className={
                                'px-xxs rounded-full border-s border-red text-red disabled:x-[bg-gray-l0,border-none,text-gray]'
                            }
                        >
                            Remove
                        </Button>
                        <Button
                            type={'submit'}
                            disabled={!form.fileName || form.fileName === initValue.fileName}
                            className={'rounded-full bg-navy px-xxs disabled:x-[bg-gray-l0,border-none,text-gray]'}
                        >
                            Replace
                        </Button>
                    </span>
                </>
            );
            break;
        case 'select':
            if (!form || !('value' in form) || !('options' in initial)) break;
            Form = (
                <>
                    <Select
                        options={initial.options}
                        value={form.value ?? ''}
                        placeholder={'Select'}
                        onChangeCustom={(value) => setForm({ value })}
                        {...SELECT_CN}
                        classNameOption={initial?.className}
                        required
                    >
                        {initial?.title}
                    </Select>
                    <span className={`block mt-xxs ${waring ? '' : 'hidden'}`}>{waring}</span>
                    <ControlBtns />
                </>
            );
            break;
        case 'password':
            if (!form || !('currentPassword' in form)) break;
            Form = (
                <>
                    <Input
                        type={'password'}
                        value={form.currentPassword}
                        onChange={(event) => {
                            setWarning(null);
                            const currentPassword = event.currentTarget.value;
                            setForm((prevState) => ({ ...prevState, currentPassword }) as FormData<'password'>);
                        }}
                        {...INPUT_CN}
                        required
                    >
                        Current Password
                    </Input>
                    {Hr}
                    <Input
                        type={'password'}
                        value={form.newPassword}
                        onChange={(event) => {
                            setWarning(null);
                            const newPassword = event.currentTarget.value;
                            setForm((prevState) => ({ ...prevState, newPassword }) as FormData<'password'>);
                        }}
                        {...INPUT_CN}
                        required
                    >
                        New Password
                    </Input>
                    <ul
                        className={cn(
                            'grid ml-3xs text-12 list-inside list-disc grid-cols-2',
                            'sm:portrait:grid-cols-1',
                            'marker:[&]:pr-5xs gap-1',
                        )}
                    >
                        <li>
                            <span className={'sm:hidden'}>Minimum of </span>9 characters
                        </li>
                        <li>
                            <span className={'hidden sm:inline'}>U</span>
                            <span className={'sm:hidden'}>One u</span>
                            ppercase letter
                        </li>
                        <li>
                            <span className={'hidden sm:inline'}>L</span>
                            <span className={'sm:hidden'}>One l</span>
                            owercase letter
                        </li>
                        <li>
                            <span className={'hidden sm:inline'}>N</span>
                            <span className={'sm:hidden'}>One n</span>
                            umber
                        </li>
                    </ul>
                    <Input
                        type={'password'}
                        value={form.passwordConfirm}
                        onChange={(event) => {
                            setWarning(null);
                            const passwordConfirm = event.currentTarget.value;
                            setForm((prevState) => ({ ...prevState, passwordConfirm }) as FormData<'password'>);
                        }}
                        {...INPUT_CN}
                        required
                    >
                        Confirm New Password
                    </Input>
                    <span className={waring ? 'text-14' : 'hidden'}>{waring}</span>
                    <ControlBtns />
                </>
            );
            break;
        case '2FA':
            if (!initValue || !('isEmailAdded' in initValue)) break;
            Form = (
                <>
                    {children}
                    <hr className={'border-white-d0'} />
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
                            toggleBlocked={initValue.isPhoneAdded}
                            initialize={function <T extends FormType>() {
                                return {
                                    className: FA2_INPUT_CN,
                                    title: 'Add your Phone as a two-factor authentication option',
                                    value: { value: initValue.suggestedPhone } as FormInit<T>,
                                    onSave: initial.onSave,
                                };
                            }}
                        >
                            <span>
                                Phone <span className={'sm:hidden'}>number</span>
                            </span>
                        </Editable>
                    </div>
                    <span className={waring ? 'mt-xxs block text-14' : 'hidden'}>{waring}</span>
                </>
            );

            EditToggle = (
                <Switch
                    state={editState}
                    classNameSwitchText={classNameToggleText}
                    handleSwitch={async () => {
                        await initial.onSwitch?.(editState);
                        if (
                            form &&
                            'value' in form &&
                            initValue &&
                            'isEmailAdded' in initValue &&
                            !initValue.isPhoneAdded
                        ) {
                            toggleEditState();
                        }
                    }}
                    className={'justify-self-end'}
                />
            );
            break;
        case 'phone':
            if (!form || !('business' in form)) break;

            const requireOnChangePhone = (key: keyof UserPhone, subKey: KeysOfUnion<Phone>, isCheckBox?: boolean) => {
                return (event: ChangeEvent<HTMLInputElement>) => {
                    setWarning(null);
                    const value = isCheckBox ? event.currentTarget.checked : event.currentTarget.value;
                    setForm((prevState) => {
                        if (!prevState || !('business' in prevState)) return prevState;

                        const newState = {
                            ...prevState,
                            [key]: { ...prevState[key], [subKey]: value },
                        };

                        // handle set-as-primary checkboxes
                        if (isCheckBox && 'business' in newState) {
                            let isAllDefault = false;
                            for (const stateKey in newState) {
                                const k = stateKey as keyof UserPhone;
                                // @ts-expect-error wrong subkey
                                newState[k][subKey] = key === stateKey && value && newState[stateKey].number;
                                // @ts-expect-error wrong subkey
                                isAllDefault = isAllDefault || newState[stateKey][subKey];
                            }

                            // Set primary automatically if no one is checked
                            if (!isAllDefault) {
                                for (const stateKey in newState) {
                                    // @ts-expect-error wrong subkey
                                    newState[stateKey].isPrimary = newState[stateKey].number;
                                    // @ts-expect-error wrong subkey
                                    if (newState[stateKey].isPrimary) break;
                                }
                            }
                        }

                        return newState;
                    });
                };
            };

            const renderPhoneFieldset = (field: keyof UserPhone, ext?: string) => {
                const InputField = (
                    <Input
                        type={'number'}
                        value={form[field].number ?? ''}
                        maxLength={12}
                        onChange={requireOnChangePhone(field, 'number')}
                        {...INPUT_CN}
                    >
                        {field}
                    </Input>
                );

                const InputFieldFinal =
                    ext !== undefined ? (
                        <span className={'grid grid-cols-[2fr,1fr] gap-x-4xs'}>
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
                    ) : (
                        InputField
                    );

                return (
                    <>
                        {InputFieldFinal}
                        <Input
                            type={'checkbox'}
                            checked={(form[field]?.isPrimary && form[field].number.length > 0) || false}
                            disabled={!form[field].number}
                            onChange={requireOnChangePhone(field, 'isPrimary', true)}
                            {...CHECKBOX_CN}
                        >
                            Set as primary
                        </Input>
                    </>
                );
            };

            Form = (
                <>
                    <div className={'flex flex-col gap-y-[min(2dvw,0.81rem)]'}>
                        {renderPhoneFieldset('business', 'ext' in form.business ? form.business?.ext : '')}
                        {renderPhoneFieldset('mobile')}
                        {renderPhoneFieldset('personal')}
                        <span className={waring ? 'block text-14 first-letter:capitalize' : 'hidden'}>{waring}</span>
                    </div>
                    <ControlBtns />
                </>
            );
            break;
        case 'name':
            if (!form || !('initial' in form)) break;
            Form = (
                <div className={'flex flex-col gap-y-xxs'}>
                    <Select
                        options={SALUTATION}
                        value={form.salutation}
                        placeholder={'Select'}
                        onChangeCustom={(value) =>
                            setForm(
                                (prevState) =>
                                    ({
                                        ...prevState,
                                        salutation: value as SalutationKey,
                                    }) as FormData<'name'>,
                            )
                        }
                        {...SELECT_CN}
                        classNameWrapper={SELECT_CN.classNameWrapper + ' w-[43%]'}
                        required
                    >
                        Salutations
                    </Select>
                    <span className={'grid grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-x-4xs'}>
                        <Input
                            value={form.firstName}
                            onChange={(event) => {
                                const firstName = event.currentTarget.value;
                                setForm((prevState) => ({ ...prevState, firstName }) as FormData<'name'>);
                            }}
                            {...INPUT_CN}
                            required
                        >
                            First Name
                        </Input>
                        <Input
                            value={form.initial}
                            onChange={(event) => {
                                const initial = event.currentTarget.value;
                                setForm((prevState) => ({ ...prevState, initial }) as FormData<'name'>);
                            }}
                            {...INPUT_CN}
                        >
                            <span>
                                Initial <span className={'sm:hidden'}>(optional)</span>
                            </span>
                        </Input>
                    </span>
                    <Input
                        value={form.lastName}
                        onChange={(event) => {
                            const lastName = event.currentTarget.value;
                            setForm((prevState) => ({ ...prevState, lastName }) as FormData<'name'>);
                        }}
                        {...INPUT_CN}
                        required
                    >
                        Last Name
                    </Input>
                    <span className={waring ? 'mt-xxs block text-14' : 'hidden'}>{waring}</span>
                    <ControlBtns />
                </div>
            );
            break;
        case 'address':
            if (!form || !('businessAddress' in form)) break;

            const requireOnChangeAddress = (key: keyof UserAddress, subKey: keyof Address, isCheckBox?: boolean) => {
                return (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
                    setWarning(null);
                    const formValue =
                        typeof value === 'string'
                            ? value
                            : isCheckBox
                              ? (value.target as HTMLInputElement).checked
                              : value.currentTarget.value;
                    setForm((prevState) =>
                        prevState && 'businessAddress' in prevState
                            ? { ...prevState, [key]: { ...prevState[key], [subKey]: formValue } }
                            : prevState,
                    );
                };
            };

            const renderAddressForm = (key: keyof UserAddress) => {
                const isPersonal = key === 'personalAddress';
                if (!form[key]) return null;

                return (
                    // gap-x is not used for sm breakpoints
                    <>
                        <span
                            className={cn(
                                `mb-4xs grid grid-cols-[repeat(2,minmax(0,1fr))] gap-x-4xs gap-y-xs`,
                                `${isPersonal ? 'mt-xs rounded-s bg-gray-l3 p-3xs' : 'mt-[min(0.75dvw,0.94rem)]'}`,
                            )}
                        >
                            <span className={`col-span-2 flex justify-between text-20 capitalize`}>
                                <span>{key.slice(0, 'Address'.length + 1)} Address</span>
                                <span
                                    onClick={() =>
                                        setForm(
                                            (prevState) =>
                                                ({
                                                    ...prevState,
                                                    personalAddress: null,
                                                }) as FormData<'address'>,
                                        )
                                    }
                                    className={isPersonal ? 'cursor-pointer underline' : 'hidden'}
                                >
                                    Delete
                                </span>
                            </span>
                            <Select
                                options={COUNTRY}
                                value={form[key].country ?? ''}
                                placeholder={'Select'}
                                onChangeCustom={(value) => requireOnChangeAddress(key, 'country')(value)}
                                {...SELECT_CN}
                                classNameWrapper={INPUT_CN.classNameWrapper + ' sm:col-span-2'}
                                required
                            >
                                Country / Region
                            </Select>
                            <Select
                                options={STATE_PROVINCE?.[form[key].country] ?? {}}
                                value={form[key]?.state ?? ''}
                                placeholder={'Select'}
                                onChangeCustom={(value) => requireOnChangeAddress(key, 'state')(value)}
                                {...SELECT_CN}
                                classNameWrapper={INPUT_CN.classNameWrapper + ' sm:col-span-2'}
                                required
                            >
                                State / Province
                            </Select>
                            <Input
                                value={form[key]?.line1 ?? ''}
                                onChange={requireOnChangeAddress(key, 'line1')}
                                {...INPUT_CN}
                                classNameWrapper={INPUT_CN.classNameWrapper + ' col-span-2'}
                                required
                            >
                                Street Address #1
                            </Input>
                            <Input
                                value={form[key]?.line2 ?? ''}
                                onChange={requireOnChangeAddress(key, 'line2')}
                                {...INPUT_CN}
                                classNameWrapper={INPUT_CN.classNameWrapper + ' col-span-2'}
                            >
                                Street Address #2
                            </Input>
                            <Input
                                value={form[key]?.city ?? ''}
                                onChange={requireOnChangeAddress(key, 'city')}
                                {...INPUT_CN}
                                classNameWrapper={INPUT_CN.classNameWrapper + ' sm:col-span-2'}
                                required
                            >
                                City / Locality
                            </Input>
                            <Input
                                value={form[key]?.zip ?? ''}
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
                            checked={form[key]?.isPrimary ?? false}
                            onChange={requireOnChangeAddress(key, 'isPrimary', true)}
                            {...CHECKBOX_CN}
                        >
                            Set as primary
                        </Input>
                        <span
                            onClick={() =>
                                setForm(
                                    (prevState) =>
                                        ({
                                            ...prevState,
                                            personalAddress: DEFAULT_ADDRESS,
                                        }) as FormData<'address'>,
                                )
                            }
                            className={`mt-xs cursor-pointer text-20 underline ${isPersonal || form.personalAddress !== null ? 'hidden' : ''}`}
                        >
                            Add a Personal Address
                        </span>
                    </>
                );
            };
            Form = (
                <>
                    {renderAddressForm('businessAddress')}
                    {form.personalAddress ? renderAddressForm('personalAddress') : null}
                    <span className={waring ? 'mt-xxs block text-14' : 'hidden'}>{waring}</span>
                    <ControlBtns />
                </>
            );
            break;
        case 'company':
            if (!form || !('jobTitle' in form)) break;

            Form = (
                <div className={'flex flex-col gap-y-xs'}>
                    <Input
                        value={form.jobTitle ?? ''}
                        onChange={(event) => {
                            const jobTitle = event.currentTarget.value;
                            setForm((prevState) => ({ ...prevState, jobTitle }) as FormData<'company'>);
                        }}
                        {...INPUT_CN}
                        classNameWrapper={INPUT_CN.classNameWrapper + ' col-span-2'}
                        required
                    >
                        Job Title
                    </Input>
                    <Select
                        options={JOB_FUNCTION}
                        value={form.jobFunction ?? ''}
                        placeholder={'Select'}
                        onChangeCustom={(value) =>
                            setForm(
                                (prevState) =>
                                    ({
                                        ...prevState,
                                        jobFunction: value as JobFunctionKey,
                                    }) as FormData<'company'>,
                            )
                        }
                        {...SELECT_CN}
                        required
                    >
                        Job Function
                    </Select>
                    <Select
                        options={INDUSTRY}
                        value={form.industry ?? ''}
                        placeholder={'Select'}
                        onChangeCustom={(value) =>
                            setForm(
                                (prevState) =>
                                    ({
                                        ...prevState,
                                        industry: value as IndustryKey,
                                    }) as FormData<'company'>,
                            )
                        }
                        {...SELECT_CN}
                        required
                    >
                        Industry
                    </Select>
                    <Select
                        options={SUB_INDUSTRY[form.industry]}
                        value={form.subIndustry ?? ''}
                        placeholder={'Select'}
                        onChangeCustom={(value) =>
                            setForm(
                                (prevState) =>
                                    ({
                                        ...prevState,
                                        subIndustry: value as SubIndustryKey,
                                    }) as FormData<'company'>,
                            )
                        }
                        {...SELECT_CN}
                        required
                    >
                        Industry
                    </Select>
                    <ControlBtns />
                </div>
            );
            break;
    }

    const isFormShown = editState && Form && !simpleSwitch;
    if (keepChildrenOnEdit) {
        return (
            <div className={'w-full overflow-x-hidden overflow-ellipsis'}>
                <div className={`flex justify-between ${isFormShown ? 'mb-xxs' : ''}`}>
                    {children}
                    {EditToggle}
                </div>
                {isFormShown ? Form : null}
            </div>
        );
    } else {
        return (
            <>
                <form
                    id={JSON.stringify(form)}
                    ref={formRef}
                    onSubmit={handleFormSubmit}
                    className={`${classNameWrapper} flex flex-col`}
                >
                    {isFormShown ? Form : children}
                </form>
                {editState && Form && type !== '2FA' ? null : EditToggle}
            </>
        );
    }
};

Editable.displayName = Editable.name;

export type { Props as EditableProps, FormData, FormInit, FormType };
export { Editable };
