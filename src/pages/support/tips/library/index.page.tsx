'use client';

import { Route } from '@/app/static';

import { useRedirect } from '@/app/hooks';

function Redirect() {
    useRedirect(Route.TipsAll);
    return null;
}

export default Redirect;
