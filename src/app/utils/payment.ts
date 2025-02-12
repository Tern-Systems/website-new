import { CardData, SavedCardFull } from '@/app/types/billing';
import { CountryKey, StateKey } from '@/app/static';

const mapSavedCard = (card: SavedCardFull | undefined): CardData => {
    const billingInfo = card?.billingAddress;
    const [addressLine1, addressLine2] = card?.billingAddress?.address?.split('|') ?? [];
    return {
        id: card?.paymentProfileId ?? '',
        profileId: card?.customerProfileId ?? '',
        cardNumber: card?.cardNumber ?? '',
        billingAddress: card?.billingAddress?.address ?? '',
        nickName: card?.nickName ?? '',
        type: card?.cardType ?? '',
        cvc: '',
        expirationDate: card?.expDate ?? '',
        cardholderName: (billingInfo?.firstName ?? '') + ' ' + (billingInfo?.lastName ?? ''),
        addressLine1: addressLine1 ?? '',
        addressLine2: addressLine2 ?? '',
        city: billingInfo?.city ?? '',
        state: billingInfo?.state as StateKey,
        zip: billingInfo?.zip ?? '',
        country: billingInfo?.country as CountryKey,
        isPreferred: card?.preferred ?? false,
    };
};

export { mapSavedCard };
