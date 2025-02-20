import React, { FC, FormEvent, useCallback, useEffect, useState } from 'react';
import cn from 'classnames';

import { CardData, SavedCardFull } from '@/app/types/billing';
import { COUNTRY, STATE_PROVINCE } from '@/app/static';

import { BillingService } from '@/app/services';

import { mapSavedCard } from '@/app/utils';
import { useForm } from '@/app/hooks';
import { useModal, useUser } from '@/app/context';
import { Breakpoint, useBreakpointCheck } from '@/app/hooks/useBreakpointCheck';

import { ScrollEnd } from '@/app/ui/misc';
import { Button, Input, Select } from '@/app/ui/form';
import { MessageModal } from '@/app/ui/modals';
import { RemovePaymentMethodModal } from './RemovePaymentMethodModal';

import SVG_VISA from '/public/images/icons/card-visa.svg';
import SVG_MASTER from '/public/images/icons/card-master-card.svg';
import SVG_AMEX from '/public/images/icons/card-amex.svg';
import SVG_DISCOVER from '/public/images/icons/card-discover.svg';
import SVG_CARD_NUM from '/public/images/icons/card-num.svg';

const FIELDSET_CN = 'flex flex-col w-full gap-n';
const LEGEND_CN =
    'text-documentation font-[500] mt-[3.75rem] mb-3xs  md:x-[text-heading,mt-[70px]]  lg:x-[text-heading,mt-[4.375rem]]';
const INPUT_CN =
    'bg-[#444444] w-full h-[2.25rem] border border-gray-l0 px-xxs  md:x-[h-[3.125rem],px-xs]  lg:x-[h-[3.125rem],px-xs]';
const FIELD_CN = 'text-section-xs grid grid-auto-rows gap-y-3xs  md:text-section-s  lg:text-section-s';
const BUTTON_CN = 'md:x-[text-section-s,h-[3.125rem]]  lg:x-[text-section-s,h-[3.125rem]]';

const FORM_DATA_DEFAULT: CardData = {
    profileId: '',
    id: '',
    type: '',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
    cardholderName: '',
    country: '',
    billingAddress: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    zip: '',
    state: '',
    nickName: '',
    isPreferred: false,
};

const renderSubmitBtn = (paymentCreation: boolean | undefined, className: string = '') => (
    <Button
        type={'submit'}
        className={cn(
            'order-last h-[2.25rem] w-full bg-blue text-section-xs font-bold text-primary',
            BUTTON_CN,
            className,
        )}
    >
        {paymentCreation ? 'Add' : 'Update'}
    </Button>
);

interface Props {
    paymentCreation?: boolean;
}

const PaymentMethodTool: FC<Props> = (props: Props) => {
    const { paymentCreation } = props;

    const { userData } = useUser();
    const modalCtx = useModal();
    const isSmScreen = useBreakpointCheck() <= Breakpoint.sm;

    const [editCardIdx, setEditCardIdx] = useState(-1);
    const [savedCards, setSavedCards] = useState<SavedCardFull[]>([]);

    const [formData, setFormData, setFormDataState] = useForm<CardData>(FORM_DATA_DEFAULT);

    const fetchEditCards = useCallback(async () => {
        if (!userData) return;
        try {
            const { payload: cards } = await BillingService.getEditCards(userData.email);
            setSavedCards(cards);
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
        // eslint-disable-next-line
    }, [userData]);

    useEffect(() => {
        if (paymentCreation) return;
        fetchEditCards();
        // eslint-disable-next-line
    }, [fetchEditCards, paymentCreation]);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!userData || editCardIdx <= -1) return;
        try {
            let responseMsg: string;
            if (paymentCreation) {
                const { message } = await BillingService.postSaveCard(formData, userData?.email);
                responseMsg = message;
            } else {
                const { message } = await BillingService.postUpdateCard(formData, userData?.email);
                responseMsg = message;
            }
            modalCtx.openModal(<MessageModal>{responseMsg}</MessageModal>);
            await fetchEditCards();
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    };

    useEffect(() => {
        if (editCardIdx <= -1) return;
        const formData: CardData = mapSavedCard(savedCards[editCardIdx]);
        setFormDataState(formData);
    }, [savedCards, editCardIdx, setFormDataState]);

    // Elements
    const SavedCardOptions: Record<string, string> = Object.fromEntries(
        savedCards?.map((card: SavedCardFull | undefined, idx) => [
            idx,
            card ? (card.nickName ?? card.cardType + ' **** ' + card.last4) : '',
        ]) ?? [],
    );

    const SelectMethod = (
        <Select
            altIcon
            hidden={paymentCreation}
            options={SavedCardOptions}
            value={editCardIdx.toString()}
            placeholder={'Select Payment Method'}
            onChangeCustom={(value) => setEditCardIdx(value ? +value : -1)}
            classNameWrapper={cn(
                `flex-col gap-y-xxs`,
                `text-section-xs md:text-basic lg:text-section-s`,
                `w-full border-b border-gray-l0`,
            )}
            classNameLabel={'mr-auto'}
            classNameSelected={'w-full '}
            classNameChevron={cn('ml-auto')}
            className={cn(`px-xs h-[3.1375rem] !border-0 !bg-[#444444]  sm:h-button-xl marker:px-xxs sm:px-3xs`)}
            classNameOption={cn(
                'h-[3.1375rem] !border-0 !bg-gray  sm:h-button-xl !border-t-s !border-gray-l0',
                'hover:!bg-[#979797]',
            )}
        >
            Choose Payment Method
        </Select>
    );

    return (
        <div className={'bg-black pb-[17.5rem] text-primary'}>
            <form
                className={cn(
                    'w-full',
                    'grid grid-cols-1 lg:grid-cols-2',
                    'md:min-w-[31.25rem] md:max-w-[60%] md:flex-col',
                    'lg:gap-x-[min(10.42dvw,9rem)]',
                )}
                onSubmit={handleFormSubmit}
            >
                <fieldset className={`${FIELDSET_CN}  ${paymentCreation ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
                    <h1
                        className={cn(
                            'mt-xxl text-heading font-[500] leading-tight',
                            'md:x-[text-[2rem],mt-[4.375rem]]',
                            'lg:x-[text-[2rem],mt-[4.375rem]]',
                        )}
                    >
                        {paymentCreation ? 'Add Payment Method' : 'Edit Payment Method Details'}
                    </h1>
                    {!paymentCreation && SelectMethod}
                </fieldset>

                <fieldset className={`${FIELDSET_CN} order-3 lg:order-none lg:row-span-1 lg:row-start-2`}>
                    <h2 className={`${LEGEND_CN}`}>Card Information</h2>

                    <Input
                        type={'text'}
                        value={
                            editCardIdx >= 0 && !paymentCreation
                                ? savedCards[editCardIdx]?.cardType + ' **** ' + savedCards[editCardIdx]?.last4
                                : ''
                        }
                        maxLength={16}
                        onChange={setFormData('cardNumber')}
                        placeholder={'1234 1234 1234 1234'}
                        icons={[SVG_VISA, SVG_MASTER, SVG_AMEX, SVG_DISCOVER]}
                        classNameWrapper={cn(FIELD_CN, 'text-section-s', { ['brightness-[0.9]']: !paymentCreation })}
                        className={INPUT_CN}
                        disabled={!paymentCreation}
                    >
                        Card Number
                    </Input>
                    <div className='flex flex-row gap-n'>
                        <Input
                            type={'expiration'}
                            value={formData.expirationDate}
                            maxLength={5}
                            onChange={setFormData('expirationDate')}
                            placeholder={'MM/YY'}
                            classNameWrapper={`${FIELD_CN} w-1/2`}
                            className={INPUT_CN}
                            required
                        >
                            Expiration
                        </Input>
                        <Input
                            value={formData.cvc}
                            maxLength={
                                formData.cardNumber &&
                                (formData.cardNumber.startsWith('34') || formData.cardNumber.startsWith('37'))
                                    ? 4
                                    : 3
                            }
                            onChange={setFormData('cvc')}
                            placeholder={'CVC'}
                            icons={[SVG_CARD_NUM]}
                            classNameWrapper={`${FIELD_CN} w-1/2`}
                            className={INPUT_CN}
                            required
                        >
                            CVC
                        </Input>
                    </div>

                    <Input
                        type={'text'}
                        value={formData.nickName}
                        onChange={setFormData('nickName')}
                        classNameWrapper={`${FIELD_CN} `}
                        className={INPUT_CN}
                        required
                    >
                        Nickname
                    </Input>
                    <span className={''}>
                        <Input
                            type={'checkbox'}
                            checked={formData.isPreferred}
                            onChange={setFormData('isPreferred')}
                            classNameWrapper={`[&&]:mb-s w-fit`}
                            classNameLabel={'text-section-3xs [&&]:mb-0  md:text-section-xxs  lg:text-section-xxs'}
                            className={'max-h-xxs max-w-xxs [&&&]:border-gray-l0 [&&&]:bg-[#444444]'}
                            classNameCheckbox={`h-[.75rem] w-[.75rem]  md:x-[h-[.9375rem],w-[.9375rem]]  lg:x-[h-[.9375rem],w-[.9375rem]]`}
                            isCustomCheckbox
                        >
                            Set as preferred payment method
                        </Input>
                        {isSmScreen ? renderSubmitBtn(paymentCreation) : null}
                    </span>
                </fieldset>

                <fieldset className={` ${FIELDSET_CN} lg:row-span-2`}>
                    <h2 className={` ${LEGEND_CN}`}>Billing address</h2>
                    <Input
                        value={formData.cardholderName}
                        onChange={setFormData('cardholderName')}
                        classNameWrapper={`${FIELD_CN} `}
                        className={INPUT_CN}
                        required
                    >
                        Full Name
                    </Input>
                    <Input
                        value={formData.addressLine1}
                        onChange={setFormData('addressLine1')}
                        classNameWrapper={`${FIELD_CN} `}
                        className={INPUT_CN}
                        required
                    >
                        Street Address #1
                    </Input>
                    <Input
                        value={formData.addressLine2}
                        onChange={setFormData('addressLine2')}
                        classNameWrapper={`${FIELD_CN} `}
                        className={INPUT_CN}
                    >
                        Street Address #2
                    </Input>
                    <Input
                        value={formData.city}
                        onChange={setFormData('city')}
                        onKeyDown={(event) => {
                            if (!/[a-z\s]/i.test(event.key) && event.key !== 'Backspace') event.preventDefault();
                        }}
                        classNameWrapper={`${FIELD_CN}`}
                        className={INPUT_CN}
                        required
                    >
                        City / Locality
                    </Input>
                    <div className='flex flex-row gap-n'>
                        <Select
                            options={STATE_PROVINCE?.[formData.country] ?? {}}
                            value={formData.state}
                            onChangeCustom={(value) => setFormData('state')(value)}
                            classNameWrapper={cn(FIELD_CN, `text-[500] w-1/2`)}
                            classNameLabel={'mr-auto'}
                            classNameSelected={'w-full '}
                            classNameChevron={cn('ml-auto')}
                            className={cn(
                                `px-xs h-[3.1375rem] !border-0 !bg-[#444444]  sm:h-button-xl marker:px-xxs sm:px-3xs`,
                            )}
                            classNameOption={cn(
                                'h-[3.1375rem] !border-0 !bg-gray  sm:h-button-xl !border-t-s !border-gray-l0',
                                'hover:!bg-[#979797]',
                            )}
                            required
                        >
                            State / Province
                        </Select>
                        <Input
                            type={'number'}
                            value={formData.zip}
                            maxLength={5}
                            onChange={setFormData('zip')}
                            classNameWrapper={`${FIELD_CN} w-1/2`}
                            className={INPUT_CN}
                            required
                        >
                            Postal / ZIP Code
                        </Input>
                    </div>
                    <Select
                        options={COUNTRY}
                        value={formData.country}
                        onChangeCustom={(value) => setFormData('country')(value)}
                        classNameWrapper={cn(FIELD_CN, `text-[500]`)}
                        classNameLabel={'mr-auto'}
                        classNameSelected={'w-full '}
                        classNameChevron={cn('ml-auto')}
                        className={cn(
                            `px-xs h-[3.1375rem] !border-0 !bg-[#444444]  sm:h-button-xl marker:px-xxs sm:px-3xs`,
                        )}
                        classNameOption={cn(
                            'h-[3.1375rem] !border-0 !bg-gray  sm:h-button-xl !border-t-s !border-gray-l0',
                            'hover:!bg-[#979797]',
                        )}
                        required
                    >
                        Country / Region
                    </Select>
                </fieldset>

                {isSmScreen ? null : renderSubmitBtn(paymentCreation)}
            </form>
            <div
                className={'mt-[9.375rem]'}
                hidden={paymentCreation}
            >
                <span
                    className={'cursor-pointer text-section-xxs text-red'}
                    onClick={() => {
                        if (savedCards[+editCardIdx]) {
                            modalCtx.openModal(
                                <RemovePaymentMethodModal card={mapSavedCard(savedCards[+editCardIdx])} />,
                                { darkenBg: true },
                            );
                        }
                    }}
                >
                    Remove Payment Method
                </span>
            </div>
            <ScrollEnd />
        </div>
    );
};

export { PaymentMethodTool };
