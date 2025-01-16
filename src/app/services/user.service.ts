import axios, {AxiosRequestConfig} from "axios";

import {Res} from "@/app/types/service";
import {PlanName, PlanType, Subscription} from "@/app/types/subscription";
import {UserData} from "@/app/context/User.context";

import {BaseService} from "./base.service";


type UpdateUserData = Omit<UserData, 'email' | 'photo'> & { photo?: File | null };

type SubscriptionData = {
    name: PlanType;
    price: number;
    tax_amount: number;
    endDate: string;
    duration: number;
    source: PlanName;
}


interface IUserService {
    getUser(token: string, fetchPlanDetails: boolean): Promise<Res<UserData, false>>;

    getUserActivePlans(email: string): Promise<Res<Subscription[], false>>;

    postUpdateUser(email: string, data: UpdateUserData): Promise<Res>;

    postUpdateUserName(email: string, username: string): Promise<Res>;
}

class UserServiceImpl extends BaseService implements IUserService {
    constructor() {
        super(UserServiceImpl.name)
    }

    async postUpdateUserName(email: string, username: string): Promise<Res> {
        const [debug, error] = this.getLoggers(this.postUpdateUser.name);

        const config: AxiosRequestConfig = {
            method: "POST",
            url: this._API + `add-or-update-username`,
            headers: {'Content-Type': 'application/json',},
            data: JSON.stringify({userEmail: email, username}),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
            return {message: response.data.msg}
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.response?.data?.error ?? err.message : 'Unexpected error!';
        }
    }

    async postUpdateUser(email: string, data: UpdateUserData): Promise<Res> {
        const [debug, error] = this.getLoggers(this.postUpdateUser.name);

        const userFormData = new FormData();

        userFormData.set('userEmail', email);

        if (data.photo)
            userFormData.set('photo', data.photo);

        userFormData.set('salutation', data.name.salutation);
        userFormData.set('firstName', data.name.firstName);
        userFormData.set('initial', data.name.initial ?? '');
        userFormData.set('lastName', data.name.lastName);
        userFormData.set('language', data.language ?? 'en-US');
        userFormData.set('businessLine1', data.address.businessAddress?.line1 ?? '')
        userFormData.set('businessLine2', data.address.businessAddress?.line2 ?? '')
        userFormData.set('businessState', data.address.businessAddress?.state ?? '')
        userFormData.set('businessZip', data.address.businessAddress?.zip ?? '')
        userFormData.set('businessCity', data.address.businessAddress?.city ?? '')
        userFormData.set('businessCountry', data.address.businessAddress?.country ?? '')
        userFormData.set('businessAddressIsPrimary', data.address.businessAddress?.isPrimary?.toString() ?? 'false')
        userFormData.set('personalLine1', data.address.personalAddress?.line1 ?? '')
        userFormData.set('personalLine2', data.address.personalAddress?.line2 ?? '')
        userFormData.set('personalState', data.address.personalAddress?.state ?? '')
        userFormData.set('personalZip', data.address.personalAddress?.zip ?? '')
        userFormData.set('personalCity', data.address.personalAddress?.city ?? '')
        userFormData.set('personalCountry', data.address.personalAddress?.country ?? '')
        userFormData.set('personalAddressIsPrimary', data.address.personalAddress?.isPrimary.toString() ?? 'false')
        userFormData.set('companyName', data.company?.name ?? '')
        userFormData.set('jobTitle', data.company?.jobTitle ?? '')
        userFormData.set('jobFunction', data.company?.jobFunction ?? '')
        userFormData.set('industry', data.company?.industry ?? '')
        userFormData.set('subIndustry', data.company?.subIndustry ?? '')
        userFormData.set('mobilePhone', data.phones.mobile?.number ?? '')
        userFormData.set('mobileIsPrimary', data.phones.mobile?.isPrimary.toString() ?? 'false')
        userFormData.set('businessPhone', data.phones.business?.number ?? '')
        userFormData.set('businessExtension', data.phones.business && 'ext' in data.phones.business ? data.phones.business?.ext : '')
        userFormData.set('businessIsPrimary', data.phones.business?.isPrimary.toString() ?? 'false')
        userFormData.set('personalPhone', data.phones.personal?.number ?? '')
        userFormData.set('personalIsPrimary', data.phones.personal?.isPrimary.toString() ?? 'false')

        const config: AxiosRequestConfig = {
            method: "POST",
            url: this._API + `update-user-data`,
            headers: {'Content-Type': 'multipart/form-data'},
            data: userFormData,
            withCredentials: true,
        };

        try {
            debug(config);
            debug(Object.fromEntries(Array.from(userFormData)));
            const response = await axios(config);
            debug(response);
            return {message: response.data.msg}
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.response?.data?.error ?? err.message : 'Unexpected error!';
        }
    }

    async getUserActivePlans(email: string): Promise<Res<Subscription[], false>> {
        const [debug, error] = this.getLoggers(this.getUserActivePlans.name);

        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + `get-plan-details`,
            params: {email},
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);

            const userSubscriptions: Subscription[] = response.data.map((entry: SubscriptionData): Subscription => {
                if (!('tax_amount' in entry))
                    throw 'Received wrong response schema from the server'
                return {
                    subscription: entry.source ?? '--',
                    type: entry.name ?? '--',
                    isBasicKind: entry.name === 'Basic',
                    recurrency: entry.duration === 12 ? 'annual' : 'monthly',
                    renewDate: new Date(entry.endDate ?? 0).getTime(),
                    tax: entry.tax_amount ?? NaN,
                    priceUSD: entry.price ?? NaN,
                }
            })

            return {payload: userSubscriptions};
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.response?.data?.error ?? err.message : 'Unexpected error!';
        }
    }

    async getUser(token: string): Promise<Res<UserData, false>> {
        const [debug, error] = this.getLoggers(this.getUser.name);

        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + `get-user-data`,
            headers: {Authorization: 'Bearer ' + token},
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);

            const userData: UserData = response.data;

            if (!userData.email)
                throw "Incorrect response from server";

            const {payload: subscriptions} = await this.getUserActivePlans(userData.email);

            const userDataMapped: UserData = {
                ...userData,
                subscriptions,
                connectedApps: {
                    data: [],
                    social: [],
                },
                state2FA: {
                    email: userData.state2FA.email,
                    phone: userData.state2FA.phone,
                }
            }

            return {payload: userDataMapped};
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.response?.data?.error ?? err.message : 'Unexpected error!';
        }
    }

}

const UserService = new UserServiceImpl();
export type {UpdateUserData};
export {UserService}
