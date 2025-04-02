import { BaseService } from './base.service';
import { Res } from '@/app/types/service';

interface IContactService {
    postSubmitContact(data: {
        firstName: string;
        lastName: string;
        company: string;
        email: string;
        phone: string;
        message: string;
        isAllowedUpdate: boolean;
    }): Promise<Res>;
}

class ContactServiceImpl extends BaseService implements IContactService {
    private static readonly _MESSAGE = {
        CONTACT_SUBMITTED: 'Thank you for your message. We will get back to you soon.',
    };

    constructor() {
        super(ContactServiceImpl.name);
    }

    async postSubmitContact(data: {
        firstName: string;
        lastName: string;
        company: string;
        email: string;
        phone: string;
        message: string;
        isAllowedUpdate: boolean;
    }): Promise<Res> {
        const config = {
            method: 'POST',
            url: this._API + 'submit-contact',
            headers: BaseService._HEADER.CONTENT_JSON,
            data: JSON.stringify(data),
            withCredentials: true,
        };
        const { message } = await this.req(this.postSubmitContact.name, config, null);
        return { message: message || ContactServiceImpl._MESSAGE.CONTACT_SUBMITTED };
    }
}

export const ContactService = new ContactServiceImpl();
