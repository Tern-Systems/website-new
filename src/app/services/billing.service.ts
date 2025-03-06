import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { CardData, Invoice, SavedCard, SavedCardFull } from '@/app/types/billing';
import { PlanName, PlanType, SubscriptionPreview } from '@/app/types/subscription';
import { Res } from '@/app/types/service';

import { BaseService } from '@/app/services/base.service';
import { Route } from '@/app/static';
import { copyObject } from '@/app/utils';

type PlanDetails = {
    Details: string[];
    Duration: number;
    Plan: PlanType;
    Price: number;
    Source: PlanName;
};
type FormCardData = Omit<CardData, 'nickName' | 'isPreferred'>;
type SubscribeData = FormCardData & {
    savedCardIdx: string;
    acceptTerms: boolean;
};

interface IBillingService {
    getCards(email: string): Promise<Res<SavedCard[], false>>;

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

    getPlanDetails(email: string): Promise<Res<SubscriptionPreview, false>>;

    getInvoices(email: string): Promise<Res<Invoice[], false>>;

    postExportTransaction(email: string): Promise<Res<string>>;

    postSaveCard(formData: CardData, email: string): Promise<Res>;

    getEditCards(email: string): Promise<Res<SavedCardFull[], false>>;

    postUpdateCard(formData: CardData, email: string): Promise<Res>;

    postDeleteCard(id: string, paymentId: string, email: string): Promise<Res>;

    postCancelSubscription(email: string, source: PlanName): Promise<Res>;
}

class BillingServiceImpl extends BaseService implements IBillingService {
    constructor() {
        super(BillingServiceImpl.name);
    }

    async postCancelSubscription(email: string, source: PlanName): Promise<Res> {
        const [debug, error] = this.getLoggers(this.postCancelSubscription.name);

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `cancel-subscription`,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ userEmail: email, source }),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
            return { message: response.data.msg };
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? (err.response?.data?.error ?? err.message) : 'Unexpected error!';
        }
    }

    async postDeleteCard(id: string, paymentId: string, email: string): Promise<Res> {
        const [debug, error] = this.getLoggers(this.postUpdateCard.name);

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `remove-card`,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
                email,
                profileId: id,
                paymentProfileId: paymentId,
            }),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
            return { message: response.data.msg };
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? (err.response?.data?.error ?? err.message) : 'Unexpected error!';
        }
    }

    async postUpdateCard(formData: CardData, email: string): Promise<Res> {
        const [debug, error] = this.getLoggers(this.postUpdateCard.name);

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `update-card`,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ email, ...formData }),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
            return { message: response.data.msg };
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? (err.response?.data?.error ?? err.message) : 'Unexpected error!';
        }
    }

    async getEditCards(email: string): Promise<Res<SavedCardFull[], false>> {
        const [debug, error] = this.getLoggers(this.postSaveCard.name);

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `get-saved-cards-and-edit`,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ email }),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
            return { payload: response.data };
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? (err.response?.data?.error ?? err.message) : 'Unexpected error!';
        }
    }

    async postSaveCard(formData: CardData, user: string): Promise<Res> {
        const [debug, error] = this.getLoggers(this.postSaveCard.name);

        const cardDetails = {
            cardNumber: formData.cardNumber,
            expiryDate: formData.expirationDate,
            cardCode: formData.cvc,
        };

        const [firstName, lastName] = formData.cardholderName.split(' ');

        const billingDetails = {
            firstName,
            lastName,
            address: `${formData.addressLine1} | ${formData.addressLine2}`,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
        };

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `save-new-card`,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
                user,
                cardDetails: cardDetails,
                billingDetails: billingDetails,
                nickName: formData.nickName,
                isPreferred: formData.isPreferred,
            }),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
            return { message: response.data.msg };
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? (err.response?.data?.error ?? err.message) : 'Unexpected error!';
        }
    }

    async postExportTransaction(email: string): Promise<Res<string>> {
        const [debug, error] = this.getLoggers(this.getInvoices.name);

        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + `export-transaction-details`,
            params: { email },
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
            return {
                message: response.data.msg,
                payload: response.data,
            };
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? (err.response?.data?.error ?? err.message) : 'Unexpected error!';
        }
    }

    async getInvoices(email: string): Promise<Res<Invoice[]>> {
        const [debug, error] = this.getLoggers(this.getInvoices.name);

        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + `get-subscription-details`,
            params: { email },
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
            return {
                message: response.data.msg,
                payload: response.data,
            };
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? (err.response?.data?.error ?? err.message) : 'Unexpected error!';
        }
    }

    async getCards(email: string): Promise<Res<SavedCard[]>> {
        const [debug, error] = this.getLoggers(this.getCards.name);

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `get-saved-cards`,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ email }),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
            return {
                message: response.data.msg,
                payload: response.data,
            };
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? (err.response?.data?.error ?? err.message) : 'Unexpected error!';
        }
    }

    async postProcessPayment(
        data: SubscribeData,
        planType: PlanType,
        planDuration: number,
        planPrice: number,
        email: string,
    ): Promise<Res> {
        const [debug, error] = this.getLoggers(this.postProcessPayment.name);

        const cardDetails = {
            cardNumber: data.cardNumber,
            expiryDate: data.expirationDate,
            cardCode: data.cvc,
            cardholderName: data.cardholderName,
        };
        const [firstName, ...lastName] = data.cardholderName.split(' ');
        const billingDetails = {
            address: data.addressLine1 + (data.addressLine2 ?? ''),
            city: data.city,
            state: data.state,
            zip: data.zip,
            country: data.country,
            firstName,
            lastName,
        };
        const selectedPlan = {
            planName: planType,
            price: planPrice,
            duration: planDuration,
        };

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `process-payment`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                user: email,
                cardDetails,
                billingDetails,
                selectedPlan,
                duration: planDuration,
            }),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
            return { message: response.data.msg };
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? (err.response?.data?.error ?? err.message) : 'Unexpected error!';
        }
    }

    async postProcessSavedPayment(
        data: SubscribeData,
        planType: string,
        planDuration: number,
        planPrice: number,
        email: string,
    ): Promise<Res> {
        const [debug, error] = this.getLoggers(this.postProcessSavedPayment.name);

        try {
            const config: AxiosRequestConfig = {
                method: 'POST',
                url: this._API + `process-payment-saved`,
                headers: { 'Content-Type': 'application/json' },
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

            debug(config);
            const response = await axios(config);
            debug(response);
            return { message: response.data.msg };
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? (err.response?.data?.error ?? err.message) : 'Unexpected error!';
        }
    }

    async getPlanDetails(source: PlanName): Promise<Res<SubscriptionPreview, false>> {
        const [debug, error] = this.getLoggers(this.getPlanDetails.name);

        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + `plan-details`,
            withCredentials: false,
        };

        try {
            debug(config);
            const response: AxiosResponse<{ allplanDetails: PlanDetails[] }> = await axios(config);
            debug(response);

            let previewResult: SubscriptionPreview = {
                route: Route.TidalSubscribe,
                subscription: source,
                isBasicKind: source === 'Tidal',
                type: {},
            };
            previewResult = response.data.allplanDetails
                .filter((subscription: PlanDetails) => subscription.Source === source)
                .reduce((result, subscription: PlanDetails): SubscriptionPreview => {
                    const updatedResult: SubscriptionPreview = copyObject(result);
                    if (!updatedResult.type[subscription.Plan]) {
                        updatedResult.type[subscription.Plan] = {
                            benefits: subscription.Details,
                            priceUSD: { annual: 0, monthly: 0 },
                        };
                    }

                    updatedResult.type[subscription.Plan].priceUSD[subscription.Duration === 1 ? 'monthly' : 'annual'] =
                        subscription.Price;
                    return updatedResult;
                }, previewResult);

            return { payload: previewResult };
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? (err.response?.data?.error ?? err.message) : 'Unexpected error!';
        }
    }
}

const BillingService = new BillingServiceImpl();
export { BillingService };
export type { SubscribeData };
