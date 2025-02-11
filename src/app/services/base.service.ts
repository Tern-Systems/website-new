abstract class BaseService {
    protected readonly _API: string;
    protected readonly _serviceName: string;

    protected constructor(name: string) {
        const env: string | undefined = process.env.NEXT_PUBLIC_NODE_ENV ?? process.env.NODE_ENV ?? 'development';
        if (!env)
            this.debug('No ENV set, continuing in development mode...');

        const api: string | undefined = env === 'development' ? process.env.NEXT_PUBLIC_API_DEV : process.env.NEXT_PUBLIC_API;

        this.debug('ENV:', env + ',', 'API url:', api);
        if (!api)
            throw 'API URL is not defined!'

        this._API = api;
        this._serviceName = name;
    }

    protected getLoggers(method: string) {
        const env: string | undefined = process.env.NEXT_PUBLIC_NODE_ENV ?? process.env.NODE_ENV ?? 'development';
        if (env === 'development')
            console.log(this._serviceName + ' - ' + method + ':');
        return [this.debug, this.error];
    }

    // eslint-disable-next-line
    private debug(...data: any[]): void {
        const env: string | undefined = process.env.NEXT_PUBLIC_NODE_ENV ?? process.env.NODE_ENV ?? 'development';
        if (env === 'development')
            console.log('DEBUG', ...data);
    }

    private error(error: unknown) {
        const env: string | undefined = process.env.NEXT_PUBLIC_NODE_ENV ?? process.env.NODE_ENV ?? 'development';
        if (env === 'development')
            console.log('ERROR', error);
    }
}

export {BaseService}
