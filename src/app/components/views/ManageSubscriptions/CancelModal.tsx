import {FC} from "react";
import {SectionsEnum} from "@/app/utils/sections";

import {useModal} from "@/app/context";
import {useNavigate} from "@/app/hooks/useNavigate";

import {BaseModal} from "@/app/components/modals";

import {Button} from "@/app/components/form";

const CancelModal: FC = () => {
    const modalCtx = useModal();
    const [navigate] = useNavigate();

    const handleDelete = async () => {
        // TODO
        modalCtx.closeModal();
    }

    return (
        <BaseModal
            title={'Cancel Plan'}
            className={'bg-control4 [&_hr]:border-control5 [&_h2]:text-form [&_h2+button]:brightness-50 w-[33rem]'}
            classNameContent={'text-form text-center'}
        >
                <span className={'inline-block w-[25.3135rem]'}>
                    <p className={'mb-[1rem] text-nowrap'}>You‘re about to cancel your ARCH Pro Plan subscription.</p>
                    <p>
                        If you wish to proceed, please click the red <span
                        className={'font-bold'}>Cancel Subscription</span> button. Otherwise, click the
                        <span className={'font-bold'}>Return to Billing</span> button to return to managing your ARCH subscription billing settings.
                    </p>
                    <span
                        className={'flex gap-[0.62rem] font-bold mt-[1.56rem] text-[0.875rem] justify-center text-primary'}>
                        <Button
                            className={'bg-[#F42200] px-[1rem] h-[1.43rem] rounded-full'}
                            onClick={() => handleDelete()}
                        >
                          Cancel Subscription
                        </Button>
                        <Button
                            className={'bg-control2 px-[1rem] h-[1.43rem] rounded-full'}
                            onClick={() => {
                                navigate(SectionsEnum.Billing);
                                modalCtx.closeModal();
                            }}
                        >
                          Return to Billing
                        </Button>
                    </span>
                </span>
        </BaseModal>
    )
}

export {CancelModal}