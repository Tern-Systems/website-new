'use client';

import { FC } from 'react';
import Image from 'next/image';

import { CardData } from '@/app/types/billing';

import { BillingService } from '@/app/services';

import { useModal, useUser } from '@/app/hooks';

import { BaseModal, MessageModal } from '@/app/ui/modals';
import { Button } from '@/app/ui/form';

import SVG_CARD from '@/assets/images/card-outline.svg';

const BTN_CN = 'h-[1.4375rem] px-5xs text-white text-12  md:text-14  lg:text-14';

interface Props {
    card: CardData;
}

const RemovePaymentMethodModal: FC<Props> = (props: Props) => {
    const { card } = props;
    const { userData, setupSession } = useUser();
    const modalCtx = useModal();

    const handleRemove = async () => {
        if (!userData || !card.profileId || !card.id) throw 'Error setting up operation - no required card data';
        try {
            const { message } = await BillingService.postDeleteCard(card.profileId, card.id, userData.email);
            modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            await setupSession();
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    };

    const cardStr =
        (card.type ?? '-- missing type --') +
        ' ' +
        (card.cardNumber ? 'Ending in • • • ' + card.cardNumber?.slice(-4) : '-- missing number --');

    return (
        <BaseModal
            title={'Remove Payment Method'}
            classNameTitle={`text-20  md:text-27  lg:text-27`}
            className={`w-[min(90dvw,33rem)] [&]:rounded-none bg-gray [&_h2+button]:brightness-50 text-primary border-gray-l1`}
            classNameContent={'text-primary '}
            classNameHr='[&]:mt-5xs [&]:mb-s border-white'
        >
            <div>
                <span className='text-14  md:text-16  lg:text-16'>
                    Remove {card.nickName ? card.nickName : cardStr}
                </span>
                <div className={`w-full flex gap-xs bg-gray-d0 mt-xs mb-xl px-n py-s border border-gray-l1`}>
                    <Image
                        src={SVG_CARD}
                        alt={'card'}
                        className={'h-auto w-[min(16dvw,8.3362rem)]'}
                    />
                    <span className='w-full flex items-center justify-center text-14  md:text-18  lg:text-18'>
                        <span>{cardStr}</span>
                    </span>
                </div>
                <div className={'flex gap-xxs'}>
                    <Button
                        className={`bg-red font-bold ${BTN_CN} `}
                        onClick={() => handleRemove()}
                    >
                        Remove
                    </Button>
                    <Button
                        className={`bg-black font-[500] border border-gray-l0 ${BTN_CN} `}
                        onClick={() => modalCtx.closeModal()}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
};

RemovePaymentMethodModal.displayName = RemovePaymentMethodModal.name;

export { RemovePaymentMethodModal };
