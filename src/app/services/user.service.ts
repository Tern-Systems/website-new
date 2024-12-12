import axios, {AxiosRequestConfig} from "axios";

import {Res} from "@/app/types/service";

import {UserData} from "@/app/context";

import {BaseService} from "./base.service";


type UserBaseData = Pick<UserData, 'email' | 'isEmailVerified' | 'isPurchased'>

interface IUserService {
    getUser(token: string): Promise<Res<UserBaseData>>;
}

class UserServiceImpl extends BaseService implements IUserService {
    constructor() {
        super()
    }

    async getUser(token: string): Promise<Res<UserBaseData>> {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this.API + `get-user-data`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
            withCredentials: true,
        };

        try {
            const response = await axios(config);
            return {payload: response.data};
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data.msg : 'Unknown error!';
        }
    }

}

const UserService = new UserServiceImpl();
export {UserService}
