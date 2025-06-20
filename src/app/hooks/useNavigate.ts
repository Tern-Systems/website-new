'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { LAYOUT, Route } from '@/app/static';

import { useLayout, useModal } from '@/app/hooks';
import { NavigationState } from '@/app/contexts/layout.context';

const useNavigate = (
    preventModalClosing?: boolean,
    closeModalImmediately?: boolean,
): [(route: Route) => Promise<void>, AppRouterInstance, string | null] => {
    const pageRoute = usePathname();
    const router = useRouter();
    const modalCtx = useModal();

    const layoutCtx = useLayout();

    const [navigationState, setNavigationState, _, setBlockedRoute] = layoutCtx.navigateState;

    useEffect(() => {
        layoutCtx.setFadeState(false);
    }, [pageRoute]);

    const closeModal = () => {
        if (!preventModalClosing) modalCtx.closeModal();
    };

    const navigate = async (route: Route) => {
        if (navigationState === NavigationState.BLOCKED) {
            setNavigationState(NavigationState.TRY_NAVIGATE);
            setBlockedRoute(route);
            return;
        }
        if (pageRoute === route) return;
        layoutCtx.setFadeState(true);
        setTimeout(() => {
            router.push(route);
            setNavigationState(NavigationState.FREE);
            document.querySelector('#header')?.scrollIntoView();
        }, LAYOUT.fadeDuration);

        if (closeModalImmediately) closeModal();
        else {
            setTimeout(() => {
                closeModal();
            }, 3 * LAYOUT.fadeDuration);
        }
    };

    return [navigate, router, pageRoute];
};

export { useNavigate };
