import {genSalt, hashSync} from "bcryptjs";
import axios, {AxiosRequestConfig} from "axios";
import {Res} from "@/app/utils/service";

type LoginData = {
    email: string;
    password: string;
}

type SignUpData = LoginData & {
    passwordConfirm: string;
}

interface IAuthService {
    postSignUp: (data: SignUpData) => Promise<Res>;
    postLogIn: (data: LoginData) => Promise<Res<string>>;
}

class AuthServiceImpl implements IAuthService {
    readonly API: string;

    constructor() {
        const api: string | undefined = process.env.NEXT_PUBLIC_API;
        if (!api)
            throw 'API URL is not defined!'
        this.API = api;
    }

    async postSignUp(data: SignUpData): Promise<Res> {
        if (data.password !== data.passwordConfirm)
            throw "Passwords don't match";

        const salt = await genSalt(10);
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this.API + 'signup',
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
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this.API + `login`,
            headers: {
                "Content-Type": 'application/json',
            },
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
}

const Service = new AuthServiceImpl();
export {Service}
export type {SignUpData, LoginData}