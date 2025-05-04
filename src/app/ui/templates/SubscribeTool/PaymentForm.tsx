'use client';

import { FC, FormEvent, ReactElement, useEffect, useState } from 'react';

import { DataTestID } from '@/tests/static';

import { SavedCard } from '@/app/types/billing';
import { Subscription, SubscriptionRecurrency } from '@/app/types/subscription';
import { SubscribeData } from '@/app/services/billing.service';
import { SelectOptions } from '@/app/ui/form/Select';

import { COUNTRY, CountryKey, MISC_LINKS, Route, STATE_PROVINCE, StateKey } from '@/app/static';

import { BillingService } from '@/app/services';

import { useFlow, useForm, useModal, useNavigate, useUser } from '@/app/hooks';

import { H3 } from '@/app/ui/atoms';
import { PageLink } from '@/app/ui/layout';
import { Button, Input, Select } from '@/app/ui/form';
import { MessageModal } from '@/app/ui/modals';
import { DeclinedModal } from './DeclinedModal';

import SVG_VISA from '@/assets/images/icons/card-visa.svg';
import SVG_MASTER from '@/assets/images/icons/card-master-card.svg';
import SVG_AMEX from '@/assets/images/icons/card-amex.svg';
import SVG_DISCOVER from '@/assets/images/icons/card-discover.svg';
import SVG_CARD_NUM from '@/assets/images/icons/card-num.svg';

import styles from './Subscribe.module.css';

const TestID = DataTestID.page.subscribe.paymentForm;

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
};

interface Props {
    type: Subscription['type'] | undefined;
    recurrency: SubscriptionRecurrency | undefined;
    priceUSD: number | undefined;
}

const PaymentForm: FC<Props> = (props: Props) => {
    const { type, recurrency, priceUSD } = props;

    const flowCtx = useFlow();
    const modalCtx = useModal();
    const userCtx = useUser();
    const [navigate] = useNavigate(true);

    const [formData, setFormData] = useForm<SubscribeData>(FORM_DEFAULT);
    const [billingExpanded, setBillingExpandedState] = useState(false);

    const [savedCards, setSavedCards] = useState<SavedCard[]>([]);

    // Fetch saved cards
    useEffect(() => {
        const fetchCards = async () => {
            if (!userCtx.userData) return;
            try {
                const { payload: cards } = await BillingService.getCards(userCtx.userData.email);
                setSavedCards(cards);
                if (cards.length === 1) setFormData('savedCardIdx')('0');
            } catch (_: unknown) {
                // Empty block
            }
        };
        fetchCards();
    }, [setSavedCards, userCtx.userData]);

    const finishPayment = async (message: string) => {
        await userCtx.setupSession(true);
        const next = flowCtx.next();
        if (next) next();
        else {
            window.open(MISC_LINKS.Tidal, '_blank');
            modalCtx.openModal(<MessageModal data-testid={TestID.successModal}>{message}</MessageModal>);
            await navigate(Route.Home);
        }
    };

    const toggleBillingDetails = () => setBillingExpandedState((prev) => !prev);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            if (!userCtx.userData || !priceUSD || !recurrency || !type) return;

            const recurrencyMapped = recurrency === 'monthly' ? 1 : 12;
            let formDataMapped: SubscribeData = formData;
            if (!billingExpanded && !savedCards.length) {
                if (!formData.billingAddress) return;
                const billingAddress = formData.billingAddress.split(',');
                formDataMapped = {
                    ...formData,
                    addressLine1: billingAddress[0] ?? '',
                    addressLine2: billingAddress[1] ?? '',
                    city: billingAddress[2] ?? '',
                    state: (billingAddress[3] as StateKey) ?? '',
                    zip: billingAddress[4] ?? '',
                    country: (billingAddress[5] as CountryKey) ?? '',
                };
            }

            let message: string;
            if (savedCards.length) {
                const selectedCard: SavedCard = savedCards[+formData.savedCardIdx];

                if (!selectedCard.billingAddress) throw 'Error preparing billing address';

                formDataMapped.id = selectedCard.id;
                formDataMapped.cvc = formData.cvc;
                formDataMapped.state = selectedCard.billingAddress.state;
                formDataMapped.country = selectedCard.billingAddress.country;

                const { message: msg } = await BillingService.postProcessSavedPayment(
                    formDataMapped,
                    type,
                    recurrencyMapped,
                    priceUSD,
                    userCtx.userData.email,
                );
                message = msg;
            } else {
                const { message: msg } = await BillingService.postProcessPayment(
                    formDataMapped,
                    type,
                    recurrencyMapped,
                    priceUSD,
                    userCtx.userData.email,
                );
                message = msg;
            }
            finishPayment(message);
        } catch (_: unknown) {
            modalCtx.openModal(<DeclinedModal data-testid={TestID.errorModal} />);
        }
    };

    // Elements
    const SavedCards: SelectOptions = {};
    for (const key in savedCards) SavedCards[key] = savedCards[key].cardType + ' **** ' + savedCards[key].last4;

    let FormInputs: ReactElement;
    if (savedCards.length) {
        FormInputs = (
            <>
                <Select
                    data-testid={TestID.input.savedCardIdx}
                    options={SavedCards}
                    value={formData.savedCardIdx}
                    placeholder={'Select'}
                    onChange={setFormData('savedCardIdx')}
                    className={{
                        wrapper: 'mb-xxs',
                        select: styles.select,
                        option: styles.control,
                    }}
                    required
                    altIcon
                />
                <Input
                    data-testid={TestID.input.cvc}
                    name={TestID.input.cvc}
                    type={'number'}
                    value={formData.cvc}
                    maxLength={4}
                    onChange={setFormData('cvc')}
                    placeholder={'CVC'}
                    icons={[SVG_CARD_NUM]}
                    className={styles.control}
                    required
                />
            </>
        );
    } else {
        FormInputs = (
            <>
                <fieldset>
                    <legend>Card Information</legend>
                    <Input
                        data-testid={TestID.input.cardNumber}
                        name={TestID.input.cardNumber}
                        type={'number'}
                        value={formData.cardNumber}
                        maxLength={16}
                        onChange={setFormData('cardNumber')}
                        placeholder={'1234 1234 1234 1234'}
                        wrapper={'col-span-2'}
                        className={styles.control}
                        icons={[SVG_VISA, SVG_MASTER, SVG_AMEX, SVG_DISCOVER]}
                        required
                    />
                    <fieldset className={styles.pair}>
                        <Input
                            data-testid={TestID.input.expirationDate}
                            name={TestID.input.expirationDate}
                            type={'expiration'}
                            value={formData.expirationDate}
                            maxLength={5}
                            onChange={setFormData('expirationDate')}
                            placeholder={'MM/YY'}
                            className={styles.control}
                            required
                        />
                        <Input
                            data-testid={TestID.input.cvc}
                            name={TestID.input.cvc}
                            type={'number'}
                            value={formData.cvc}
                            maxLength={4}
                            onChange={setFormData('cvc')}
                            placeholder={'CVC'}
                            className={styles.control}
                            icons={[SVG_CARD_NUM]}
                            required
                        />
                    </fieldset>
                </fieldset>
                <fieldset>
                    <legend>Cardholder Name</legend>
                    <Input
                        data-testid={TestID.input.cardholderName}
                        type={'text-only'}
                        name={TestID.input.cardholderName}
                        value={formData.cardholderName}
                        onChange={setFormData('cardholderName')}
                        className={styles.control}
                        placeholder={'Full name on card'}
                        required
                    />
                </fieldset>
                <fieldset>
                    <legend>Billing Address</legend>
                    <Select
                        data-testid={TestID.input.country}
                        name={TestID.input.country}
                        options={COUNTRY}
                        value={formData.country ?? ''}
                        placeholder={'Country / Region'}
                        onChange={setFormData('country')}
                        className={{
                            select: styles.select,
                            option: styles.control,
                            ul: 'min-w-0',
                        }}
                        required
                        altIcon
                    />
                    {billingExpanded ? (
                        <>
                            <Input
                                data-testid={TestID.input.addressLine1}
                                name={TestID.input.addressLine1}
                                value={formData.addressLine1}
                                onChange={setFormData('addressLine1')}
                                placeholder={'Street Address #1'}
                                className={styles.control}
                                required={billingExpanded}
                            />
                            <Input
                                data-testid={TestID.input.addressLine2}
                                name={TestID.input.addressLine2}
                                value={formData.addressLine2}
                                onChange={setFormData('addressLine2')}
                                placeholder={'Street Address #2'}
                                className={styles.control}
                            />
                            <fieldset className={styles.pair}>
                                <Input
                                    data-testid={TestID.input.city}
                                    type={'text-only'}
                                    name={TestID.input.city}
                                    value={formData.city}
                                    onChange={setFormData('city')}
                                    placeholder={'City / Locality'}
                                    className={styles.control}
                                    required={billingExpanded}
                                />
                                <Input
                                    data-testid={TestID.input.zip}
                                    name={TestID.input.zip}
                                    type={'number'}
                                    value={formData.zip}
                                    maxLength={5}
                                    onChange={setFormData('zip')}
                                    className={styles.control}
                                    placeholder={'Postal / Zip Code'}
                                    required={billingExpanded}
                                />
                            </fieldset>
                            {billingExpanded ? (
                                <Select
                                    data-testid={TestID.input.state}
                                    name={TestID.input.state}
                                    options={STATE_PROVINCE?.[formData?.country ?? ''] ?? {}}
                                    value={formData.state ?? ''}
                                    placeholder={'State / Province'}
                                    onChange={setFormData('state')}
                                    className={{
                                        select: styles.select,
                                        option: styles.control,
                                    }}
                                    required={billingExpanded}
                                    altIcon
                                />
                            ) : null}
                        </>
                    ) : billingExpanded ? null : (
                        <Input
                            data-testid={TestID.input.billingAddress}
                            name={TestID.input.billingAddress}
                            value={formData.billingAddress}
                            onChange={setFormData('billingAddress')}
                            placeholder={'Address'}
                            className={styles.control}
                            required={!billingExpanded}
                        />
                    )}
                </fieldset>
                {billingExpanded ? null : (
                    <p
                        data-testid={TestID.expandButton}
                        className={'mt-4xs block cursor-pointer text-14 underline'}
                        onClick={() => toggleBillingDetails()}
                    >
                        Enter address manually
                    </p>
                )}
            </>
        );
    }

    return (
        <form
            className={styles.form}
            onSubmit={handleFormSubmit}
        >
            <H3 className={`mb-xs lg:!text-27`}>{savedCards.length ? 'Choose ' : ''}Payment Method</H3>
            {FormInputs}
            <Input
                data-testid={TestID.input.termsCheckbox}
                name={TestID.input.termsCheckbox}
                type={'checkbox'}
                checked={formData.acceptTerms}
                onChange={setFormData('acceptTerms')}
                wrapper={'flex-row-reverse mt-s !items-start gap-4xs-1'}
                label={'flex'}
                className={'max-h-xxs max-w-xxs'}
                required
            >
                <span className={'text-14 leading-n'}>
                    You will be charged the amount and at the frequency listed above until you cancel. We may charge our
                    prices as described in our&nbsp;
                    <PageLink
                        href={Route.Terms}
                        className={'underline'}
                    >
                        Terms & Conditions
                    </PageLink>
                    . You can&nbsp;
                    <PageLink
                        href={Route.ManageSubscriptions}
                        className={'underline'}
                    >
                        cancel at any time
                    </PageLink>
                    . By subscribing, you agree to Tern System&apos;s&nbsp;
                    <PageLink
                        href={Route.Terms}
                        className={'underline'}
                    >
                        Terms & Conditions
                    </PageLink>
                    &nbsp;and&nbsp;
                    <PageLink
                        href={Route.Privacy}
                        className={'underline'}
                    >
                        Privacy Policy
                    </PageLink>
                    .
                </span>
            </Input>
            <Button
                data-testid={TestID.submitButton}
                type={'submit'}
                className={`mt-n w-full  bg-blue  font-bold text-18 text-primary  sm:h-6xl h-7xl`}
            >
                Subscribe
            </Button>
        </form>
    );
};

PaymentForm.displayName = PaymentForm.name;

export { PaymentForm };
