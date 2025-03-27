import { AxiosRequestConfig } from 'axios';

import { BaseUtilImpl } from '@/__tests__/utils/base.util';

import { AuthService, BaseService } from '@/app/services';
import { AuthServiceImpl, OTP_DTO } from '@/app/services/auth.service';

class AuthTestUtilImpl extends BaseUtilImpl {
    public static readonly DATA = {
        ...BaseUtilImpl.DATA,
        wrongEmail: 'wrong-email@email.dom',
        newPassword: 'Pass25dummy2%%',
        dummyPhone: '+12345678901',
    };

    // Utils
    async requestPasswordReset(email: string = AuthTestUtilImpl.DATA.dummyEmail) {
        const { payload } = await AuthService.postForgotPassword(email);
        const { token } = payload;

        if (!token) throw 'No token has been received from backend';
        return token;
    }

    async setup2FA(): Promise<void> {
        // Save phone
        const configSavePhone: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `2FA-save-phone`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({
                userEmail: AuthTestUtilImpl.DATA.dummyEmail,
                phone: AuthTestUtilImpl.DATA.dummyPhone,
            }),
            withCredentials: true,
        };

        await this.req(this.setup2FA.name, configSavePhone, null);

        // Enable 2FA
        const configRequest2FA_OTP: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `2FA-send-otp`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({
                userEmail: AuthTestUtilImpl.DATA.dummyEmail,
                phone: AuthTestUtilImpl.DATA.dummyPhone,
            }),
            withCredentials: true,
        };

        const { payload } = await this.req<Partial<OTP_DTO>>(
            this.setup2FA.name,
            configRequest2FA_OTP,
            AuthServiceImpl.checkOTP_DTO,
        );

        const { otp } = payload;

        if (!otp) throw 'Error receiving OTP from backend';

        const configEnable2FA: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `2FA-verify-otp`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ userEmail: AuthTestUtilImpl.DATA.dummyEmail, otp }),
            withCredentials: true,
        };

        await this.req(this.setup2FA.name, configEnable2FA, null);
    }
}

const AuthTestUtil = new AuthTestUtilImpl();

export { AuthTestUtil, AuthTestUtilImpl };
