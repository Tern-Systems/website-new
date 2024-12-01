import {Dispatch, FC, FormEvent, SetStateAction, useEffect} from "react";

import {PlanRecurrency, PlanType, useModal} from "@/app/context";
import {CardData} from "@/app/static/types";
import {SectionsEnum} from "@/app/utils/sections";

import {COUNTRIES, STATES} from "@/app/static/constants";

import {useForm} from "@/app/hooks/useForm";

import {RemovePaymentMethodModal} from "./RemovePaymentMethodModal";

import {Button, Input, Select} from "@/app/components/form";

import SVG_VISA from "@/assets/images/icons/card-visa.svg";
import SVG_MASTER from "@/assets/images/icons/card-master-card.svg";
import SVG_AMEX from "@/assets/images/icons/card-amex.svg";
import SVG_DISCOVER from "@/assets/images/icons/card-discover.svg";
import SVG_CARD_NUM from "@/assets/images/icons/card-num.svg";

import styles from './Form.module.css'


type Plan = {
    planType: PlanType;
    planRecurrency: PlanRecurrency;
    priceUSD: number;
    tax: number;
    lastBillingDate: number;
}
type Subscription = {
    plan: Plan;
    savedCards: CardData[];
}

const FORM_DATA_DEFAULT: CardData = {
    type: '',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
    cardholderName: '',
    billingCountry: '',
    billingAddress: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    state: '',
    nickName: '',
    isDefault: false
}

interface Props {
    editCardState: [number, Dispatch<SetStateAction<number>>];
    creationState: [boolean, Dispatch<SetStateAction<boolean>>];
    savedCards: CardData[];
}

const PaymentMethodToolView: FC<Props> = (props: Props) => {
    const {editCardState, savedCards, creationState} = props;
    const [editCardIdx, setEditCardIdx] = editCardState;
    const [isPaymentCreation, setPaymentCreationState] = creationState;

    const modalCtx = useModal();
    const [formData, setFormData] = useForm<CardData>(
        isPaymentCreation ? FORM_DATA_DEFAULT : savedCards[editCardIdx]
    );

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        try {
            // TOOD;

            if (isPaymentCreation)
                setPaymentCreationState(false);
            else
                setEditCardIdx(-1);
        } catch (error: unknown) {

        }
    }

    // Elements
    const SavedCardOptions: Record<string, string> = Object.fromEntries(
        savedCards?.map((card, index) =>
            [index, card.nickName])
        ?? []
    );

    return (
        <>
            <Button
                icon={'back'}
                className={'mt-[1.7rem] font-oxygen font-bold'}
                onClick={() => {
                    if (isPaymentCreation)
                        setPaymentCreationState(false)
                    else
                        setEditCardIdx(-1)
                }}
            >
                {SectionsEnum.ManageSubscriptions}
            </Button>
            <div className={'text-nowrap mt-[4.17rem]'}>
                <h1 className={'text-[3rem] font-bold mb-[4.14rem]'}>
                    Edit payment method details
                </h1>
                <form className={styles.form} onSubmit={handleFormSubmit}>
                    <fieldset>
                        <legend/>
                        <Select
                            hidden={isPaymentCreation}
                            options={SavedCardOptions}
                            value={editCardIdx.toString()}
                            placeholder={'Select'}
                            onChangeCustom={(value) => setEditCardIdx(+value)}
                            classNameWrapper={'flex-col [&]:items-start mb-[3.24rem]'}
                            className={`px-[0.62rem] py-[0.8rem]  h-[3.25rem] bg-white border-small rounded-[0.375rem] border-control3`}
                        >
                            Choose Payment Method
                        </Select>
                        <legend>Card Information</legend>
                        <Input
                            type={'number'}
                            value={formData.cardNumber}
                            maxLength={16}
                            onChange={setFormData('cardNumber')}
                            placeholder={'1234 1234 1234 1234'}
                            icons={[SVG_VISA, SVG_MASTER, SVG_AMEX, SVG_DISCOVER]}
                            classNameWrapper={'flex-col [&]:items-start'}
                            required
                        >
                            Credit or Debit Card
                        </Input>
                        <span className={'flex gap-[1.88rem]'}>
                            <Input
                                value={formData.expirationDate}
                                maxLength={5}
                                onChange={setFormData('expirationDate')}
                                onKeyDown={(event) => {
                                    if (!/[0-9]/.test(event.key) && event.key !== 'Backspace')
                                        event.preventDefault();
                                    if (event.currentTarget.value.length === 2 && event.key !== 'Backspace')
                                        event.currentTarget.value = event.currentTarget.value + '/';
                                }}
                                placeholder={'MM/YY'}
                                classNameWrapper={'flex-col [&]:items-start'}
                                required
                            >
                                Expiration
                            </Input>
                            <Input
                                value={formData.cvc}
                                maxLength={3}
                                onChange={setFormData('cvc')}
                                placeholder={'CVC'}
                                icons={[SVG_CARD_NUM]}
                                classNameWrapper={'flex-col [&]:items-start'}
                                required
                            >
                                CVC
                            </Input>
                        </span>
                        <Input
                            type={'number'}
                            value={formData.nickName}
                            onChange={setFormData('nickName')}
                            placeholder={'Nickname'}
                            classNameWrapper={'flex-col [&]:items-start'}
                            required
                        >
                            Nickname
                        </Input>
                        <Input
                            type={'checkbox'}
                            checked={formData.isDefault}
                            onChange={setFormData('isDefault')}
                            classNameWrapper={'flex-row-reverse place-self-start gap-x-[0.4rem]'}
                            classNameLabel={'flex text-[0.875rem] [&&]:mb-0'}
                            className={'max-w-[1rem] max-h-[1rem]'}
                            required
                        >
                            Set as preferred payment method
                        </Input>
                        <Button
                            type={'submit'}
                            className={`p-x-[1.12rem] h-[3.25rem] bg-control text-primary font-sans text-[1.125rem] font-bold
                                            w-full rounded-full`}
                        >
                            Update
                        </Button>
                    </fieldset>
                    <fieldset className={'ml-[8.44rem]'}>
                        <legend>Billing address</legend>
                        <Input
                            value={formData.cardholderName}
                            onChange={setFormData('cardholderName')}
                            placeholder={'Full name on card'}
                            classNameWrapper={'flex-col [&]:items-start'}
                            required
                        >
                            Name
                        </Input>
                        <Input
                            value={formData.addressLine1}
                            onChange={setFormData('addressLine1')}
                            placeholder={'Address Line #1'}
                            classNameWrapper={'flex-col [&]:items-start'}
                            required
                        >
                            Street Address #1
                        </Input>
                        <Input
                            value={formData.city}
                            onChange={setFormData('city')}
                            onKeyDown={(event) => {
                                if (!/[a-z]/i.test(event.key) && event.key !== 'Backspace')
                                    event.preventDefault();
                            }}
                            placeholder={'City / Locality'}
                            classNameWrapper={'flex-col [&]:items-start'}
                            required
                        >
                            City / Locality
                        </Input>
                        <Input
                            type={'number'}
                            value={formData.postalCode}
                            maxLength={5}
                            onChange={setFormData('postalCode')}
                            placeholder={'Postal / Zip Code'}
                            classNameWrapper={'flex-col [&]:items-start'}
                            required
                        >
                            Postal / ZIP Code
                        </Input>
                    </fieldset>
                    <fieldset>
                        <Input
                            value={formData.addressLine2}
                            onChange={setFormData('addressLine2')}
                            placeholder={'Address Line #2'}
                            classNameWrapper={'flex-col [&]:items-start'}
                        >
                            Street Address #2
                        </Input>
                        <Select
                            options={STATES}
                            value={formData.state}
                            placeholder={'State / Province'}
                            onChangeCustom={(value) => setFormData('state')(value)}
                            classNameWrapper={'flex-col [&]:items-start'}
                            className={`px-[0.62rem] py-[0.8rem] bg-white`}
                            hidden={formData.billingCountry !== 'US'}
                            required={formData.billingCountry === 'US'}
                        >
                            State / Province
                        </Select>
                        <Select
                            options={COUNTRIES}
                            value={formData.billingCountry}
                            placeholder={'Country / Region'}
                            onChangeCustom={(value) => setFormData('billingCountry')(value)}
                            classNameWrapper={'flex-col [&]:items-start'}
                            className={`px-[0.62rem] py-[0.8rem] bg-white border-small rounded-[0.375rem] border-control3 `}
                            required
                        >
                            Country / Region
                        </Select>
                    </fieldset>
                </form>
                <div className={'mt-[6.57rem]'} hidden={isPaymentCreation}>
                    <span
                        className={'text-[#F42200] text-[0.875rem] cursor-pointer'}
                        onClick={() => modalCtx.openModal(<RemovePaymentMethodModal card={savedCards[+editCardIdx]}/>)}
                    >
                        Remove Payment Method
                    </span>
                </div>
            </div>
        </>
    )
}

export {PaymentMethodToolView}
export type {Subscription, Plan}