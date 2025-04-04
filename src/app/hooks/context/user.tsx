'use client';

import { useContext } from 'react';

import { IUserContext, UserContext } from '@/app/contexts/user.context';
import { UserProvider } from '@/app/providers';

const useUser = (): IUserContext => {
    const context = useContext(UserContext);
    if (!context) throw new Error(`${useUser.name} must be used within a ${UserProvider.name}!`);
    return context;
};

export { useUser };
