import axios, { AxiosRequestConfig } from 'axios';

import { DeepPartial } from '@/app/types/utils';
import { APIRes, NodeEnv } from '@/app/types/service';

// Response of service function could be either type of Promise<Res<P,M>> / Promise<void> (quiet action - no even success message, only error message)
// If you don't use BaseService.req() - make sure to use BaseService.getLoggers (e.g. this.getLoggers(this.methodServiceFunction.name)), then log config, config.data and response
abstract class BaseService {
    private static readonly _ENVS: NodeEnv[] = ['development', 'production'];
    private static readonly _EXCEPTION = {
        WRONG_SCHEMA: 'Received wrong response schema from backend',
    };
    protected static readonly _HEADER = {
        CONTENT_FORM: { 'Content-Type': 'multipart/form-data' },
        CONTENT_JSON: { 'Content-Type': 'application/json' },
        AUTHORIZATION: (token: string) => ({ Authorization: 'Bearer ' + token }),
    };

    public static NodeEnv: NodeEnv;
    protected readonly _API: string;
    protected readonly _serviceName: string;

    protected constructor(name: string) {
        const env: string | undefined = process.env.NEXT_PUBLIC_NODE_ENV ?? process.env.NODE_ENV;

        if (!BaseService._ENVS.some((entry) => env === entry))
            this.debug('No ENV set, continuing in development mode...');
        BaseService.NodeEnv = (env as NodeEnv) ?? 'development';

        const api: string | undefined = process.env.NEXT_PUBLIC_API_URL;

        this.debug('ENV:', BaseService.NodeEnv + ',', 'API url:', api);
        if (!api) throw 'API URL is not defined!';
        else if (api.slice(-1) !== '/') throw `API URL should contain '/' at the end!`;

        this._API = api;
        this._serviceName = name;
    }

    // Provides loggers for service function
    // Returns  - array of loggers (debug_logger, error_logger)
    // Args:
    //  method  - action name (e.g. - this.methodFunction.name)
    protected getLoggers() {
        return [this.debug, this.error];
    }

    // Makes simple request (logs + request itself + payload check)
    // Returns  - checked response with payload of type APIRes<P, M> (check above)
    // Throws   - errors of type string
    // Args:
    //  method      - action name (e.g. - this.methodFunction.name)
    //  config      - axios config
    //  schemaCheck - callback, checks payload of the response, if check is false - exception will be thrown
    //      Should return   - array of boolean checks (e.g. ['key' in data])
    //      Provided args:
    //          data        - response.data
    protected async req<P = void, M extends boolean = true>(
        method: string,
        config: AxiosRequestConfig,
        schemaCheck: P extends void ? null : (data: DeepPartial<P>) => boolean[],
    ): Promise<APIRes<P, M>> {
        const [debug, error] = this.getLoggers();
        const url = config.url + ':';

        try {
            debug('REQUEST ->', this._serviceName + '.' + method + ':', url);
            debug(config);
            // if (config.data) debug('REQUEST DATA', url, config.data);

            const response = await axios(config);

            debug('RESPONSE <-', this._serviceName + '.' + method + ':', url);
            debug(response);
            // if (response.data) debug('RESPONSE DATA', url, response.data);

            if (schemaCheck !== null && !schemaCheck?.(response.data)?.every((check) => check))
                throw BaseService._EXCEPTION.WRONG_SCHEMA;

            return { payload: response.data, message: response.data?.msg } as APIRes<P, M>;
        } catch (err: unknown) {
            error(err);
            const errCasted = err as any;
            throw (
                errCasted?.response?.data?.error ??
                errCasted?.message ??
                (typeof err === 'string' ? err : 'Unexpected error!')
            );
        }
    }

    // eslint-disable-next-line
    private debug(...data: any[]): void {
        // eslint-disable-next-line no-console
        if (BaseService.NodeEnv !== 'production') console.log('DEBUG', ...data);
    }

    private error(error: unknown) {
        // eslint-disable-next-line no-console
        if (BaseService.NodeEnv !== 'production') console.error('ERROR', error);
    }
}

export { BaseService };
