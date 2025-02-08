import React, {FC} from "react";
import Image from "next/image";

import {CardData} from "@/app/types/billing";

import {BillingService} from "@/app/services";

import {useModal, useUser} from "@/app/context";

import {BaseModal, MessageModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";

import SVG_CARD from '/public/images/card.svg';


const BTN_CN = 'px-xxs h-[--h-control] rounded-full';


interface Props {
    card: CardData;
}

const RemovePaymentMethodModal: FC<Props> = (props: Props) => {
    const {card} = props;
    const {userData, fetchUserData} = useUser();
    const modalCtx = useModal();

    const handleRemove = async () => {
        if (!userData || !card.profileId)
            return;
        try {
            const {message} = await BillingService.postDeleteCard(card.profileId, card.id, userData.email);
            modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            await fetchUserData();
        } catch (error: unknown) {
            if (typeof error === 'string')
                modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    }

    return (
        <BaseModal
            title={'Remove Payment Method'}
            className={`bg-white [&_hr]:border-gray-l0 [&_h2]:text-gray [&_h2+button]:brightness-50 w-[min(90dvw,33rem)]
                        font-oxygen text-basic`}
            classNameContent={'text-gray text-center'}
        >
                <span className={'inline-block'}>
                    <span>Remove {card.nickName}</span>
                    <span
                        className={`bg-white-d1 rounded-s p-xs flex items-center my-s gap-xs`}>
                        <Image src={SVG_CARD} alt={'card'} className={'w-[min(12.5dvw,4.75rem)] h-auto'}/>
                        <span><span
                            className={'capitalize'}>{card.type}</span> Ending in •••• {card.cardNumber.slice(-4)}</span>
                    </span>
                    <span className={'flex gap-[0.625rem] font-bold text-section text-primary justify-center'}>
                        <Button
                            className={`border-red text-red border-s ${BTN_CN}`}
                            onClick={() => handleRemove()}
                        >
                          Remove
                        </Button>
                        <Button
                            className={`bg-gray-l0 ${BTN_CN}`}
                            onClick={() => modalCtx.closeModal()}
                        >
                            Cancel
                        </Button>
                    </span>
                </span>
        </BaseModal>
    )
}

export {RemovePaymentMethodModal}