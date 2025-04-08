import { CardData } from '@/app/types/billing';

const CARD_DATA_DEFAULT: CardData = {
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

export { CARD_DATA_DEFAULT };
