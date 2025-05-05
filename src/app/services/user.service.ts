import { AxiosRequestConfig } from 'axios';

import { Res } from '@/app/types/service';
import { Subscription } from '@/app/types/subscription';
import { UserData } from '@/app/contexts/user.context';

import { BaseService } from './base.service';

import { BillingService } from '@/app/services/billing.service';

type UpdateUserData = Omit<UserData, 'email' | 'photo'> & { photo?: File | null };

interface IUserService {
    getUser(token: string, fetchPlanDetails: boolean): Promise<Res<UserData, false>>;

    postUpdateUser(email: string, data: UpdateUserData): Promise<Res>;

    postUpdateUserName(email: string, username: string): Promise<Res>;
}

class UserServiceImpl extends BaseService implements IUserService {
    private static readonly _MESSAGE = {
        PROFILE_UPDATED: 'Successfully update profile',
    };

    constructor() {
        super(UserServiceImpl.name);
    }

    async postUpdateUserName(email: string, username: string): Promise<Res> {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `user/update-username`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify({ userEmail: email, username }),
            withCredentials: true,
        };
        const { message } = await this.req<undefined, false>(this.postUpdateUserName.name, config, null);
        return { message: message || UserServiceImpl._MESSAGE.PROFILE_UPDATED };
    }

    async postUpdateUser(email: string, data: UpdateUserData): Promise<Res> {
        const userFormData = new FormData();

        userFormData.set('userEmail', email);

        if (data.photo) userFormData.set('photo', data.photo);

        userFormData.set('salutation', data.name.salutation);
        userFormData.set('firstName', data.name.firstName);
        userFormData.set('initial', data.name.initial ?? '');
        userFormData.set('lastName', data.name.lastName);
        userFormData.set('language', data.language ?? 'en-US');
        userFormData.set('businessLine1', data.address.businessAddress?.line1 ?? '');
        userFormData.set('businessLine2', data.address.businessAddress?.line2 ?? '');
        userFormData.set('businessState', data.address.businessAddress?.state ?? '');
        userFormData.set('businessZip', data.address.businessAddress?.zip ?? '');
        userFormData.set('businessCity', data.address.businessAddress?.city ?? '');
        userFormData.set('businessCountry', data.address.businessAddress?.country ?? '');
        userFormData.set('businessAddressIsPrimary', data.address.businessAddress?.isPrimary?.toString() ?? 'false');
        userFormData.set('personalLine1', data.address.personalAddress?.line1 ?? '');
        userFormData.set('personalLine2', data.address.personalAddress?.line2 ?? '');
        userFormData.set('personalState', data.address.personalAddress?.state ?? '');
        userFormData.set('personalZip', data.address.personalAddress?.zip ?? '');
        userFormData.set('personalCity', data.address.personalAddress?.city ?? '');
        userFormData.set('personalCountry', data.address.personalAddress?.country ?? '');
        userFormData.set('personalAddressIsPrimary', data.address.personalAddress?.isPrimary.toString() ?? 'false');
        userFormData.set('companyName', data.company?.name ?? '');
        userFormData.set('jobTitle', data.company?.jobTitle ?? '');
        userFormData.set('jobFunction', data.company?.jobFunction ?? '');
        userFormData.set('industry', data.company?.industry ?? '');
        userFormData.set('subIndustry', data.company?.subIndustry ?? '');
        userFormData.set('mobilePhone', data.phones.mobile?.number ?? '');
        userFormData.set('mobileIsPrimary', data.phones.mobile?.isPrimary.toString() ?? 'false');
        userFormData.set('businessPhone', data.phones.business?.number ?? '');
        userFormData.set(
            'businessExtension',
            data.phones.business && 'ext' in data.phones.business ? data.phones.business?.ext : '',
        );
        userFormData.set('businessIsPrimary', data.phones.business?.isPrimary.toString() ?? 'false');
        userFormData.set('personalPhone', data.phones.personal?.number ?? '');
        userFormData.set('personalIsPrimary', data.phones.personal?.isPrimary.toString() ?? 'false');

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: this._API + `user/update-data`,
            headers: BaseService._HEADER.CONTENT_JSON,
            data: userFormData,
            withCredentials: true,
        };
        const { message } = await this.req<undefined, false>(this.postUpdateUser.name, config, null);
        return { message: message || UserServiceImpl._MESSAGE.PROFILE_UPDATED };
    }

    async getUser(token: string, fetchPlanDetails: boolean = false): Promise<Res<UserData, false>> {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: this._API + `user/data`,
            headers: BaseService._HEADER.AUTHORIZATION(token),
            withCredentials: true,
        };
        const { payload: userData } = await this.req<UserData, false>(this.getUser.name, config, (data) => [
            typeof data.email === 'string',
        ]);

        let subscriptions: Subscription[] = [];
        if (fetchPlanDetails) {
            const { payload: activeSubscriptions } = await BillingService.getUserActivePlans(userData.email);
            subscriptions = activeSubscriptions;
        }

        const userDataMapped: UserData = {
            ...userData,
            subscriptions,
            connectedApps: {
                data: [],
                social: [],
            },
            phones: {
                ...userData.phones,
                mobile: {
                    number: userData.phones.mobile?.number ?? userData.state2FA.phone ?? '',
                    isPrimary: userData.phones.mobile?.isPrimary ?? Boolean(userData.state2FA.phone) ?? false,
                },
            },
        };

        return { payload: userDataMapped };
    }
}

const UserService = new UserServiceImpl();
export type { UpdateUserData };
export { UserServiceImpl, UserService };
