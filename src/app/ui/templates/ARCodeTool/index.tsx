import React, {FC, FormEvent, useCallback, useEffect, useState} from "react";
import Image from "next/image";
import {useQRCode} from "next-qrcode";
import axios from "axios";

import {ARCode} from "@/app/types/arcode";
import {UserSubscription} from "@/app/context/User.context";
import {FlowQueue} from "@/app/context/Flow.context";
import {Route} from "@/app/static";

import {ARCHService} from "@/app/services";

import {useBreakpointCheck, useForm, useNavigate, useSaveOnLeave} from "@/app/hooks";
import {useFlow, useModal, useUser} from "@/app/context";

import {AuthModal, BaseModal, MessageModal} from "@/app/ui/modals";
import {Button, Input} from "@/app/ui/form";

import SVG_ARCH from "@/assets/images/arch-logo.svg";


type ARCodeToolForm = Pick<ARCode, 'backgroundColor' | 'moduleColor' | 'name' | 'mediaId' | 'qrCodeUrl'> & {
    file?: File | null
};

const FORM_DEFAULT: ARCodeToolForm = {
    mediaId: '',
    backgroundColor: '#000000',
    moduleColor: '#ffffff',
    name: '',
    file: null,
    qrCodeUrl: '',
}
const FORM_COLOR_PICKERS = ['module', 'background'];
const MAX_AR_CODE_WIDTH = 440;


interface Props {
    arCode?: ARCode;
}

const ARCodeTool: FC<Props> = (props: Props) => {
    const {arCode} = props;

    const flowCtx = useFlow();
    const modalCtx = useModal();
    const {isLoggedIn, userData} = useUser();
    const [navigate] = useNavigate();
    const isSmScreen = useBreakpointCheck();
    const {SVG} = useQRCode();

    const [qrSize, setQrSize] = useState(MAX_AR_CODE_WIDTH);
    const [formValue, setFormValue, setFormValueState] = useForm<ARCodeToolForm>(
        (arCode
            ? {
                mediaId: arCode.mediaId,
                backgroundColor: arCode.backgroundColor,
                moduleColor: arCode.moduleColor,
                name: arCode.name,
                qrCodeUrl: arCode.qrCodeUrl,
            }
            : FORM_DEFAULT)
    );

    const processCode = useCallback(async () => {
        if (!userData || !formValue || !formValue.file)
            return;

        try {
            if (!arCode) {
                const {
                    payload: {id, url}
                } = await ARCHService.postGenerateQR(formValue.moduleColor, formValue.backgroundColor);
                const response = await fetch(url);
                const blob = await response.blob();
                const file = new File([blob], "fileName.jpg", {type: "image/png"});
                await ARCHService.postSaveQR(userData.email, formValue.name, id, file, formValue.file);

                const SuccessModal = () => {
                    return (
                        <BaseModal isSimple
                                   className={'w-[18rem] h-[3.6rem] bottom-[7.2rem] right-[--s-default] border-control-white border-small'}>
                            Your AR Code <span className={'font-bold'}>{formValue.name}</span> has been successfully
                            saved
                        </BaseModal>
                    );
                }
                setFormValueState(FORM_DEFAULT);
                modalCtx.openModal(<SuccessModal/>)
            }
        } catch (error: unknown) {
            let message: string = 'Unknown error';
            if (axios.isAxiosError(error))
                message = error.cause?.message ?? message;
            else if (typeof error === 'string')
                message = error;
            modalCtx.openModal(<MessageModal>{message}</MessageModal>);
        }
        // eslint-disable-next-line
    }, [formValue, userData])

    useSaveOnLeave(processCode);


    useEffect(() => {
        if (arCode)
            setFormValueState(arCode);
    }, [setFormValueState, arCode])


    useEffect(() => {
        const handleResize = () => setQrSize(Math.min(MAX_AR_CODE_WIDTH, MAX_AR_CODE_WIDTH * window.innerWidth / 1100));
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const flow: FlowQueue = [];
        if (!isLoggedIn) {
            flow.push(() => {
                const info = 'You must have an ARCH subscription to save an AR code. Please create an account below to purchase a Plan.';
                return modalCtx.openModal(<AuthModal info={info}/>, {hideContent: true});
            });
        }

        const subscription: UserSubscription | undefined = userData?.subscriptions.find((entry: UserSubscription) => entry.subscription === 'ternKey');
        if (!subscription)
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
                classNameLabel={'text-[min(8dvw,1.875rem)]'}
                onChange={setFormValue(key)}
                required
            >
                {type} Color
            </Input>
        )
    });


    // Generate QR code as data URL
    return (
        <div
            className={`flex place-self-center my-auto p-[4rem] w-[min(90dvw,69rem)] bg-control-navy border-small border-control-gray rounded-small
                        sm:bg-transparent sm:flex-col sm:border-none sm:p-0 place-items-center`}>
            <div
                className={`mr-[min(6.4dvw,7.7rem)] cursor-pointer content-center place-items-center place-self-center   sm:mr-0 sm:mb-[5.3dvw]`}>
                <SVG
                    text={'https://arch.tern.ac/' + arCode?.mediaId}
                    options={{
                        width: qrSize,
                        margin: 1,
                        color: {
                            dark: formValue.backgroundColor,
                            light: formValue.moduleColor,
                        }
                    }}
                />
            </div>
            <form
                className={'flex flex-col justify-between w-[min(100%,21rem)] gap-y-[min(5.3dvw,1.3rem)] ml-auto sm:ml-0'}
                onSubmit={handleFormSubmit}
            >
                <Image src={SVG_ARCH} alt={'arch-logo'}
                       className={`h-[4rem] place-self-center ${isSmScreen ? 'hidden' : ''}`}/>
                <Input
                    type={"text"}
                    placeholder={'Name'}
                    value={formValue.name}
                    onChange={setFormValue('name')}
                    className={`px-[min(3.4dvw,0.68rem)] h-[min(10dvw,2.3rem)] w-full text-header bg-control-gray-l0
                                border-small border-control-white rounded-smallest`}
                    required
                />
                <Input
                    type={"file"}
                    accept='image/*,video/*'
                    onChange={(event) => {
                        if (event.target.files) {
                            const file = Array.from(event.target.files)[0];
                            setFormValueState((prevState) => ({...prevState, file}));
                        }
                    }}
                    classNameWrapper={'h-[min(13dvw,3.1rem)] font-bold text-content text-black bg-control-white rounded-full'}
                    required
                >
                    {arCode ? formValue.file?.name : 'Upload Media'}
                </Input>
                {ColorPickers}
                <Button
                    className={`px-[4.3rem] h-[min(13dvw,3.1rem)] text-content font-bold border-small border-control-gray-l0
                                rounded-full bg-control-navy    sm:border-none`}>
                    Save AR Code
                </Button>
            </form>
        </div>
    );
}

export type {ARCodeToolForm}
export {ARCodeTool};
