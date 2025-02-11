import React, {FC, FormEvent, ReactElement, useEffect, useState} from 'react';

import {FlowQueue} from "@/app/context/Flow.context";
import {SavedCard} from "@/app/types/billing";
import {Subscription, SubscriptionRecurrency} from "@/app/types/subscription";
import {SubscribeData} from "@/app/services/billing.service";
import {COUNTRY, CountryKey, Route, STATE_PROVINCE, StateKey} from "@/app/static";

import {BillingService} from "@/app/services";

import {useForm, useNavigate} from "@/app/hooks";
import {useFlow, useModal, useUser} from "@/app/context";

import {ScrollEnd} from "@/app/ui/misc";
import {PageLink} from "@/app/ui/layout";
import {Button, Input, Select} from '@/app/ui/form';
import {MessageModal} from "@/app/ui/modals";
import {DeclinedModal} from "./DeclinedModal";

import SVG_VISA from '/public/images/icons/card-visa.svg';
import SVG_MASTER from '/public/images/icons/card-master-card.svg';
import SVG_AMEX from '/public/images/icons/card-amex.svg';
import SVG_DISCOVER from '/public/images/icons/card-discover.svg';
import SVG_CARD_NUM from '/public/images/icons/card-num.svg';

import styles from './Subscribe.module.css'


const FORM_DEFAULT: SubscribeData = {
    id: '',
    savedCardIdx: '-1',
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
    acceptTerms: false,
}

const CONTROL_H_CN = 'h-[3rem] sm:h-[1.7rem] sm:landscape:[&&]:py-0'
const SELECT_CN = `px-[min(1dvw,0.75rem)] rounded-xs border-s ${CONTROL_H_CN}`;


interface Props {
    name: Subscription['subscription'] | undefined;
    type: Subscription['type'] | undefined;
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

    const [paymentStatus, setPaymentStatus] = useState<boolean | string | null>(null);
    const [savedCards, setSavedCards] = useState<SavedCard[]>([]);

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
            userCtx.fetchUserData();
            const next = flowCtx.next();
            if (next)
                next();
            else {
                const flow: FlowQueue = [];
                flow.push(() => {
                    navigate(Route.Home);
                });
                flow.push(() => {
                    modalCtx.openModal(<MessageModal>{paymentStatus}</MessageModal>);
                });
                flowCtx.run(flow);
            }
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
            let formDataMapped: SubscribeData = formData;
            if (!isBillingExpanded) {
                const billingAddress = formData.billingAddress.split(',');
                formDataMapped = {
                    ...formData,
                    addressLine1: billingAddress[0] ?? '',
                    addressLine2: billingAddress[1] ?? '',
                    city: billingAddress[2] ?? '',
                    state: billingAddress[3] as StateKey ?? '',
                    zip: billingAddress[4] ?? '',
                    country: billingAddress[5] as CountryKey ?? '',
                }
            }

            if (savedCards.length) {
                const selectedCard: SavedCard = savedCards[+formData.savedCardIdx];
                formDataMapped.id = selectedCard.id;
                formDataMapped.cvc = formData.cvc;
                formDataMapped.state = selectedCard.billingAddress.state;
                await BillingService.postProcessSavedPayment(formDataMapped, type, recurrencyMapped, priceUSD, userCtx.userData.email);
            } else
                await BillingService.postProcessPayment(formDataMapped, type, recurrencyMapped, priceUSD, userCtx.userData.email);
            setPaymentStatus(true);
        } catch (error: unknown) {
            setPaymentStatus(false);
        }
    }

    // Elements
    const SavedCards: Record<string, string> = {}
    for (const key in savedCards)
        SavedCards[key] = savedCards[key].cardType + ' **** ' + savedCards[key].last4;

    let FormInputs: ReactElement;
    if (savedCards.length) {
        FormInputs = (
            <>
                <Select
                    options={SavedCards}
                    value={formData.savedCardIdx}
                    placeholder={'Select'}
                    onChangeCustom={(value) => setFormData('savedCardIdx')(value)}
                    classNameWrapper={'mb-xxs'}
                    className={SELECT_CN}
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
                            if (!/[a-z\s]/i.test(event.key) && event.key !== 'Backspace')
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
                        value={formData.country}
                        placeholder={'Country / Region'}
                        onChangeCustom={(value) => setFormData('country')(value)}
                        className={`${SELECT_CN} bg-white [&&]:rounded-b-none`}
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
                                        if (!/[a-z\s]/i.test(event.key) && event.key !== 'Backspace')
                                            event.preventDefault();
                                    }}
                                    className={`[&&]:rounded-none [&&]:border-r-0 ${CONTROL_H_CN}`}
                                    required={isBillingExpanded}
                                />
                                <Input
                                    type={'number'}
                                    value={formData.zip}
                                    maxLength={5}
                                    onChange={setFormData('zip')}
                                    className={`[&&]:rounded-none ${CONTROL_H_CN}`}
                                    placeholder={'Postal / Zip Code'}
                                    required={isBillingExpanded}
                                />
                            </div>
                            <Select
                                options={(STATE_PROVINCE?.[formData.country] ?? {})}
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
        <div className={`flex-1 w-1/2 bg-white h-full overflow-y-scroll
                        pt-[7.44rem] 
                        sm:x-[overflow-y-visible,p-xs,w-full,max-h-fit,shadow-none]`}
        >
            <div className={'mx-auto max-w-[29rem] w-full'}>
                <form className={styles.form} onSubmit={handleFormSubmit}>
                    <h2 className={`mb-xs font-bold`}>
                        {savedCards.length ? 'Choose' : ''} Payment Method
                    </h2>
                    {FormInputs}
                    <Input
                        type={'checkbox'}
                        checked={formData.acceptTerms}
                        onChange={setFormData('acceptTerms')}
                        classNameWrapper={'flex-row-reverse mt-[min(4dvw,1.46rem)] [&&]:items-start gap-[0.47rem]'}
                        classNameLabel={'flex'}
                        className={'max-w-xxs max-h-xxs'}
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
                        className={`mt-[min(4dvw,--p-n)] w-full rounded-full bg-gray
                                    text-section-s font-bold text-primary
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