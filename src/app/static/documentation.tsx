import React from 'react';

import { DocumentationContent } from '@/app/types/documentation';

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

export { COMING_SOON_DOC };
