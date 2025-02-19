import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { LAYOUT, Route } from '@/app/static';

import { useLayout, useModal } from '@/app/context';
import { NavigationState } from '@/app/context/Layout.context';

const useNavigate = (
    preventModalClosing?: boolean,
    closeModalImmediately?: boolean,
): [(route: Route) => Promise<void>, AppRouterInstance] => {
    const pageRoute = usePathname();
    const router = useRouter();
    const modalCtx = useModal();

    const layoutCtx = useLayout();

    const [navigationState, setNavigationState, _, setBlockedRoute] = layoutCtx.navigateState;

    useEffect(() => {
        layoutCtx.setFadeState(false);
        document.querySelector('#header')?.scrollIntoView();
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
        }, LAYOUT.fadeDuration);

        if (closeModalImmediately) closeModal();
        else {
            setTimeout(() => {
                closeModal();
            }, 3 * LAYOUT.fadeDuration);
        }
    };

    return [navigate, router];
};

export { useNavigate };
