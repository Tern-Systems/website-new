import bcryptjs from 'bcryptjs';
import { AxiosRequestConfig } from 'axios';

import { Res } from '@/app/types/service';

import { BaseService } from './base.service';

type TokenDTO = { token: string };
type LoginDTO = TokenDTO;
type ResetPasswordDTO = Partial<TokenDTO>;

type OTP_DTO = { otp: string };

interface IAuthService {
    postSignup(email: string, password: string): Promise<Res>;

    postLogin(email: string, password: string): Promise<Res<LoginDTO, false>>;

    postLogout(): Promise<Res>;

    postForgotPassword(email: string): Promise<Res>;

    postSendOTP(email: string): Promise<Res>;

    postLoginVerifyOTP(otp: string, userEmail: string): Promise<Res>;

    postResetPassword(token: string, newPassword: string): Promise<Res>;

    postChangePassword(oldPassword: string, newPassword: string, confirmPassword: string, email: string): Promise<Res>;

    postVerifyOTP(otp: string, userEmail: string): Promise<Res>;

    post2FATurnOff(email: string): Promise<Res>;

    post2FASavePhone(userEmail: string, phone: string): Promise<Res>;

    post2FASaveEmail(userEmail: string, twoFAEmail: string): Promise<Res>;

    postDeleteAccount(email: string, password: string): Promise<Res>;
}

class AuthServiceImpl extends BaseService implements IAuthService {
    private static readonly _MESSAGE = {
        ACCOUNT_CREATED: 'Successfully signed up',
        PASSWORD_UPDATED: 'Successfully update the password',
        OTP_SEND: 'OTP has been sent to your phone',
        OTP_VERIFIED: 'Successfully verified OTP. Logging in...',
        TURNED_OFF_2FA: '2 factor authentication has been turned off',
        RESET_PASSWORD_EMAIL_SENT: 'Successfully set a new password',
        PASSWORD_SET: 'Successfully set a new password',
        LOGGED_OUT: 'Successfully logged out',
    };

    constructor() {
        super(AuthServiceImpl.name);
    }

    static checkOTP_DTO(data: Partial<OTP_DTO>) {
        return [BaseService.NodeEnv !== 'test' || 'otp' in data];
    }

    async postLogout(): Promise<Res> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `auth/logout`,
            withCredentials: true,
        };
        const { message } = await this.req(this.postLogout.name, config, null);
        return { message: message ?? AuthServiceImpl._MESSAGE.LOGGED_OUT };
    }

    async postSignup(email: string, password: string): Promise<Res> {
        const salt = await bcryptjs.genSalt(10);
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + 'auth/website-signup',
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ email, password: bcryptjs.hashSync(password, salt) }),
            withCredentials: false,
        };
        const { message } = await this.req(this.postSignup.name, config, null);
        return { message: message ?? AuthServiceImpl._MESSAGE.ACCOUNT_CREATED };
    }

    async postLogin(email: string, password: string): Promise<Res<LoginDTO, false>> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `auth/login`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ email, password }),
            withCredentials: true,
        };
        const { payload } = await this.req<LoginDTO, false>(this.postLogin.name, config, (data) => [
            typeof data.token === 'string',
        ]);
        return { payload };
    }

    async postForgotPassword(email: string): Promise<Res<ResetPasswordDTO>> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `auth/forgot-password`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ email }),
            withCredentials: true,
        };
        const { payload, message } = await this.req<ResetPasswordDTO>(this.postForgotPassword.name, config, (data) => [
            BaseService.NodeEnv !== 'test' || typeof data.token === 'string',
        ]);
        return { payload, message: message ?? AuthServiceImpl._MESSAGE.RESET_PASSWORD_EMAIL_SENT };
    }

    async postResetPassword(token: string, newPassword: string): Promise<Res> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `auth/reset-password/` + token,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: { newPassword },
            withCredentials: true,
        };
        const { message } = await this.req(this.postResetPassword.name, config, null);
        return { message: message ?? AuthServiceImpl._MESSAGE.PASSWORD_SET };
    }

    async postCreatePassword(token: string, password: string): Promise<Res> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `auth/create-password`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ token, password }),
            withCredentials: true,
        };
        const { message } = await this.req(this.postCreatePassword.name, config, null);
        return { message: message ?? AuthServiceImpl._MESSAGE.PASSWORD_SET };
    }

    async postSendOTP(userEmail: string): Promise<Res<OTP_DTO>> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `auth/send-otp`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ userEmail }),
            withCredentials: true,
        };
        const { payload, message } = await this.req<OTP_DTO>(
            this.postSendOTP.name,
            config,
            AuthServiceImpl.checkOTP_DTO,
        );
        return { payload, message: message ?? AuthServiceImpl._MESSAGE.OTP_SEND };
    }

    async postLoginVerifyOTP(otp: string, email: string): Promise<Res> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `auth/verify-otp`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ userEmail: email, otp }),
            withCredentials: true,
        };
        const { message } = await this.req(this.postLoginVerifyOTP.name, config, null);
        return { message: message ?? AuthServiceImpl._MESSAGE.OTP_VERIFIED };
    }

    async post2FASendOTP(email: string, twoFAEmail: string): Promise<Res> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `auth/2FA/send-otp`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ userEmail: email, twoFAEmail }),
            withCredentials: true,
        };
        const { message } = await this.req(this.post2FASendOTP.name, config, null);
        return { message: message ?? AuthServiceImpl._MESSAGE.OTP_SEND };
    }

    async postVerifyOTP(otp: string, userEmail: string): Promise<Res> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `auth/2FA/verify-otp`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ otp, userEmail }),
            withCredentials: true,
        };
        const { message } = await this.req(this.postVerifyOTP.name, config, null);
        return { message: message ?? AuthServiceImpl._MESSAGE.OTP_VERIFIED };
    }

    async post2FATurnOff(userEmail: string): Promise<Res> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `auth/2FA/turn-off`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ userEmail }),
            withCredentials: true,
        };
        const { message } = await this.req(this.post2FATurnOff.name, config, null);
        return { message: message ?? AuthServiceImpl._MESSAGE.TURNED_OFF_2FA };
    }

    async post2FASavePhone(userEmail: string, phone: string): Promise<Res> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `auth/2FA/save-phone`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ userEmail, phone }),
            withCredentials: true,
        };
        const { message } = await this.req(this.post2FASavePhone.name, config, null);
        return { message: message ?? AuthServiceImpl._MESSAGE.TURNED_OFF_2FA };
    }

    async post2FASaveEmail(userEmail: string, twoFAEmail: string): Promise<Res> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `auth/2FA/save-email`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ userEmail, twoFAEmail }),
            withCredentials: true,
        };
        const { message } = await this.req(this.post2FASaveEmail.name, config, null);
        return { message: message ?? AuthServiceImpl._MESSAGE.TURNED_OFF_2FA };
    }

    async postDeleteAccount(email: string, confirm: string): Promise<Res> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `user/delete-account`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ email, confirm: confirm.toLowerCase() }),
            withCredentials: true,
        };
        const { message } = await this.req(this.postDeleteAccount.name, config, null);
        return { message: message ?? AuthServiceImpl._MESSAGE.TURNED_OFF_2FA };
    }

    async postChangePassword(
        oldPassword: string,
        newPassword: string,
        confirmPassword: string,
        email: string,
    ): Promise<Res> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + 'user/change-password',
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ oldPassword, newPassword, confirmPassword, email }),
            withCredentials: true,
        };
        const { message } = await this.req(this.postChangePassword.name, config, null);
        return { message: message ?? AuthServiceImpl._MESSAGE.TURNED_OFF_2FA };
    }
}

const AuthService = new AuthServiceImpl();

export type { OTP_DTO };
export { AuthService, AuthServiceImpl };
