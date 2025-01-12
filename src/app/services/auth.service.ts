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

    postSendOTP(email: string): Promise<void>;

    postLoginVerifyOTP(otp: string, userEmail: string): Promise<void>;

    postResetPassword(token: string, newPassword: string): Promise<void>;

    postChangePassword(oldPassword: string, newPassword: string, confirmPassword: string, email: string): Promise<void>

    postVerifyOTP(otp: string, userEmail: string): Promise<void>;

    post2FATurnOff(email: string): Promise<void>;

    post2FASavePhone(userEmail: string, phone: string): Promise<void>;

    postDeleteAccount(email: string, password: string): Promise<void>;
}

class AuthServiceImpl extends BaseService implements IAuthService {
    constructor() {
        super(AuthServiceImpl.name)
    }

    async postSignUp(data: SignUpData): Promise<Res> {
        const [debug, error] = this.getLoggers(this.postSignUp.name);

        const salt = await genSalt(10);
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + 'arch-signup',
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
            debug(config);
            const response = await axios(config);
            debug(response);
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async postLogIn(data: LoginData): Promise<Res<string>> {
        const [debug, error] = this.getLoggers(this.postLogIn.name);

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
            debug(config);
            const response = await axios(config);
            debug(response);
            return {payload: response.data.token};
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async postForgotPassword(email: string): Promise<void> {
        const [debug, error] = this.getLoggers(this.postForgotPassword.name);

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `forgot-password`,
            headers: {'Content-Type': 'application/json',},
            data: JSON.stringify({email}),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async postResetPassword(token: string, newPassword: string): Promise<void> {
        const [debug, error] = this.getLoggers(this.postResetPassword.name);

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `reset-password/` + token,
            headers: {'Content-Type': 'application/json',},
            data: {newPassword},
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async postSendOTP(email: string): Promise<void> {
        const [debug, error] = this.getLoggers(this.postSendOTP.name);

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `send-otp`,
            headers: {'Content-Type': 'application/json',},
            data: JSON.stringify({userEmail: email}),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? error : 'Unknown error!';
        }
    }

    async postLoginVerifyOTP(otp: string, userEmail: string): Promise<void> {
        const [debug, error] = this.getLoggers(this.postLoginVerifyOTP.name);

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `2FA-login-verify-otp`,
            headers: {'Content-Type': 'application/json',},
            data: JSON.stringify({userEmail, otp}),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async post2FASendOTP(email: string, phone: string): Promise<void> {
        const [debug, error] = this.getLoggers(this.post2FASendOTP.name);

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `2FA-send-otp`,
            headers: {'Content-Type': 'application/json',},
            data: JSON.stringify({userEmail: email, phone: phone}),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async postVerifyOTP(otp: string, userEmail: string): Promise<void> {
        const [debug, error] = this.getLoggers(this.postVerifyOTP.name);

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `2FA-verify-otp`,
            headers: {'Content-Type': 'application/json',},
            data: JSON.stringify({otp, userEmail}),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async post2FATurnOff(userEmail: string): Promise<void> {
        const [debug, error] = this.getLoggers(this.post2FATurnOff.name);

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `2FA-turn-off`,
            data: {userEmail},
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async post2FASavePhone(userEmail: string, phone: string): Promise<void> {
        const [debug, error] = this.getLoggers(this.post2FASavePhone.name);

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `2FA-save-phone`,
            headers: {'Content-Type': 'application/json',},
            data: JSON.stringify({userEmail, phone}),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async postDeleteAccount(email: string, confirm: string): Promise<void> {
        const [debug, error] = this.getLoggers(this.postDeleteAccount.name);

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `delete-account`,
            headers: {'Content-Type': 'application/json',},
            data: JSON.stringify({email, confirm: confirm.toLowerCase()}),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
            return response.data.success;
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }

    async postChangePassword(oldPassword: string, newPassword: string, confirmPassword: string, email: string): Promise<void> {
        const [debug, error] = this.getLoggers(this.postChangePassword.name);

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + 'change-password',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({oldPassword, newPassword, confirmPassword, email}),
            withCredentials: true,
        };

        try {
            debug(config);
            const response = await axios(config);
            debug(response);
        } catch (err: unknown) {
            error(err);
            throw axios.isAxiosError(err) ? err.message : 'Unexpected error!';
        }
    }
}

const AuthService = new AuthServiceImpl();
export {AuthService}
export type {SignUpData, LoginData}