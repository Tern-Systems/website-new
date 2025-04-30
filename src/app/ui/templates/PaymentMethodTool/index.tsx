'use client';

import { FC, FormEvent, useCallback, useEffect, useState } from 'react';
import cn from 'classnames';

import { CardData, SavedCardFull } from '@/app/types/billing';
import { CARD_DATA_DEFAULT, COUNTRY, Route, STATE_PROVINCE } from '@/app/static';

import { BillingService } from '@/app/services';

import { mapSavedCard } from '@/app/utils';
import { useForm, useModal, useNavigate, useUser } from '@/app/hooks';

import { ScrollEnd } from '@/app/ui/organisms';
import { Button, Input, Select } from '@/app/ui/form';
import { MessageModal } from '@/app/ui/modals';
import { RemovePaymentMethodModal } from './RemovePaymentMethodModal';

import SVG_VISA from '@/assets/images/icons/card-visa.svg';
import SVG_MASTER from '@/assets/images/icons/card-master-card.svg';
import SVG_AMEX from '@/assets/images/icons/card-amex.svg';
import SVG_DISCOVER from '@/assets/images/icons/card-discover.svg';
import SVG_CARD_NUM from '@/assets/images/icons/card-num.svg';
import { DataTestID } from '@/tests/static';

const TestID = DataTestID.page.profile.billing.purchasingInformation.paymentMethodTool;

const FIELDSET_CN = 'flex flex-col w-full gap-n';
const LEGEND_CN = 'text-24 font-[500] mt-3xl mb-3xs  md:x-[text-27,mt-5xl]  lg:x-[text-27,mt-5xl]';
const INPUT_CN = 'bg-gray-d2 w-full h-xxl border border-gray-l0 px-xxs  md:x-[h-6xl,px-xs]  lg:x-[h-6xl,px-xs]';
const FIELD_CN = 'text-14 grid grid-auto-rows gap-y-3xs  md:text-18  lg:text-18';
const BUTTON_CN = 'md:x-[text-18,h-6xl]  lg:x-[text-18,h-6xl]';

interface Props {
    creation?: boolean;
}

const PaymentMethodTool: FC<Props> = (props: Props) => {
    const { creation } = props;

    const { userData } = useUser();
    const modalCtx = useModal();
    const [navigate] = useNavigate(false);

    const [editCardIdx, setEditCardIdx] = useState(-1);
    const [savedCards, setSavedCards] = useState<SavedCardFull[]>([]);

    const [formData, setFormData, setFormDataState] = useForm<CardData>(CARD_DATA_DEFAULT);

    const fetchEditCards = useCallback(async () => {
        if (!userData || creation) return;
        try {
            const { payload: cards } = await BillingService.getEditCards(userData.email);
            if (cards.length === 1) setEditCardIdx(0);
            setSavedCards(cards);
        } catch (_) {
            // Empty block
        }
    }, [userData]);

    useEffect(() => {
        fetchEditCards();
    }, [fetchEditCards, creation]);

    useEffect(() => {
        if (editCardIdx <= -1) return;
        const formData: CardData = mapSavedCard(savedCards[editCardIdx]);
        setFormDataState(formData);
    }, [savedCards, editCardIdx, setFormDataState]);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!userData || (!creation && editCardIdx <= -1)) return;
        try {
            let responseMsg: string;
            if (creation) {
                const { message } = await BillingService.postSaveCard(formData, userData?.email);
                responseMsg = message;
            } else {
                const { message } = await BillingService.postUpdateCard(formData, userData?.email);
                responseMsg = message;
            }
            modalCtx.openModal(<MessageModal data-testid={TestID.successModal}>{responseMsg}</MessageModal>);

            if (!creation) await fetchEditCards();
            else navigate(Route.PurchasingInformation);
        } catch (error: unknown) {
            if (typeof error === 'string')
                modalCtx.openModal(<MessageModal data-testid={TestID.errorModal}>{error}</MessageModal>);
        }
    };

    // Elements
    const SavedCardOptions: Record<string, string> = Object.fromEntries(
        savedCards?.map((card: SavedCardFull | undefined, idx) => [
            idx,
            card ? (card.nickName ?? card.cardType + ' **** ' + card.last4) : '',
        ]) ?? [],
    );

    const SelectMethod = (
        <Select
            data-testid={TestID.form.input.cardSelect}
            name={TestID.form.input.cardSelect}
            altIcon
            hidden={creation}
            options={SavedCardOptions}
            value={editCardIdx.toString()}
            placeholder={'Select Payment Method'}
            onChange={(value) => setEditCardIdx(parseInt(value) ?? -1)}
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
                <fieldset className={`${FIELDSET_CN}  ${creation ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
                    <h1
                        className={cn(
                            'mt-xxl text-27 font-[500] leading-tight',
                            'md:x-[text-32,mt-5xl]',
                            'lg:x-[text-32,mt-5xl]',
                        )}
                    >
                        {creation ? 'Add Payment Method' : 'Edit Payment Method Details'}
                    </h1>
                    {!creation && SelectMethod}
                </fieldset>

                <fieldset className={`${FIELDSET_CN} order-3 lg:order-none lg:row-span-1 lg:row-start-2`}>
                    {savedCards[+editCardIdx] || creation ? (
                        <>
                            <h2 className={LEGEND_CN}>Card Information</h2>

                            <Input
                                data-testid={TestID.form.input.cardNumber}
                                name={TestID.form.input.cardNumber}
                                type={creation ? 'number' : 'text'}
                                value={
                                    editCardIdx >= 0 && !creation
                                        ? savedCards[editCardIdx]?.cardType + ' **** ' + savedCards[editCardIdx]?.last4
                                        : formData.cardNumber
                                }
                                maxLength={16}
                                onChange={setFormData('cardNumber')}
                                placeholder={'1234 1234 1234 1234'}
                                icons={[SVG_VISA, SVG_MASTER, SVG_AMEX, SVG_DISCOVER]}
                                classNameWrapper={cn(FIELD_CN, 'text-18', {
                                    ['brightness-[0.9]']: !creation,
                                })}
                                className={INPUT_CN}
                                disabled={!creation}
                            >
                                Card Number
                            </Input>
                            <div className='flex flex-row gap-n'>
                                <Input
                                    data-testid={TestID.form.input.expirationDate}
                                    name={TestID.form.input.expirationDate}
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
                                    data-testid={TestID.form.input.cvc}
                                    name={TestID.form.input.cvc}
                                    value={formData.cvc}
                                    maxLength={4}
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
                                data-testid={TestID.form.input.nickname}
                                name={TestID.form.input.nickname}
                                type={'text'}
                                value={formData.nickName}
                                onChange={setFormData('nickName')}
                                classNameWrapper={`${FIELD_CN} `}
                                className={INPUT_CN}
                            >
                                Nickname
                            </Input>
                            <span>
                                <Input
                                    data-testid={TestID.form.input.preferredCheckbox}
                                    name={TestID.form.input.preferredCheckbox}
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
                                <Button
                                    data-testid={TestID.form.submitButton}
                                    type={'submit'}
                                    className={cn(
                                        'order-last h-[2.25rem] w-full bg-blue text-section-xs font-bold text-primary',
                                        BUTTON_CN,
                                    )}
                                >
                                    {creation ? 'Add' : 'Update'}
                                </Button>
                            </span>
                        </>
                    ) : null}
                </fieldset>

                {savedCards[+editCardIdx] || creation ? (
                    <>
                        <fieldset className={` ${FIELDSET_CN} lg:row-span-2`}>
                            <h2 className={` ${LEGEND_CN}`}>Billing address</h2>
                            <Input
                                data-testid={TestID.form.input.cardholderName}
                                name={TestID.form.input.cardholderName}
                                value={formData.cardholderName}
                                onChange={setFormData('cardholderName')}
                                classNameWrapper={`${FIELD_CN} `}
                                className={INPUT_CN}
                                required
                            >
                                Full Name
                            </Input>
                            <Input
                                data-testid={TestID.form.input.addressLine1}
                                name={TestID.form.input.addressLine1}
                                value={formData.addressLine1}
                                onChange={setFormData('addressLine1')}
                                classNameWrapper={`${FIELD_CN} `}
                                className={INPUT_CN}
                                required
                            >
                                Street Address #1
                            </Input>
                            <Input
                                data-testid={TestID.form.input.addressLine2}
                                name={TestID.form.input.addressLine2}
                                value={formData.addressLine2}
                                onChange={setFormData('addressLine2')}
                                classNameWrapper={`${FIELD_CN} `}
                                className={INPUT_CN}
                            >
                                Street Address #2
                            </Input>
                            <Input
                                data-testid={TestID.form.input.city}
                                name={TestID.form.input.city}
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
                                    data-testid={TestID.form.input.state}
                                    name={TestID.form.input.state}
                                    options={STATE_PROVINCE?.[formData.country ?? ''] ?? {}}
                                    value={formData.state ?? ''}
                                    onChange={(value) => setFormData('state')(value)}
                                    classNameWrapper={cn(FIELD_CN, `text-[500] w-1/2`)}
                                    classNameLabel={'mr-auto'}
                                    classNameSelected={'w-full '}
                                    classNameChevron={cn('ml-auto')}
                                    className={cn(
                                        `px-xs h-6xl !border-0 !bg-gray-d2 !border-s !border-gray-l0   sm:h-button-xl marker:px-xxs sm:px-3xs`,
                                    )}
                                    classNameOption={cn(
                                        'h-6xl !border-0 !bg-gray  sm:h-button-xl !border-t-s !border-gray-l0',
                                        'hover:!bg-gray-l2',
                                    )}
                                    required
                                    disabled={!formData.country}
                                >
                                    State / Province
                                </Select>
                                <Input
                                    data-testid={TestID.form.input.zip}
                                    name={TestID.form.input.zip}
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
                                data-testid={TestID.form.input.country}
                                name={TestID.form.input.country}
                                options={COUNTRY}
                                value={formData.country ?? ''}
                                onChange={(value) => setFormData('country')(value)}
                                classNameWrapper={cn(FIELD_CN, `text-[500]`)}
                                classNameLabel={'mr-auto'}
                                classNameSelected={'w-full '}
                                classNameChevron={cn('ml-auto')}
                                className={cn(
                                    `px-xs h-6xl !border-0 !bg-gray-d2 !border-s !border-gray-l0  sm:h-button-xl marker:px-xxs sm:px-3xs`,
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
            {savedCards[+editCardIdx] || creation ? (
                <div
                    className={'mt-7xl'}
                    hidden={creation}
                >
                    <span
                        data-testid={TestID.removeCard.toggle}
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
