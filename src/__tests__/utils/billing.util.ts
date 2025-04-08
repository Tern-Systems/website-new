import { BaseUtilImpl } from '@/__tests__/utils/base.util';

import { CountryKey, StateKey } from '@/app/static';
import { PlanType, RecurrencyEnum } from '@/app/types/subscription';
import { SubscribeData } from '@/app/services/billing.service';

import { BillingService } from '@/app/services';
import { CardData } from '@/app/types/billing';

class BillingTestUtilImpl extends BaseUtilImpl {
    public static readonly DATA = {
        ...BaseUtilImpl.DATA,
        dummyCard: {
            general: {
                cardholderName: 'Firstname Lastname',
                cardNumber: '370000000000002',
                cvc: '1111',
                expirationDate: '01/30',
            },
            fullAddress: {
                normal: '1111 Street of Country, Unit 1, City, State, 11111',
                wrong: '1111 Street of Country Unit 1 City State 11111',
            },
            address: {
                country: 'US' as CountryKey,
                addressLine1: '1111 Street of Country',
                addressLine2: 'Unit 1',
                city: 'City',
                zip: '11111',
                state: 'NY' as StateKey,
            },
            misc: {
                nickname: {
                    initial: 'Nickname',
                    edit: 'Nickname-Edited',
                },
                preferred: true,
            },
        },
    };

    // Utils
    async subscribePlan(type: PlanType, recurrency: RecurrencyEnum) {
        await this.signupUser();

        const { dummyCard, dummyEmail } = BillingTestUtilImpl.DATA;
        const card: SubscribeData = {
            ...dummyCard.general,
            ...dummyCard.address,
            id: '',
            type: type,
            billingAddress: '',
            savedCardIdx: '0',
            acceptTerms: true,
        };
        await BillingService.postProcessPayment(card, type, recurrency, 0, dummyEmail);
    }

    async saveCard(email: string = BillingTestUtilImpl.DATA.dummyEmail) {
        const { dummyCard } = BillingTestUtilImpl.DATA;
        const card: CardData = {
            ...dummyCard.general,
            id: dummyCard.general.cardNumber,
            type: '',
            ...dummyCard.address,
            isPreferred: dummyCard.misc.preferred,
            nickName: dummyCard.misc.nickname.initial,
            billingAddress: '',
        };
        await BillingService.postSaveCard(card, email);
    }
}

const BillingTestUtil = new BillingTestUtilImpl();
export { BillingTestUtil, BillingTestUtilImpl };
