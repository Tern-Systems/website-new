import React, {FC, FormEvent, useEffect, useState} from "react";
import cn from "classnames";

import {CardData, SavedCardFull} from "@/app/types/billing";
import {COUNTRY, CountryKey, STATE_PROVINCE, StateKey} from "@/app/static";

import {BillingService} from "@/app/services";

import {useBreakpointCheck, useForm} from "@/app/hooks";
import {useModal, useUser} from "@/app/context";

import {ScrollEnd} from "@/app/ui/misc";
import {Button, Input, Select} from "@/app/ui/form";
import {MessageModal} from "@/app/ui/modals";
import {RemovePaymentMethodModal} from "./RemovePaymentMethodModal";

import SVG_VISA from "/public/images/icons/card-visa.svg";
import SVG_MASTER from "/public/images/icons/card-master-card.svg";
import SVG_AMEX from "/public/images/icons/card-amex.svg";
import SVG_DISCOVER from "/public/images/icons/card-discover.svg";
import SVG_CARD_NUM from "/public/images/icons/card-num.svg";

import styles from './Form.module.css'


const SM_ROW_START = 'sm:row-start-auto';
const FIELDSET_CN = '[&&>*]:sm:col-start-1';
const LEGEND_CN = `sm:mt-[2.7dvw] sm:[&&]:mb-0 ${SM_ROW_START}`;
const SELECT_CN = 'px-[--s-d2l-smallest] py-[min(--s-d-small) h-[min(5.6dvw,3.25rem)] bg-white';
const FIELD_CN = `flex-col [&]:items-start ${SM_ROW_START}`;


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
    isDefault: false,
}


interface Props {
    isPaymentCreation?: boolean;
}

const PaymentMethodTool: FC<Props> = (props: Props) => {
    const {isPaymentCreation} = props;

    const {userData} = useUser();
    const modalCtx = useModal();
    const isSmScreen = useBreakpointCheck();

    const [editCardIdx, setEditCardIdx] = useState(-1);
    const [savedCards, setSavedCards] = useState<SavedCardFull[]>([]);

    const [formData, setFormData, setFormDataState] = useForm<CardData>(FORM_DATA_DEFAULT);


    useEffect(() => {
        if (isPaymentCreation)
            return;

        const fetchEditCards = async () => {
            if (!userData)
                return;

            try {
                const {payload: cards} = await BillingService.getEditCards(userData.email);
                setSavedCards(cards);
            } catch (error: unknown) {
                if (typeof error === 'string')
                    modalCtx.openModal(<MessageModal>{error}</MessageModal>);
            }
        }
        fetchEditCards();
        // eslint-disable-next-line
    }, [isPaymentCreation]);


    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!userData)
            return;
        try {
            if (isPaymentCreation)
                await BillingService.postSaveCard(formData, userData?.email);
            else
                await BillingService.postUpdateCard(formData, userData?.email);
        } catch (error: unknown) {
            if (typeof error === 'string')
                modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    }


    const mapSavedCard = (card: SavedCardFull): CardData => {
        const billingInfo = card.billingAddress;
        const [addressLine1, addressLine2] = card?.billingAddress.address.split('|');
        return {
            id: card.paymentProfileId,
            profileId: card.customerProfileId,
            cardNumber: card.cardType + ' **** ' + card.last4,
            billingAddress: card?.billingAddress.address,
            nickName: card.nickName,
            type: card.cardType,
            cvc: '',
            expirationDate: card.expDate,
            cardholderName: billingInfo.firstName + ' ' + billingInfo.lastName,
            addressLine1: addressLine1 ?? '',
            addressLine2: addressLine2 ?? '',
            city: billingInfo.city,
            state: billingInfo.state as StateKey,
            zip: billingInfo.zip,
            country: billingInfo.country as CountryKey,
            isDefault: card.preferred,
        }
    }

    useEffect(() => {
        if (editCardIdx <= -1)
            return;
        const formData: CardData = mapSavedCard(savedCards[editCardIdx]);
        setFormDataState(formData);
    }, [savedCards, editCardIdx, setFormDataState])

    // Elements
    const SavedCardOptions: Record<string, string> = Object.fromEntries(
        savedCards?.map((card, idx) =>
            [idx, card.nickName])
        ?? []
    );

    const SubmitBtn = (
        <Button
            type={'submit'}
            className={`px-[1.12rem] h-[min(13dvw,3.25rem)] bg-control-gray font-neo text-header font-bold
                        w-full rounded-full text-primary col-span-2 sm:mt-[2.7dvw]`}
        >
            {isPaymentCreation ? 'Add' : 'Update'}
        </Button>
    );

    return (
        <div className={'mt-[min(8dvw,9rem)] px-[min(5.3dvw,1.83rem)]'}>
            <h1 className={'text-header-l font-bold mb-[min(5.3dvw,4.15rem)]'}>
                {isPaymentCreation ? 'Add alternative payment method' : 'Edit payment method details'}
            </h1>
            <form className={`${styles.form} sm:[&&]:grid-cols-2`} onSubmit={handleFormSubmit}>
                <fieldset className={`[&>*]:col-start-1 ${FIELDSET_CN}`}>
                    <Select
                        hidden={isPaymentCreation}
                        options={SavedCardOptions}
                        value={editCardIdx.toString()}
                        placeholder={'Select'}
                        onChangeCustom={(value) => setEditCardIdx(+value)}
                        classNameWrapper={`${FIELD_CN} mb-[min(5.3dvw,3.25rem)] row-start-1 sm:mb-0`}
                        classNameOption={'bg-white [&]:border-control-gray-l0'}
                        className={SELECT_CN}
                    >
                        Choose Payment Method
                    </Select>
                    <legend className={`row-start-2 ${LEGEND_CN}`}>Card Information</legend>
                    <Input
                        type={'text'}
                        value={formData.cardNumber}
                        maxLength={16}
                        onChange={setFormData('cardNumber')}
                        placeholder={'1234 1234 1234 1234'}
                        icons={[SVG_VISA, SVG_MASTER, SVG_AMEX, SVG_DISCOVER]}
                        classNameWrapper={cn(FIELD_CN, `row-start-3`, {['brightness-[0.9]']: !isPaymentCreation})}
                        disabled={!isPaymentCreation}
                    >
                        Credit or Debit Card
                    </Input>
                    <Input
                        type={'expiration'}
                        value={formData.expirationDate}
                        maxLength={5}
                        onChange={setFormData('expirationDate')}
                        placeholder={'MM/YY'}
                        classNameWrapper={`${FIELD_CN} [&&]:col-span-1 row-start-4`}
                        required
                    >
                        Expiration
                    </Input>
                    <Input
                        value={formData.cvc}
                        maxLength={formData.cardNumber && (formData.cardNumber.startsWith('34') || formData.cardNumber.startsWith('37')) ? 4 : 3}
                        onChange={setFormData('cvc')}
                        placeholder={'CVC'}
                        icons={[SVG_CARD_NUM]}
                        classNameWrapper={`${FIELD_CN} [&&]:col-span-1 row-start-4`}
                        required
                    >
                        CVC
                    </Input>
                    <Input
                        type={'text'}
                        value={formData.nickName}
                        onChange={setFormData('nickName')}
                        classNameWrapper={`${FIELD_CN} row-start-5`}
                        required
                    >
                        Nickname
                    </Input>
                    <span className={'row-start-6'}>
                        <Input
                            type={'checkbox'}
                            checked={formData.isDefault}
                            onChange={setFormData('isDefault')}
                            classNameWrapper={`flex-row-reverse place-self-start [&&]:mb-[1rem] sm:[&&]:mb-0 sm:[&&]:mt-[1.3dvw]`}
                            classNameLabel={'text-small [&&]:mb-0'}
                            className={'max-w-[--1drl] max-h-[--1drl]'}
                        >
                            Set as preferred payment method
                        </Input>
                        {isSmScreen ? null : SubmitBtn}
                    </span>
                </fieldset>
                <fieldset className={`[&>*]:col-start-3 ${FIELDSET_CN}`}>
                    <legend className={`row-start-2 ${LEGEND_CN}`}>Billing address</legend>
                    <Input
                        value={formData.cardholderName}
                        onChange={setFormData('cardholderName')}
                        classNameWrapper={`${FIELD_CN} row-start-3`}
                        required
                    >
                        Name
                    </Input>
                    <Input
                        value={formData.addressLine1}
                        onChange={setFormData('addressLine1')}
                        classNameWrapper={`${FIELD_CN} row-start-4`}
                        required
                    >
                        Street Address #1
                    </Input>
                    <Input
                        value={formData.addressLine2}
                        onChange={setFormData('addressLine2')}
                        classNameWrapper={`${FIELD_CN} row-start-4 sm:[&&]:row-span-1`}
                    >
                        Street Address #2
                    </Input>
                    <Input
                        value={formData.city}
                        onChange={setFormData('city')}
                        onKeyDown={(event) => {
                            if (!/[a-z ]/i.test(event.key) && event.key !== 'Backspace') {
                                event.preventDefault();
                            }
                        }}
                        classNameWrapper={`${FIELD_CN} row-start-5 sm:[&&]:col-span-1`}
                        required
                    >
                        City / Locality
                    </Input>
                    <Select
                        options={(STATE_PROVINCE?.[formData.country] ?? {})}
                        value={formData.state}
                        onChangeCustom={(value) => setFormData('state')(value)}
                        classNameWrapper={`${FIELD_CN} row-start-5 sm:[&&]:col-span-1`}
                        className={SELECT_CN}
                        required
                    >
                        State / Province
                    </Select>
                    <Input
                        type={'number'}
                        value={formData.zip}
                        maxLength={5}
                        onChange={setFormData('zip')}
                        classNameWrapper={`${FIELD_CN} row-start-6 sm:[&&]:col-span-1`}
                        required
                    >
                        Postal / ZIP Code
                    </Input>
                    <Select
                        options={COUNTRY}
                        value={formData.country}
                        onChangeCustom={(value) => setFormData('country')(value)}
                        classNameWrapper={`${FIELD_CN} row-start-6 sm:[&&]:col-span-1`}
                        className={SELECT_CN}
                        required
                    >
                        Country / Region
                    </Select>
                </fieldset>
                {isSmScreen ? SubmitBtn : null}
            </form>
            <div className={'mt-[min(5dvw,6.6rem)]'} hidden={isPaymentCreation}>
                <span
                    className={'text-red text-small cursor-pointer'}
                    onClick={() => {
                        if (savedCards[+editCardIdx]) {
                            modalCtx.openModal(
                                <RemovePaymentMethodModal card={mapSavedCard(savedCards[+editCardIdx])}/>,
                                {darkenBg: true}
                            );
                        }
                    }}
                >
                    Remove Payment Method
                </span>
            </div>
            <ScrollEnd/>
        </div>
    )
}

export {PaymentMethodTool};
