import React from 'react';

import { DocumentationLink } from '@/app/types/layout';
import { Route } from '@/app/static/routing';
import { DocumentationContent } from '@/app/types/documentation';

const DOCUMENTATION_LINKS: DocumentationLink[] = [
    {
        title: 'Tidal Manual',
        description: 'Discover the sandbox application that unlocks the potential of ternary programming.',
        href: Route.TidalDoc,
        subscription: 'Tidal',
    },
    {
        title: 'TernKit Manual',
        description: 'Research and test ternary code on a machine equipped for ternary logic execution.',
        href: Route.TernKitDoc,
        subscription: 'Tidal',
    },
    {
        title: 'G Handbook',
        description: 'Master the G high-level programming language, optimized for ternary-based computing.',
        href: Route.GDoc,
        subscription: 'Tidal',
    },
    {
        title: 'TERN Handbook',
        description: 'Discover the TERN assembly programming language and redefine coding beyond binary limits.',
        href: Route.TernDoc,
        subscription: 'Tidal',
    },
    {
        title: 'BTMC Textbook',
        description:
            'This textbook outlines BTMC fundamentals and the implementation of balanced ternary logic in systems.',
        href: Route.BTMCDoc,
        subscription: 'Tidal',
    },
];

const COMING_SOON_DOC: DocumentationContent = {
    children: (
        <span
            className={`block h-full content-center text-nowrap text-center text-[3rem] sm:portrait:x-[-rotate-[75deg],w-full]`}
        >
            Coming soon...
        </span>
    ),
    anchors: [],
};

export { COMING_SOON_DOC, DOCUMENTATION_LINKS };
