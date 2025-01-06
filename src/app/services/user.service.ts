import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

import {Res} from "@/app/types/service";
import {PlanName, PlanType} from "@/app/types/subscription";
import {UserData, UserSubscription} from "@/app/context/User.context";

import {BaseService} from "./base.service";


type SubscriptionDetails = {
    name: PlanType,
    price: number,
    endDate: string,
    duration: number,
    source: PlanName
}


interface IUserService {
    getUser(token: string): Promise<Res<UserData>>;

    getPlanDetails(email: string): Promise<Res<UserSubscription[]>>;
}

class UserServiceImpl extends BaseService implements IUserService {
    constructor() {
        super(UserServiceImpl.name)
    }

    async getPlanDetails(email: string, isARCH: boolean = false): Promise<Res<UserSubscription[]>> {
        const [debug, error] = this.getLoggers(this.getPlanDetails.name);

        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + (isARCH ? 'arch-' : '') + `get-plan-details`,
            params: {email},
            withCredentials: true,
        };

        try {
            debug(config);

            const response: AxiosResponse<SubscriptionDetails[], AxiosRequestConfig> = await axios(config);
            debug(response);

            const userSubscriptions: UserSubscription[] = response.data.map((entry) => ({
                subscription: entry.source,
                type: entry.name,
                isBasicKind: entry.name === 'Basic',
                recurrency: entry.duration === 12 ? 'annual' : 'monthly',
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
            const {payload: ternKeyPlanDetails} = await this.getPlanDetails(userData.email);
            const {payload: archPlanDetails} = await this.getPlanDetails(userData.email, true);

            // Todo 2FA
            const userDataMapped: UserData = {
                ...userData,
                subscriptions: [
                    ...ternKeyPlanDetails,
                    ...archPlanDetails,
                ],
                connectedApps: {
                    data: [],
                    social: [],
                },
                state2FA: {
                    email: userData.email,
                    phone: userData.phones.personal?.number ?? userData.phones.mobile?.number ?? userData.phones.business?.number ?? ''
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
