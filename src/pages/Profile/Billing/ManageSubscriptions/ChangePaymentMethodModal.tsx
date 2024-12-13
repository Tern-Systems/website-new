import {FC, useState} from "react";
import Image from "next/image";

import {CardData} from "@/app/types/billing";
import {Route} from "@/app/static";

import {useModal} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {BaseModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";

import SVG_CARD from "@/assets/images/icons/card.svg";
import SVG_MARK from "@/assets/images/icons/mark.svg";


interface Props {
    savedCards: CardData[];
}

const ChangePaymentMethodModal: FC<Props> = (props: Props) => {
    const {savedCards} = props;

    const modalCtx = useModal();

    const [selectedCardIdx, setSelectedCardIdx] = useState(-1);

    const handleSave = async () => {
        // TOOD
        modalCtx.closeModal();
    }

    // Elements
    const SavedCards = savedCards.map((card, idx) => {
        const isPreferred = card.isDefault;
        return (
            <li
                key={card.nickName + idx}
                className={`flex justify-between text-[1.3125rem] items-center px-[0.8rem] py-[0.7rem] rounded-[0.5625rem]
                        ${!isPreferred && selectedCardIdx === idx ? 'bg-[#D3D3D3]' : ''}`}
                onClick={() => setSelectedCardIdx(idx)}
            >
            <span className={`flex ${isPreferred ? 'brightness-150' : ''}`}>
                <Image src={SVG_CARD} alt={'card'} className={'w-[1.35rem] mr-[0.65rem]'}/>
                <span>{card.nickName}</span>
            </span>
                {isPreferred ? <Image src={SVG_MARK} alt={'mark'} className={'w-[0.8125rem]'}/> : null}
            </li>
        )
    });

    return (
        <BaseModal
            title={'Change Payment method'}
            className={'bg-control4 [&_hr]:border-control5 [&_h2]:text-form [&_h2+button]:brightness-50 w-[30.31rem]'}
            classNameContent={'text-form text-center'}
        >
            <ul className={'list-none flex flex-col gap-y-[0.84rem]'}>{SavedCards}</ul>
            <PageLink href={Route.EditPaymentMethod}>
                <Button
                    icon={'plus'}
                    className={'font-bold text-[1.3125rem] mt-[1.51rem]'}
                >
                    Add alternative payment method
                </Button>
            </PageLink>
            <span
                className={'flex gap-[0.62rem] font-bold mt-[1.56rem] text-[0.875rem] justify-center text-primary'}>
                <Button
                    className={'border-small border-control3 text-form px-[1rem] h-[1.43rem] rounded-full'}
                    onClick={() => handleSave()}
                >
                    Done
                </Button>
                <Button
                    className={'bg-control2 px-[1rem] h-[1.43rem] rounded-full'}
                    onClick={() => modalCtx.closeModal()}
                >
                  Cancel
                </Button>
            </span>
        </BaseModal>
    )
}

export {ChangePaymentMethodModal}