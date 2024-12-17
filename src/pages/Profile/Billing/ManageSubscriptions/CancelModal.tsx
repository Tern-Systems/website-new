import {FC} from "react";

import {Route} from "@/app/static";

import {useModal} from "@/app/context";

import {BaseModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";
import {PageLink} from "@/app/ui/layout";


const CancelModal: FC = () => {
    const modalCtx = useModal();

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
                        <PageLink href={Route.Billing}>
                            <Button className={'bg-control2 px-[1rem] h-[1.43rem] rounded-full'}>
                              Return to Billing
                            </Button>
                        </PageLink>
                    </span>
                </span>
        </BaseModal>
    )
}

export {CancelModal}