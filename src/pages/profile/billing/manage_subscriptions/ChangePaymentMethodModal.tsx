import React, {Dispatch, FC, FormEvent, SetStateAction, useRef, useState} from "react";
import {ReactSVG} from "react-svg";
import Image from "next/image";

import {CardData, SavedCardFull} from "@/app/types/billing";
import {Route} from "@/app/static";

import {BillingService} from "@/app/services";

import {mapSavedCard} from "@/app/utils";
import {useSaveOnLeave} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {BaseModal, MessageModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";

import SVG_CARD from "/public/images/icons/card.svg";
import SVG_MARK from "/public/images/icons/mark.svg";


const BTN_CN = 'px-[--1drs] h-[--h-control-dl] rounded-full';


interface Props {
    savedCards: SavedCardFull[];
    setUpdateCards: Dispatch<SetStateAction<boolean>>;
}

const ChangePaymentMethodModal: FC<Props> = (props: Props) => {
    const {savedCards, setUpdateCards} = props;

    const modalCtx = useModal();
    const {userData} = useUser();

    const formRef = useRef<HTMLFormElement | null>(null);
    const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);


    const updateCard = async () => {
        if (!userData || selectedCardIdx === null)
            return;
        try {
            const updatedCard: CardData = {
                ...mapSavedCard(savedCards[selectedCardIdx]),
                isPreferred: true,
            }
            const {message} = await BillingService.postUpdateCard(updatedCard, userData.email);
            modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            setUpdateCards(true);
        } catch (error: unknown) {
            if (typeof error === 'string')
                modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    }

    useSaveOnLeave(async () => {
        if (formRef.current !== null)
            await updateCard();
    });


    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await updateCard();
    }


    // Elements
    const SavedCards = savedCards.map((card, idx) => {
        const {preferred} = card;
        return (
            <li
                key={card.nickName + idx}
                onClick={() => setSelectedCardIdx(idx)}
                className={`flex justify-between text-content items-center px-[--s-small] py-[0.7rem] rounded-small
                            sm:py-0 ${!preferred && selectedCardIdx === idx ? 'bg-control-white-d1' : ''}`}
            >
                <span className={`flex items-center ${preferred ? 'brightness-[2.4]' : ''}`}>
                    <ReactSVG src={SVG_CARD.src}
                              className={`[&_svg]:w-[min(3.9dvw,1.35rem)] mr-[min(2dvw,0.65rem)] [&_path]:fill-gray`}/>
                    <span
                        className={'text-content'}>{card.nickName ?? (card.cardType + ' **** ' + card.cardNumber.slice(-4))}</span>
                </span>
                {preferred ?
                    <Image src={SVG_MARK} alt={'mark'} className={'w-[min(2.4dvw,0.8125rem)] h-auto'}/> : null}
            </li>
        )
    });

    return (
        <BaseModal
            title={'Change Payment method'}
            className={'bg-control-white [&_hr]:border-control-gray-l0 [&_h2]:text-gray [&_path]:fill-gray w-[min(90dvw,30rem)]'}
            classNameContent={'text-gray text-center'}
        >
            <form ref={formRef} onSubmit={handleFormSubmit} className={'contents'}>
                <ul className={'list-none flex flex-col gap-y-[--s-small]'}>{SavedCards}</ul>
                <PageLink href={Route.EditPaymentMethod}
                          className={'w-full justify-center sm:justify-start sm:px-[--s-small]'}>
                    <Button
                        icon={'plus'}
                        className={'font-bold text-content mt-[min(2.7dvw,1.5rem)]'}
                        classNameIcon={'sm:[&_*]:w-[--p-content-4xs]'}
                    >
                        Add alternative payment method
                    </Button>
                </PageLink>
                <span
                    className={'flex gap-[--s-d2l-smallest] font-bold mt-[--1hdr] text-small justify-center'}>
                    <Button
                        type={'submit'}
                        className={`border-small border-control-white-d0 text-gray ${BTN_CN}`}
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
            </form>
        </BaseModal>
    )
}

export {ChangePaymentMethodModal}