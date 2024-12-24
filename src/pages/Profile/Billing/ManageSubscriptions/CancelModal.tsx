import {FC} from "react";

import {Route} from "@/app/static";

import {useModal} from "@/app/context";

import {BaseModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";
import {PageLink} from "@/app/ui/layout";


const BTN_CN = 'px-[min(2.7dvw,1rem)] h-[min(6.1dvw,1.43rem)] rounded-full';


const CancelModal: FC = () => {
    const modalCtx = useModal();

    const handleDelete = async () => {
        // TODO
        modalCtx.closeModal();
    }

    return (
        <BaseModal
            title={'Cancel Plan'}
            className={'bg-control-white [&_hr]:border-control-gray-l0 [&_h2]:text-gray [&_h2+button]:brightness-50 w-[90dvw] max-w-[33rem]'}
            classNameContent={'text-gray text-center text-[min(3.2dvw,1rem)]'}
        >
            <div className={'inline-block max-w-[25rem]'}>
                <p className={'mb-[min(2.6dvw,1rem)] text-nowrap sm:max-w-[70%] sm:whitespace-pre-wrap place-self-center'}>
                    You&apos;re about to cancel your ARCH Pro Plan subscription.
                </p>
                <p>
                    If you wish to proceed, please click the red <span
                    className={'font-bold'}>Cancel Subscription</span> button. Otherwise, click the
                    <span className={'font-bold'}> Return to Billing</span> button to return to managing your ARCH
                    subscription billing settings.
                </p>
                <span
                    className={'flex gap-[min(1.3dvw,0.62rem)] font-bold mt-[min(4dvw,1.56rem)] text-small justify-center text-[#FFFFFF]'}>
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