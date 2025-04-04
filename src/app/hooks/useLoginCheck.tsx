'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { Route } from '@/app/static';

import { useLayout, useModal, useNavigate, useUser } from '@/app/hooks';

import { AuthModal } from '@/app/ui/modals';

const useLoginCheck = () => {
    const route = usePathname();
    const userCtx = useUser();
    const modalCtx = useModal();
    const layoutCtx = useLayout();
    const [navigate] = useNavigate();

    useEffect(() => {
        if (userCtx.isLoggedIn === false && route !== Route.Home && !layoutCtx.isFade) {
            modalCtx.openModal(<AuthModal onClose={() => navigate(Route.Home)} />, { hideContent: true });
        }
    }, [userCtx.isLoggedIn, modalCtx.isOpened, layoutCtx.isFade, route]);

    return userCtx.isLoggedIn;
};

export { useLoginCheck };
