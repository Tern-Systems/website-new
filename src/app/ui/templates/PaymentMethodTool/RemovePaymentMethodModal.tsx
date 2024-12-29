import {FC} from "react";
import Image from "next/image";

import {CardData} from "@/app/types/billing";

import {useModal} from "@/app/context";

import {BaseModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";

import SVG_CARD from '@/assets/images/card.svg';


const BTN_CN = 'px-[--1drs] h-[--h-control] rounded-full';


interface Props {
    card: CardData;
}

const RemovePaymentMethodModal: FC<Props> = (props: Props) => {
    const {card} = props;

    const modalCtx = useModal();

    const handleRemove = async () => {
        // TODO
        modalCtx.closeModal();
    }

    return (
        <BaseModal
            title={'Remove Payment Method'}
            className={`bg-control-white [&_hr]:border-control-gray-l0 [&_h2]:text-gray [&_h2+button]:brightness-50 w-[min(90dvw,33rem)]
                        font-oxygen text-[--1drl]`}
            classNameContent={'text-gray text-center'}
        >
                <span className={'inline-block'}>
                    <span>Remove {card.nickName}</span>
                    <span
                        className={`bg-control-white-d1 rounded-small p-[--1qdrs] flex items-center my-[--s-normal] gap-[--1qdr]`}>
                        <Image src={SVG_CARD} alt={'card'} className={'w-[min(12.5dvw,4.75rem)]'}/>
                        <span><span
                            className={'capitalize'}>{card.type}</span> Ending in •••• {card.cardNumber.slice(-4)}</span>
                    </span>
                    <span className={'flex gap-[0.625rem] font-bold text-small text-primary justify-center'}>
                        <Button
                            className={`border-control-red text-red border-small ${BTN_CN}`}
                            onClick={() => handleRemove()}
                        >
                          Remove
                        </Button>
                        <Button
                            className={`bg-control-gray-l0 ${BTN_CN}`}
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