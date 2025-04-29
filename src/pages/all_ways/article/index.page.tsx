'use client';

import { Route } from '@/app/static';

import { useRedirect } from '@/app/hooks';

function Redirect() {
    useRedirect(Route.AllWaysAll);
    return null;
}

export default Redirect;
