import {Dispatch, FC, FormEvent, ReactElement, SetStateAction, useState} from 'react';

import {useForm} from "@/app/hooks/useForm";

import {Input} from '@/app/components/form/Input';
import {Button} from "@/app/components/form/Button";
import {Select} from "@/app/components/form/Select";

import SVG_VISA from '@/assets/images/icons/card-visa.svg';
import SVG_MASTER from '@/assets/images/icons/card-master-card.svg';
import SVG_AMEX from '@/assets/images/icons/card-amex.svg';
import SVG_DISCOVER from '@/assets/images/icons/card-discover.svg';
import SVG_CARD_NUM from '@/assets/images/icons/card-num.svg';

import styles from './Subscribe.module.css'

type CardData = {
    type: string;
    cardNumber: string;
    expirationDate: string;
    cvc: string;
    cardholderName: string;
    billingCountry: string;
    billingAddress: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postalCode: string;
    state: string;
}

type FormData = CardData & {
    savedMethod: string;
    acceptTerms: boolean;
}

const FORM_DEFAULT: FormData = {
    savedMethod: '',
    type: '',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
    cardholderName: '',
    billingCountry: 'Country / Region',
    billingAddress: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    state: 'State / Province',
    acceptTerms: false,
}


// TODO
const COUNTRIES: Record<string, string> = {
    'US': 'United States',
    'CA': 'Canada',
    'GB': 'United Kingdom'
}
const STATES: Record<string, string> = {
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'FL': 'Florida',
    'GA': 'Georgia',
    'HI': 'Hawaii',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'ME': 'Maine',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NY': 'New York',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'RI': 'Rhode',
    'SC': 'South',
    'SD': 'South',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VT': 'Vermont',
    'VA': 'Virginia',
    'WA': 'Washington',
    'WV': 'West',
    'WI': 'Wisconsin',
    'WY': 'Wyoming'
}

const SAVED_PAYMENTS: Record<string, CardData> = {
    visa: {
        type: 'visa',
        cardNumber: '1234123412341234',
        expirationDate: '01/01',
        cvc: '000',
        cardholderName: 'NAME SURNAME',
        billingCountry: 'Country',
        billingAddress: '123 St',
        addressLine1: '',
        addressLine2: '',
        city: 'City',
        postalCode: '00000',
        state: 'State',
    }
}


interface PaymentFormProps {
    setPaymentStatus: Dispatch<SetStateAction<boolean | null>>;
}

const PaymentForm: FC<PaymentFormProps> = (props: PaymentFormProps) => {
    const {setPaymentStatus} = props

    const [formData, setFormData] = useForm<FormData>(FORM_DEFAULT);
    const [isBillingExpanded, setBillingExpandedState] = useState(false);
    const [isSavedPaymentMethod, setSavedPaymentMethod] = useState(false); // TODO

    const toggleBillingDetails = () => setBillingExpandedState((prev) => !prev);

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log(Array.from(new FormData(event.currentTarget))); // TODO

        if (isSavedPaymentMethod) {
        }

        // const responsePaymentStatus: boolean = false;
        // setPaymentDeclined(!responsePaymentStatus);
    }

    const SavedPayments: Record<string, string> = {}
    for (const key in SAVED_PAYMENTS)
        SavedPayments[key] = key + ' ' + SAVED_PAYMENTS[key].cardNumber;

    // Elements
    let FormInputs: ReactElement;
    if (isSavedPaymentMethod) {
        FormInputs = (
            <Select
                name={'payment-method'}
                options={SavedPayments}
                value={formData.savedMethod}
                onChangeCustom={(value) => setFormData('savedMethod')(value)}
                className={`px-[0.62rem] py-[0.8rem] bg-white [&&]:rounded-b-none border-small
                                        rounded-[0.375rem] border-control3 `}
                classNameOptions={'bg-white rounded-b-small'}
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
                        name={'card-number'}
                        value={formData.cardNumber}
                        onChange={setFormData('cardNumber')}
                        placeholder={'1234 1234 1234 1234'}
                        classNameWrapper={'col-span-3'}
                        className={`[&&]:border-b-0 [&&]:rounded-b-none`}
                        icons={[SVG_VISA, SVG_MASTER, SVG_AMEX, SVG_DISCOVER]}

                        required
                    />
                    <Input
                        name={'expiration-date'}
                        value={formData.expirationDate}
                        onChange={setFormData('expirationDate')}
                        placeholder={'MM/YY'}
                        className={`[&&]:rounded-t-none [&&]:rounded-br-none [&&]:border-r-0`}
                        required
                    />
                    <Input
                        type={'number'}
                        name={'cvc'}
                        value={formData.cvc}
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
                        name={'cardholder-name'}
                        value={formData.cardholderName}
                        onChange={setFormData('cardholderName')}
                        placeholder={'Full name on card'}
                        required
                    />
                </fieldset>
                <fieldset>
                    <legend>Billing Address</legend>
                    <Select
                        name={'billing-country'}
                        options={COUNTRIES}
                        value={formData.billingCountry}
                        onChangeCustom={(value) => setFormData('billingCountry')(value)}
                        className={`px-[0.62rem] py-[0.8rem] bg-white [&&]:rounded-b-none border-small
                                        rounded-[0.375rem] border-control3 `}
                        classNameOptions={'bg-white rounded-b-small'}
                        required
                    />
                    <Input
                        name={'billing-address'}
                        value={formData.billingAddress}
                        onChange={setFormData('billingAddress')}
                        placeholder={'Address'}
                        className={isBillingExpanded ? 'hidden' : '[&&]:rounded-t-none [&&]:border-t-0'}
                        required={!isBillingExpanded}
                    />
                    {isBillingExpanded
                        ? <>
                            <Input
                                name={'billing-address-1'}
                                onChange={setFormData('addressLine1')}
                                placeholder={'Address Line #1'}
                                className={'[&&]:border-y-0 [&&]:rounded-none'}
                                required={isBillingExpanded}
                            />
                            <Input
                                name={'billing-address-2'}
                                value={formData.addressLine2}
                                onChange={setFormData('addressLine2')}
                                placeholder={'Address Line #2'}
                                className={'[&&]:border-b-0 [&&]:rounded-none'}
                                required={isBillingExpanded}
                            />
                            <div className={'flex'}>
                                <Input
                                    name={'billing-city'}
                                    value={formData.city}
                                    onChange={setFormData('city')}
                                    placeholder={'City'}
                                    className={`[&&]:border-r-0 [&&]:rounded-r-none ${formData.billingCountry === 'US'
                                        ? '[&&]:rounded-none'
                                        : '[&&]:rounded-tl-none'}`}
                                    required={isBillingExpanded}
                                />
                                <Input
                                    name={'postal-code'}
                                    type={'number'}
                                    value={formData.postalCode}
                                    onChange={setFormData('postalCode')}
                                    className={`${formData.billingCountry === 'US' ? '[&&]:rounded-none' : '[&&]:rounded-l-none [&&]:rounded-tr-none'}`}
                                    placeholder={'Postal / Zip Code'}
                                    required={isBillingExpanded}
                                />
                            </div>
                            <Select
                                name={'state'}
                                options={STATES}
                                value={formData.state}
                                onChangeCustom={(value) => setFormData('state')(value)}
                                className={`px-[0.62rem] py-[0.8rem] bg-white [&&]:rounded-t-none [&&]:border-t-0
                                            ${formData.billingCountry === 'US' ? '' : 'hidden'}`}
                                classNameOptions={'bg-white rounded-b-small'}
                                required={isBillingExpanded}
                            />
                        </>
                        : null
                    }
                </fieldset>
                {
                    isBillingExpanded
                        ? null
                        : (
                            <span
                                className={'mt-[0.65rem text-[0.875rem] underline cursor-pointer'}
                                onClick={() => toggleBillingDetails()}
                            >
                                Enter address manually
                            </span>
                        )
                }
            </>
        );
    }

    return (
        <div className={'flex-1 pt-[7.44rem] w-1/2 bg-control4 text-[1.3125rem] overflow-y-scroll'}>
            <div className={'w-[29.0625rem] mx-auto'}>
                <form className={styles.form} onSubmit={handleFormSubmit}>
                    <h2 className={`font-bold mb-[2.12rem]`}>{isSavedPaymentMethod ? 'Choose' : ''} Payment Method</h2>
                    {FormInputs}
                    <Input
                        name={'accept-terms'}
                        type={'checkbox'}
                        checked={formData.acceptTerms}
                        onChange={setFormData('acceptTerms')}
                        classNameWrapper={'flex-row-reverse mt-[1.46rem] [&&]:items-start'}
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
                                    w-full rounded-full `}
                    >
                        Subscibe
                    </Button>
                </form>
            </div>
        </div>
    );
};

export {PaymentForm}