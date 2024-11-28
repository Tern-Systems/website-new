'use client';

import React, {createContext, FC, PropsWithChildren, useContext, useState} from 'react';


type FlowItem = () => void | Promise<void>;
type FlowQueue = FlowItem[];

interface IFlowContext {
    run: (flow: FlowQueue) => void;
    next: () => (() => void) | undefined;
    clear: () => void;
}

const FlowContext = createContext<IFlowContext | null>(null);

const DeferredCallProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
        const [flowQueue, setFlowQueue] = useState<FlowQueue>([]);

        const get = (queue: FlowQueue): FlowItem | undefined => {
            const [toExecute, ...newQueue] = queue
            setFlowQueue(newQueue);
            return toExecute;
        }

        const next = (): (() => void) | undefined => {
            if (flowQueue.length)
                return get(flowQueue);
        };

        const run = (flow: FlowQueue) => {
            if (!flow.length)
                return;
            setFlowQueue(flow);
            get(flow)?.();
        }

        const clear = () => setFlowQueue([]);

        return (
            <FlowContext.Provider value={{run, next, clear}}>
                {props.children}
            </FlowContext.Provider>
        );
    }
;

const useFlow = (): IFlowContext => {
    const context = useContext(FlowContext);
    if (!context)
        throw new Error('useModal must be used within a ModalProvider!');
    return context;
};

export {DeferredCallProvider, useFlow}
export type {FlowQueue}
