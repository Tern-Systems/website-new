import {FC, useState} from "react";
import {ReactSVG} from "react-svg";
import Image from "next/image";

import {CardData} from "@/app/types/billing";
import {Route} from "@/app/static";

import {useSaveOnLeave} from "@/app/hooks";
import {useModal} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {BaseModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";

import SVG_CARD from "@/assets/images/icons/card.svg";
import SVG_MARK from "@/assets/images/icons/mark.svg";


const BTN_CN = 'px-[--1drs] h-[--h-control-dl] rounded-full';


interface Props {
    savedCards: CardData[];
}

const ChangePaymentMethodModal: FC<Props> = (props: Props) => {
    const {savedCards} = props;

    const modalCtx = useModal();
    useSaveOnLeave(async ()=>{
        // TODO save
    });

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
                onClick={() => setSelectedCardIdx(idx)}
                className={`flex justify-between text-content items-center px-[--s-small] py-[0.7rem] rounded-small
                            sm:py-0 ${!isPreferred && selectedCardIdx === idx ? 'bg-control-white-d1' : ''}`}
            >
                <span className={`flex items-center ${isPreferred ? 'brightness-[2.4]' : ''}`}>
                    <ReactSVG src={SVG_CARD.src} className={`[&_svg]:w-[min(3.9dvw,1.35rem)] mr-[min(2dvw,0.65rem)] [&_path]:fill-gray`}/>
                    <span className={'text-content'}>{card.nickName}</span>
                </span>
                {isPreferred ? <Image src={SVG_MARK} alt={'mark'} className={'w-[min(2.4dvw,0.8125rem)]'}/> : null}
            </li>
        )
    });

    return (
        <BaseModal
            title={'Change Payment method'}
            className={'bg-control-white [&_hr]:border-control-gray-l0 [&_h2]:text-gray [&_path]:fill-gray w-[min(90dvw,30rem)]'}
            classNameContent={'text-gray text-center'}
        >
            <ul className={'list-none flex flex-col gap-y-[--s-small]'}>{SavedCards}</ul>
            <PageLink href={Route.EditPaymentMethod} className={'w-full justify-center sm:justify-start sm:px-[--s-small]'}>
                <Button
                    icon={'plus'}
                    className={'font-bold text-content mt-[min(2.7dvw,1.5rem)]'}
                >
                    Add alternative payment method
                </Button>
            </PageLink>
            <span
                className={'flex gap-[--s-d2l-smallest] font-bold mt-[--1hdr] text-small justify-center'}>
                <Button
                    className={`border-small border-control-white-d0 text-gray ${BTN_CN}`}
                    onClick={() => handleSave()}
                >
                    Done
                </Button>
                <Button
                    className={`bg-control-gray-l0 ${BTN_CN}`}
                    onClick={() => modalCtx.closeModal()}
                >
                  Cancel
                </Button>
            </span>
        </BaseModal>
    )
}

export {ChangePaymentMethodModal}