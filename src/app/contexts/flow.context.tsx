'use client';

import { createContext } from 'react';

type FlowItem = () => void | Promise<void>;
type FlowQueue = FlowItem[];

interface IFlowContext {
    run: (flow: FlowQueue) => void;
    next: () => FlowItem | undefined;
    clear: () => void;
}

const FlowContext = createContext<IFlowContext | null>(null);

export type { IFlowContext, FlowQueue, FlowItem };
export { FlowContext };
