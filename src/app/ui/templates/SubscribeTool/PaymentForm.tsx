import React, {FC, FormEvent, ReactElement, useEffect, useState} from 'react';

import {CardData} from "@/app/types/billing";
import {SubscriptionRecurrency} from "@/app/types/subscription";
import {SubscribeData} from "@/app/services/billing.service";
import {COUNTRY, Route, STATE_PROVINCE} from "@/app/static";

import {BillingService} from "@/app/services";

import {useForm, useNavigate} from "@/app/hooks";
import {useFlow, useModal, useUser} from "@/app/context";

import {ScrollEnd} from "@/app/ui/misc";
import {PageLink} from "@/app/ui/layout";
import {Button, Input, Select} from '@/app/ui/form';
import {DeclinedModal} from "./DeclinedModal";

import SVG_VISA from '@/assets/images/icons/card-visa.svg';
import SVG_MASTER from '@/assets/images/icons/card-master-card.svg';
import SVG_AMEX from '@/assets/images/icons/card-amex.svg';
import SVG_DISCOVER from '@/assets/images/icons/card-discover.svg';
import SVG_CARD_NUM from '@/assets/images/icons/card-num.svg';

import styles from './Subscribe.module.css'


const FORM_DEFAULT: SubscribeData = {
    savedCardIdx: '-1',
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
    acceptTerms: false,
}

const CONTROL_H_CN = 'h-[3rem] sm:h-[1.7rem] sm:landscape:[&&]:py-0'
const SELECT_CN = `px-[min(1dvw,0.75rem)] rounded-smallest border-small ${CONTROL_H_CN}`;


interface Props {
    type: string | undefined;
    recurrency: SubscriptionRecurrency | undefined;
    priceUSD: number | undefined;
}

const PaymentForm: FC<Props> = (props: Props) => {
    const {type, recurrency, priceUSD} = props


    const flowCtx = useFlow();
    const modalCtx = useModal();
    const userCtx = useUser();
    const [navigate] = useNavigate();

    const [formData, setFormData] = useForm<SubscribeData>(FORM_DEFAULT);
    const [isBillingExpanded, setBillingExpandedState] = useState(false);

    const [paymentStatus, setPaymentStatus] = useState<boolean | null>(null);
    const [savedCards, setSavedCards] = useState<CardData[]>([]);

    // Fetch saved cards
    useEffect(() => {
        const fetchCards = async () => {
            if (!userCtx.userData)
                return;
            try {
                const {payload: cards} = await BillingService.getCards(userCtx.userData.email);
                setSavedCards(cards);
            } catch (error: unknown) {
            }
        }
        fetchCards();
    }, [setSavedCards, userCtx.userData])

    // Flow / payment status
    useEffect(() => {
        if (paymentStatus === false) {
            modalCtx.openModal(<DeclinedModal/>);
            setPaymentStatus(null);
        } else if (paymentStatus) {
            const next = flowCtx.next();
            if (next)
                next();
            else
                navigate(Route.Home);
        }
        // eslint-disable-next-line
    }, [paymentStatus]);


    const toggleBillingDetails = () => setBillingExpandedState((prev) => !prev);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            if (!userCtx.userData || !priceUSD || !recurrency || !type)
                return;

            const recurrencyMapped = recurrency === 'monthly' ? 1 : 12;

            if (savedCards.length)
                await BillingService.postProcessSavedPayment(formData, type, recurrencyMapped, priceUSD, userCtx.userData.email);
            else
                await BillingService.postProcessPayment(formData, type, recurrencyMapped, priceUSD, userCtx.userData.email);
        } catch (error: unknown) {
            setPaymentStatus(false);
        }
    }

    // Elements
    const SavedCards: Record<string, string> = {}
    for (const key in savedCards)
        SavedCards[key] = key + ' ' + savedCards[key].cardNumber;

    let FormInputs: ReactElement;
    if (savedCards.length) {
        FormInputs = (
            <>
                <Select
                    options={SavedCards}
                    value={formData.savedCardIdx}
                    placeholder={'Select'}
                    onChangeCustom={(value) => setFormData('savedCardIdx')(value)}
                    className={`${SELECT_CN} mb-[--1dr]`}
                    classNameOption={CONTROL_H_CN}
                    required
                />
                <Input
                    type={'number'}
                    value={formData.cvc}
                    maxLength={3}
                    onChange={setFormData('cvc')}
                    placeholder={'CVC'}
                    icons={[SVG_CARD_NUM]}
                    className={CONTROL_H_CN}
                    required
                />
            </>
        )
    } else {
        FormInputs = (
            <>
                <fieldset className={'grid grid-rows-2 grid-cols-2'}>
                    <legend>Card Information</legend>
                    <Input
                        type={'number'}
                        value={formData.cardNumber}
                        maxLength={16}
                        onChange={setFormData('cardNumber')}
                        placeholder={'1234 1234 1234 1234'}
                        classNameWrapper={'col-span-2'}
                        className={`[&&]:border-b-0 [&&]:rounded-b-none ${CONTROL_H_CN}`}
                        icons={[SVG_VISA, SVG_MASTER, SVG_AMEX, SVG_DISCOVER]}

                        required
                    />
                    <Input
                        type={'expiration'}
                        value={formData.expirationDate}
                        maxLength={5}
                        onChange={setFormData('expirationDate')}
                        placeholder={'MM/YY'}
                        className={`[&&]:rounded-t-none [&&]:rounded-br-none [&&]:border-r-0 ${CONTROL_H_CN}`}
                        required
                    />
                    <Input
                        type={'number'}
                        value={formData.cvc}
                        maxLength={3}
                        onChange={setFormData('cvc')}
                        placeholder={'CVC'}
                        className={`[&&]:rounded-t-none [&&]:rounded-bl-none ${CONTROL_H_CN}`}
                        icons={[SVG_CARD_NUM]}
                        required
                    />
                </fieldset>
                <fieldset>
                    <legend>Cardholder Name</legend>
                    <Input
                        value={formData.cardholderName}
                        onChange={setFormData('cardholderName')}
                        onKeyDown={(event) => {
                            if (!/[a-z]/i.test(event.key) && event.key !== 'Backspace')
                                event.preventDefault();
                        }}
                        className={CONTROL_H_CN}
                        placeholder={'Full name on card'}
                        required
                    />
                </fieldset>
                <fieldset>
                    <legend>Billing Address</legend>
                    <Select
                        options={COUNTRY}
                        value={formData.billingCountry}
                        placeholder={'Country / Region'}
                        onChangeCustom={(value) => setFormData('billingCountry')(value)}
                        className={`${SELECT_CN} bg-control-white [&&]:rounded-b-none`}
                        classNameOption={CONTROL_H_CN}
                        required
                    />
                    {isBillingExpanded
                        ? <>
                            <Input
                                value={formData.addressLine1}
                                onChange={setFormData('addressLine1')}
                                placeholder={'Street Address #1'}
                                className={`[&&]:border-y-0 [&&]:rounded-none ${CONTROL_H_CN}`}
                                required={isBillingExpanded}
                            />
                            <Input
                                value={formData.addressLine2}
                                onChange={setFormData('addressLine2')}
                                placeholder={'Street Address #2'}
                                className={`[&&]:border-b-0 [&&]:rounded-none ${CONTROL_H_CN}`}
                            />
                            <div className={'flex'}>
                                <Input
                                    value={formData.city}
                                    onChange={setFormData('city')}
                                    placeholder={'City / Locality'}
                                    onKeyDown={(event) => {
                                        if (!/[a-z]/i.test(event.key) && event.key !== 'Backspace')
                                            event.preventDefault();
                                    }}
                                    className={`[&&]:rounded-none [&&]:border-r-0 ${CONTROL_H_CN}`}
                                    required={isBillingExpanded}
                                />
                                <Input
                                    type={'number'}
                                    value={formData.postalCode}
                                    maxLength={5}
                                    onChange={setFormData('postalCode')}
                                    className={`[&&]:rounded-none ${CONTROL_H_CN}`}
                                    placeholder={'Postal / Zip Code'}
                                    required={isBillingExpanded}
                                />
                            </div>
                            <Select
                                options={STATE_PROVINCE[formData.billingCountry]}
                                hidden={!isBillingExpanded}
                                value={formData.state}
                                placeholder={'State / Province'}
                                onChangeCustom={(value) => setFormData('state')(value)}
                                className={`${SELECT_CN} [&&]:rounded-t-none [&&]:border-t-0`}
                                classNameOption={CONTROL_H_CN}
                                required={isBillingExpanded}
                            />
                        </>
                        : (
                            <Input
                                hidden={isBillingExpanded}
                                value={formData.billingAddress}
                                onChange={setFormData('billingAddress')}
                                placeholder={'Address'}
                                className={`[&&]:rounded-t-none [&&]:border-t-0 ${CONTROL_H_CN}`}
                                required={!isBillingExpanded}
                            />
                        )}
                </fieldset>
                <span
                    hidden={isBillingExpanded}
                    className={'block mt-[0.65rem] text-section-xs underline cursor-pointer'}
                    onClick={() => toggleBillingDetails()}
                >
                    Enter address manually
                </span>
            </>
        );
    }

    return (
        <div className={`flex-1 w-1/2 bg-control-white h-full overflow-y-scroll
                        pt-[7.44rem] 
                        sm:x-[overflow-y-visible,p-[--p-content-sm],w-full,max-h-fit,shadow-none]`}
        >
            <div className={'mx-auto max-w-[29rem] w-full'}>
                <form className={styles.form} onSubmit={handleFormSubmit}>
                    <h2 className={`mb-[--p-content-sm] font-bold`}>
                        {savedCards.length ? 'Choose' : ''} Payment Method
                    </h2>
                    {FormInputs}
                    <Input
                        type={'checkbox'}
                        checked={formData.acceptTerms}
                        onChange={setFormData('acceptTerms')}
                        classNameWrapper={'flex-row-reverse mt-[min(4dvw,1.46rem)] [&&]:items-start gap-[0.47rem]'}
                        classNameLabel={'flex'}
                        className={'max-w-[--1drl] max-h-[--1drl]'}
                        required
                    >
                        <span className={'text-section-xs leading-normal'}>
                            You will be charged the amount and at the frequency listed above
                            until you cancel. We may charge our prices as described in our&nbsp;
                            <PageLink href={Route.Terms}
                                      className='underline'>Terms & Conditions</PageLink>. You can&nbsp;
                            <PageLink href={Route.ManageSubscriptions}
                                      className='underline'>cancel at any time</PageLink> . By subscribing,
                            you agree to Tern System&apos;s&nbsp;
                            <PageLink href={Route.Terms} className='underline'>Terms & Conditions</PageLink> and&nbsp;
                            <PageLink href={Route.Privacy} className='underline'>Privacy Policy</PageLink>.
                        </span>
                    </Input>
                    <Button
                        type={'submit'}
                        onClick={() => setPaymentStatus(true)}
                        className={`mt-[min(4dvw,1.87rem)] w-full rounded-full bg-control-gray
                                    font-neo text-section-s font-bold text-primary
                                    h-[4.4rem]
                                    sm:h-[3.125rem]`}
                    >
                        Subscribe
                    </Button>
                </form>
            </div>
            <ScrollEnd/>
        </div>
    );
};

export {PaymentForm}