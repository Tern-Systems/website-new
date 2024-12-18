import {FC} from "react";
import Image from "next/image";

import {CardData} from "@/app/types/billing";

import {useModal} from "@/app/context";

import {BaseModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";

import SVG_CARD from '@/assets/images/card.svg';


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
            className={'bg-control-white [&_hr]:border-control-gray-l0 [&_h2]:text-gray [&_h2+button]:brightness-50 w-[33rem]'}
            classNameContent={'text-gray text-center'}
        >
                <span className={'inline-block'}>
                    <span>Remove {card.nickName}</span>
                    <span
                        className={`bg-control-white-d1 rounded-small p-[1.25rem] flex items-center mt-[1.55rem] gap-[1.25rem]`}>
                        <Image src={SVG_CARD} alt={'card'} className={'w-[4.75rem]'}/>
                        <span><span
                            className={'capitalize'}>{card.type}</span> Ending in •••• {card.cardNumber.slice(-4)}</span>
                    </span>
                    <span
                        className={'flex gap-[0.625rem] font-bold mt-[1.55rem] text-small justify-center'}>
                        <Button
                            className={'bg-control-red px-[1rem] h-[1.45rem] rounded-full'}
                            onClick={() => handleRemove()}
                        >
                          Remove
                        </Button>
                        <Button
                            className={'bg-control-gray-l0 px-[1rem] h-[1.45rem] rounded-full'}
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