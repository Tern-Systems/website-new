'use client';

import { useEffect } from 'react';

import { Route } from '@/app/static';

import { useNavigate } from '@/app/hooks/useNavigate';

const useRedirect = (route: Route) => {
    const [navigate] = useNavigate();
    useEffect(() => {
        navigate(route);
    }, []);
};

export { useRedirect };
