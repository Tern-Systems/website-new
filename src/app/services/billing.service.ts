import axios, {AxiosRequestConfig} from "axios";

import {CardData, InvoiceHistory} from "@/app/types/billing";
import {Res} from "@/app/types/service";

import {BaseService} from "@/app/services/base.service";
import { url } from "inspector";


type FormCardData = Omit<CardData, 'nickName' | 'isDefault' | 'cardId'>;
type SubscribeData = FormCardData & {
    savedCardIdx: string;
    acceptTerms: boolean;
}

interface IBillingService {
    getCards(email: string): Promise<Res<CardData[]>>;

    postProcessPayment(data: SubscribeData, planType: string, planDuration: number, planPrice: number, email: string): Promise<Res>;

    postProcessSavedPayment(data: SubscribeData, planType: string, planDuration: number, planPrice: number, email: string): Promise<Res>;
    getPlanDetails(email: string):any;

    postGetInvoices(email: string): Promise<Res<InvoiceHistory[]>>;
}

class BillingServiceImpl extends BaseService implements IBillingService {
    constructor() {
        super(BillingServiceImpl.name)
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
            return response.data;
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async getCards(email: string): Promise<Res<CardData[]>> {
        const [debug, error] = this.getLoggers(this.getCards.name);

        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + `get-saved-cards`,
            params: {email},
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

    async postProcessPayment(data: SubscribeData, planType: string, planDuration: number, planPrice: number, email: string): Promise<Res> {
        const [debug, error] = this.getLoggers(this.postProcessPayment.name);

        // TODO change body
        const cardDetails = {
            cardNumber: data.cardNumber,
            expiryDate: data.expirationDate,
            cardCode: data.cvc,
            cardholderName: data.cardholderName.split(' '),
        };
        const billingDetails = {
            address: data.addressLine1 + (data.addressLine2 ?? ''),
            city: data.city,
            state: data.state,
            zip: data.postalCode,
            country: data.billingCountry
        };
        const selectedPlan = {
            planName: planType,
            price: planPrice,
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
            return response.data;
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async postProcessSavedPayment(data: SubscribeData, planType: string, planDuration: number, planPrice: number, email: string): Promise<Res> {
        const [debug, error] = this.getLoggers(this.postProcessSavedPayment.name);

        try {
            const taxResponse = await this._fetchTaxes('place');

            const config: AxiosRequestConfig = {
                method: 'POST',
                url: this._API + `process-payment-saved`,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    user: email,
                    cardId: data.cardNumber,
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
            data: {user:email},
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
