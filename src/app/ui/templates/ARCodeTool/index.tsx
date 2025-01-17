import React, {FC, FormEvent, useCallback, useEffect, useRef} from "react";
import html2canvas from "html2canvas";
import {randomBytes} from "crypto";
import Image from "next/image";
import {useQRCode} from "next-qrcode";
import cn from "classnames";

import {SubscriptionBase} from "@/app/types/subscription";
import {ARCode} from "@/app/types/arcode";
import {FlowQueue} from "@/app/context/Flow.context";
import {Route} from "@/app/static";

import {ARCHService} from "@/app/services";

import {useForm, useNavigate, useSaveOnLeave} from "@/app/hooks";
import {useFlow, useModal, useUser} from "@/app/context";

import {ScrollEnd} from "@/app/ui/misc";
import {AuthModal, MessageModal} from "@/app/ui/modals";
import {Button, Input} from "@/app/ui/form";

import SVG_ARCH from "/public/images/arch-logo.svg";


const MEDIA_ID_LENGTH = 16;

type ARCodeToolForm =
    Pick<ARCode, 'backgroundColor' | 'moduleColor' | 'name' | 'mediaId' | 'qrCodeUrl' | 'videoPath' | 'buttonLink'>
    & Partial<Pick<ARCode, 'video'>>;

const generateId = () => randomBytes(MEDIA_ID_LENGTH).toString('hex');
const generateFormDefault = (): ARCodeToolForm => ({
    mediaId: generateId(),
    backgroundColor: '#000000',
    moduleColor: '#ffffff',
    name: '',
    video: undefined,
    videoPath: '',
    qrCodeUrl: '',
    buttonLink: '',
})
const FORM_COLOR_PICKERS = ['module', 'background'];


interface Props {
    arCode?: ARCode;
}

const ARCodeTool: FC<Props> = (props: Props) => {
    const {arCode} = props;
    const isEdit = arCode !== undefined;

    const flowCtx = useFlow();
    const modalCtx = useModal();
    const {isLoggedIn, userData} = useUser();
    const [navigate] = useNavigate(true);
    const {SVG} = useQRCode();

    const qrRef = useRef<HTMLDivElement | null>(null);
    const [formValue, setFormValue, setFormValueState] = useForm<ARCodeToolForm>(
        (isEdit
                ? {
                    mediaId: arCode.mediaId,
                    backgroundColor: arCode.backgroundColor,
                    moduleColor: arCode.moduleColor,
                    name: arCode.name,
                    qrCodeUrl: arCode.qrCodeUrl,
                    videoPath: arCode.videoPath,
                    buttonLink: arCode.buttonLink,
                }
                : generateFormDefault()
        ),
        () => preventLeaving(true)
    );

    const processCode = useCallback(async () => {
        if (!userData || !formValue || !qrRef.current)
            return;

        try {
            let qrImage: File | undefined = undefined;
            // Create an image of QR
            if (!isEdit) {
                const canvas = await html2canvas(qrRef.current);
                const data = canvas.toDataURL('image/png');
                const response = await fetch(data);
                const blob = await response.blob();
                qrImage = new File([blob], formValue.name, {type: "image/png"});
            }

            await ARCHService.postSaveQR(
                userData.email, formValue.name, isEdit, formValue.mediaId,
                formValue.backgroundColor, formValue.moduleColor, qrImage, formValue.video,
                formValue.buttonLink,
            );

            const SuccessModal = () => (
                <MessageModal>
                    Your AR Code <span className={'font-bold'}>{formValue.name}</span> has been successfully saved
                </MessageModal>
            );
            modalCtx.openModal(<SuccessModal/>);

            preventLeaving(false);
            if (!arCode)
                setFormValueState(generateFormDefault());
            else
                navigate(Route.SavedCodes);
        } catch (error: unknown) {
            if (typeof error === 'string')
                modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
        // eslint-disable-next-line
    }, [formValue, userData])

    const preventLeaving = useSaveOnLeave(processCode);


    useEffect(() => {
        if (arCode)
            setFormValueState(arCode);
    }, [setFormValueState, arCode])


    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const flow: FlowQueue = [];
        if (!isLoggedIn) {
            flow.push(() => {
                const info = 'You must have an ARCH subscription to save an AR code. Please create an account below to purchase a Plan.';
                return modalCtx.openModal(<AuthModal info={info}/>, {hideContent: true});
            });
        }

        const subscription: SubscriptionBase | undefined = userData?.subscriptions.find((entry: SubscriptionBase) => entry.subscription === 'ARCH');
        if (!subscription) {
            flow.push(() => {
                preventLeaving(false);
                navigate(Route.ServicePricing)
            })
        }

        if (!flow.length)
            return processCode();

        flow.push(async () => {
            await processCode()
            navigate(Route.SavedCodes);
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


    // Generate QR code as data URL
    return (
        <div className={'flex my-auto w-full h-full px-[--p-content-xs] justify-center items-center'}>
            <div className={cn(
                `h-[calc(100%-2*var(--p-content-xxl))] content-center`,
                'sm:overflow-y-scroll',
                'sm:landscape:h-[calc(100%-var(--p-content-xs))]',
            )}
            >
                <form
                    onSubmit={handleFormSubmit}
                    className={cn(
                        `grid auto-rows-min`,
                        'grid-cols-[minmax(0,32rem),1fr] gap-x-[min(6.4dvw,8.15rem)] p-[3rem] h-fit [&>*]:w-full',
                        'lg:[&>*]:col-start-2 lg:x-[gap-y-[--p-content-xl],p-[4rem],rounded-small,bg-section-navy,border-small,border-control-gray]',
                        'md:x-[gap-[--p-content],p-0]',
                        'md:portrait:grid-cols-1',
                        `sm:x-[gap-y-[--p-content-xs],p-0,border-none,bg-transparent]`,
                        'sm:portrait:grid-cols-1',
                        `sm:landscape:x-[grid-rows-5,gap-y-[--p-content-5xs],gap-x-[--p-content-3xs]]`,
                        `sm:landscape:grid-cols-[minmax(21rem,14fr),10fr,10rem] sm:landscape:[&>*]:col-start-1`,
                    )}
                >
                    <div
                        className={cn(
                            `flex justify-center cursor-pointer`,
                            `[&]:col-start-1 row-span-7 [&_*]:x-[w-full,h-full] rounded-small overflow-hidden`,
                            `md:row-span-1`,
                            `sm:portrait:[&_*]:w-[66dvw]`,
                            `sm:landscape:[&_*]:h-full sm:landscape:[&]:x-[col-start-2,row-start-1,row-span-5]`,
                        )}
                    >
                        <div ref={qrRef} onClick={() => setFormValue('mediaId')(generateId())}>
                            <SVG
                                text={'https://arch.tern.ac/' + formValue.mediaId}
                                options={{
                                    margin: 1,
                                    color: {
                                        dark: formValue.backgroundColor,
                                        light: formValue.moduleColor,
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <Image
                        src={SVG_ARCH}
                        alt={'arch-logo'}
                        className={`hidden place-self-center h-[4rem] w-auto  lg:x-[inline,-mb-[1rem]]`}
                    />
                    <span
                        className={cn(
                            'contents',
                            'md:x-[flex,flex-col,gap-y-[--p-content],p-[3rem],rounded-small,bg-section-navy]',
                            'md:landscape:justify-between'
                        )}
                    >
                        <Input
                            type={"text"}
                            placeholder={'Name'}
                            value={formValue.name}
                            onChange={setFormValue('name')}
                            className={cn(
                                `px-[0.68rem] h-[2.3rem] w-full`,
                                `lg:-mb-[0.72rem]`,
                                `rounded-smallest border-small border-control-white bg-control-gray-l0`,
                                `text-heading`
                            )}
                            required
                        />
                        <Input
                            type={"file"}
                            accept={'image/*,video/*'}
                            onChange={(event) => {
                                if (!event.target.files)
                                    return;
                                const file = Array.from(event.target.files)?.[0];
                                if (file) {
                                    setFormValueState((prevState) =>
                                        ({...prevState, video: file, videoPath: file.name})
                                    );
                                }
                            }}
                            classNameWrapper={'h-[3.125rem] rounded-full bg-control-white font-bold text-heading-s text-black  sm:landscape:col-start-1'}
                            classNameLabel={'max-w-[75%]'}
                            classNameIcon={'[&_*]:w-[1rem]'}
                            required={!arCode}
                        >
                            {formValue.videoPath ? formValue.videoPath : 'Upload Media'}
                        </Input>
                        {ColorPickers}
                        <Input
                            type={"text"}
                            placeholder={'Button Link'}
                            value={formValue.buttonLink}
                            onChange={setFormValue('buttonLink')}
                            className={cn(
                                `px-[0.68rem] h-[2.3rem] w-full`,
                                `lg:-mb-[0.72rem]`,
                                `rounded-smallest border-small border-control-white bg-control-gray-l0`,
                                `text-heading`,
                            )}
                            required
                        />
                        <Button
                            type={'submit'}
                            icon={'file'}
                            className={cn(
                                `px-[4.3rem] h-[3.125rem] w-full`,
                                `rounded-full border-control-gray-l0 border-small bg-section-navy`,
                                `text-heading-s font-bold`,
                                `sm:border-none`,
                                'sm:landscape:[&]:x-[col-start-3,row-start-2,row-span-3,flex-col,justify-between,p-[--p-content-xs],h-full,rounded-small,text-section]'
                            )}
                            classNameIcon={'hidden [&_*]:size-[2.5rem]  sm:landscape:block'}
                        >
                            Save to Library
                        </Button>
                    </span>
                </form>
                <ScrollEnd/>
            </div>
        </div>
    );
}

export type {ARCodeToolForm}
export {ARCodeTool};
