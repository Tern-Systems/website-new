import React, {FC, FormEvent, useCallback, useEffect, useState} from "react";
import Image from "next/image";
import {useQRCode} from "next-qrcode";

import {ARCode} from "@/app/types/arcode";
import {UserSubscription} from "@/app/context/User.context";
import {FlowQueue} from "@/app/context/Flow.context";
import {Route} from "@/app/static";

import {useBreakpointCheck, useForm, useNavigate, useSaveOnLeave} from "@/app/hooks";
import {useFlow, useModal, useUser} from "@/app/context";

import {AuthModal, BaseModal} from "@/app/ui/modals";
import {Button, Input} from "@/app/ui/form";

import SVG_ARCH from "@/assets/images/arch-logo.svg";


type ARCodeToolForm = Omit<ARCode, 'file'> & Partial<Pick<ARCode, 'file'>>;

const FORM_DEFAULT: ARCodeToolForm = {id: '', backgroundColor: '#000000', moduleColor: '#ffffff', name: '', file: ''}
const FORM_COLOR_PICKERS = ['module', 'background'];
const AR_CODE_WIDTH = 440;
const MAX_AR_CODE_WIDTH = 440;


interface Props {
    editID?: string;
}

const ARCodeTool: FC<Props> = (props: Props) => {
    const {editID} = props;

    const flowCtx = useFlow();
    const modalCtx = useModal();
    const {isLoggedIn, userData} = useUser();
    const [navigate] = useNavigate();
    const {SVG} = useQRCode();
    const isSmScreen = useBreakpointCheck();

    const [qrSize, setQrSize] = useState(AR_CODE_WIDTH);
    const [formValue, setFormValue, setFormValueState] = useForm<ARCodeToolForm>({
        ...FORM_DEFAULT,
        id: editID ?? FORM_DEFAULT.id
    });

    const processCode = useCallback(async () => {
        // eslint-disable-next-line
        const result = null; // TODO

        const SuccessModal = () => {
            return (
                <BaseModal isSimple
                           className={'w-[18rem] h-[3.6rem] bottom-[7.2rem] right-[--p-small] border-control-white border-small'}>
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


    useEffect(() => {
        const handleResize = () => setQrSize(Math.min(MAX_AR_CODE_WIDTH, AR_CODE_WIDTH * window.innerWidth / 1100));
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

    return (
        <div
            className={`flex place-self-center my-auto p-[4rem] w-[min(90dvw,69rem)] bg-control-navy border-small border-control-gray rounded-small
                        sm:bg-transparent sm:flex-col sm:border-none sm:p-0 place-items-center`}>
            <div
                className={`mr-[min(6.4dvw,7.7rem)] cursor-pointer content-center place-items-center place-self-center   sm:mr-0 sm:mb-[5.3dvw]`}>
                <SVG
                    text={'https://arch.tern.ac/'}
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
                    name={'qr-name'}
                    placeholder={'Name'}
                    value={formValue.name}
                    onChange={setFormValue('name')}
                    className={`px-[min(3.4dvw,0.68rem)] h-[min(10dvw,2.3rem)] w-full text-header bg-control-gray-l0
                                border-small border-control-white rounded-smallest`}
                    required
                />
                <Input
                    type={"file"}
                    accept='image/png,image/jpeg,image/svg,image/jpg,image/webp,image/jpeg,image/gif,image/tiff,image/heif,image/heic'
                    name={'qr-file'}
                    classNameWrapper={'h-[min(13dvw,3.1rem)] font-bold text-content text-black bg-control-white rounded-full'}
                    required
                >
                    {editID ? formValue.file : 'Upload Media'}
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
