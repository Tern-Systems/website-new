import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

import {Res} from "@/app/types/service";
import {PlanName, PlanType, Subscription} from "@/app/types/subscription";
import {UserData} from "@/app/context/User.context";

import {BaseService} from "./base.service";


type SubscriptionData = {
    name: PlanType;
    price: number;
    tax_amount: number;
    endDate: string;
    duration: number;
    source: PlanName;
}


interface IUserService {
    getUser(token: string): Promise<Res<UserData>>;

    getPlanDetails(email: string): Promise<Res<Subscription[]>>;
}

class UserServiceImpl extends BaseService implements IUserService {
    constructor() {
        super(UserServiceImpl.name)
    }

    async getPlanDetails(email: string): Promise<Res<Subscription[]>> {
        const [debug, error] = this.getLoggers(this.getPlanDetails.name);

        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + `get-plan-details`,
            params: {email},
            withCredentials: true,
        };

        try {
            debug(config);
            const response: AxiosResponse<SubscriptionData[], AxiosRequestConfig> = await axios(config);
            debug(response);

            const userSubscriptions: Subscription[] = response.data.map((entry) => ({
                subscription: entry.source ?? '--',
                type: entry.name ?? '--',
                isBasicKind: entry.name === 'Basic',
                recurrency: entry.duration === 12 ? 'annual' : 'monthly',
                renewDate: new Date(entry.endDate ?? 0).getTime(),
                tax: entry.tax_amount ?? NaN,
                priceUSD: entry.price ?? NaN,
            }))

            return {payload: userSubscriptions};
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async getUser(token: string): Promise<Res<UserData>> {
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

            // const ternKeyResponse = await this.getPlanDetails(userData.email);
            const {payload: subscriptions} = await this.getPlanDetails(userData.email);

            // Todo 2FA
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
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

}

const UserService = new UserServiceImpl();
export {UserService}
