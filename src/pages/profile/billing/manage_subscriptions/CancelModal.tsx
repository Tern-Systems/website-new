import React, {FC} from "react";

import {Route} from "@/app/static";

import {useModal, useUser} from "@/app/context";

import {BaseModal, MessageModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";
import {PageLink} from "@/app/ui/layout";
import {BillingService} from "@/app/services";


const BTN_CN = 'px-[min(2.7dvw,1rem)] h-[--h-control-dl] rounded-full';


const CancelModal: FC = () => {
    const {userData} = useUser();
    const modalCtx = useModal();

    const handleDelete = async () => {
        if (!userData)
            return;
        await BillingService.postCancelSubscription(userData.email);
        modalCtx.openModal(<MessageModal>The plan was cancelled</MessageModal>);
    }

    return (
        <BaseModal
            title={'Cancel Plan'}
            className={'bg-control-white [&_hr]:border-control-gray-l0 [&_h2]:text-gray [&_h2+button]:brightness-50 w-[90dvw] max-w-[33rem]'}
            classNameContent={'text-gray text-center text-[--1drl]'}
        >
            <div className={'inline-block max-w-[25rem]'}>
                <p className={'mb-[--1drs] text-nowrap sm:max-w-[70%] sm:whitespace-pre-wrap place-self-center'}>
                    You&apos;re about to cancel your ARCH Pro Plan subscription.
                </p>
                <p>
                    If you wish to proceed, please click the red <span
                    className={'font-bold'}>Cancel Subscription</span> button. Otherwise, click the
                    <span className={'font-bold'}> Return to Billing</span> button to return to managing your ARCH
                    subscription billing settings.
                </p>
                <span
                    className={'flex gap-[--s-dl-smallest] font-bold mt-[--1hdr] text-small justify-center text-[#FFFFFF]'}>
                        <Button
                            onClick={() => handleDelete()}
                            className={`bg-control-red ${BTN_CN}`}
                        >
                          Cancel Subscription
                        </Button>
                        <PageLink href={Route.Billing}>
                            <Button className={`bg-control-gray-l0 ${BTN_CN}`}>
                              Return to Billing
                            </Button>
                        </PageLink>
                    </span>
            </div>
        </BaseModal>
    )
}

export {CancelModal}