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
                className={`flex justify-between text-content items-center px-[0.8rem] py-[0.7rem] rounded-small
                        ${!isPreferred && selectedCardIdx === idx ? 'bg-control-white-d1' : ''}`}
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
            className={'bg-control-white [&_hr]:border-control-gray-l0 [&_h2]:text-gray [&_h2+button]:brightness-50 w-[30.31rem]'}
            classNameContent={'text-gray text-center'}
        >
            <ul className={'list-none flex flex-col gap-y-[0.84rem]'}>{SavedCards}</ul>
            <PageLink href={Route.EditPaymentMethod}>
                <Button
                    icon={'plus'}
                    className={'font-bold text-content mt-[1.51rem]'}
                >
                    Add alternative payment method
                </Button>
            </PageLink>
            <span
                className={'flex gap-[0.62rem] font-bold mt-[1.56rem] text-small justify-center'}>
                <Button
                    className={'border-small border-control-white-d0 text-gray px-[1rem] h-[1.43rem] rounded-full'}
                    onClick={() => handleSave()}
                >
                    Done
                </Button>
                <Button
                    className={'bg-control-gray-l0 px-[1rem] h-[1.43rem] rounded-full'}
                    onClick={() => modalCtx.closeModal()}
                >
                  Cancel
                </Button>
            </span>
        </BaseModal>
    )
}

export {ChangePaymentMethodModal}