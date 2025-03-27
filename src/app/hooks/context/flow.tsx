'use client';

import { useContext } from 'react';

import { IFlowContext, FlowContext } from '@/app/contexts/flow.context';
import { FlowProvider } from '@/app/providers';

const useFlow = (): IFlowContext => {
    const context = useContext(FlowContext);
    if (!context) throw new Error(`${useFlow.name} must be used within a ${FlowProvider.name}!`);
    return context;
};

export { useFlow };
