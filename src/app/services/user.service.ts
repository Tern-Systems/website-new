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
        const [debug, error] = this.getLoggers(this.getUser.name);

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
            debug(config);
            const response = await axios(config);
            debug(response);
            return {payload: response.data};
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

}

const UserService = new UserServiceImpl();
export {UserService}
