import React from "react";

import {DocumentationContent} from "@/app/types/documentation";


const COMING_SOON_DOC: DocumentationContent = {
    children: (
        <span className={`block text-center content-center text-[3rem] h-full text-nowrap
                            sm:portrait:x-[-rotate-[75deg],w-full]`}
        >
            Coming soon...
        </span>
    ),
    anchors: [],
    isChapter: false
};


export {COMING_SOON_DOC};