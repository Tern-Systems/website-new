abstract class BaseService {
    protected readonly _env: string;
    protected readonly _API: string;
    protected readonly _serviceName: string;

    protected constructor(name: string) {
        const env: string | undefined = process.env.NEXT_PUBLIC_NODE_ENV ?? process.env.NODE_ENV;

        if (!env)
            this.debug('No ENV set, continuing in development mode...');

        this._env = env ?? 'development';
        const api: string | undefined = this._env === 'development' ? process.env.NEXT_PUBLIC_API_DEV : process.env.NEXT_PUBLIC_API;

        this.debug('ENV:', this._env + ',', 'API url:', api);
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
        if (this._env === 'development')
            console.log('DEBUG', ...data);
    }

    private error(error: unknown) {
        if (this._env === 'development')
            console.log('ERROR', error);
    }
}

export {BaseService}
