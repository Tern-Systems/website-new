import React, {FC, FormEvent, useRef} from "react";
import {ReactSVG} from "react-svg";
import Image from "next/image";

import {CardData, SavedCardFull} from "@/app/types/billing";
import {Route} from "@/app/static";

import {BillingService} from "@/app/services";

import {mapSavedCard} from "@/app/utils";
import {useForm, useSaveOnLeave} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {PageLink} from "@/app/ui/layout";
import {BaseModal, MessageModal} from "@/app/ui/modals";
import {Button, Input} from "@/app/ui/form";

import SVG_CARD from "/public/images/icons/card.svg";
import SVG_MARK from "/public/images/icons/mark.svg";
import SVG_CARD_NUM from "/public/images/icons/card-num.svg";


type FormData = Pick<CardData, 'cvc'> & {
    selectedCardIdx: number | null;
}

const fORM_DATA_DEFAUL: FormData = {
    cvc: '',
    selectedCardIdx: null,
}

const BTN_CN = 'px-[--1drs] h-[--h-control-dl] rounded-full';


interface Props {
    savedCards: SavedCardFull[];
}

const ChangePaymentMethodModal: FC<Props> = (props: Props) => {
    const {savedCards} = props;

    const modalCtx = useModal();
    const {userData} = useUser();

    const formRef = useRef<HTMLFormElement | null>(null);
    const [formData, setFormData, setFormState] = useForm<FormData>(fORM_DATA_DEFAUL);


    const updateCard = async () => {
        if (!userData || formData.selectedCardIdx === null)
            return;
        try {
            const updatedCard: CardData = {
                ...mapSavedCard(savedCards[formData.selectedCardIdx]),
                isPreferred: true,
                cvc: formData.cvc,
            }
            await BillingService.postUpdateCard(updatedCard, userData.email);
            modalCtx.closeModal();
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
                onClick={() => setFormState((prevState) => ({...prevState, selectedCardIdx: idx}))}
                className={`flex justify-between text-content items-center px-[--s-small] py-[0.7rem] rounded-small
                            sm:py-0 ${!preferred && formData.selectedCardIdx === idx ? 'bg-control-white-d1' : ''}`}
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
                <Input
                    type={'number'}
                    value={formData.cvc}
                    maxLength={3}
                    onChange={setFormData('cvc')}
                    placeholder={'CVC'}
                    icons={[SVG_CARD_NUM]}
                    classNameWrapper={'w-full py-[--p-content-5xs]'}
                    className={'w-full h-[3rem] rounded-small px-[--p-content-3xs]  sm:x-[h-[1rem],text-section-3xs]'}
                    classNameIcon={'sm:w-[--p-content-3xs]'}
                    required
                />
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