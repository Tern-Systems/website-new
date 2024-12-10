import React, {ChangeEvent, FC, PropsWithChildren, ReactElement, useState} from "react";
import Image from "next/image";

import {Button, Input, Switch} from "@/app/components/form";

import SVG_PENCIL from "@/assets/images/icons/edit-line.svg";


enum EditableTypeEnum {SIMPLE = 1, PASSWORD = 3, FA2 = 2}

interface Props extends PropsWithChildren {
    type?: EditableTypeEnum;
    toggleType?: 'icon' | 'button',
    data: {
        className?: string;
        title?: string;
        values?: (string | null)[];
        onSave: (values: (string | null)[]) => Promise<void>;
    };
    isSimpleSwitch?: boolean;
    keepChildrenOnEdit?: boolean;
    classNameToggle?: string;
    classNameWrapper?: string;
}

const Editable: FC<Props> = (props: Props) => {
    const {
        type, toggleType, keepChildrenOnEdit, isSimpleSwitch
        , classNameWrapper, classNameToggle, data, children
    } = props;


    // State
    const DefaultFormValue = data?.values ?? Array(type).fill('');

    const [isEditState, setEditState] = useState(
        type === EditableTypeEnum.FA2 ?? DefaultFormValue[0] === 'true'
    );
    const [formData, setFormData] = useState<(string | null)[]>(DefaultFormValue);
    const [waring, setWarning] = useState<string | null>(null);


    // handlers
    const toggleEditState = () => {
        setEditState(prevState => {
            if (prevState)
                setFormData(DefaultFormValue);
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

    const handleInputChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
        setWarning(null);
        const value = event.currentTarget.value;
        setFormData(prevState => {
            const newState = [...prevState];
            newState[index] = value;
            return newState;
        })
    }


    // Elements
    const Hr = <hr className={'border-control3'}/>;

    let Form: ReactElement | null = null;
    const controlBtns = (
        <span className={'block mt-[0.94rem] text-[0.875rem] font-bold'}>
            <Button
                className={'bg-control2 px-[1rem] h-[1.43rem] rounded-full mr-[0.75rem]'}
                onClick={() => toggleEditState()}
            >
                Cancel
            </Button>
            <Button
                disabled={
                    data?.values
                        ? formData.every((value, index) => data.values?.[index] === value && value)
                        : formData.some((value) => value?.length === 0)
                }
                onClick={() => handleUpdateClick()}
                className={'bg-[#00397F] px-[1rem] h-[1.43rem] rounded-full disabled:bg-control2 disabled:text-form disabled:cursor-default'}
            >
                Update
            </Button>
        </span>
    );

    const renderToggleBtn = () => {
        const isDataUndefined = data?.values !== undefined;
        const isDisabled = isDataUndefined || isEditState;

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
                            disabled:cursor-default 
                            ${isDisabled ? '' : 'hover:bg-control3 hover:text-primary'}
                            ${classNameToggle} ${isDataUndefined ? '' : (isEditState ? '[&]:bg-control3' : '[&]:bg-[#D9D9D9] text-form')}`}
            >
                {
                    isDataUndefined
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
    switch (type) {
        default:
        case EditableTypeEnum.SIMPLE:
            Form = (
                <>
                    <Input
                        value={formData[0] ?? ''}
                        onChange={handleInputChange(0)}
                        className={data?.className}
                        classNameWrapper={'flex-col gap-y-[0.62rem]'}
                        classNameLabel={'place-self-start text-[0.875rem]'}
                    >
                        {data?.title}
                    </Input>
                    <span hidden={!waring}>{waring}</span>
                    {controlBtns}
                </>
            )
            break;
        case EditableTypeEnum.PASSWORD:
            if (formData[0] === null || formData[1] === null || formData[2] === null)
                break;
            Form = (
                <>
                    <Input
                        type={'password'}
                        value={formData[0]}
                        onChange={handleInputChange(0)}
                        className={data?.className}
                        classNameWrapper={'flex-col gap-y-[0.62rem]'}
                        classNameLabel={'place-self-start text-[0.875rem]'}

                    >
                        Current Password
                    </Input>
                    {Hr}
                    <Input
                        type={'password'}
                        value={formData[1]}
                        onChange={handleInputChange(1)}
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
                        value={formData[2]}
                        onChange={handleInputChange(2)}
                        className={data?.className}
                        classNameWrapper={'flex-col gap-y-[0.62rem] mt-[0.31rem]'}
                        classNameLabel={'place-self-start text-[0.875rem]'}
                    >
                        Confirm New Password
                    </Input>
                    <span hidden={!waring}>{waring}</span>
                    {controlBtns}
                </>
            );
            break;
        case EditableTypeEnum.FA2:
            Form = (
                <>
                    {children}
                    <hr className={'border-control3'}/>
                    <div className={'flex justify-between'}>
                        <Editable
                            toggleType={'button'}
                            keepChildrenOnEdit={true}
                            isSimpleSwitch={true}
                            data={{
                                className: 'bg-control2 py-[0.35rem] w-full rounded-[0.375rem] px-[0.76rem] border-small border-control4',
                                title: 'Add your Email as a two-factor authentication option',
                                values: formData[1] ? [formData[1]] : undefined,
                                onSave: async () => {
                                } //TODO
                            }}
                        >
                            Email
                        </Editable>
                    </div>
                    <div className={'flex justify-between'}>
                        <Editable
                            toggleType={'button'}
                            keepChildrenOnEdit={true}
                            data={{
                                className: 'bg-control2 py-[0.35rem] w-full rounded-[0.375rem] px-[0.76rem] border-small border-control4',
                                title: 'Add your Phone as a two-factor authentication option',
                                values: formData[2] ? [formData[2]] : undefined,
                                onSave: async () => {
                                } //TODO
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
    }

    const isFormShown = isEditState && Form && !isSimpleSwitch;

    if (keepChildrenOnEdit) {
        return (
            <div className={'w-full'}>
                <div className={'flex justify-between '}>{children}{EditToggle}</div>
                {isFormShown ? Form : null}
            </div>
        );
    } else {
        return (
            <>
                <div className={`${classNameWrapper} flex flex-col`}>
                    {isFormShown ? Form : children}
                </div>
                {isEditState && Form && type !== EditableTypeEnum.FA2 ? null : EditToggle}
            </>
        )
    }
}

export {Editable, EditableTypeEnum}