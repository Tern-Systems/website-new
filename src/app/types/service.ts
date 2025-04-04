import { DeepPartial } from '@/app/types/utils';

type NodeEnv = 'development' | 'production' | 'test';

type Message = { message?: string }; // Message is optional thing (backend could not send it) and shouldn't affect app flow
type Payload<P> = { payload: DeepPartial<P> }; // Payload depends on schema check - declared as partial because of only simple checks (e.g. using 'in' operator to check 1-2 fields only of response.data)
type APIRes<P = void, M extends boolean = true> = P extends void // Successful response from the server could consist of with either message / message + payload / payload
    ? Message
    : M extends true
      ? Message & Payload<P>
      : Payload<P>;
type Res<P = void, M extends boolean = true> = Required<APIRes<P, M>>; // Type for a service response only - to make sure it stays uniform through all the services

export type { NodeEnv, Res, APIRes };
