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

    protected getLoggers(method: string) {
        console.log(this._serviceName + ' - ' + method + ':')
        return [this.debug, this.error];
    }

    // eslint-disable-next-line
    private debug(...data: any[]): void {
        if (process.env.NODE_ENV === 'development')
            console.log('DEBUG', ...data);
    }

    private error(error: unknown) {
        if (process.env.NODE_ENV === 'development')
            console.log('ERROR', error);
    }
}

export {BaseService}
