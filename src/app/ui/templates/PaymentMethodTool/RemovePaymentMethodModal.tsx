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
            className={'bg-control4 [&_hr]:border-control5 [&_h2]:text-form [&_h2+button]:brightness-50 w-[33rem]'}
            classNameContent={'text-form text-center'}
        >
                <span className={'inline-block'}>
                    <span>Remove {card.nickName}</span>
                    <span
                        className={`bg-[#D3D3D3] rounded-[0.5625rem] p-[1.25rem] flex items-center mt-[1.56rem] gap-[1.25rem]`}>
                        <Image src={SVG_CARD} alt={'card'} className={'w-[4.6875rem]'}/>
                        <span><span
                            className={'capitalize'}>{card.type}</span> Ending in •••• {card.cardNumber.slice(-4)}</span>
                    </span>
                    <span
                        className={'flex gap-[0.62rem] font-bold mt-[1.56rem] text-[0.875rem] justify-center text-primary'}>
                        <Button
                            className={'bg-[#F42200] px-[1rem] h-[1.43rem] rounded-full'}
                            onClick={() => handleRemove()}
                        >
                          Remove
                        </Button>
                        <Button
                            className={'bg-control2 px-[1rem] h-[1.43rem] rounded-full'}
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