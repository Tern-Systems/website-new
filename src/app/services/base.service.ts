abstract class BaseService {
    protected readonly _API: string;
    protected readonly _serviceName: string;

    protected constructor(name: string) {
        const api: string | undefined = process.env.NEXT_PUBLIC_API;
        if (!api)
            throw 'API URL is not defined!'
        this._API = api;
        this._serviceName = name;
    }

    get getAPI() {
        return this._API;
    }

    protected log(method: string): void {
        console.info(this._serviceName + ' - ' + method + '...');
    }
}

export {BaseService}
