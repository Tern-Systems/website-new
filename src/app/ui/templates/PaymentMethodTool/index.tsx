'use client';

import { FC, FormEvent, useCallback, useEffect, useState } from 'react';
import cn from 'classnames';

import { CardData, SavedCardFull } from '@/app/types/billing';
import { COUNTRY, STATE_PROVINCE } from '@/app/static';

import { BillingService } from '@/app/services';

import { mapSavedCard } from '@/app/utils';
import { useForm } from '@/app/hooks';
import { useModal, useUser } from '@/app/hooks';

import { ScrollEnd } from '@/app/ui/organisms';
import { Button, Input, Select } from '@/app/ui/form';
import { MessageModal } from '@/app/ui/modals';
import { RemovePaymentMethodModal } from './RemovePaymentMethodModal';

import SVG_VISA from '@/assets/images/icons/card-visa.svg';
import SVG_MASTER from '@/assets/images/icons/card-master-card.svg';
import SVG_AMEX from '@/assets/images/icons/card-amex.svg';
import SVG_DISCOVER from '@/assets/images/icons/card-discover.svg';
import SVG_CARD_NUM from '@/assets/images/icons/card-num.svg';

const FIELDSET_CN = 'flex flex-col w-full gap-n';
const LEGEND_CN = 'text-24 font-[500] mt-3xl mb-3xs  md:x-[text-27,mt-5xl]  lg:x-[text-27,mt-5xl]';
const INPUT_CN = 'bg-gray-d2 w-full h-xxl border border-gray-l0 px-xxs  md:x-[h-6xl,px-xs]  lg:x-[h-6xl,px-xs]';
const FIELD_CN = 'text-14 grid grid-auto-rows gap-y-3xs  md:text-18  lg:text-18';
const BUTTON_CN = 'md:x-[text-18,h-6xl]  lg:x-[text-18,h-6xl]';

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
        className={cn('order-last h-xxl w-full bg-blue text-14 font-bold text-primary', BUTTON_CN, className)}
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

    const [editCardIdx, setEditCardIdx] = useState(-1);
    const [savedCards, setSavedCards] = useState<SavedCardFull[]>([]);

    const [formData, setFormData, setFormDataState] = useForm<CardData>(FORM_DATA_DEFAULT);

    const fetchEditCards = useCallback(async () => {
        if (!userData) return;
        try {
            setSavedCards([]);
            const { payload: cards } = await BillingService.getEditCards(userData.email);
            setSavedCards(cards);
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    }, [userData]);

    useEffect(() => {
        if (paymentCreation) return;
        fetchEditCards();
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
            onChangeCustom={(value) => setEditCardIdx(parseInt(value) ?? -1)}
            classNameWrapper={cn(
                `flex-col gap-y-xxs`,
                `text-14 md:text-16 lg:text-18`,
                `w-full border-b border-gray-l0`,
            )}
            classNameLabel={'mr-auto'}
            classNameSelected={'w-full '}
            classNameChevron={cn('ml-auto')}
            className={cn(`px-xs h-6xl !border-0 !bg-gray-d2  sm:h-button-xl marker:px-xxs sm:px-3xs`)}
            classNameOption={cn(
                'h-6xl !border-0 !bg-gray  sm:h-button-xl !border-t-s !border-gray-l0',
                'hover:!bg-gray-l2',
            )}
        >
            Choose Payment Method
        </Select>
    );

    return (
        <div className={'pb-[17.5rem] text-primary'}>
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
                            'mt-xxl text-27 font-[500] leading-tight',
                            'md:x-[text-32,mt-5xl]',
                            'lg:x-[text-32,mt-5xl]',
                        )}
                    >
                        {paymentCreation ? 'Add Payment Method' : 'Edit Payment Method Details'}
                    </h1>
                    {!paymentCreation && SelectMethod}
                </fieldset>

                <fieldset className={`${FIELDSET_CN} order-3 lg:order-none lg:row-span-1 lg:row-start-2`}>
                    {savedCards[+editCardIdx] || paymentCreation ? (
                        <>
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
                                classNameWrapper={cn(FIELD_CN, 'text-18', {
                                    ['brightness-[0.9]']: !paymentCreation,
                                })}
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
                                    classNameLabel={'text-10 [&&]:mb-0  md:text-12  lg:text-12'}
                                    className={'max-h-xxs max-w-xxs [&&&]:border-gray-l0 [&&&]:bg-gray-d2'}
                                    classNameCheckbox={`h-7xs w-7xs  md:x-[h-5xs,w-5xs]  lg:x-[h-5xs,w-5xs]`}
                                    isCustomCheckbox
                                >
                                    Set as preferred payment method
                                </Input>
                                {renderSubmitBtn(paymentCreation)}
                            </span>
                        </>
                    ) : null}
                </fieldset>

                {savedCards[+editCardIdx] || paymentCreation ? (
                    <>
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
                                    if (!/[a-z\s]/i.test(event.key) && event.key !== 'Backspace')
                                        event.preventDefault();
                                }}
                                classNameWrapper={`${FIELD_CN}`}
                                className={INPUT_CN}
                                required
                            >
                                City / Locality
                            </Input>
                            <div className='flex flex-row gap-n'>
                                <Select
                                    options={STATE_PROVINCE?.[formData.country ?? ''] ?? {}}
                                    value={formData.state ?? ''}
                                    onChangeCustom={(value) => setFormData('state')(value)}
                                    classNameWrapper={cn(FIELD_CN, `text-[500] w-1/2`)}
                                    classNameLabel={'mr-auto'}
                                    classNameSelected={'w-full '}
                                    classNameChevron={cn('ml-auto')}
                                    className={cn(
                                        `px-xs h-6xl !border-0 !bg-gray-d2  sm:h-button-xl marker:px-xxs sm:px-3xs`,
                                    )}
                                    classNameOption={cn(
                                        'h-6xl !border-0 !bg-gray  sm:h-button-xl !border-t-s !border-gray-l0',
                                        'hover:!bg-gray-l2',
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
                                value={formData.country ?? ''}
                                onChangeCustom={(value) => setFormData('country')(value)}
                                classNameWrapper={cn(FIELD_CN, `text-[500]`)}
                                classNameLabel={'mr-auto'}
                                classNameSelected={'w-full '}
                                classNameChevron={cn('ml-auto')}
                                className={cn(
                                    `px-xs h-6xl !border-0 !bg-gray-d2  sm:h-button-xl marker:px-xxs sm:px-3xs`,
                                )}
                                classNameOption={cn(
                                    'h-6xl !border-0 !bg-gray  sm:h-button-xl !border-t-s !border-gray-l0',
                                    'hover:!bg-gray-l2',
                                )}
                                required
                            >
                                Country / Region
                            </Select>
                        </fieldset>
                    </>
                ) : null}
            </form>
            {savedCards[+editCardIdx] || paymentCreation ? (
                <div
                    className={'mt-7xl'}
                    hidden={paymentCreation}
                >
                    <span
                        className={'cursor-pointer text-12 text-red'}
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
            ) : null}
            <ScrollEnd />
        </div>
    );
};

PaymentMethodTool.displayName = PaymentMethodTool.name;

export { PaymentMethodTool };
