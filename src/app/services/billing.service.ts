import { AxiosRequestConfig } from 'axios';

import { DeepPartial } from '@/app/types/utils';
import { Res } from '@/app/types/service';
import { CardData, Invoice, SavedCard, SavedCardFull } from '@/app/types/billing';
import { PlanType, RecurrencyEnum, Subscription, SubscriptionPreview } from '@/app/types/subscription';

import { BaseService } from '@/app/services/base.service';
import { Route } from '@/app/static';

import { copyObject } from '@/app/utils';

type SubscriptionDTO = Omit<Subscription, 'recurrency'> & { recurrency: number };

type PlanDetails = DeepPartial<{
    Details: string[];
    Duration: number;
    Plan: PlanType;
    Price: number;
    Source: string;
}>;

type FormCardData = Omit<CardData, 'nickName' | 'isPreferred'>;
type SubscribeData = FormCardData & {
    savedCardIdx: string;
    acceptTerms: boolean;
};

interface IBillingService {
    postProcessPayment(
        data: SubscribeData,
        planType: string,
        planDuration: number,
        planPrice: number,
        email: string,
    ): Promise<Res>;

    postProcessSavedPayment(
        data: SubscribeData,
        planType: string,
        planDuration: number,
        planPrice: number,
        email: string,
    ): Promise<Res>;

    getUserActivePlans(email: string): Promise<Res<Subscription[], false>>;

    getPlanDetails(email: string): Promise<Res<SubscriptionPreview, false>>;

    getInvoices(email: string): Promise<Res<Invoice[], false>>;

    postExportTransaction(email: string): Promise<Res<string, false>>;

    getCards(email: string): Promise<Res<SavedCard[], false>>;

    getEditCards(email: string): Promise<Res<SavedCardFull[], false>>;

    postSaveCard(formData: CardData, email: string): Promise<Res>;

    postUpdateCard(formData: CardData, email: string): Promise<Res>;

    postDeleteCard(id: string, paymentId: string, email: string): Promise<Res>;

    postCancelSubscription(email: string, source: string): Promise<Res>;
}

class BillingServiceImpl extends BaseService implements IBillingService {
    private static readonly _MESSAGE = {
        SUBSCRIPTION_CANCELLED: 'Subscription has been canceled',
        CARD_REMOVED: 'Card has been removed',
        CARD_UPDATED: 'Successfully update card',
        CARD_SAVED: 'Successfully save card',
        PAYMENT_PROCESSED: 'Successfully process payment',
    };

    constructor() {
        super(BillingServiceImpl.name);
    }

    async postCancelSubscription(email: string, source: string): Promise<Res> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `cancel-subscription`,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ userEmail: email, source }),
            withCredentials: true,
        };

        const { message } = await this.req(this.postCancelSubscription.name, config, null);
        return { message: message || BillingServiceImpl._MESSAGE.SUBSCRIPTION_CANCELLED };
    }

    async postDeleteCard(id: string, paymentId: string, email: string): Promise<Res> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `remove-card`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({
                email,
                profileId: id,
                paymentProfileId: paymentId,
            }),
            withCredentials: true,
        };
        const { message } = await this.req(this.postDeleteCard.name, config, null);
        return { message: message || BillingServiceImpl._MESSAGE.CARD_REMOVED };
    }

    async postUpdateCard(formData: CardData, email: string): Promise<Res> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `update-card`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ email, ...formData }),
            withCredentials: true,
        };
        const { message } = await this.req(this.postUpdateCard.name, config, null);
        return { message: message || BillingServiceImpl._MESSAGE.CARD_UPDATED };
    }

    async getEditCards(email: string): Promise<Res<SavedCardFull[], false>> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `get-saved-cards-and-edit`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ email }),
            withCredentials: true,
        };
        const { payload } = await this.req<SavedCardFull[], false>(this.getEditCards.name, config, (data) => [
            !data.length || typeof data[0]?.last4 === 'string',
        ]);
        return { payload };
    }

    async postSaveCard(formData: CardData, user: string): Promise<Res> {
        const cardDetails = {
            cardNumber: formData.cardNumber,
            expiryDate: formData.expirationDate,
            cardCode: formData.cvc,
        };

        const nameParts = formData?.cardholderName?.split(' ') || [];

        const billingDetails = {
            firstName: nameParts.slice(0, -1).join(' '),
            lastName: nameParts[nameParts.length - 1],
            address: `${formData.addressLine1} | ${formData.addressLine2}`,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
        };

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `save-new-card`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({
                user,
                cardDetails: cardDetails,
                billingDetails: billingDetails,
                nickName: formData.nickName,
                isPreferred: formData.isPreferred,
            }),
            withCredentials: true,
        };
        const { message } = await this.req(this.postSaveCard.name, config, null);
        return { message: message || BillingServiceImpl._MESSAGE.CARD_SAVED };
    }

    async postExportTransaction(email: string): Promise<Res<string, false>> {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + `export-transaction-details`,
            params: { email },
            withCredentials: true,
        };
        const { payload } = await this.req<string, false>(this.postExportTransaction.name, config, (data) => [!!data]);
        return { payload };
    }

    async getInvoices(email: string): Promise<Res<Invoice[], false>> {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + `get-subscription-details`,
            params: { email },
            withCredentials: true,
        };

        const { payload } = await this.req<Invoice[], false>(this.getInvoices.name, config, (data) => [
            !data.length || typeof data[0]?.to === 'string',
        ]);
        return { payload };
    }

    async getCards(email: string): Promise<Res<SavedCard[], false>> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `get-saved-cards`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ email }),
            withCredentials: true,
        };
        const { payload } = await this.req<SavedCard[], false>(this.getCards.name, config, (data) => [
            !data.length || typeof data[0]?.last4 === 'string',
        ]);
        return { payload };
    }

    async postProcessPayment(
        data: SubscribeData,
        planType: PlanType,
        planDuration: number,
        planPrice: number,
        email: string,
    ): Promise<Res> {
        const cardDetails = {
            cardNumber: data.cardNumber,
            expiryDate: data.expirationDate,
            cardCode: data.cvc,
            cardholderName: data.cardholderName,
        };
        const nameParts = data?.cardholderName?.split(' ') || [];
        const billingDetails = {
            address: data.addressLine1 + (data.addressLine2 || ''),
            city: data.city,
            state: data.state,
            zip: data.zip,
            country: data.country,
            firstName: nameParts.slice(0, -1).join(' '),
            lastName: nameParts[nameParts.length - 1],
        };
        const selectedPlan = {
            planName: planType,
            price: planPrice,
            duration: planDuration,
        };

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `process-payment`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({
                user: email,
                cardDetails,
                billingDetails,
                selectedPlan,
                duration: planDuration,
            }),
            withCredentials: true,
        };
        const { message } = await this.req(this.postProcessPayment.name, config, null);
        return { message: message || BillingServiceImpl._MESSAGE.PAYMENT_PROCESSED };
    }

    async postProcessSavedPayment(
        data: SubscribeData,
        planType: string,
        planDuration: number,
        planPrice: number,
        email: string,
    ): Promise<Res> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `process-payment-saved`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({
                user: email,
                cardId: data.id,
                cvv: data.cvc,
                planName: planType,
                price: planPrice,
                duration: planDuration,
                country: data.country,
                state: data.state,
            }),
            withCredentials: true,
        };
        const { message } = await this.req(this.postProcessSavedPayment.name, config, null);
        return { message: message || BillingServiceImpl._MESSAGE.PAYMENT_PROCESSED };
    }

    async getUserActivePlans(email: string): Promise<Res<Subscription[], false>> {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + `get-plan-details`,
            params: { email },
            withCredentials: true,
        };
        const { payload } = await this.req<SubscriptionDTO[], false>(this.getUserActivePlans.name, config, (data) => [
            !data.length || typeof data[0].tax?.amount === 'number',
        ]);

        const subscriptions: Subscription[] = payload.map((subscription) => ({
            ...subscription,
            recurrency: subscription.recurrency === RecurrencyEnum.monthly ? 'monthly' : 'annual',
        }));

        return { payload: subscriptions };
    }

    async getPlanDetails(source: string): Promise<Res<SubscriptionPreview, false>> {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + `plan-details`,
            withCredentials: false,
        };
        const { payload } = await this.req<{ allplanDetails: PlanDetails[] }, false>(
            this.getPlanDetails.name,
            config,
            (data) => [!data.allplanDetails?.length || typeof data.allplanDetails[0]?.Plan === 'string'],
        );

        let previewResult: SubscriptionPreview = {
            route: Route.SubscriptionsTidal,
            subscription: source,
            basicKind: source === 'Tidal',
            type: {},
        };

        if (payload.allplanDetails) {
            previewResult = payload.allplanDetails
                ?.filter((subscription) => subscription?.Source === source)
                ?.reduce((result, subscription): SubscriptionPreview => {
                    const updatedResult: SubscriptionPreview = copyObject(result);
                    if (!subscription?.Plan) return updatedResult;

                    if (!updatedResult.type) updatedResult.type = {};

                    let plan = updatedResult.type?.[subscription.Plan];

                    if (!plan) {
                        updatedResult.type[subscription.Plan] = {
                            benefits: subscription.Details,
                            priceUSD: { annual: 0, monthly: 0 },
                        };
                        plan = updatedResult.type[subscription.Plan];
                    }

                    if (plan?.priceUSD) {
                        plan.priceUSD[subscription.Duration === RecurrencyEnum.monthly ? 'monthly' : 'annual'] =
                            subscription.Price;
                    }
                    return updatedResult;
                }, previewResult);
        }

        return { payload: previewResult };
    }
}

const BillingService = new BillingServiceImpl();

export type { SubscribeData };
export { BillingServiceImpl, BillingService };
