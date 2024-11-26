abstract class BaseService {
    readonly API: string;

    constructor() {
        const api: string | undefined = process.env.NEXT_PUBLIC_API;
        if (!api)
            throw 'API URL is not defined!'
        this.API = api;
    }
}

export {BaseService}
