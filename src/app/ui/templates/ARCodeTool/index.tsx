import React, {FC, FormEvent, useCallback, useEffect} from "react";
import Image from "next/image";

import {ARCode} from "@/app/types/arcode";
import {FlowQueue} from "@/app/context/Flow.context";
import {Route} from "@/app/static";

import {useForm, useNavigate, useSaveOnLeave} from "@/app/hooks";
import {useFlow, useModal, useUser} from "@/app/context";

import {AuthModal, BaseModal} from "@/app/ui/modals";
import {Button, Input} from "@/app/ui/form";

import SVG_QR from "@/assets/images/qr.png";
import SVG_ARCH from "@/assets/images/arch-logo.svg";


type ARCodeToolForm = Omit<ARCode, 'file'> & Partial<Pick<ARCode, 'file'>>;

const FORM_DEFAULT: ARCodeToolForm = {id: '', backgroundColor: '#ffffff', moduleColor: '#ffffff', name: ''}
const FORM_COLOR_PICKERS = ['module', 'background'];


interface Props {
    editID?: string;
}

const ARCodeTool: FC<Props> = (props: Props) => {
    const {editID} = props;

    const flowCtx = useFlow();
    const modalCtx = useModal();
    const {isLoggedIn, userData} = useUser();
    const [navigate] = useNavigate();
    const {hasPurchasedPlan} = userData || {};

    const [formValue, setFormValue, setFormValueState] = useForm<ARCodeToolForm>({
        ...FORM_DEFAULT,
        id: editID ?? FORM_DEFAULT.id
    });

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

    useSaveOnLeave(processCode);


    useEffect(() => {
        const arCodeParam = sessionStorage.getItem('ar-code');
        if (arCodeParam)
            setFormValueState(JSON.parse(arCodeParam) as ARCode);
    }, [setFormValueState])


    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const flow: FlowQueue = [];
        if (!isLoggedIn) {
            flow.push(() => {
                const info = 'You must have an ARCH subscription to save an AR code. Please create an account below to purchase a Plan.';
                return modalCtx.openModal(<AuthModal info={info} isLoginAction={false}/>, {hideContent: true});
            });
        }
        if (!hasPurchasedPlan)
            flow.push(() => navigate(Route.ServicePricing))

        if (!flow.length)
            return processCode();

        flow.push(async () => {
            navigate(Route.SavedCodes);
            await processCode()
        });
        flowCtx.run(flow);
    }

    //Elements
    const ColorPickers = FORM_COLOR_PICKERS.map((type, idx) => {
        const key = `${type}Color` as keyof Pick<ARCodeToolForm, 'moduleColor' | 'backgroundColor'>;
        return (
            <Input
                key={type + idx}
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
                    {editID ? formValue.file : 'Upload Media'}
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

export type {ARCodeToolForm}
export {ARCodeTool};
