import {genSalt, hashSync} from "bcryptjs";
import axios, {AxiosRequestConfig} from "axios";

import {Res} from "@/app/types/service";

import {BaseService} from "./base.service";


type LoginData = {
    email: string;
    password: string;
}

type SignUpData = LoginData & {
    passwordConfirm: string;
}


interface IAuthService {
    postSignUp(data: SignUpData): Promise<Res>;

    postLogIn(data: LoginData): Promise<Res<string>>;

    postForgotPassword(email: string): Promise<void>;
}

class AuthServiceImpl extends BaseService implements IAuthService {
    constructor() {
        super(AuthServiceImpl.name)
    }

    async postSignUp(data: SignUpData): Promise<Res> {
        this.log(this.postSignUp.name);
        const salt = await genSalt(10);
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + 'signup',
            headers: {
                "Content-Type": 'application/json',
            },
            data: JSON.stringify({
                email: data.email,
                password: hashSync(data.password, salt)
            }),
            withCredentials: false,
        };

        try {
            await axios(config);
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data.msg : 'Unknown error!';
        }
    }

    async postLogIn(data: LoginData): Promise<Res<string>> {
        this.log(this.postLogIn.name);
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `login`,
            headers: {'Content-Type': 'application/json',},
            data: JSON.stringify({
                email: data.email,
                password: data.password
            }),
            withCredentials: true,
        };

        try {
            const response = await axios(config);
            return {payload: response.data.token};
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data.msg : 'Unknown error!';
        }
    }

    async postForgotPassword(email: string): Promise<void> {
        this.log(this.postForgotPassword.name);
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `forgot-password`,
            headers: {'Content-Type': 'application/json',},
            data: JSON.stringify({email}),
            withCredentials: true,
        };

        try {
            await axios(config);
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data.msg : 'Unknown error!';
        }
    }

    async postResetPassword(token: string, newPassword: string): Promise<void> {
        this.log(this.postResetPassword.name);
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `reset-password/` + token,
            headers: {'Content-Type': 'application/json',},
            data: {newPassword},
            withCredentials: true,
        };

        try {
            await axios(config);
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data.msg : 'Unknown error!';
        }
    }
}

const AuthService = new AuthServiceImpl();
export {AuthService}
export type {SignUpData, LoginData}