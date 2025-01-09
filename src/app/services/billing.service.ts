import axios, {AxiosRequestConfig} from "axios";

import {CardData, InvoiceHistory, SavedCard, SavedCardFull} from "@/app/types/billing";
import {PlanType} from "@/app/types/subscription";
import {Res} from "@/app/types/service";

import {BaseService} from "@/app/services/base.service";


type FormCardData = Omit<CardData, 'nickName' | 'isDefault'>;
type SubscribeData = FormCardData & {
    savedCardIdx: string;
    acceptTerms: boolean;
}

interface IBillingService {
    getCards(email: string): Promise<Res<SavedCard[]>>;

    postProcessPayment(data: SubscribeData, planType: string, planDuration: number, planPrice: number, email: string, isArch: boolean): Promise<Res>;

    postProcessSavedPayment(data: SubscribeData, planType: string, planDuration: number, planPrice: number, email: string, isArch: boolean): Promise<Res>;

    //eslint-disable-next-line
    getPlanDetails(email: string): any;

    postGetInvoices(email: string): Promise<Res<InvoiceHistory[]>>;

    postExportTransaction(email: string): Promise<Res<string>>;

    postSaveCard(formData: CardData, email: string): Promise<Res>;

    getEditCards(email: string): Promise<Res<SavedCardFull[]>>;
}

class BillingServiceImpl extends BaseService implements IBillingService {
    constructor() {
        super(BillingServiceImpl.name)
    }

    async getEditCards(email: string): Promise<Res<SavedCardFull[]>> {
        const [debug, error] = this.getLoggers(this.postSaveCard.name);

        const config: AxiosRequestConfig = {
            method: "POST",
            data: JSON.stringify({email,}),
            url: this._API + `get-saved-cards-and-edit`,
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);

            return {payload: response.data};
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async postSaveCard(formData: CardData, user: string): Promise<Res> {
        const [debug, error] = this.getLoggers(this.postSaveCard.name);

        const cardDetails = {
            cardNumber: formData.cardNumber,
            expiryDate: formData.expirationDate,
            cardCode: formData.cvc
        }

        const billingDetails = {
            firstName: formData.cardholderName,
            lastName: formData.cardholderName,
            address: `${formData.addressLine1} | ${formData.addressLine2}`,
            city: formData.city,
            state: formData.state,
            zip: formData.postalCode,
            country: formData.billingCountry
        }


        const config: AxiosRequestConfig = {
            method: "POST",
            url: this._API + `save-new-card`,
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({
                user,
                cardDetails: cardDetails,
                billingDetails: billingDetails,
                nickName: formData.nickName,
                isPreferred: formData.isDefault
            }),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async postExportTransaction(email: string): Promise<Res<string>> {
        const [debug, error] = this.getLoggers(this.postGetInvoices.name);

        const config: AxiosRequestConfig = {
            method: "POST",
            url: this._API + `export-transaction-details`,
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({email}),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
            return {payload: response.data};
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async postGetInvoices(email: string): Promise<Res<InvoiceHistory[]>> {
        const [debug, error] = this.getLoggers(this.postGetInvoices.name);

        const config: AxiosRequestConfig = {
            method: "POST",
            url: this._API + `get-subscription-details`,
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({email}),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
            return {payload: [response.data]};
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async getCards(email: string): Promise<Res<SavedCard[]>> {
        const [debug, error] = this.getLoggers(this.getCards.name);

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `get-saved-cards`,
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({email}),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
            return {payload: response.data};
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async postProcessPayment(data: SubscribeData, planType: PlanType, planDuration: number, planPrice: number, email: string, isArch: boolean): Promise<Res> {
        const [debug, error] = this.getLoggers(this.postProcessPayment.name);

        // TODO change body
        const cardDetails = {
            cardNumber: data.cardNumber,
            expiryDate: data.expirationDate,
            cardCode: data.cvc,
            cardholderName: data.cardholderName,
        };
        const [firstName, lastName] = data.cardholderName.split(' ');
        const billingDetails = {
            address: data.addressLine1 + (data.addressLine2 ?? ''),
            city: data.city,
            state: data.state,
            zip: data.postalCode,
            country: data.billingCountry,
            firstName,
            lastName
        };
        const selectedPlan = {
            planName: planType,
            price: planPrice,
            duration: planDuration,
        };

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + (isArch ? 'arch-' : '') + `process-payment`,
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
            return response.data;
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async postProcessSavedPayment(data: SubscribeData, planType: string, planDuration: number, planPrice: number, email: string, isArch: boolean): Promise<Res> {
        const [debug, error] = this.getLoggers(this.postProcessSavedPayment.name);

        try {
            const taxResponse = await this._fetchTaxes('place');

            const config: AxiosRequestConfig = {
                method: 'POST',
                url: this._API + (isArch ? 'arch-' : '') + `process-payment-saved`,
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify({
                    user: email,
                    cardId: data.id,
                    cvv: data.cvc,
                    planName: planType,
                    price: planPrice * (1 + taxResponse),
                    duration: planDuration,
                    state: data.state
                }),
                withCredentials: true,
            };

            debug(config);
            const response = await axios(config);
            debug(response);
            return response.data;
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    };

    async getPlanDetails(email: string) {

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `arch-current-plan`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {user: email},
            withCredentials: false,
        };
        try {
            const response = await axios(config);

            return response.data;
        } catch (err: unknown) {

            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    // eslint-disable-next-line
    private async _fetchTaxes(place: string): Promise<number> { // TODO
        // eslint-disable-next-line
        const [debug, error] = this.getLoggers(this._fetchTaxes.name);
        return 0;
    }
}

const BillingService = new BillingServiceImpl();
export {BillingService}
export type {SubscribeData}
