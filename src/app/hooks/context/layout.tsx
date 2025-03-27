'use client';

import { useContext } from 'react';

import { ILayoutContext, LayoutContext } from '@/app/contexts/layout.context';
import { LayoutProvider } from '@/app/providers';

const useLayout = (): ILayoutContext => {
    const context = useContext(LayoutContext);
    if (!context) throw new Error(`${useLayout.name} must be used within a ${LayoutProvider.name}!`);
    return context;
};

export { useLayout };
