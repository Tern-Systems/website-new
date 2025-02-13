import React, { Dispatch, FC, FormEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import { ReactSVG } from 'react-svg';
import Image from 'next/image';

import { CardData, SavedCardFull } from '@/app/types/billing';
import { Route } from '@/app/static';

import { BillingService } from '@/app/services';

import { mapSavedCard } from '@/app/utils';
import { useSaveOnLeave } from '@/app/hooks';
import { useModal, useUser } from '@/app/context';

import { PageLink } from '@/app/ui/layout';
import { BaseModal, MessageModal } from '@/app/ui/modals';
import { Button } from '@/app/ui/form';

import SVG_CARD from '/public/images/icons/card.svg';
import SVG_MARK from '/public/images/icons/mark.svg';

const BTN_CN = 'px-xxs h-h-button-n rounded-full';

interface Props {
    savedCards: SavedCardFull[];
    setUpdateCards: Dispatch<SetStateAction<boolean>>;
}

const ChangePaymentMethodModal: FC<Props> = (props: Props) => {
    const { savedCards, setUpdateCards } = props;

    const modalCtx = useModal();
    const { userData } = useUser();

    const formRef = useRef<HTMLFormElement | null>(null);
    const submitRef = useRef<HTMLButtonElement | null>(null);

    const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);

    //eslint-disable-next-line
    useEffect(() => setPreventLeaveState(true), []);

    const updateCard = async () => {
        if (!userData || selectedCardIdx === null || !formRef.current || !submitRef.current) return false;
        try {
            if (!formRef.current.checkValidity()) {
                submitRef.current.click();
                return false;
            }

            const updatedCard: CardData = {
                ...mapSavedCard(savedCards[selectedCardIdx]),
                isPreferred: true,
            };
            const { message } = await BillingService.postUpdateCard(updatedCard, userData.email);
            modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            setUpdateCards(true);
            return true;
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            return false;
        }
    };
    const setPreventLeaveState = useSaveOnLeave({ onSave: updateCard });

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await updateCard();
    };

    // Elements
    const SavedCards = savedCards.map((card, idx) => {
        const { preferred } = card;
        return (
            <li
                key={card.nickName + idx}
                onClick={() => setSelectedCardIdx(idx)}
                className={`flex items-center justify-between rounded-s px-3xs py-[0.7rem] text-heading-s sm:py-0 ${!preferred && selectedCardIdx === idx ? 'bg-white-d1' : ''}`}
            >
                <span className={`flex items-center ${preferred ? 'brightness-[2.4]' : ''}`}>
                    <ReactSVG
                        src={SVG_CARD.src}
                        className={`mr-[min(2dvw,0.65rem)] [&_path]:fill-gray [&_svg]:w-[min(3.9dvw,1.35rem)]`}
                    />
                    <span className={'text-heading-s'}>
                        {card.nickName ?? card.cardType + ' **** ' + card.cardNumber.slice(-4)}
                    </span>
                </span>
                {preferred ? (
                    <Image
                        src={SVG_MARK}
                        alt={'mark'}
                        className={'h-auto w-[min(2.4dvw,0.8125rem)]'}
                    />
                ) : null}
            </li>
        );
    });

    return (
        <BaseModal
            title={'Change Payment method'}
            className={'w-[min(90dvw,30rem)] bg-white [&_h2]:text-gray [&_hr]:border-gray-l0 [&_path]:fill-gray'}
            classNameContent={'text-gray text-center'}
        >
            <form
                ref={formRef}
                onSubmit={handleFormSubmit}
                className={'contents'}
            >
                <ul className={'flex list-none flex-col gap-y-3xs'}>{SavedCards}</ul>
                <PageLink
                    href={Route.EditPaymentMethod}
                    className={'w-full justify-center sm:justify-start sm:px-3xs'}
                >
                    <Button
                        icon={'plus'}
                        className={'mt-[min(2.7dvw,1.5rem)] text-heading-s font-bold'}
                        classNameIcon={'sm:[&_*]:w-4xs'}
                    >
                        Add alternative payment method
                    </Button>
                </PageLink>
                <span className={'mt-s flex justify-center gap-4xs text-section font-bold'}>
                    <Button
                        ref={submitRef}
                        type={'submit'}
                        className={`border-s border-white-d0 text-gray ${BTN_CN}`}
                    >
                        Done
                    </Button>
                    <Button
                        className={`bg-gray-l0 ${BTN_CN}`}
                        onClick={() => modalCtx.closeModal()}
                    >
                        Cancel
                    </Button>
                </span>
            </form>
        </BaseModal>
    );
};

export { ChangePaymentMethodModal };
