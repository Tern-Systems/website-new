import axios, {AxiosRequestConfig} from "axios";

import {Res} from "@/app/types/service";
import {UserData} from "@/app/context/User.context";

import {BaseService} from "./base.service";


interface IUserService {
    getUser(token: string): Promise<Res<UserData>>;
}

class UserServiceImpl extends BaseService implements IUserService {
    constructor() {
        super(UserServiceImpl.name)
    }

    async getUser(token: string): Promise<Res<UserData>> {
        this.log(this.getUser.name);
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + `get-user-data`,
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
