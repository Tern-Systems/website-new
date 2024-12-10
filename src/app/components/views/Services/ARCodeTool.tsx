import React, {FC, FormEvent, useCallback, useEffect, useState} from "react";
import Image from "next/image";

import {SectionsEnum} from "@/app/utils/sections";
import {ARCode} from "@/app/components/views/Services/SavedARCodes/CodeMenu";

import {FlowQueue, useFlow, useModal, useUser} from "@/app/context";

import {useNavigate} from "@/app/hooks/useNavigate";
import {useForm} from "@/app/hooks/useForm";
import {useSearchParams} from "next/navigation";

import {AuthModal, BaseModal, SaveChangesModal} from "@/app/components/modals";

import {Button, Input} from "@/app/components/form";

import SVG_QR from "@/assets/images/qr.png";
import SVG_ARCH from "@/assets/images/arch-logo.svg";

type ARCodeToolForm = Omit<ARCode, 'file'> & Partial<Pick<ARCode, 'file'>>;

const FORM_DEFAULT: ARCodeToolForm = {backgroundColor: '#ffffff', moduleColor: '#ffffff', name: ''}
const FORM_COLOR_PICKERS = ['module', 'background'];

const ARCodeToolView: FC = () => {
    const flowCtx = useFlow();
    const modalCtx = useModal();
    const [navigate] = useNavigate();
    const params = useSearchParams();
    const {isLoggedIn, userData} = useUser();
    const {isPurchased} = userData || {};

    const [formValue, setFormValue, setFormValueState] = useForm<ARCodeToolForm>(FORM_DEFAULT);
    const [isEditMode, setEditState] = useState(false);

    const processCode = useCallback(async () => {
        const result = null; // TODO

        const SuccessModal = () => {
            return (
                <BaseModal isSimple
                           className={'w-[18rem] h-[3.58rem] bottom-[7.19rem] right-[--py] border-control4 border-small'}>
                    Your AR Code <span className={'font-bold'}>{formValue.name}</span> has been successfully saved
                </BaseModal>
            );
        }

        modalCtx.openModal(<SuccessModal/>);
    }, [modalCtx, formValue.name])

    useEffect(() => {
        const arCodeParam = params.get('ar-code');
        if (!arCodeParam)
            return;

        setFormValueState(JSON.parse(arCodeParam) as ARCode);
        setEditState(true);
    }, [params, setFormValueState])

    useEffect(() => {
        const handlePageLeave = () => {
            if (isEditMode)
                return;

            modalCtx.openModal(<SaveChangesModal onSave={() => processCode()} onLeave={()=>{}}/>);
        }
        // TODO prevent leaving
    }, [])


    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const flow: FlowQueue = [];
        if (!isLoggedIn) {
            flow.push(() => {
                const info = 'You must have an ARCH subscription to save an AR code. Please create an account below to purchase a Plan.';
                return modalCtx.openModal(<AuthModal info={info} isLoginAction={false}/>, {hideContent: true});
            });
        }
        if (!isPurchased)
            flow.push(() => navigate(SectionsEnum.Pricing))

        if (!flow.length)
            return processCode();

        flow.push(async () => {
            navigate(SectionsEnum.SavedCodes);
            await processCode()
        });
        flowCtx.run(flow);
    }

    //Elements
    const ColorPickers = FORM_COLOR_PICKERS.map((type, index) => {
        const key = `${type}Color` as keyof Pick<ARCodeToolForm, 'moduleColor' | 'backgroundColor'>;
        return (
            <Input
                key={type + index}
                type={'color'}
                value={formValue[key]}
                style={{backgroundColor: formValue[key]}}
                classNameLabel={'text-[1.875rem]'}
                onChange={setFormValue(key)}
                required
            >
                {type} Color
            </Input>
        )
    });

    return (
        <div
            className={'flex place-self-center my-auto p-[4.06rem] w-[69.65rem] bg-section border-small border-control2 rounded-small'}>
            <div className={'p-[0.91rem] mr-[7.7rem] size-[32.375rem] bg-section2 cursor-pointer'}>
                <Image src={SVG_QR} alt={'qr'} className={'h-full'}/>
            </div>
            <form
                className={'flex flex-col justify-between w-[21rem]'}
                onSubmit={handleFormSubmit}
            >
                <Image src={SVG_ARCH} alt={'arch-logo'} className={'h-[4rem] place-self-center'}/>
                <Input
                    type={"text"}
                    name={'qr-name'}
                    placeholder={'Name'}
                    value={formValue.name}
                    onChange={setFormValue('name')}
                    className={`px-[0.68rem] h-[2.3125rem] w-full text-[1.6875rem] placeholder:text-primary bg-control2
                                border-small border-control4 rounded-[0.375rem]`}
                    required
                />
                <Input
                    type={"file"}
                    name={'qr-file'}
                    classNameWrapper={'h-[3.125rem] font-bold text-[1.3125rem] text-black bg-white rounded-full'}
                    required
                >
                    {isEditMode ? formValue.file : 'Upload Media'}
                </Input>
                {ColorPickers}
                <Button
                    className={'px-[4.34rem] h-[3.125rem] text-[1.3125rem] font-bold border-small border-control5 rounded-full'}>
                    Save AR Code
                </Button>
            </form>
        </div>
    );
}

export {ARCodeToolView};
export type {ARCodeToolForm}