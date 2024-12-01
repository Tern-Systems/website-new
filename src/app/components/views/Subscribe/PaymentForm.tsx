import {FC, FormEvent, ReactElement, useEffect, useState} from 'react';

import {CardData} from "@/app/static/types";
import {SectionsEnum} from "@/app/utils/sections";

import {COUNTRIES, PLAN, STATES} from "@/app/static/constants";

import {BillingService, SubscribeData} from "@/app/services/billing.service";

import {PlanRecurrency, PlanType, useFlow, useModal, useUser} from "@/app/context";

import {useForm} from "@/app/hooks/useForm";
import {useNavigate} from "@/app/hooks/useNavigate";

import {DeclinedModal} from "@/app/components/views/Subscribe/DeclinedModal";

import {Button, Input, Select} from '@/app/components/form';

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


interface PaymentFormProps {
    planType: NonNullable<PlanType>;
    recurrency: PlanRecurrency;
}

const PaymentForm: FC<PaymentFormProps> = (props: PaymentFormProps) => {
    const {planType, recurrency} = props

    const [navigate] = useNavigate();

    const flowCtx = useFlow();
    const modalCtx = useModal();
    const userCtx = useUser();

    const [formData, setFormData] = useForm<SubscribeData>(FORM_DEFAULT);
    const [isBillingExpanded, setBillingExpandedState] = useState(false);

    const [isSavedCard, setSavedPaymentMethod] = useState(true); // TODO
    const [paymentStatus, setPaymentStatus] = useState<boolean | null>(null);
    const [savedCards, setSavedCards] = useState<CardData[]>([]);

    // Fetch saved cards
    useEffect(() => {
        const fetchCards = async () => {
            if (!userCtx.userData)
                return;
            const {payload: cards} = await BillingService.getCards(userCtx.userData.email);
            setSavedCards(cards);
        }
        try {
            fetchCards();
        } catch (error: unknown) {
        }
    }, [setSavedCards, userCtx.userData])

    // Flow / payment status
    useEffect(() => {
        if (paymentStatus === false) {
            modalCtx.openModal(<DeclinedModal/>);
            setPaymentStatus(null);
        } else if (paymentStatus) {
            const next = flowCtx.next();
            if (next)
                return next();
            navigate(SectionsEnum.Home);
        }
    }, [paymentStatus, modalCtx, flowCtx, setPaymentStatus, navigate]);


    const toggleBillingDetails = () => setBillingExpandedState((prev) => !prev);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            if (!userCtx.userData)
                return;

            const price = PLAN[planType].priceUSD[recurrency]; // TODO
            const recurrencyMapped = recurrency === 'monthly' ? 1 : 12;

            if (isSavedCard)
                await BillingService.postProcessSavedPayment(formData, planType, recurrencyMapped, price, userCtx.userData.email);
            else
                await BillingService.postProcessPayment(formData, planType, recurrencyMapped, price, userCtx.userData.email);
        } catch (error: unknown) {
            setPaymentStatus(false);
        }
    }

    // Elements
    const SavedCards: Record<string, string> = {}
    for (const key in savedCards)
        SavedCards[key] = key + ' ' + savedCards[key].cardNumber;

    let FormInputs: ReactElement;
    if (isSavedCard) {
        FormInputs = (
            <Select
                options={SavedCards}
                value={formData.savedCardIdx}
                placeholder={'Select'}
                onChangeCustom={(value) => setFormData('savedCardIdx')(value)}
                className={`px-[0.62rem] py-[0.8rem] bg-white border-small rounded-[0.375rem] border-control3 `}
                required
            />
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
                        className={`[&&]:border-b-0 [&&]:rounded-b-none`}
                        icons={[SVG_VISA, SVG_MASTER, SVG_AMEX, SVG_DISCOVER]}

                        required
                    />
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
                        className={`[&&]:rounded-t-none [&&]:rounded-br-none [&&]:border-r-0`}
                        required
                    />
                    <Input
                        type={'number'}
                        value={formData.cvc}
                        maxLength={3}
                        onChange={setFormData('cvc')}
                        placeholder={'CVC'}
                        className={`[&&]:rounded-t-none [&&]:rounded-bl-none`}
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
                        placeholder={'Full name on card'}
                        required
                    />
                </fieldset>
                <fieldset>
                    <legend>Billing Address</legend>
                    <Select
                        options={COUNTRIES}
                        value={formData.billingCountry}
                        placeholder={'Country / Region'}
                        onChangeCustom={(value) => setFormData('billingCountry')(value)}
                        className={`px-[0.62rem] py-[0.8rem] bg-white [&&]:rounded-b-none border-small
                                        rounded-[0.375rem] border-control3 `}
                        required
                    />
                    {isBillingExpanded
                        ? <>
                            <Input
                                value={formData.addressLine1}
                                onChange={setFormData('addressLine1')}
                                placeholder={'Address Line #1'}
                                className={'[&&]:border-y-0 [&&]:rounded-none'}
                                required={isBillingExpanded}
                            />
                            <Input
                                value={formData.addressLine2}
                                onChange={setFormData('addressLine2')}
                                placeholder={'Address Line #2'}
                                className={'[&&]:border-b-0 [&&]:rounded-none'}
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
                                    className={`[&&]:border-r-0 [&&]:rounded-r-none ${formData.billingCountry === 'US'
                                        ? '[&&]:rounded-none'
                                        : '[&&]:rounded-tl-none'}`}
                                    required={isBillingExpanded}
                                />
                                <Input
                                    type={'number'}
                                    value={formData.postalCode}
                                    maxLength={5}
                                    onChange={setFormData('postalCode')}
                                    className={`${formData.billingCountry === 'US' ? '[&&]:rounded-none' : '[&&]:rounded-l-none [&&]:rounded-tr-none'}`}
                                    placeholder={'Postal / Zip Code'}
                                    required={isBillingExpanded}
                                />
                            </div>
                            <Select
                                options={STATES}
                                hidden={!isBillingExpanded || formData.billingCountry !== 'US'}
                                value={formData.state}
                                placeholder={'State / Province'}
                                onChangeCustom={(value) => setFormData('state')(value)}
                                className={`px-[0.62rem] py-[0.8rem] bg-white [&&]:rounded-t-none [&&]:border-t-0
                                            ${formData.billingCountry === 'US' ? '' : 'hidden'}`}
                                required={isBillingExpanded && formData.billingCountry === 'US'}
                            />
                        </>
                        : (
                            <Input
                                hidden={isBillingExpanded}
                                value={formData.billingAddress}
                                onChange={setFormData('billingAddress')}
                                placeholder={'Address'}
                                className={'[&&]:rounded-t-none [&&]:border-t-0'}
                                required={!isBillingExpanded}
                            />
                        )}
                </fieldset>
                <span
                    hidden={isBillingExpanded}
                    className={'mt-[0.65rem text-[0.875rem] underline cursor-pointer'}
                    onClick={() => toggleBillingDetails()}
                >
                    Enter address manually
                </span>
            </>
        );
    }

    // TODO links
    return (
        <div className={'flex-1 pt-[7.44rem] w-1/2 bg-control4 text-[1.3125rem] overflow-y-scroll'}>
            <div className={'w-[29.0625rem] mx-auto'}>
                <form className={styles.form} onSubmit={handleFormSubmit}>
                    <h2 className={`font-bold mb-[2.12rem]`}>{isSavedCard ? 'Choose' : ''} Payment Method</h2>
                    {FormInputs}
                    <Input
                        type={'checkbox'}
                        checked={formData.acceptTerms}
                        onChange={setFormData('acceptTerms')}
                        classNameWrapper={'flex-row-reverse mt-[1.46rem] [&&]:items-start gap-[0.47rem]'}
                        classNameLabel={'flex'}
                        className={'max-w-[1rem] max-h-[1rem]'}
                        required
                    >
                        <span className={'text-form text-[0.875rem] leading-normal'}>
                            You will be charged the amount and at the frequency listed above
                            until you cancel. We may charge our prices as described in our{' '}
                            <a className='underline'>Terms & Conditions</a>. You can{' '}
                            <a className='underline'>cancel at any time</a> . By subscribing,
                            you agree to Tern Systems’{' '}
                            <a className='underline'>Terms & Conditions</a> and{' '}
                            <a className='underline'>Privacy Policy</a>.
                        </span>
                    </Input>
                    <Button
                        type={'submit'}
                        className={`mt-[1.87rem] p-[1.12rem] bg-control text-primary font-sans text-[1.125rem] font-bold
                                    w-full rounded-full`}
                    >
                        Subscribe
                    </Button>
                </form>
            </div>
        </div>
    );
};

export {PaymentForm}