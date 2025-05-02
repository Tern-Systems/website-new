import { ReactElement } from 'react';
import { AxiosRequestConfig } from 'axios';

import { cleanup, RenderOptions, RenderResult } from '@testing-library/react';

import { NavigationMock } from '@/tests/mocks/navigation';
import { render, waitFor } from '@/tests/utils/jest.util';

import { Subscription } from '@/app/types/subscription';

import { BaseService, BillingService } from '@/app/services';

import { AuthService } from '@/app/services/auth.service';

import { createCookie } from '@/app/utils';

const UseUserHookMock = jest.requireMock('@/app/hooks/context/useUser');

class BaseUtilImpl extends BaseService {
    public static readonly DATA = {
        dummyEmail: 'dummyemail@email.dom',
        dummyPassword: 'Pass25dummy2%',
    };

    constructor() {
        super(BaseUtilImpl.name);
    }

    // User flow
    async signupUser(email: string = BaseUtilImpl.DATA.dummyEmail, password: string = BaseUtilImpl.DATA.dummyPassword) {
        await AuthService.postSignup(email, password);
    }

    async renderLoggedIn(
        Element: ReactElement,
        createAccount: boolean = true,
        options: RenderOptions = {},
    ): Promise<{ render: RenderResult; useUserSpy: jest.SpyInstance }> {
        if (createAccount) await this.signupUser();

        const { payload } = await AuthService.postLogin(BaseUtilImpl.DATA.dummyEmail, BaseUtilImpl.DATA.dummyPassword);
        const { token } = payload;

        if (!token) throw 'Error receiving bearer token from backend';

        this.mockCookie();
        document.cookie = createCookie(token);

        const useUserSpy = jest.spyOn(UseUserHookMock, 'useUser');

        const page = await render(Element, options);

        await waitFor(() => {
            expect(useUserSpy).toHaveBeenCalled();
            expect(useUserSpy).not.toHaveLastReturnedWith(expect.objectContaining({ userData: null }));
        });

        return { render: page, useUserSpy };
    }

    // Utils
    async deleteUser(email: string = BaseUtilImpl.DATA.dummyEmail): Promise<void> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `tester/delete-profile`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ email }),
        };

        await this.req(this.deleteUser.name, config, null);
    }

    mockCookie = () => Object.defineProperty(document, 'cookie', { writable: true, value: '' });

    mockGetUserPlans = (subscriptions: Subscription[]) =>
        jest.spyOn(BillingService, 'getUserActivePlans').mockReturnValue(Promise.resolve({ payload: subscriptions }));

    mockRouter = () => jest.spyOn(NavigationMock, 'useRouter').mockReturnValue({ push: jest.fn() });

    mockPathName = (path: string) => jest.spyOn(NavigationMock, 'usePathname').mockReturnValue(path);

    mockParams = (params: Record<string, string>) => jest.spyOn(NavigationMock, 'useParams').mockReturnValue(params);

    mockSearchParams = (query: Record<string, string>) =>
        jest.spyOn(NavigationMock, 'useSearchParams').mockReturnValue(new URLSearchParams(query));

    async clean(expectError?: boolean) {
        if (expectError) return await this._clean();

        try {
            await this._clean();
        } catch (_) {
            //Empty block
        }
    }

    private async _clean() {
        await BaseTestUtil.deleteUser();
        jest.clearAllMocks();
        jest.restoreAllMocks();
        jest.resetAllMocks();
        jest.clearAllTimers();
        jest.resetModules();
        cleanup();
    }
}

const BaseTestUtil = new BaseUtilImpl();

export { BaseTestUtil, BaseUtilImpl };
