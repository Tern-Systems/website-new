'use client';

import { FC, PropsWithChildren, useState } from 'react';

import { FlowContext } from '@/app/contexts';
import { FlowItem, FlowQueue } from '@/app/contexts/flow.context';

const FlowProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [flowQueue, setFlowQueue] = useState<FlowQueue>([]);

    const get = (queue: FlowQueue): FlowItem | undefined => {
        const [toExecute, ...newQueue] = queue;
        setFlowQueue(newQueue);
        return toExecute;
    };

    const next = (): FlowItem | undefined => {
        if (flowQueue.length) return get(flowQueue);
    };

    const run = (flow: FlowQueue) => {
        if (!flow.length) return;
        setFlowQueue(flow);
        get(flow)?.();
    };

    const clear = () => setFlowQueue([]);

    return <FlowContext.Provider value={{ run, next, clear }}>{props.children}</FlowContext.Provider>;
};

export { FlowProvider };
