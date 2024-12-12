import axios, {AxiosRequestConfig} from "axios";

import {CardData} from "@/app/types/billing";
import {Res} from "@/app/types/service";

import {BaseService} from "@/app/services/base.service";


type FormCardData = Omit<CardData, 'nickName' | 'isDefault' | 'cardId'>;
type SubscribeData = FormCardData & {
    savedCardIdx: string;
    acceptTerms: boolean;
}

interface IBillingService {
    getCards(email: string): Promise<Res<CardData[]>>;

    postProcessPayment(data: SubscribeData, planType: string, planDuration: number, planPrice: number, email: string): Promise<Res>;

    postProcessSavedPayment(data: SubscribeData, planType: string, planDuration: number, planPrice: number, email: string): Promise<Res>;
}

class BillingServiceImpl extends BaseService implements IBillingService {
    constructor() {
        super()
    }

    async getCards(email: string): Promise<Res<CardData[]>> {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this.API + `get-saved-cards`,
            params: {email},
            withCredentials: true,
        };

        try {
            const response = await axios(config);
            return response.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data.msg : 'Unknown error!';
        }
    }

    async postProcessPayment(data: SubscribeData, planType: string, planDuration: number, planPrice: number, email: string): Promise<Res> {
        const cardDetails = {
            cardNumber: data.cardNumber,
            expiryDate: data.expirationDate,
            cardCode: data.cvc,
        };
        const [firstName, lastName] = data.cardholderName.split(' ');
        const billingDetails = {
            firstName,
            lastName,
            address: data.addressLine1 + (data.addressLine2 ?? ''),
            city: data.city,
            state: data.state,
            zip: data.postalCode,
            country: data.billingCountry
        };
        const selectedPlan = {
            planName: planType,
            price: planPrice,
            duration: planDuration
        };

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this.API + `process-payment`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                user: email,
                cardDetails,
                billingDetails,
                selectedPlan,
            }),
            withCredentials: true,
        };

        try {
            const response = await axios(config);
            return response.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data.msg : 'Unknown error!';
        }
    }

    async postProcessSavedPayment(data: SubscribeData, planType: string, planDuration: number, planPrice: number, email: string): Promise<Res> {
        try {
            const taxResponse = await this._fetchTaxes('place');

            const config: AxiosRequestConfig = {
                method: 'POST',
                url: this.API + `process-payment-saved`,
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

            const response = await axios(config);
            return response.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data.msg : 'Unknown error!';
        }
    };

    private async _fetchTaxes(place: string): Promise<number> { // TODO
        return 0;
    }
}

const BillingService = new BillingServiceImpl();
export {BillingService}
export type {SubscribeData}
