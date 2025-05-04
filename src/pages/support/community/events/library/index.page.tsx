'use client';

import { Route } from '@/app/static';

import { useRedirect } from '@/app/hooks';

function Redirect() {
    useRedirect(Route.EventsAll);
    return null;
}

export default Redirect;
